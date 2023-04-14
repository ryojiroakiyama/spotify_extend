import { useEffect, useState } from 'react';
import { getSavedTracks, getPlaylistTracks, getNotInPlaylistTracks } from '../utils/getFuncs';
import { Track } from '../../types/types';

interface Props {
    token: string;
}

//TODO: すべての曲に関して情報を用意して、どこにも属していない曲をハイライトするのもあり。リンクなどUIを発達させる
//TODO: 時間を考えて、savedTracksとplaylistsTracksを50ずつ取得して表示するのあり、nextjsにして先に取得しておくことを考える
//MEMO: それぞれのtracksの中に重複があるかもしれないので、重複を削除するかテストする
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
