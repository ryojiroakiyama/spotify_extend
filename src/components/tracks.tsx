import { useEffect, useState } from 'react';
import { fetchWebApi } from '../utils/api';

interface Props {
    token: string;
}

export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<string[] | null>(null);
    const [playlistTracks, setPlaylistTracks] = useState<any | null>(null);

    useEffect(() => {
        async function fetchData() {
            //TODO: この二つ非同期でもいい
            await getSavedTracks();
            await getPlaylistTracks();
        }

        fetchData();
    }, [token]);

    async function getSavedTracks() {
        const tracks = await getTracks("v1/me/tracks?limit=50&offset=0");
        setSavedTracks(tracks);
    }

    async function getPlaylistTracks() {
        let endpointPlaylists: string | null = "v1/me/playlists?limit=50&offset=0";
        let tracks: string[] = [];

        while (endpointPlaylists !== null) {
            const response: any = await fetchWebApi(endpointPlaylists, token);

            for (let i = 0; i < response.items.length; i++) {
                const tracksFromPlaylist = await getTracksFromPlaylist(response.items[i].id);
                tracks = tracks.concat(tracksFromPlaylist);
            }

            endpointPlaylists = response.next ? extractEndpoint(response.next) : null;
            console.log("getPlaylistTracks: ", endpointPlaylists);
        }
        setPlaylistTracks(tracks);
    }
    
    async function getTracksFromPlaylist(playlistId: string) : Promise<string[]> {
        return await getTracks(`v1/playlists/${playlistId}/tracks`);
    }

    async function getTracks(endpoint: string | null) {
        let tracks: string[] = [];

        while (endpoint !== null) {
            const response = await fetchWebApi(endpoint, token);
            tracks = tracks.concat(response.items.map((item: any) => item.track.id));
            endpoint = response.next ? extractEndpoint(response.next) : null;
            console.log("getTracks: ", endpoint);
        }
        return tracks;
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
        </>
    );
}
