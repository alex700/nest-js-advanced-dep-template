import { createDiceToy } from './dice';

async function start() {
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  const app = await createDiceToy();
  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
  console.log(`Dice Toy listening on port ${port}`);
}

start().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
