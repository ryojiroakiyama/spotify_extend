import { Playlist, UserProfile } from '../../types/types';

interface Props {
	token: string;
	playlists: Playlist[];
	profile: UserProfile;
}

export default function SortBpm(props: Props) {
    const { token, playlists, profile } = props;
	
    return (
			<>
        <div>sort bpm</div>
			</>
    );
}
