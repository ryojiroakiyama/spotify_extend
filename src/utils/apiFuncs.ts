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

export async function getAllSavedTracks(token: string) {
    let offset = 0;
    const limit = 50;
    let allTracks: Track[] = [];
    let hasNext = true;

    while (hasNext) {
        const endpoint = `v1/me/tracks?offset=${offset}&limit=${limit}`;
        
        const response = await fetchWebApiEndpoint(endpoint, token);
        if (response.error) {
            throw new Error(response.error.message);
        }

        const tracks = response.items.map((item: any) => item.track);
        allTracks = allTracks.concat(tracks);
        hasNext = response.next !== null;
        offset += limit;  // 次のページのオフセットを更新
    }

    return allTracks;
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

export async function getPlaylistsWithTracks(playlists: Playlist[], token: string): Promise<PlaylistWithTracks[]> {
    let playlistWithTracks: PlaylistWithTracks[] = [];

    for (let i = 0; i < playlists.length; i++) {
        // まず、現在のプレイリストの情報をコピーし、新しいオブジェクトを作成
        const playlistInfo: PlaylistWithTracks = {
            ...playlists[i],
            tracks: await getTracksFromPlaylist(playlists[i].id, token)
        };

        // 新しく作成したオブジェクトを配列に追加
        playlistWithTracks.push(playlistInfo);
    }
    
    return playlistWithTracks;
}

export const isTrackBelongToPlaylist = (track: Track, playlist: PlaylistWithTracks): boolean => {
    for (let i = 0; i < playlist.tracks.length; i++) {
        if (playlist.tracks[i].id === track.id) {
            return true;
        }
    }
    return false;
}

export async function createNewPlaylist(name: string, userId: string, token: string): Promise<string> {
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

    return res.id;
}

export async function addTracksToPlaylist(playlistId: string, tracks: string[], token: string): Promise<void> {
    const endpoint = `v1/playlists/${playlistId}/tracks`;

    const postData = {
        uris: tracks
    };

    const res = await postWebApiEndpoint(endpoint, token, postData);
    if (res.error) {
        throw new Error(res.error.message);
    }
}
