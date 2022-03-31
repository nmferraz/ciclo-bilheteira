import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Flor no Escuro', 'no time to die'];
  res.send(categories);
});

export default handler;