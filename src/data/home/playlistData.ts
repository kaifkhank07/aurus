export interface PlaylistData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  playlist: {
    category: string;
    title: string;
    description: string;
    creator: string;
    stats: string;
    spotifyUrl: string;
    coverAlt: string;
  };
}

export const playlistData: PlaylistData = {
  eyebrow: "YOUR FAVOURITE INTERNET RADIO.",
  titleTop: "AURUS",
  titleAccent: "Playlist",
  playlist: {
    category: "Public Playlist",
    title: "Aurus Playlist",
    description:
      '"The official Aurus playlist — where music meets lifestyle! Curated for our residents, it\'s the perfect soundtrack for living the Aurus way: vibrant, luxurious, and unforgettable."',
    creator: "Aurus - Luxury Student Residence and Kartik",
    stats: "95 saves • 90 songs, about 5 hr 20 min",
    // spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1E4CUrkGzn1VSI?si=-O7W6AcIRuCihhvthvmjKQ&utm_source=whatsapp&pi=lp7hN3HESkGlh",
    coverAlt: "Aurus Luxury Student Residences Playlist",
  },
};

