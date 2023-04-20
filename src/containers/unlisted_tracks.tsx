import { useEffect, useState, CSSProperties, useCallback } from 'react';
import { getSavedTracks, getTracksFromPlaylist, isTrackBelongToPlaylist } from '../utils/getFuncs';
import { Track, PlaylistWithTracks, UserProfile } from '../../types/types';

import TracksWithPlaylists from '../components/tracks';

interface Props {
	token: string;
	myProfile: UserProfile;
	myPlaylists: PlaylistWithTracks[];
    setMyPlaylists: React.Dispatch<React.SetStateAction<PlaylistWithTracks[] | null>>;
}

const bodyStyle: CSSProperties = {
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundImage: "linear-gradient(163deg, #1DB954, #191414)",
}

//MEMO: UX改善として、
//      1. 50ずつplaylistTracksに含まれているかどうかを判定する。
//         savedTracksを50ずつ取得+全てをspotifyから取得していなければnext=trueにしておく。
//         next50ボタンで次のsavedTracksを取得するようにする。
//      2. 属しているプレイリストを表示する、複数属す場合は色付け、どこにも属していない場合はハイライトする
export default function UnlistedTracks(props: Props) {
    const { token, myPlaylists, setMyPlaylists } = props;
    const [isPlaylistTracksLoaded, setIsPlaylistTracksLoaded] = useState<boolean>(false);
    const [isAllSavedTracksLoaded, setIsAllSavedTracksLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1); // 1 page = 50 tracks
    const [savedTracks, setSavedTracks] = useState<Track[]>([]);
    // どの曲がどのプレイリストに属しているかを保存する
    const [mapTrackToPlaylists, setMapTrackToPlaylists] = useState<Map<string, string[]>>(new Map());

    useEffect(() => {
        async function fetchData() {
            let newPlaylist = myPlaylists;
            for (let i = 0; i < newPlaylist.length; i++) {
                if (newPlaylist[i].tracks.length > 0) {
                    continue;
                }
                newPlaylist[i].tracks = await getTracksFromPlaylist(newPlaylist[i].id, token);
            }
            setMyPlaylists(newPlaylist);
            setIsPlaylistTracksLoaded(true);
        }

        fetchData();
    }, [token, myPlaylists, setMyPlaylists]);

    const getPlaylistsIdsTrackBelongTo = useCallback((track: Track, playlists: PlaylistWithTracks[]) => {
        const playlistsTrackBelongTo = playlists.filter((playlist) => isTrackBelongToPlaylist(track, playlist));
        return playlistsTrackBelongTo.map((playlist) => playlist.id);
    }, []);

    useEffect(() => {
        if (!isPlaylistTracksLoaded) {
            return;
        }
        if (isAllSavedTracksLoaded) {
            return;
        }

        async function fetchData() {
            const numTracksRequired = currentPage * 50;
            let tracksToFetch = savedTracks;
            
            while (tracksToFetch.length < numTracksRequired) {
              const [tracks, hasNext] = await getSavedTracks(tracksToFetch.length, token);
              tracksToFetch = [...tracksToFetch, ...tracks];
              tracks.forEach((track: Track) => {
                const playlistsIds = getPlaylistsIdsTrackBelongTo(track, myPlaylists);
                setMapTrackToPlaylists(prev => new Map([...prev, [track.id, playlistsIds]]));
              });
              if (!hasNext) {
                setIsAllSavedTracksLoaded(true);
                break;
              }
            }
            
            setSavedTracks(tracksToFetch);
          }

        fetchData();
    }, [token, myPlaylists, savedTracks, isPlaylistTracksLoaded, isAllSavedTracksLoaded, getPlaylistsIdsTrackBelongTo, currentPage]);

    function sliceSavedTracks(tracks: Track[], startIndex: number, endIndex: number): Track[] {
        const end = Math.min(endIndex, tracks.length - 1); // 範囲の終点が配列の範囲外の場合は最後の要素まで取得する
        const slicedTracks = tracks.slice(startIndex, end + 1);
        return slicedTracks;
    }

    function getTracksFromCurrentPage(tracks: Track[], currentPage: number): Track[] {
        const startIndex = (currentPage - 1) * 50;
        const endIndex = currentPage * 50 - 1;
        const end = Math.min(endIndex, tracks.length - 1);
        return sliceSavedTracks(tracks, startIndex, end);
    }

    if (!isPlaylistTracksLoaded || savedTracks === null) {
        return <div>Loading ...</div>;
    }

    return (
        <div style={bodyStyle}>        
            <TracksWithPlaylists 
                tracks={getTracksFromCurrentPage(savedTracks, currentPage)}
                playlists={myPlaylists}
                mapTrackToPlaylists={mapTrackToPlaylists}
                />
        </div>
    );
}
