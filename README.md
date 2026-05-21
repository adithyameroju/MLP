# MLP — Employer portal

React + Vite demo UI for endorsements, CD balance, claims, policy coverage, and related flows.

## Live demo (GitHub Pages)

After CI deploys successfully:

**https://adithyameroju.github.io/MLP/#/**

Routing uses hash URLs (`#/`, `#/claims`, …), which works reliably on GitHub Pages project sites.

## Local development

```bash
npm ci
npm run dev
```

## Deploy

`.github/workflows/deploy-github-pages.yml` builds on every push to `main`.  

If the site does not appear after the first workflow run: **Repository → Settings → Pages → Build and deployment → Source: GitHub Actions**, then re-run the workflow.
