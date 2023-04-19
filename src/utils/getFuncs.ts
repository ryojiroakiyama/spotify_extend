import { fetchAllItems } from "./api";
import { Track, PlaylistWithTracks, Playlist } from '../../types/types';

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

export async function getPlaylistsWithTracks(token: string, playlists: Playlist[]) {
    let playlistsWithTracks: PlaylistWithTracks[] = [];

    for (let i = 0; i < playlists.length; i++) {
        console.log("getTracksFromPlaylist: " + playlists[i].id);
        const tracksFromPlaylist = await getTracksFromPlaylist(playlists[i].id, token);
        playlistsWithTracks.push({
            ...playlists[i],
            tracks: tracksFromPlaylist
        })
    }

    return playlistsWithTracks;
}

export async function getMyPlaylists(token: string, myId: string) {
    let playlists: Playlist[] = [];

    const playlistsItems = await fetchAllItems("v1/me/playlists", token);
    playlists = playlists.concat(playlistsItems);

    // 自分のプレイリスト以外を除外
    playlists = playlists.filter((playlist: Playlist) => playlist.owner.id === myId);

    return playlists;
}

async function getTracksFromPlaylist(playlistId: string, token: string) {
    let tracks: Track[] = [];

    const tracksItems = await fetchAllItems(`v1/playlists/${playlistId}/tracks`, token);
    tracks = tracks.concat(tracksItems.map((item: any) => item.track));

    return tracks;
}
