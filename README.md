# create-eminence-astro-starter

Create a minimal, opinionated Astro site configured for Cloudflare Workers or static hosting. The generator owns its template and never invokes `create-astro` or `create-cloudflare`.

## Requirements

Node.js 24+ (current LTS) and one of pnpm, npm, Yarn, or Bun. A Cloudflare account is needed only to deploy.

## Usage

```bash
pnpm create eminence-astro-starter
npm create eminence-astro-starter@latest
yarn create eminence-astro-starter
bun create eminence-astro-starter
pnpm create eminence-astro-starter my-site --yes
```

For local generator development, run `pnpm create-project`. It executes the TypeScript source directly, so it always uses your latest edits without requiring a build. Use `pnpm create-project -- --yes` to generate the ignored `my-site-name/` test project without prompts. Run `pnpm build` before packing or publishing.

The CLI asks once for the name, optional improvements, deployment adapter, frontend frameworks, language setup, and Git. Project names must be kebab-case (`my-site`); spaces and underscores become dashes after you submit. Every improvement is selected by default: Tailwind CSS 4, Prettier, Eminence Astro Suite, Vitest, Resend, GitHub label sync, and GitHub issue templates. Svelte is selected by default; add React too, or deselect both for no UI framework. Choose no adapter for a static Astro site, or Cloudflare Workers for server rendering.

The language step offers Spanish, English, French, Italian, Catalan, and German. Choose Paraglide for multilingual routing and select at least two languages, then choose the default. Without Paraglide, select the one static document language instead. The generated homepage contains a translated greeting for every selected language, and its base layout uses `lang={getLocale()}` only when Paraglide is enabled.

Prettier projects include a formatting CI check. Vitest projects contain a passing starter test, test scripts, a CI test step, and—when Git is selected—a Husky pre-commit test. The hook also formats when Prettier is selected. Eminence Astro Suite is registered with basic `Head` metadata defaults. Resend projects contain `.env.example` and `TODO.md`, which explains setting `RESEND_API_KEY` locally and as a Cloudflare Worker secret. Generation starts from the official Astro minimal template, adds Astro as a production dependency with a resolved version, then overlays `templates/improved` (the `src` folder layout from eminence-astro-starter: `actions`, `assets`, `components`, `content`, `fonts`, `forms`, `lib`, and `types`) before applying selected prompt features. Dependencies are always installed, then the generated project is built and formatted without streaming those command logs. When Git is selected, it creates an `Initialize Astro` commit and a second `Apply setup` commit. For an interactive run, a non-empty target prompts before its contents are removed; `--yes` never deletes an existing directory.

Generated projects use `dev`, `build`, `preview`, `deploy`, and `cf-typegen`. Prettier projects also include `format` and `format:check`. Cloudflare projects add `start` as an alias for `dev`. `deploy` builds and runs Wrangler; authenticate first with `wrangler login`.

## Label sync

When selected, `.github/labels.json` is the source of truth for its listed labels. The workflow runs manually or after that file changes on `main`; it creates or updates listed labels and deliberately never deletes any other labels.

## Contributing and releases

Install with `pnpm install`, then run `pnpm build`, `pnpm test`, and `pnpm format:check`. Add release notes with `pnpm changeset`.

The release workflow uses Changesets to create a release PR. After that PR merges to `main`, it publishes to public npm. Configure an npm automation token as the repository secret `NPM_TOKEN`.

`GITHUB_TOKEN` can open that PR only if the repository allows it: **Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**. Enable that checkbox, then re-run the failed Release workflow. Direct link: https://github.com/Xeffen25/create-eminence-astro-starter/settings/actions
