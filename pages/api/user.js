import { getUserId } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

//script for getting the user id from the spotify api
const handler = async (req, res) => {
    //get access token
  const {
    token: { accessToken },
  } = await getSession({ req });
      //call the spotify.js function to call the api
  const response = await getUserId(accessToken);
  const item = await response.json();
    //return the information
  return res.status(200).json(item);
};

export default handler;
