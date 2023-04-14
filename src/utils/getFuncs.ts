import { fetchAllItems } from "./api";
import { Track, Playlist } from '../../types/types';

export async function getNotInPlaylistTracks(savedTracks: Track[], playlistTracks: Track[]) {
    let tracks: Track[] = [];

    savedTracks.forEach((savedTrack: Track) => {
        const isNotInPlaylist = playlistTracks.every((playlistTrack: Track) => playlistTrack.id !== savedTrack.id);
        if (isNotInPlaylist) {
            tracks.push(savedTrack);
        }
    });

    return tracks;
}

export async function getSavedTracks(token: string) {
    let tracks: Track[] = [];

    const tracksItems = await fetchAllItems("v1/me/tracks", token);
    tracks = tracks.concat(tracksItems.map((item: any) => item.track));

    return tracks;
}

export async function getPlaylistTracks(token: string) {
    const playlists = await getPlaylists(token);
    let tracks: Track[] = [];

    for (let i = 0; i < playlists.length; i++) {
        const tracksFromPlaylist = await getTracksFromPlaylist(playlists[i].id, token);
        tracks = tracks.concat(tracksFromPlaylist);
    }

    return tracks;
}

async function getPlaylists(token: string) {
    let playlists: Playlist[] = [];

    const playlistsItems = await fetchAllItems("v1/me/playlists", token);
    playlists = playlists.concat(playlistsItems);

    return playlists;
}

async function getTracksFromPlaylist(playlistId: string, token: string) {
    let tracks: Track[] = [];

    const tracksItems = await fetchAllItems(`v1/playlists/${playlistId}/tracks`, token);
    tracks = tracks.concat(tracksItems.map((item: any) => item.track));

    return tracks;
}
