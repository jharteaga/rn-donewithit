import client from './client';

const send = (message, listingId) =>
  client.post('/message', { message, listingId });

export default {
  send,
};
