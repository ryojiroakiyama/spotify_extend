import { useEffect, useState } from 'react';
import { fetchWebApi } from '../utils/api';

interface Props {
    token: string;
}

//NEXT STEP:保存されているトラックを全て取得
//          プレイリストを全て取得
//          プレイリストのトラックを全て取得

export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<any | null>(null);
    const [playlists, setPlaylists] = useState<any | null>(null);
    const [playlistTracks, setPlaylistTracks] = useState<any | null>(null);

    useEffect(() => {
        async function fetchData() {
            await getSavedTracks();
            await getPlaylistsTracks();
            await getTracksFromPlaylist(playlists.items[0].id);
        }

        fetchData();
    }, [token]);

    async function getSavedTracks() {
        const tracks = await fetchWebApi("v1/me/tracks?limit=50&offset=0", token);
        setSavedTracks(tracks);
    }

    async function getPlaylistsTracks() {
        const playlists = await fetchWebApi("v1/me/playlists?limit=50&offset=0", token);
        setPlaylists(playlists);
    }

    async function getTracksFromPlaylist(playlistId: string) {
        const tracks = await fetchWebApi(`v1/playlists/${playlistId}/tracks`, token);
        setPlaylistTracks(tracks);
    }

    if (savedTracks === null) {
        return <div>Loading saved tracks ...</div>;
    }

    if (playlists === null) {
        return <div>Loading playlists ...</div>;
    }

    if (playlistTracks === null) {
        return <div>Loading playlist tracks ...</div>;
    }

    return (
        <>
        <h1>Tracks</h1>
        {/* <div>
            {tracks.items.map((item: any) => {
                return (
                    <div key={item.track.id}>
                        <img src={item.track.album.images[0].url} alt="Profile" width="200" height="200" />
                        <div>{item.track.name}</div>
                        <div>{item.track.artists[0].name}</div>
                    </div>
                )
            })
            }
        </div> */}
        <div>
            {playlists.items.map((item: any) => {
                return (
                    <div key={item.id}>
                        <div>{item.name}</div>
                        <div>{item.tracks.href}</div>
                    </div>
                )
            })
            }
        </div>
        <div>
            {playlistTracks.items.map((item: any) => {
                return (
                    <div key={item.track.id}>
                        <img src={item.track.album.images[0].url} alt="Profile" width="200" height="200" />
                        <div>{item.track.name}</div>
                        <div>{item.track.artists[0].name}</div>
                    </div>
                )
            })
            }
        </div>
        </>
    );
}
