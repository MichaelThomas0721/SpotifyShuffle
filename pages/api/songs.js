import { getPlaylistSongs } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getPlaylistSongs(accessToken, req.body.playlistId);
  const items = await response.json();
  return res.status(200).json(items);
};

export default handler;