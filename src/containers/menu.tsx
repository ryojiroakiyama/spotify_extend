import { useState } from 'react';

import { UserProfile, Playlist } from '../../types/types';

import SortBpm from './sort_bpm';
import UnlistedTracks from './unlisted_tracks';

type Props = {
    token: string;
    profile: UserProfile;
    playlists: Playlist[];
}

const menu = {
  sortBpm: "SortBpm",
  unlistedTracks: "UnlistedTracks",
}

function Menu(props: Props) {
  const { token, profile, playlists } = props;
  const [select, setSelect] = useState<string | null>(null);

  if (select === null) {
    return (
      <>
        <button onClick={() => setSelect(menu.sortBpm)}>Sort by bpm</button>
        <button onClick={() => setSelect(menu.unlistedTracks)}>Unlisted tracks</button>
      </>
    )
  }

  return (
    <>
			{select === menu.sortBpm && <SortBpm token={token} playlists={playlists} profile={profile} />}
      {select === menu.unlistedTracks && <UnlistedTracks token={token} playlists={playlists} profile={profile} />}
    </>
  );
}

export default Menu;
