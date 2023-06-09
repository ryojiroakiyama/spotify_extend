export interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Track {
    id: string;
    name: string;
    uri: string;
    artists: Artist[];
}

export interface Artist {
    id: string;
    name: string;
}

export interface TrackWithAnalysis {
    id: string;
    name: string;
    uri: string;
    artists: Artist[];
    analysis: Analysis;
}

export interface Analysis {
    track: {
        tempo: number;
    }
}

export interface Playlist {
    id: string;
    name: string;
    owner: {
        id: string;
    }
}

export interface PlaylistWithTracks {
    id: string;
    name: string;
    owner: {
        id: string;
    }
    tracks: Track[];
}
