import { useState, useEffect } from 'react';

import { UserProfile, PlaylistWithTracks, Track } from '../../types/types';
import { fetchWebApiEndpoint } from '../utils/api';
import { getMyPlaylists } from '../utils/apiFuncs';

import Profile from '../components/profile';
import ListTracks from './list_tracks';
import Chat from '../gpt/chat';

export const menu = {
  listTracks: "List Tracks",
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
      {select === null &&
        <button onClick={() => setSelect(menu.listTracks)}>{menu.listTracks}</button>
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
