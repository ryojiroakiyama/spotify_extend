import { CSSProperties } from 'react';
import { Track, Artist } from '../../types/types';

interface Props {
    tracks: Track[];
}

const tracksStyle: CSSProperties = {
  width: '200px',
	margin: '10px',
	padding: '10px',
	border: '1px solid black',
	borderRadius: '10px',
	backgroundColor: 'white',
};

export default function Tracks(props: Props) {
    const { tracks } = props;

    return (
			<>
				<div style={{display: "flex", flexWrap: "wrap"  }}>
					{tracks.map((track: Track) => (
						<div id={track.id}  style={tracksStyle}>
						<div>{track.name}</div>
						<div>artist: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
							<a href={track.uri}> link </a>
						</div>
					))}
				</div>
			</>
    );
}
