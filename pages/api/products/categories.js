import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Ensaio do Futuro'];
  res.send(categories);
});

export default handler;