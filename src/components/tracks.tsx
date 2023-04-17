import { useEffect, useState } from 'react';
import { getSavedTracks, getPlaylistsWithTracks, getNotInPlaylistTracks } from '../utils/getFuncs';
import { Track, Artist, PlaylistWithTracks } from '../../types/types';

interface Props {
    token: string;
}

//MEMO: UX改善として、50ずつplaylistTracksに含まれているかどうかを判定する。
//      savedTracksを50ずつ取得+全てをspotifyから取得していなければnext=trueにしておく。
//      next50ボタンで次のsavedTracksを取得するようにする。

//3. 属しているプレイリストを表示する、複数属す場合は色付け、どこにも属していない場合はハイライトする
export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<Track[] | null>(null);
    const [playlistsWithTracks, setPlaylistsWithTracks] = useState<PlaylistWithTracks[] | null>(null);
    const [notInPlaylistTracks, setNotInPlaylistTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            getSavedTracks(token).then((tracks) => {
                setSavedTracks(tracks);
            });
            getPlaylistsWithTracks(token).then((tracks) => {
                setPlaylistsWithTracks(tracks);
            });
        }

        fetchData();
    }, [token]);

    useEffect(() => {
        async function fetchData() {
            if (savedTracks === null || playlistsWithTracks === null) {
                return;
            }
            getNotInPlaylistTracks(savedTracks, playlistsWithTracks).then((tracks) => {
                setNotInPlaylistTracks(tracks);
            });
        }

        fetchData();
    }, [savedTracks, playlistsWithTracks]);

    if (savedTracks === null) {
        return <div>Loading saved tracks ...</div>;
    }

    if (playlistsWithTracks === null) {
        return <div>Loading playlist tracks ...</div>;
    }

    if (notInPlaylistTracks === null) {
        return <div>Loading not in playlist tracks ...</div>;
    }

    return (
        <>
        <h1>Tracks</h1>
        <div>
            <div>saved track count: {savedTracks.length}</div>
        </div>
        <div>
            <div>not in playlist track count: {notInPlaylistTracks.length}</div>
        </div>
        <div>
            {notInPlaylistTracks.map((track: Track) => (
                <div id={track.id}  style={{margin: '10px', border: '1px solid black'}}>
                    <div>track name: {track.name}</div>
                    <div>artist name: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
                    <a href={track.uri}> link </a>
                </div>
            ))}
        </div>
        </>
    );
}
