import app from './src/app';
import config from './src/config';

const { port } = config;

app.listen(port, () => {
  console.log(`A0: Server listening on port http://localhost:${port}`);
});
