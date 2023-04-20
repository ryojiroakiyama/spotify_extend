import { CSSProperties } from 'react';
import { Track, Artist, PlaylistWithTracks } from '../../types/types';

interface Props {
    tracks: Track[];
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
    const { tracks, playlists, mapTrackToPlaylists } = props;

	const playlistList = (trackId: string) => {
		const playlistsIds = mapTrackToPlaylists.get(trackId);
		if (!playlistsIds) {
			return <div>no playlist</div>;
		}
		return playlistsIds.map((playlistId) => {
			const playlist = playlists.find((playlist) => playlist.id === playlistId);
			if (!playlist) {
				return <div>no playlist</div>;
			}
			return <div>{playlist.name}</div>;
		});
	};

    return (
			<>
				<div style={{display: "flex", flexWrap: "wrap"  }}>
					{tracks.map((track: Track) => (
						<div id={track.id}  style={tracksStyle}>
						<div>{track.name}</div>
						<div>artist: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
						<a href={track.uri}> link </a>
						{playlistList(track.id)}
						</div>
					))}
				</div>
			</>
    );
}
