# DT Starwars UI

An Angular application for browsing Star Wars starships. Users log in, then view a paginated, filterable list of starships backed by [dt-starwars-api](../dt-starwars-api), which itself wraps [swapi.tech](https://www.swapi.tech/api).

## Features

- **Authentication** — login screen backed by a bearer-token API; an auth guard protects the starships route and redirects unauthenticated users to `/login`.
- **Starships list** — paginated table of starships (name, model, manufacturer, class, crew, passengers).
- **Manufacturer filtering** — filter the starships list by manufacturer via a dropdown populated from the API.
- **Material UI** — built with Angular Material components and a custom theme.

## Logging in

This app has no real user system; the API issues a static demo token for a single hardcoded account:

| Username | Password |
|----------|----------|
| `luke`   | `yoda`   |

Enter these credentials on the login screen at `http://localhost:4200/login`. On success you're redirected to `/starships`.

## Prerequisites

- Node.js and npm
- The [dt-starwars-api](../dt-starwars-api) backend running locally (the UI dev server proxies `/api` to `http://localhost:1337`, see `proxy.conf.json`)

## Running the API

The UI expects the API at `http://localhost:1337`. From the `dt-starwars-api` directory, run it either locally or in Docker.

### Option A: Docker

```bash
cd ../dt-starwars-api
docker compose up --build
```

### Option B: Locally (requires Go 1.26+)

```bash
cd ../dt-starwars-api
go run ./cmd/api
```

## Running the UI

Install dependencies, then start the dev server:

```bash
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. Requests to `/api` are proxied to the locally running API (see [Running the API](#running-the-api) above). The application automatically reloads whenever you modify any of the source files.

## Building

To build the project for production, run:

```bash
npm run build
```

This compiles the project and stores the build artifacts in the `dist/` directory.

## Running unit tests

This project uses [Jest](https://jestjs.io) for unit tests:

```bash
npm test
```

## Additional Resources

For more information on the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
