# create-eminence-astro-starter

Create a minimal, opinionated Astro 6 site configured for server-side rendering on Cloudflare Workers. The generator owns its template and never invokes `create-astro` or `create-cloudflare`.

## Requirements

Node.js 20.19+ and one of pnpm, npm, Yarn, or Bun. A Cloudflare account is needed only to deploy.

## Usage

```bash
pnpm create eminence-astro-starter
npm create eminence-astro-starter@latest
yarn create eminence-astro-starter
bun create eminence-astro-starter
pnpm create eminence-astro-starter my-site --yes
```

The CLI asks once for the name, optional improvements (Tailwind CSS 4, Prettier, and GitHub label sync), Git, and dependency installation. `--yes` accepts all defaults. It refuses non-empty target folders.

Generated projects use `dev`, `build`, `preview`, `deploy`, and `cf-typegen`. Prettier projects also include `format` and `format:check`. `deploy` builds and runs Wrangler; authenticate first with `wrangler login`.

## Label sync

When selected, `.github/labels.json` is the source of truth for its listed labels. The workflow runs manually or after that file changes on `main`; it creates or updates listed labels and deliberately never deletes any other labels.

## Contributing and releases

Install with `pnpm install`, then run `pnpm build`, `pnpm test`, and `pnpm format:check`. Add release notes with `pnpm changeset`.

The release workflow uses Changesets to create a release PR. After that PR merges to `main`, it publishes to public npm. Configure an npm automation token as the repository secret `NPM_TOKEN`; the workflow also needs the default `GITHUB_TOKEN` permissions shown in `.github/workflows/release.yml`.

## Consumer smoke test

Run `pnpm pack`, then `node scripts/smoke-test.mjs ./create-eminence-astro-starter-0.0.0.tgz`. This packs the actual publishable files, invokes the tarball with `--yes`, and builds the generated project.
