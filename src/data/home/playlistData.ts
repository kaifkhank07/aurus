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
    spotifyUrl: "https://open.spotify.com/playlist/57EUb87yPQhwXg3zdp5U5O?si=zQDDPze0TlWUiAWinkmcVA&utm_source=copy-link&pi=Ascz15j5SZeaa",
    coverAlt: "Aurus Luxury Student Residences Playlist",
  },
};

