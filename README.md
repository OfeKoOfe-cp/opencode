<p align="center">
  <a href="https://github.com/OfeKoOfe-cp/opencode">
    <picture>
      <source srcset=".github/assets/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset=".github/assets/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src=".github/assets/logo-ornate-light.svg" alt="OfeCode logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>

<p align="center">
  <a href="https://github.com/OfeKoOfe-cp/opencode/actions/workflows/release.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/OfeKoOfe-cp/opencode/release.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OfeCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://github.com/OfeKoOfe-cp/opencode)

---

OfeCode is a fork of [OpenCode](https://github.com/anomalyco/opencode), rebranded and extended. It reads the same configuration layout as OpenCode (`opencode.json`, `.opencode/`, and the same data directories), so an existing OpenCode configuration works unchanged.

### Channels and data

A build takes its channel from the git branch it is built on, so a fork branch keeps its own database and background service registration alongside an existing OpenCode install:

```bash
bun run build --single                        # channel from the current branch
OPENCODE_CHANNEL=ofecode bun run build --single # fixed channel
```

Share the upstream `dev` channel with `OPENCODE_CHANNEL=dev`.

### Building from source

OfeCode requires the Bun version pinned in the `packageManager` field of [`package.json`](./package.json) or newer.

```bash
git clone https://github.com/OfeKoOfe-cp/opencode.git
cd opencode
bun install
bun run build --single        # compile the CLI for the current platform
bun run dev                   # run the TUI from source
```

The compiled binary lands in `packages/cli/dist/cli-<platform>-<arch>/bin/ofecode`.

### Installation (upstream)

The upstream project ships installers and packages:

```bash
# YOLO
curl -fsSL https://opencode.ai/v2/install | bash

# Package managers
npm i -g @opencode/cli@latest      # or bun/pnpm/yarn
brew install anomalyco/tap/opencode-v2 # macOS and Linux (recommended, always up to date)
brew install opencode              # macOS and Linux (official brew formula, updated less)
sudo pacman -S opencode            # Arch Linux (Stable)
paru -S opencode-beta              # Arch Linux (Latest from AUR)
mise use -g opencode               # Any OS
nix run github:anomalyco/opencode  # Nix
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

OfeCode is also available as a desktop application. Download it from [opencode.ai/download](https://opencode.ai/download).

| Platform              | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `opencode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `opencode-desktop-mac-x64.dmg`     |
| Windows               | `opencode-desktop-win-x64.exe`     |
| Linux                 | `.deb`, `.rpm`, or `.AppImage`     |

```bash
# macOS (Homebrew)
brew install --cask opencode-desktop
```

#### Installation Directory

The install script installs OpenCode to `$HOME/.opencode/bin`.

### Agents

OfeCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://opencode.ai/docs/agents).

### Documentation

For more info on how to configure OfeCode, [**head over to the upstream docs**](https://opencode.ai/docs).

### Contributing

If you're interested in contributing to OfeCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

---

**Join the upstream community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
