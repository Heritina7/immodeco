import { handler as appHandler } from '../../backend/src/index.mjs';

export const handler = async (event, context) => {
  return await appHandler(event, context);
};