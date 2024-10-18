import { fetchAllItems, fetchWebApiEndpoint, postWebApiEndpoint } from "./api";
import { Track, Playlist, PlaylistWithTracks } from '../../types/types';

export async function getSavedTracks(offset: number, token: string) {
    const endpoint = `v1/me/tracks?offset=${offset}&limit=50`;

    const response = await fetchWebApiEndpoint(endpoint, token);
    if (response.error) {
        throw new Error(response.error.message);
    }

    let tracks = response.items.map((item: any) => item.track);
    let hasNext = response.next !== null;

    return [tracks, hasNext];
}

export async function getMyPlaylists(token: string, myId: string) {
    let playlists: Playlist[] = [];

    const playlistsItems = await fetchAllItems("v1/me/playlists", token);
    playlists = playlists.concat(playlistsItems);

    // 自分のプレイリスト以外を除外
    playlists = playlists.filter((playlist: Playlist) => playlist.owner.id === myId);

    return playlists;
}

export async function getTracksFromPlaylist(playlistId: string, token: string) {
    let tracks: Track[] = [];

    const tracksItems = await fetchAllItems(`v1/playlists/${playlistId}/tracks`, token);
    tracks = tracks.concat(tracksItems.map((item: any) => item.track));

    return tracks;
}

export const isTrackBelongToPlaylist = (track: Track, playlist: PlaylistWithTracks): boolean => {
    for (let i = 0; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].id === track.id) {
            return true;
        }
    }
    return false;
}

export async function createNewPlaylist(name: string, userId: string, token: string) {
    const endpoint = `v1/users/${userId}/playlists`;

    const postData = {
        name: name,
        description: "New playlist from React App",
        public: false
    };

    const res = await postWebApiEndpoint(endpoint, token, postData);
    if (res.error) {
        throw new Error(res.error.message);
    }

    console.log("==================>:", res.id)

    // TODO: 以下別関数へ
    const endpoint2 = `v1/playlists/${res.id}/tracks`;

    const postData2 = {
        // TODO: savedTracksのuriを20個くらい詰める
        uris: ["spotify:track:0o5wusLgOl9yWjXzUF1SEJ"]
    }

    const res2 = await postWebApiEndpoint(endpoint2, token, postData2);
    if (res2.error) {
        throw new Error(res2.error.message);
    }
}
