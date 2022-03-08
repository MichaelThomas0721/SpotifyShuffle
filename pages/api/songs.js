import { getPlaylistSongs } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

//script for getting the songs in a playlist from the spoitify api
const handler = async (req, res) => {
    //get access token
  const {
    token: { accessToken },
  } = await getSession({ req });
      //call the spotify.js function to call the api
  const response = await getPlaylistSongs(accessToken, req.body.playlistId);
  const items = await response.json();
    //return the information
  return res.status(200).json(items);
};

export default handler;
