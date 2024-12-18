import { useState, useEffect } from 'react';

import { UserProfile, PlaylistWithTracks, Track } from '../../types/types';
import { fetchWebApiEndpoint } from '../utils/api';
import { getAllSavedTracks, getPlaylistsWithTracks, getMyPlaylists, addTracksToPlaylist, createNewPlaylist } from '../utils/apiFuncs';

import Profile from '../components/profile';
import ListTracks from './list_tracks';
import Chat from '../gpt/chat';

export const menu = {
  listTracks: "List Tracks",
  saveUnorganizedTracks: "Save SaveUnorganized Tracks"
}

type Pops = {
    token: string;
}

export enum TrackViewMode {
  DEFAULT = "Default",
  HIGHLIGHT_NOT_IN_PLAYLIST = "Highlight Not In Playlist",
  ONLY_NOT_IN_PLAYLIST = "Only Not In Playlist",
}

function Home(props: Pops) {
	const { token } = props;
	const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[] | null>(null);
  const [savedTracks, setSavedTracks] = useState<Track[]>([]);
  const [select, setSelect] = useState<string | null>(null);
  const [mode, setMode] = useState(TrackViewMode.DEFAULT);

	useEffect(() => {
		async function fetchData() {
				const profile = await fetchWebApiEndpoint("v1/me", token);
				setProfile(profile);

        const playlists = await getMyPlaylists(token, profile.id);
        setPlaylists((playlists.map((playlist) => ({
          ...playlist,
          tracks: [] as Track[]
        }))))
		}

		fetchData();
  }, [token]);

  useEffect(() => {
    // 非同期処理を行う関数を定義
    async function fetchAndProcessTracks() {
        if (select !== menu.saveUnorganizedTracks || playlists === null || profile === null) {
          return
        }

        const allSavedTracks = await getAllSavedTracks(token);
        const playlistsWithTracks = await getPlaylistsWithTracks(playlists, token)

        const trackInPlaylistMap = new Map<string, boolean>();
        playlistsWithTracks.forEach(playlist => {
            playlist.tracks.forEach(track => {
                trackInPlaylistMap.set(track.id, true);
            });
        });

        const trackURIs: string[] = [];
        const maxTracks = 100; // apiの仕様上MAX100

        // トラックの配列を逆順に処理して、所属していないトラックを検索
        for (let i = allSavedTracks.length - 1; i >= 0 && trackURIs.length < maxTracks; i--) {
            const track = allSavedTracks[i];

            // プレイリストに所属していないトラックを探す
            if (!trackInPlaylistMap.has(track.id)) {
                trackURIs.push(track.uri); // URIを配列に追加
            }
        }

        const playlistName = `FromReactApp_${new Date().getTime()}`;
        const playlistId = await createNewPlaylist(playlistName, profile.id, token);

        // 選ばれたトラックのURIを新しいプレイリストに追加
        await addTracksToPlaylist(playlistId, trackURIs, token);

        setSelect(null); // select状態を更新
    }

    // 定義した関数を呼び出す
    fetchAndProcessTracks();
}, [select, playlists, token, setSelect, profile]);

	if (profile === null || playlists === null) {
		return <div>Loading profile/playlists ...</div>;
	}

  return (
    <>
      <div style={{display: 'flex', margin: '15px'}}>
        <div>
          <Profile profile={profile} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: '100px'}}>
          <div>
            <Chat setSelect={setSelect} setMode={setMode} />
          </div>
        </div>
      </div>
      {select === null && <>
        <button onClick={() => setSelect(menu.listTracks)}>{menu.listTracks}</button>
        <button onClick={() => setSelect(menu.saveUnorganizedTracks)}>{menu.saveUnorganizedTracks}</button></>
      }
      {select === menu.saveUnorganizedTracks &&
        <>saving...</>
      }
      {select === menu.listTracks &&
        <ListTracks
          token={token}
          playlists={playlists}
          profile={profile}
          setPlaylists={setPlaylists}
          savedTracks={savedTracks}
          setSavedTracks={setSavedTracks}
          mode={mode}
          setMode={setMode}
        />}
    </>
  )
}

export default Home;
