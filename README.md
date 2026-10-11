# sphere-tech-web

Public website for Sphere Tech. A Next.js app that reads **published** articles from the
`sphere-tech-be` backend's unauthenticated `/public/articles` endpoints.

## Pages

| Route | What it shows |
|---|---|
| `/` | Breaking-news strip, lead story (newest *featured* article, else newest), 4 side stories, then a "Latest" grid |
| `/search?q=…` | Results matching title, overview, category or tags, with matches highlighted |
| `/articles/[slug]` | Single article: hero, overview, pull quote, body, gallery, tags |

Drafts, scheduled and archived articles never appear, because the public endpoints only return `PUBLISHED`.

## Run locally

```bash
cp .env.example .env.local      # API_URL=http://127.0.0.1:5000
npm install
npm run dev                     # http://localhost:3000
```

## Run with docker-compose

Add this service to `sphere-tech-be/docker-compose.yml` (adjust the `build.context` path to where this repo lives):

```yaml
  web:
    build:
      context: ../sphere-tech-web
      target: dev
    container_name: sphere-tech-web
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:5000
      - PUBLIC_ARTICLES_PATH=/public/articles
    volumes:
      - ../sphere-tech-web:/app
      - /app/node_modules
    depends_on:
      - backend
```

Then `docker compose up -d web` and open http://localhost:3000.

## Notes

- Cover images come from `article.coverMedia.url`, i.e. MinIO. The browser loads them directly, so MinIO's
  port `9000` must be published to the host (`ports: ["9000:9000"]` on the `minio` service).
  If an image can't load, a themed placeholder is shown instead.
- The API response can be `{ data: [...] }`, `{ data: { articles: [...] } }` or a bare array; all are handled.
- For category names to show, the public endpoints need to return a `category` object (`{ id, name }`)
  with each article. Without it, cards simply show no category pill.
