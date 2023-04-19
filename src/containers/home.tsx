import { useState, useEffect } from 'react';

import { UserProfile, Playlist } from '../../types/types';
import { fetchWebApiEndpoint } from '../utils/api';
import { getMyPlaylists } from '../utils/getFuncs';

import Profile from '../components/profile';
import Menu from './menu';
import Chat from '../gpt/chat';

type Pops = {
    token: string;
}

function Home(props: Pops) {
	const { token } = props;
	const [profile, setProfile] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

	useEffect(() => {
		async function fetchData() {
				const profile = await fetchWebApiEndpoint("v1/me", token);
				setProfile(profile);

        const playlists = await getMyPlaylists(token, profile.id);
        setPlaylists(playlists);
		}

		fetchData();
}, [token]);

	if (profile === null || playlists === null) {
		return <div>Loading ...</div>;
	}

  return (
    <>
      <Profile profile={profile} />
      <Chat />
      <Menu token={token} profile={profile} playlists={playlists} />
    </>
  )
}

export default Home;
