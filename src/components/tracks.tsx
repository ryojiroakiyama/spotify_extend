import { useEffect, useState } from 'react';
import { getSavedTracks, getPlaylistTracks, getNotInPlaylistTracks } from '../utils/getFuncs';
import { Track } from '../../types/types';

interface Props {
    token: string;
}

//1. playlistごとに曲情報を持たせる(playlistはownerで自分のものか判断できる)
//2. savedTracksを50ずつ取得して、playlistTracksに含まれているかどうかを判定する、ボタンで次のsavedTracksを取得して、playlistTracksに含まれているかどうかを判定する
//3. 属しているプレイリストを表示する、複数属す場合は色付け、どこにも属していない場合はハイライトする
export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<Track[] | null>(null);
    const [playlistTracks, setPlaylistTracks] = useState<Track[] | null>(null);
    const [notInPlaylistTracks, setNotInPlaylistTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            getSavedTracks(token).then((tracks) => {
                setSavedTracks(tracks);
            });
            getPlaylistTracks(token).then((tracks) => {
                setPlaylistTracks(tracks);
            });
        }

        fetchData();
    }, [token]);

    useEffect(() => {
        async function fetchData() {
            if (savedTracks === null || playlistTracks === null) {
                return;
            }
            getNotInPlaylistTracks(savedTracks, playlistTracks).then((tracks) => {
                setNotInPlaylistTracks(tracks);
            });
        }

        fetchData();
    }, [savedTracks, playlistTracks]);

    if (savedTracks === null) {
        return <div>Loading saved tracks ...</div>;
    }

    if (playlistTracks === null) {
        return <div>Loading playlist tracks ...</div>;
    }

    if (notInPlaylistTracks === null) {
        return <div>Loading not in playlist tracks ...</div>;
    }

    return (
        <>
        <h1>Tracks</h1>
        <div>
            <div>track count: {savedTracks.length}</div>
        </div>
        <div>
            <div>track count: {playlistTracks.length}</div>
        </div>
        <div>
            {notInPlaylistTracks.map((track: any) => (
                <div id={track.id}  style={{margin: '10px', border: '1px solid black'}}>
                    <div>{track.name}</div>
                    <div>{track.artists.map((artist: any) => artist.name).join(', ')}</div>
                </div>
            ))}
        </div>
        </>
    );
}
