import { getUserId } from '../../lib/spotify';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  const response = await getUserId(accessToken);
  const item = await response.json();
  return res.status(200).json(item);
};

export default handler;
