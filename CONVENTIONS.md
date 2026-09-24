# Project Conventions

Single source of truth for naming and documentation rules. Copy this file into any repo (or keep this repo as the canonical reference) and follow it for every project.

---

## Table of contents

1. [Commits](#1-commits)
2. [Pull requests](#2-pull-requests)
3. [Branches](#3-branches)
4. [Folders and files](#4-folders-and-files)
5. [Code naming](#5-code-naming)
6. [README format](#6-readme-format)
7. [Other docs](#7-other-docs)
8. [Quick checklist](#8-quick-checklist)

---

## 1. Commits

Use [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```text
<type>(<optional-scope>): <short summary>

[optional body]

[optional footer]
```

### Rules

| Rule | Detail |
|------|--------|
| Summary | Imperative mood, lowercase start, no period at the end |
| Length | Summary ≤ 72 characters |
| What | Describe *what changed*, not *why you felt like changing it* |
| Body | Optional; wrap at ~100 chars; explain *why* when non-obvious |
| Breaking | Add `BREAKING CHANGE:` footer, or `!` after type/scope |

### Types

| Type | When to use |
|------|-------------|
| `feat` | New user-facing capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code change that is neither fix nor feat |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system, bundler, native deps |
| `ci` | CI config / workflows |
| `chore` | Maintenance that does not touch product code |
| `revert` | Reverts a previous commit |

### Scope (optional)

Short noun for the area touched: `api`, `auth`, `ui`, `docs`, `deps`.

### Examples

```text
feat(auth): add password reset email flow
fix(cart): prevent double charge on retry
docs: clarify local setup in readme
refactor(api): extract invoice validation helper
chore(deps): bump react to 19.1
feat(api)!: drop support for v1 webhook payload

BREAKING CHANGE: clients must send schemaVersion=2
```

### Avoid

```text
# too vague
update stuff
fix bug
wip
final final 2
```

---

## 2. Pull requests

### Title format

Same spirit as commits:

```text
<type>(<optional-scope>): <short summary>
```

Examples:

```text
feat(billing): add invoice PDF download
fix(nav): correct active link on nested routes
```

### Title rules

- One clear outcome per PR when possible
- Match the primary commit type if the PR is mostly one kind of change
- No ticket IDs *only* as the title — put IDs in the body or after the summary if needed:
  - `feat(auth): add MFA enrollment (PROJ-123)`

### Body template

```markdown
## Summary
<!-- What and why, 2–4 sentences -->

## Changes
- 
- 

## Test plan
- [ ] 
- [ ] 

## Notes
<!-- Screenshots, migrations, rollout, follow-ups -->
```

### PR size and hygiene

| Prefer | Avoid |
|--------|--------|
| Focused diff, one concern | Mixing refactor + feature + deps bump |
| Linked issue / ticket in body | Empty description |
| Checklist that a reviewer can run | “Works on my machine” with no steps |

### Labels (suggested)

`feat` · `fix` · `docs` · `refactor` · `breaking` · `needs-review` · `blocked`

---

## 3. Branches

### Format

```text
<type>/<short-kebab-description>
```

Optional ticket prefix:

```text
<type>/<ticket-id>-<short-kebab-description>
```

### Examples

```text
feat/password-reset
fix/PROJ-123-cart-double-charge
docs/readme-setup
chore/upgrade-eslint
```

### Rules

- Lowercase only
- kebab-case segments
- No personal names as the only identifier (`john-wip`)
- Delete remote branches after merge

---

## 4. Folders and files

### Folders

| Context | Convention | Example |
|---------|------------|---------|
| App / source trees | `kebab-case` | `user-settings/`, `invoice-pdf/` |
| Domain packages | `kebab-case` | `packages/billing-core/` |
| Test mirrors | Match source layout | `src/foo/` → `tests/foo/` or `__tests__/` beside file |

Avoid spaces, underscores for folders, and vague names like `misc/`, `new/`, `temp/`.

### Files

| Kind | Convention | Example |
|------|------------|---------|
| Source modules | `kebab-case` (TS/JS/Python modules as team prefers — pick one per language and stick to it) | `create-invoice.ts`, `user_service.py` if snake_case is the language norm |
| React components | `PascalCase` filename matching export | `InvoiceTable.tsx` |
| Hooks | `camelCase` with `use` prefix | `useInvoiceList.ts` |
| Utilities | `kebab-case` | `format-currency.ts` |
| Tests | Same base name + suffix | `format-currency.test.ts` |
| Config | Tool default or `kebab-case` | `eslint.config.js`, `docker-compose.yml` |
| Docs | `SCREAMING_SNAKE` for root policy docs, else `kebab-case` | `CONVENTIONS.md`, `docs/api-auth.md` |

### Language defaults (when the ecosystem already has a norm)

| Language | Files / modules | Prefer |
|----------|-----------------|--------|
| TypeScript / JavaScript | `kebab-case` modules; `PascalCase` components | Match above |
| Python | `snake_case` modules and packages | PEP 8 |
| Go | `snake_case` files; package names short lowercase | Go style |
| Rust | `snake_case` | Rust style |

**Rule:** language ecosystem wins for file naming inside that language; this doc wins for git, PRs, folders at the repo root, and docs.

### Repo root layout (typical web/app repo)

```text
README.md
CONVENTIONS.md          # optional copy of this guide
docs/
src/                    # or app/, depending on framework
tests/                  # if not colocated
scripts/
```

Do not invent deep empty trees “for later.”

---

## 5. Code naming

### General

| Construct | Convention | Example |
|-----------|------------|---------|
| Functions / methods | `camelCase` (TS/JS), `snake_case` (Python) | `createInvoice()`, `create_invoice()` |
| Variables / params | Same as functions | `invoiceId`, `invoice_id` |
| Constants (module-level) | `SCREAMING_SNAKE` or `camelCase` for true enums — pick one style per language | `MAX_RETRY_COUNT` |
| Classes / types / interfaces | `PascalCase` | `InvoiceService`, `UserId` |
| Enums / enum members | `PascalCase` type; members `PascalCase` or `SCREAMING_SNAKE` consistently | `Status.Open` |
| React components | `PascalCase` | `InvoiceTable` |
| Hooks | `use` + `PascalCase` rest | `useInvoiceList` |
| Booleans | Affirmative prefix: `is`, `has`, `can`, `should` | `isLoading`, `hasAccess` |
| Event handlers | `handle` + event, or `on` + event for props | `handleSubmit`, `onSubmit` |

### Function naming rules

1. **Verb first** — name the action: `fetchUser`, `validateEmail`, `renderInvoice`.
2. **Be specific** — prefer `calculateTaxAmount` over `process` / `doStuff` / `helper`.
3. **No type noise** — avoid `getUserDataObject`; use `getUser`.
4. **Side effects visible** — `saveInvoice`, `sendEmail`, `deleteSession` beat `invoice` or `email`.
5. **Predicates return boolean** — `isExpired`, `hasPermission`, `canEdit`.
6. **Getters** — `getX` for sync read; `fetchX` / `loadX` for I/O.
7. **One responsibility** — if the name needs `and`, split the function.

### Examples

```ts
// good
function createInvoice(input: CreateInvoiceInput): Invoice { ... }
function isInvoiceOverdue(invoice: Invoice): boolean { ... }
async function fetchInvoiceById(id: string): Promise<Invoice> { ... }

// avoid
function invoice(data: any) { ... }
function processInvoiceAndSendEmailAndUpdateCache() { ... }
function getData() { ... }
```

### Abbreviations

- Use common abbreviations sparingly: `id`, `url`, `api`, `db`.
- Do not invent project slang in names (`mgr`, `svc`, `tmp2`).
- Acronyms in `PascalCase` / `camelCase`: `userId`, `parseXml`, `HttpClient` (be consistent within the repo).

---

## 6. README format

Every project README should follow this skeleton. Drop sections that truly do not apply; do not leave placeholders like “TBD” in shipped READMEs.

```markdown
# <Project name>

<!-- One or two sentences: what it is and who it is for -->

## Features
- 
- 

## Stack
- Language / framework / key libraries

## Requirements
- Runtime versions (e.g. Node 22+, Python 3.12+)
- Optional tools (Docker, etc.)

## Setup

### 1. Clone
\`\`\`bash
git clone <url>
cd <project>
\`\`\`

### 2. Install
\`\`\`bash
# exact commands for this repo
\`\`\`

### 3. Configure
\`\`\`bash
cp .env.example .env
# list required vars and which have local defaults
\`\`\`

### 4. Run
\`\`\`bash
# dev server / CLI entrypoint
\`\`\`

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |

## Project structure
\`\`\`text
src/...
\`\`\`

## Conventions
This repo follows [CONVENTIONS.md](./CONVENTIONS.md) (or link to the shared conventions repo).

## Contributing
1. Create a branch: `feat/short-description`
2. Commit with Conventional Commits
3. Open a PR using the PR template

## License
<!-- SPDX or "Proprietary" -->
```

### README rules

| Do | Don't |
|----|--------|
| Real commands that work today | `npm start` if the script is actually `dev` |
| Pin major runtime versions | Assume the reader knows your tooling |
| Link to deeper docs under `docs/` | Dump the whole architecture into the README |
| Document env vars (name + purpose) | Commit secrets |

---

## 7. Other docs

| File | Purpose |
|------|---------|
| `CONVENTIONS.md` | This guide (or a short pointer to the shared repo) |
| `docs/` | Design notes, ADRs, API docs |
| `CHANGELOG.md` | Optional; prefer generated from Conventional Commits |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR body template from §2 |
| `AGENTS.md` / `.cursor/rules` | Agent-specific instructions; should not contradict this file |

### Changelog entries (if handwritten)

```text
## [Unreleased]
### Added
- 
### Fixed
- 
### Changed
- 
```

---

## 8. Quick checklist

New project kickoff:

- [ ] README follows [§6](#6-readme-format)
- [ ] `CONVENTIONS.md` present (copy or submodule / subtree / link)
- [ ] PR template added
- [ ] Branch protection / CI expect Conventional Commit PR titles (optional but recommended)
- [ ] Language file naming matches [§4](#4-folders-and-files)
- [ ] No `misc/`, `temp/`, or `final-v2` folders

Before every PR:

- [ ] Branch name matches [§3](#3-branches)
- [ ] Commits match [§1](#1-commits)
- [ ] PR title + body match [§2](#2-pull-requests)
- [ ] New folders/files/functions match [§4](#4-folders-and-files) and [§5](#5-code-naming)

---

## Adopting in another repo

1. Copy `CONVENTIONS.md` and optionally `.github/PULL_REQUEST_TEMPLATE.md` into the project.
2. Add a **Conventions** blurb to that project’s README linking to the file.
3. Optionally add a CI lint for commit/PR titles (e.g. commitlint).
4. Do not fork rules per project unless you document the exception at the top of that repo’s `CONVENTIONS.md`.
