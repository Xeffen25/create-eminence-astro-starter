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

The CLI asks once for the name, optional improvements, deployment adapter, production site URL, frontend frameworks, language setup, and Git. Project names must be kebab-case (`my-site`); spaces and underscores become dashes after you submit. Every improvement is selected by default: Tailwind CSS 4, Prettier, Eminence Astro Suite, sitemap, Vitest, Resend, GitHub label sync, and GitHub issue templates. Svelte is selected by default; add React too, or deselect both for no UI framework. Choose no adapter for a static Astro site, or Cloudflare Workers for server rendering. The site URL defaults to `https://example.com`; that placeholder is written as a commented TODO in `astro.config.mjs`. A custom URL is set as `site` and, for Cloudflare, as a `wrangler.jsonc` custom-domain route. Cloudflare projects that keep `https://example.com` enable the `workers.dev` subdomain. A custom site URL also asks whether to enable `workers.dev` (off by default).

The language step offers Spanish, English, French, Italian, Catalan, and German. Choose Paraglide for multilingual routing and select at least two languages, then choose the default. Without Paraglide, select the one static document language instead. The generated homepage contains a translated greeting for every selected language, and its base layout uses `lang={getLocale()}` only when Paraglide is enabled.

Generated projects recommend the Astro VS Code extension, plus Prettier, Vitest, and Paraglide extensions when those features are selected. They also include the Astro docs MCP server, and Prettier editor settings when Prettier is selected.

Prettier projects include a formatting CI check. Vitest projects contain a passing starter test, test scripts, a CI test step, and—when Git is selected—a Husky pre-commit test. The hook runs `lint-staged` (Prettier on staged files) when Prettier is selected. Eminence Astro Suite is registered without disabling its integrations; sitemap is a separate prompt and installs `@astrojs/sitemap`. Every project includes Inter via Astro’s font API and a `Fonts.astro` component. Resend projects contain `.env.example`. `TODO.md` always lists creating `LICENSE.md`, creating `.github/SECURITY.md`, and editing `CONTRIBUTING.md`. Generation starts from the official Astro minimal template, adds Astro as a production dependency with a resolved version, then overlays `templates/improved` (the `src` folder layout from eminence-astro-starter: `actions`, `assets`, `components`, `content`, `fonts`, `forms`, `lib`, and `types`) before applying selected prompt features. Remaining dependencies are installed with one add command for production packages and one for dev packages so versions are resolved numbers, then Cloudflare projects run `generate-types`, and the generated project is built and formatted without streaming those command logs. When Git is selected, it creates an `Initialize Astro` commit and a second `Apply setup` commit. For an interactive run, a non-empty target prompts before its contents are removed; `--yes` never deletes an existing directory.

Generated projects use `dev`, `build`, `preview`, and `astro`. Prettier projects also include `format` and `format:check`. Cloudflare projects add `deploy` and `generate-types`. Composite scripts `github:ci` and `all` run `astro check` (so `@astrojs/check` is always installed) plus the selected format and test steps. `deploy` builds and runs Wrangler; authenticate first with `wrangler login`. When Git is selected with Prettier or Vitest, Husky is initialized with `pnpm husky` (or the equivalent for the chosen package manager) and the pre-commit hook runs `lint-staged` and tests.

## GitHub files

When selected, `.github/labels.json` is the source of truth for its listed labels (Cloudflare, locale, SEO, and Lighthouse labels are included only when those features are selected). The workflow runs manually or when that file or `.github/workflows/labels-sync.yml` changes; it creates, updates, and deletes labels so the repository matches the file.

Issue templates use conventional-commit types (`feat`, `fix`, `docs`, `deps`, `test`, `refactor`, `revert`), with Cloudflare and SEO checkboxes only when those features are selected. A pull request template is included with the issue templates. `.github/SUPPORT.md` lists docs and troubleshooting steps for the chosen stack. CI named steps follow the same rule: format check, Cloudflare types, and tests only when those features are selected.

## Contributing and releases

Install with `pnpm install`, then run `pnpm build`, `pnpm test`, and `pnpm format:check`. Add release notes with `pnpm changeset`.

The release workflow uses Changesets to create a release PR. After that PR merges to `main`, it publishes to public npm. Configure an npm automation token as the repository secret `NPM_TOKEN`.

`GITHUB_TOKEN` can open that PR only if the repository allows it: **Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests**. Enable that checkbox, then re-run the failed Release workflow. Direct link: https://github.com/Xeffen25/create-eminence-astro-starter/settings/actions
