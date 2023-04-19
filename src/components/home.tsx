import './App.css';
import { useState, useEffect } from 'react';

import { UserProfile } from '../../types/types';
import { fetchWebApi, spotifyUrl } from '../utils/api';

import Profile from '../components/profile';
import Tracks from '../components/tracks';
import Chat from '../components/chat';

type Pops = {
    token: string;
}

const menu = {
  profile: "Profile",
  tracks: "Tracks",
}

//TODO: ここでprofile以外にもプレイリストなど取得するようにする
function Home(props: Pops) {
	const { token } = props;
	const [profile, setProfile] = useState<UserProfile | null>(null);
  const [select, setSelect] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
				const profile = await fetchWebApi(spotifyUrl("v1/me"), token);
				setProfile(profile);
		}

		fetchData();
}, [token]);

	if (profile === null) {
		return <div>Loading profile ...</div>;
	}

  if (select === null) {
    return (
      <>
				<Profile profile={profile} />
        <button onClick={() => setSelect(menu.profile)}>Profile</button>
        <button onClick={() => setSelect(menu.tracks)}>Tracks</button>
        <Chat />
      </>
    )
  }

  return (
    <>
      {select === menu.tracks && <Tracks token={token} />}
    </>
  );
}

export default Home;
