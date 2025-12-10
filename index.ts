import app from './src/app';
import config from './src/config';

const { port } = config;

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
