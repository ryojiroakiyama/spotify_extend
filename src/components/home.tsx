import './App.css';
import { useState } from 'react';
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

function Home(props: Pops) {
	const { token } = props;
  const [select, setSelect] = useState<string | null>(null);

  if (select === null) {
    return (
      <div>
        <button onClick={() => setSelect(menu.profile)}>Profile</button>
        <button onClick={() => setSelect(menu.tracks)}>Tracks</button>
        <Chat />
      </div>
    )
  }

  return (
    <>
      {select === menu.profile && <Profile token={token} />}
      {select === menu.tracks && <Tracks token={token} />}
    </>
  );
}

export default Home;
