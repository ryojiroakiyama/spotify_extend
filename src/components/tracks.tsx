import { useEffect, useState } from 'react';
import { fetchWebApi } from '../utils/api';

interface Props {
    token: string;
}

export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<any | null>(null);
    const [playlistTracks, setPlaylistTracks] = useState<any | null>(null);
    const [notInPlaylistTracks, setNotInPlaylistTracks] = useState<any | null>(null);

    //TODO: savedTracksとplaylistTracksはステートの必要がないかも
    //TODO: それぞれのtracksの中に重複があるかもしれないので、重複を削除する?テストする？
    useEffect(() => {
        async function fetchData() {
            await getSavedTracks();
            await getPlaylistTracks();
        }

        fetchData();
    }, [token]);

    useEffect(() => {
        async function fetchData() {
            await getNotInPlaylistTracks();
        }

        fetchData();
    }, [savedTracks, playlistTracks]);

    async function getNotInPlaylistTracks() {
        if (savedTracks === null || playlistTracks === null) {
            return;
        }

        let tracks: string[] = [];

        savedTracks.forEach((savedTrack: any) => {
            const trackId = savedTrack.id;
            const isNotInPlaylist = playlistTracks.every((playlistTrack: any) => playlistTrack.id !== trackId);
            if (isNotInPlaylist) {
                tracks.push(savedTrack);
            }
        });

        setNotInPlaylistTracks(tracks);
    }

    async function getSavedTracks() {
        let tracks: any[] = [];

        const tracksItems = await getAllItems("v1/me/tracks");
        tracks = tracks.concat(tracksItems.map((item: any) => item.track));

        setSavedTracks(tracks);
    }

    async function getPlaylistTracks() {
        const playlists = await getPlaylists();

        let tracks: string[] = [];

        for (let i = 0; i < playlists.length; i++) {
            const tracksFromPlaylist = await getTracksFromPlaylist(playlists[i].id);
            tracks = tracks.concat(tracksFromPlaylist);
        }

        setPlaylistTracks(tracks);
    }

    async function getPlaylists() {
        let playlists: any[] = [];

        const playlistsItems = await getAllItems("v1/me/playlists");
        playlists = playlists.concat(playlistsItems);

        return playlists;
    }
    
    async function getTracksFromPlaylist(playlistId: string): Promise<string[]> {
        let tracks: any[] = [];

        const tracksItems = await getAllItems(`v1/playlists/${playlistId}/tracks`);
        tracks = tracks.concat(tracksItems.map((item: any) => item.track));

        return tracks;
    }

    // TODO: spotifyUrl(endpoint)という関数を作り、それをfetchWebApiの引数に渡す
    // TODO: すべての曲に関して情報を用意して、どこにも属していない曲をハイライトするのもあり。リンクなどUIを発達させる

    async function getAllItems(endpoint: string) {
        let endpointIterate: string | null = endpoint + "?offset=0&limit=50";
        let items: any[] = [];

        while (endpointIterate !== null) {
            const response: any = await fetchWebApi(endpointIterate, token);
            items = items.concat(response.items);
            endpointIterate = response.next ? extractEndpoint(response.next) : null;
        }

        return items;
    }

    function extractEndpoint(url: string) {
        return url.replace('https://api.spotify.com/', '');
    }

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
