import { UserProfile } from '../../types/types';

interface Props {
    profile: UserProfile;
}

export default function Profile(props: Props) {
    const { profile } = props;

    return (
        <>
            <section id="profile">
                <h3>Logged in as <span>{profile.display_name}</span></h3>
                {profile.images && <img src={profile.images[0].url} alt="Profile" width="200" height="200" />}
                <ul>
                    {/* <li>User ID: <span>{profile.id}</span></li> */}
                    {/* <li>Email: <span>{profile.email}</span></li>
                    <li>Spotify URI: <a href={profile.uri}>{profile.uri}</a></li>
                    <li>Link: <a href={profile.href}>{profile.href}</a></li> */}
                </ul>
            </section>
        </>
    );
}
