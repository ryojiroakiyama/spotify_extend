import { PlaylistWithTracks, UserProfile } from '../../types/types';

interface Props {
	token: string;
	myProfile: UserProfile;
	myPlaylists: PlaylistWithTracks[];
	setMyPlaylists: React.Dispatch<React.SetStateAction<PlaylistWithTracks[] | null>>;
}

export default function SortBpm(props: Props) {
    const { token, myPlaylists, myProfile } = props;
	
    return (
			<>
        <div>sort bpm</div>
			</>
    );
}
