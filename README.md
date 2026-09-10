# The Builder's Book

[![CI](https://github.com/buildersbook/buildersbook/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/buildersbook/buildersbook/actions/workflows/ci.yml?query=branch%3Amain)

An open curriculum for engineers who build production software by orchestrating AI coding agents.

## What this is

The site at [buildersbook.dev](https://buildersbook.dev) publishes the book and essays. [The book](https://buildersbook.dev/book) is in progress, with the first chapter planned. The essays are standalone records of the work, beginning with [We Built Agent Enforcement Hooks and Then Killed Them](https://buildersbook.dev/essays/agent-enforcement-hooks).

## Who it's for

Written for engineers who build software and want to direct AI coding agents while keeping responsibility for scope, correctness, and review.

## How this repository is built

One operator directs the AI coding agents that build this repository. The framework separates their roles: SCOUT plans, IMPLEMENT changes files, VERIFY reviews read-only, and ADVERSARY uses a different model family for adversarial review. The operator reviews changes and authorizes commits.

Every change is verified against the codebase. Plans and session records describe intent; the repository determines what is actually implemented.

The site is a working example of the practice it documents.

## Stack

The site uses Next.js App Router, Fumadocs, MDX, TypeScript, and pnpm, and is hosted on Vercel. CI gates include content validation, design-token and contrast checks, and a JavaScript budget for reading pages.

## Running locally

To run locally, use Node.js `22.23.1` (see [.nvmrc](.nvmrc)) and pnpm `10.17.1`.

```sh
git clone https://github.com/buildersbook/buildersbook.git
cd buildersbook
pnpm install   # runs MDX codegen via fumadocs-mdx
pnpm dev
pnpm validate  # lint, types, tests, content and design gates
pnpm build     # production build + JS budget check
```

## Contributing

Issues are welcome. Pull requests require prior discussion; see [CONTRIBUTING.md](CONTRIBUTING.md). Report vulnerabilities through [SECURITY.md](SECURITY.md).

## License

Code and scripts are licensed under [MIT](LICENSE). Essays and book chapters in `content/`, and files in `design/reference/`, are licensed under [CC BY-SA 4.0](LICENSE-CONTENT).

The Builder's Book mark and wordmark, including site icons and avatars, are excluded from both licenses and are not licensed for reuse; see [the brand license boundary](design/brand/README.md).

Dustin Matlock — [buildersbook.dev](https://buildersbook.dev).
