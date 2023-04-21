import { useState, useEffect } from 'react';

import { UserProfile, PlaylistWithTracks, Track } from '../../types/types';
import { fetchWebApiEndpoint } from '../utils/api';
import { getMyPlaylists } from '../utils/getFuncs';

import Profile from '../components/profile';
import ListTracks from './list_tracks';

const menu = {
  listTracks: "List Tracks",
}

type Pops = {
    token: string;
}

function Home(props: Pops) {
	const { token } = props;
	const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[] | null>(null);
  const [savedTracks, setSavedTracks] = useState<Track[]>([]);
  const [select, setSelect] = useState<string | null>(null);

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
		return <div>Loading ...</div>;
	}

  return (
    <>
      <Profile profile={profile} />
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
        />}
    </>
  )
}

export default Home;
