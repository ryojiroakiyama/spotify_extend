import { useState, useEffect } from 'react';

import { UserProfile, PlaylistWithTracks, Track } from '../../types/types';
import { fetchWebApiEndpoint } from '../utils/api';
import { getMyPlaylists } from '../utils/getFuncs';

import Profile from '../components/profile';
import SortBpm from './sort_bpm';
import UnlistedTracks from './unlisted_tracks';

const menu = {
  sortBpm: "SortBpm",
  unlistedTracks: "UnlistedTracks",
}

type Pops = {
    token: string;
}

function Home(props: Pops) {
	const { token } = props;
	const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [myPlaylists, setMyPlaylists] = useState<PlaylistWithTracks[] | null>(null);
  const [select, setSelect] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
				const profile = await fetchWebApiEndpoint("v1/me", token);
				setMyProfile(profile);

        const playlists = await getMyPlaylists(token, profile.id);
        setMyPlaylists((playlists.map((playlist) => ({
          ...playlist,
          tracks: [] as Track[]
        }))))
		}

		fetchData();
}, [token]);

	if (myProfile === null || myPlaylists === null) {
		return <div>Loading ...</div>;
	}

  return (
    <>
      <Profile profile={myProfile} />
      {select === null &&
        <>
          <button onClick={() => setSelect(menu.sortBpm)}>Sort by bpm</button>
          <button onClick={() => setSelect(menu.unlistedTracks)}>Unlisted tracks</button>
        </>
      }
      {select === menu.sortBpm && <SortBpm token={token} myPlaylists={myPlaylists} myProfile={myProfile} setMyPlaylists={setMyPlaylists}/>}
      {select === menu.unlistedTracks && <UnlistedTracks token={token} myPlaylists={myPlaylists} myProfile={myProfile} setMyPlaylists={setMyPlaylists} />}
    </>
  )
}

export default Home;
