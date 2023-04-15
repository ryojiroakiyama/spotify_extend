import { fetchAllItems } from "./api";
import { Track, PlaylistWithTracks } from '../../types/types';

export async function getNotInPlaylistTracks(savedTracks: Track[], playlistsWithTracks: PlaylistWithTracks[]) {
    let tracks: Track[] = [];

    savedTracks.forEach((savedTrack: Track) => {
        const isNotInPlaylist = playlistsWithTracks.every((playlist: PlaylistWithTracks) => {
            return playlist.tracks.every((playlistTrack: Track) => playlistTrack.id !== savedTrack.id);
        });
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

export async function getPlaylistsWithTracks(token: string) {
    let playlistsWithTracks = await getMyPlaylists(token);

    for (let i = 0; i < playlistsWithTracks.length; i++) {
        const tracksFromPlaylist = await getTracksFromPlaylist(playlistsWithTracks[i].id, token);
        playlistsWithTracks[i].tracks = tracksFromPlaylist;
    }

    return playlistsWithTracks;
}

async function getMyPlaylists(token: string) {
    let playlists: PlaylistWithTracks[] = [];

    //TODO: profile情報から自分のIDを取得する
    const myId = "i2ygbw453jwitgc7s84ly0nf3";

    const playlistsItems = await fetchAllItems("v1/me/playlists", token);
    playlists = playlists.concat(playlistsItems);

    // 自分のプレイリスト以外を除外
    playlists = playlists.filter((playlist: PlaylistWithTracks) => playlist.owner.id === myId);

    return playlists;
}

async function getTracksFromPlaylist(playlistId: string, token: string) {
    let tracks: Track[] = [];

    const tracksItems = await fetchAllItems(`v1/playlists/${playlistId}/tracks`, token);
    tracks = tracks.concat(tracksItems.map((item: any) => item.track));

    return tracks;
}
