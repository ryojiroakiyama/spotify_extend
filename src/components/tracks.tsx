import { CSSProperties } from 'react';
import { Track, Artist, PlaylistWithTracks } from '../../types/types';
import { TrackViewMode } from '../containers/home';

interface Props {
    track: Track;
	playlists: PlaylistWithTracks[];
	mapTrackToPlaylists: Map<string, string[]>
	mode: TrackViewMode;
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
    const { track, playlists, mapTrackToPlaylists, mode } = props;

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

	const isNotInPlaylist = () => {
		return playlistNameList.length === 0;
	}

	const info = (borderStyle: object) => (
		<div id={track.id}  style={{...tracksStyle, ...borderStyle}}>
			<div>{track.name}</div>
			<div>artist: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
			<a href={track.uri}> link </a>
			{playlistList(playlistNameList)}
		</div>
	)

    const getHighlightBorderStyle = () => {
        if (isNotInPlaylist()) {
            return "5px orange";
        } else if (playlistNameList.length >= 2) {
            return "3px green";
        } else {
            return "black";
        }
    };

	switch (mode) {
		case TrackViewMode.DEFAULT:
			return info({ border: `solid`});
		case TrackViewMode.HIGHLIGHT_NOT_IN_PLAYLIST:
			return info({ border: `solid ${getHighlightBorderStyle()}`});
		case TrackViewMode.ONLY_NOT_IN_PLAYLIST:
			return isNotInPlaylist() ? info({ border: `solid`}) : <></>;
	}
}
