import { useEffect, useState, CSSProperties, useCallback } from 'react';
import { getSavedTracks, getTracksFromPlaylist, isTrackBelongToPlaylist, createNewPlaylist, addTracksToPlaylist } from '../utils/apiFuncs';
import { Track, PlaylistWithTracks, UserProfile } from '../../types/types';
import { TrackViewMode } from './home';

import TracksWithPlaylists from '../components/tracks';

interface Props {
	token: string;
	profile: UserProfile;
	playlists: PlaylistWithTracks[];
    setPlaylists: React.Dispatch<React.SetStateAction<PlaylistWithTracks[] | null>>;
    savedTracks: Track[];
    setSavedTracks: React.Dispatch<React.SetStateAction<Track[]>>;
    mode: TrackViewMode;
    setMode: React.Dispatch<React.SetStateAction<TrackViewMode>>;
}

const bodyStyle: CSSProperties = {
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundImage: "linear-gradient(163deg, #1DB954, #191414)",
}

export default function ListTracks(props: Props) {
    const { token, playlists, setPlaylists, savedTracks, setSavedTracks, mode, setMode } = props;
    const [isAllSavedTracksLoaded, setIsAllSavedTracksLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1); // 1 page = 50 tracks
    // どの曲がどのプレイリストに属しているかを保存する
    const [mapTrackToPlaylists, setMapTrackToPlaylists] = useState<Map<string, string[]>>(new Map());

    const fetchTracksToPlaylists = useCallback(async (playlists: PlaylistWithTracks[]) => {
        for (let i = 0; i < playlists.length; i++) {
            if (playlists[i].tracks.length > 0) {
                continue;
            }
            playlists[i].tracks = await getTracksFromPlaylist(playlists[i].id, token);
        }
        return playlists;
    }, [token]);

    const getPlaylistsIdsTrackBelongTo = useCallback((track: Track, playlists: PlaylistWithTracks[]) => {
        const playlistsTrackBelongTo = playlists.filter((playlist) => isTrackBelongToPlaylist(track, playlist));
        return playlistsTrackBelongTo.map((playlist) => playlist.id);
    }, []);

    const fetchMissingTracks = useCallback(async (currentTracks: Track[], numTracksRequired: number, token: string) => {
        if (isAllSavedTracksLoaded) {
            return currentTracks;
        }
        while (currentTracks.length < numTracksRequired) {
            const [tracks, hasNext] = await getSavedTracks(currentTracks.length, token);
            currentTracks = [...currentTracks, ...tracks];
            tracks.forEach((track: Track) => {
              const playlistsIds = getPlaylistsIdsTrackBelongTo(track, playlists);
              setMapTrackToPlaylists(prev => new Map([...prev, [track.id, playlistsIds]]));
            });
            if (!hasNext) {
              setIsAllSavedTracksLoaded(true);
              break;
            }
        }
        return currentTracks;
    }, [isAllSavedTracksLoaded, getPlaylistsIdsTrackBelongTo, playlists]);

    useEffect(() => {
        async function fetchData() {
            const playlistWithTracks = await fetchTracksToPlaylists(playlists);
            setPlaylists(playlistWithTracks);
            const tracks = await fetchMissingTracks(savedTracks, currentPage * 50, token);
            setSavedTracks(tracks);
        }

        fetchData();
    }, [token, playlists, setPlaylists, fetchTracksToPlaylists, fetchMissingTracks, savedTracks, currentPage, setSavedTracks]);

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

    if (savedTracks.length === 0) {
        return <div>Loading ...</div>;
    }

    return (
        <div style={bodyStyle}>
            {currentPage > 1 &&
                <button onClick={() => setCurrentPage(currentPage - 1)}>Prev 50</button>}
            {(!isAllSavedTracksLoaded || savedTracks.length > (currentPage * 50)) &&
                <button onClick={() => setCurrentPage(currentPage + 1)}>Next 50</button>}
            <select value={mode} onChange={(e) => {setMode(e.target.value as TrackViewMode)}}>
                <option value={TrackViewMode.DEFAULT}>Default</option>
                <option value={TrackViewMode.HIGHLIGHT_NOT_IN_PLAYLIST}>Highlight not in playlist</option>
                <option value={TrackViewMode.ONLY_NOT_IN_PLAYLIST}>Only not in playlist</option>
            </select>
            <div style={{display: "flex", flexWrap: "wrap"  }}>
                {getTracksFromCurrentPage(savedTracks, currentPage).map((track: Track) => {
                    return <TracksWithPlaylists
                    track={track}
                    playlists={playlists}
                    mapTrackToPlaylists={mapTrackToPlaylists}
                    mode={mode} />
                })}
            </div>
        </div>
    );
}
