import { useEffect, useState } from 'react';
import { fetchWebApi } from '../utils/api';

interface Props {
    token: string;
}

export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<string[] | null>(null);
    const [playlistTracks, setPlaylistTracks] = useState<any | null>(null);
    const [notInPlaylistTracks, setNotInPlaylistTracks] = useState<any | null>(null);

    useEffect(() => {
        async function fetchData() {
            //TODO: この二つ非同期でもいい
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

        for (let i = 0; i < savedTracks.length; i++) {
            if (!playlistTracks.includes(savedTracks[i])) {
                tracks.push(savedTracks[i]);
            }
        }

        setNotInPlaylistTracks(tracks);
    }

    async function getSavedTracks() {
        let tracks: string[] = [];

        const tracksItems = await getAllItems("v1/me/tracks");
        tracks = tracks.concat(tracksItems.map((item: any) => item.track.id));

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
        let tracks: string[] = [];

        const tracksItems = await getAllItems(`v1/playlists/${playlistId}/tracks`);
        tracks = tracks.concat(tracksItems.map((item: any) => item.track.id));

        return tracks;
    }

    // TODO: spotifyUrl(endpoint)という関数を作り、それをfetchWebApiの引数に渡す

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

    return (
        <>
        <h1>Tracks</h1>
        <div>
            <div>track count: {savedTracks.length}</div>
            <div>1: {savedTracks[0]}</div>
            <div>2: {savedTracks[1]}</div>
        </div>
        <div>
            <div>track count: {playlistTracks.length}</div>
            <div>1: {playlistTracks[0]}</div>
            <div>2: {playlistTracks[1]}</div>
        </div>
        <div>
            <div>track count: {notInPlaylistTracks?.length}</div>
            <div>1: {notInPlaylistTracks?.[0]}</div>
            <div>2: {notInPlaylistTracks?.[1]}</div>
        </div>
        </>
    );
}
