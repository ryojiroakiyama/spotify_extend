import { CSSProperties } from 'react';
import { Track, Artist, PlaylistWithTracks } from '../../types/types';

interface Props {
    track: Track;
	playlists: PlaylistWithTracks[];
	mapTrackToPlaylists: Map<string, string[]>
}

const tracksStyle: CSSProperties = {
  width: '200px',
	margin: '10px',
	padding: '10px',
	border: '1px solid black',
	borderRadius: '10px',
	backgroundColor: 'white',
};

export default function TracksWithPlaylists(props: Props) {
    const { track, playlists, mapTrackToPlaylists } = props;

	const playlistNameList = (() => {
		const playlistsIds = mapTrackToPlaylists.get(track.id);
		if (!playlistsIds || playlistsIds.length === 0) {
			return [];
		}
		const list = playlistsIds.map((playlistId) => {
			const playlist = playlists.find((playlist) => playlist.id === playlistId);
			if (!playlist) {
				return '';
			}
			return playlist.name;
		});
		return list;
	})();

	const playlistList = (playlistNameList: string[]) => {
		return  <div style={{borderTop: "solid 1px", marginTop: "15px"}}>
					<div style={{fontSize: '0.9em'}}>playlists:</div>
					{playlistNameList.map((playlistName) => {
						return <div>{playlistName}</div>;
					})}
				</div>
	}

    const getBorderColor = () => {
        if (playlistNameList.length === 0) {
            return "orange";
        } else if (playlistNameList.length >= 2) {
            return "green";
        } else {
            return "black";
        }
    };

    return (
		<div id={track.id}  style={{...tracksStyle, border: `solid ${getBorderColor()}`}}>
			<div>{track.name}</div>
			<div>artist: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
			<a href={track.uri}> link </a>
			{playlistList(playlistNameList)}
		</div>
    );
}
