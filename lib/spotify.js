const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const SONGS_ENDPOINT = `https://api.spotify.com/v1/playlists/{playlist_id}/tracks`;
const USER_ENDPOINT = 'https://api.spotify.com/v1/me';
const CREATEPLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/{user_id}/playlists`;
const POPULATEPLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/playlists/{playlist_id}/tracks';

const getAccessToken = async (refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

export const getUsersPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getPlaylistSongs = async (refresh_token, playlistId) => {
  const { access_token } = await getAccessToken(refresh_token);
  const endPoint = SONGS_ENDPOINT.replace('{playlist_id}', playlistId);
  return fetch(endPoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getUserId = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  const endPoint = USER_ENDPOINT;
  return fetch(endPoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const createPlaylist = async (refresh_token, userId) => {
  const { access_token } = await getAccessToken(refresh_token);
  const endPoint = CREATEPLAYLIST_ENDPOINT.replace('{user_id}', userId);
  return fetch(endPoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      "name": "New Playlist",
      "description": "New playlist description",
      "public": false
    })
  });
};

export const fillPlaylist = async (refresh_token, playlistId, data) => {
  const { access_token } = await getAccessToken(refresh_token);
  const endPoint = CREATEPLAYLIST_ENDPOINT.replace('{playlist_id}', playlistId);
  console.log("_____________________________");
  console.log(data);
  return fetch(endPoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'uris': data
    })
  });
};