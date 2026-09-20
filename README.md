# Dice Toy

A tiny, independently written NestJS example: two HTTP routes, no persistence,
credentials, external services, or application framework beyond Nest itself.
This demo was written from scratch; no private application code or third-party
boilerplate was copied.

## Run

Use Node.js 22 and npm 10.

```sh
npm ci --ignore-scripts
npm start
```

The server listens on port 4000 (`PORT` can override it).

```sh
curl http://localhost:4000/health
curl 'http://localhost:4000/roll?sides=6&count=2'
```

`GET /health` returns `{"status":"ok"}`. `GET /roll` returns the die size,
an array of rolls, and their total. Defaults: one six-sided die. Allowed values:
2–100 sides and 1–10 dice; invalid or unknown query fields return HTTP 400.

```sh
npm test
npm run build
npm run start:prod
# Or:
docker build -t dice-toy .
docker run --rm -p 4000:4000 dice-toy
```

## Deliberately small

- `toy/dice.ts`: routes, Zod input validation, and one Nest module.
- `toy/serve.ts`: startup.
- `checks/dice.test.cjs`: HTTP checks using Node's built-in test runner.

Uses NestJS common/core/platform-express, reflect-metadata, Zod, and TypeScript.
The larger dependency manifest is intentionally retained as a dependency fixture;
most packages are unused. Installation skips lifecycle scripts because this demo
does not need them. Older unused tooling may emit engine/deprecation warnings.
The committed `.npmrc` enables legacy peer resolution because the retained Nest
CLI 7 dependencies declare older TypeScript peer ranges. The demo builds directly
with TypeScript and does not use that CLI.
The React example is independent and does not require this API.
