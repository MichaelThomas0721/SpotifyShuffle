import { createPlaylist } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

//Script used for creating the empty playlist
const handler = async (req, res) => {
  //get access token
  const {
    token: { accessToken },
  } = await getSession({ req });
  //call the spotify.js function to call the api
  const response = await createPlaylist(accessToken, req.body.userId);
  const items = await response.json();
  //return the information
  return res.status(200).json(items);
};

export default handler;
