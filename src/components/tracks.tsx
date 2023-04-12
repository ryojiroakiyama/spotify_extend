import { useEffect, useState } from 'react';
import { fetchWebApi } from '../utils/api';

interface Props {
    token: string;
}

export default function Tracks(props: Props) {
    const { token } = props;
    const [tracks, setTracks] = useState<any | null>(null);

    useEffect(() => {
        async function fetchData() {
            const tracks = await fetchWebApi("v1/me/top/tracks?time_range=short_term&limit=5", token);
            console.log("tracks: ", tracks);
            setTracks(tracks);
        }

        fetchData();
    }, [token]);

    if (tracks === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <h1>Tracks</h1>
        {/* <div>{tracks.country}</div> */}
        </>
    );
}
