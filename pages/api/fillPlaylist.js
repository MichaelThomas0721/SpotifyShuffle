import { fillPlaylist } from "../../lib/spotify";
import { getSession } from "next-auth/react";

//script for 
const handler = async (req, res) => {
  //get access token
  const {
    token: { accessToken },
  } = await getSession({ req });
  //call the spotify.js function to call the api
  const response = await fillPlaylist(
    accessToken,
    req.body.playlistId,
    req.body.data
  );
  const items = await response.json();
  //return the information
  return res.status(200).json(items);
};

export default handler;
