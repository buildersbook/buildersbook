# Builder's Book

[![CI](https://github.com/buildersbook/buildersbook/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/buildersbook/buildersbook/actions/workflows/ci.yml?query=branch%3Amain)

The Builder's Book — an open curriculum for engineers who build production software by orchestrating AI coding agents.

- Live site: [buildersbook.dev](https://buildersbook.dev).
- Required Node: `22.23.1` (see `.nvmrc`).
- Install and start: `pnpm install`, then `pnpm dev`.
- Validate: `pnpm validate`.

The development plan lives at [DEVELOPMENT-PLAN.md](DEVELOPMENT-PLAN.md).

`pnpm install` runs `fumadocs-mdx` codegen via `postinstall`; the generated files in `.source/` are gitignored.

## License

Code and scripts are licensed under [MIT](LICENSE). Essays and book chapters in `content/`, and files in `design/reference/`, are licensed under [CC BY-SA 4.0](LICENSE-CONTENT).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
