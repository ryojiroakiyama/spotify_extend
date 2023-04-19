import { useEffect, useState, CSSProperties } from 'react';
import { getSavedTracks, getPlaylistsWithTracks, getNotInPlaylistTracks } from '../utils/getFuncs';
import { Track, Artist, PlaylistWithTracks } from '../../types/types';

interface Props {
	token: string;
}

const bodyStyle: CSSProperties = {
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundImage: "linear-gradient(163deg, #1DB954, #191414)",
}

const tracksStyle: CSSProperties = {
  width: '200px',
	margin: '10px',
	padding: '10px',
	border: '1px solid black',
	borderRadius: '10px',
	backgroundColor: 'white',
};

//MEMO: UX改善として、
//      1. 50ずつplaylistTracksに含まれているかどうかを判定する。
//         savedTracksを50ずつ取得+全てをspotifyから取得していなければnext=trueにしておく。
//         next50ボタンで次のsavedTracksを取得するようにする。
//      2. 属しているプレイリストを表示する、複数属す場合は色付け、どこにも属していない場合はハイライトする
export default function Tracks(props: Props) {
    const { token } = props;
    const [savedTracks, setSavedTracks] = useState<Track[] | null>(null);
    const [playlistsWithTracks, setPlaylistsWithTracks] = useState<PlaylistWithTracks[] | null>(null);
    const [notInPlaylistTracks, setNotInPlaylistTracks] = useState<Track[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            getSavedTracks(token).then((tracks) => {
                setSavedTracks(tracks);
            });
            getPlaylistsWithTracks(token).then((tracks) => {
                setPlaylistsWithTracks(tracks);
            });
        }

        fetchData();
    }, [token]);

    useEffect(() => {
        async function fetchData() {
            if (savedTracks === null || playlistsWithTracks === null) {
                return;
            }
            getNotInPlaylistTracks(savedTracks, playlistsWithTracks).then((tracks) => {
                setNotInPlaylistTracks(tracks);
            });
        }

        fetchData();
    }, [savedTracks, playlistsWithTracks]);

    if (savedTracks === null) {
        return <div>Loading saved tracks ...</div>;
    }

    if (playlistsWithTracks === null) {
        return <div>Loading playlist tracks ...</div>;
    }

    if (notInPlaylistTracks === null) {
        return <div>Loading not in playlist tracks ...</div>;
    }

    return (
			<>
        <div style={bodyStyle}>
					<h1>Tracks left behind in the playlist</h1>
					<div>{notInPlaylistTracks.length} left / {savedTracks.length} saved</div>
					<div style={{display: "flex", flexWrap: "wrap"  }}>
						{notInPlaylistTracks.map((track: Track) => (
							<div id={track.id}  style={tracksStyle}>
							<div>{track.name}</div>
							<div>artist: {track.artists.map((artist: Artist) => artist.name).join(', ')}</div>
								<a href={track.uri}> link </a>
							</div>
						))}
					</div>
        </div>
			</>
    );
}
