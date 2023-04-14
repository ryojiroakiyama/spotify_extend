import { UserProfile } from '../../types/types';
import { useEffect, useState } from 'react';
import { fetchWebApi, spotifyUrl } from '../utils/api';

interface Props {
    token: string;
}

export default function Profile(props: Props) {
    const { token } = props;
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function fetchData() {
            const profile = await fetchWebApi(spotifyUrl("v1/me"), token);
            setProfile(profile);
        }

        fetchData();
    }, [token]);

    if (profile === null) {
        return <div>Loading profile ...</div>;
    }

    return (
        <>
        <h1>Display your Spotify profile data</h1>
        <section id="profile">
            <h2>Logged in as <span>{profile.display_name}</span></h2>
            {profile.images && <img src={profile.images[0].url} alt="Profile" width="200" height="200" />}
            <ul>
            <li>User ID: <span>{profile.id}</span></li>
            <li>Email: <span>{profile.email}</span></li>
            <li>Spotify URI: <a href='#'>{profile.uri}</a></li>
            <li>Link: <a href='#'>{profile.href}</a></li>
            </ul>
        </section>
        </>
    );
}
