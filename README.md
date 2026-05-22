# MacCorner Clone - AI Website Cloner Template

A powerful, reusable template for reverse-engineering any website into a clean, modern Next.js codebase using AI coding agents. This project is a clone and customization of the [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template).

<a href="https://github.com/tantruongg23/macorner-clone/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>

## 🎯 What is This?

MacCorner Clone is a comprehensive toolkit that helps you:
- **Clone websites** — Point at any URL and automatically reconstruct it as a modern Next.js application
- **Extract design systems** — Automatically capture colors, typography, spacing, and other design tokens
- **Build component specs** — Generate detailed specifications for every UI component with exact CSS values
- **Parallelize development** — Dispatch AI agents to build different sections simultaneously

The AI Website Cloner Template uses Claude Code (or other AI coding agents) to inspect target websites, extract assets and design tokens, write component specifications, and dispatch parallel builders to reconstruct every section with pixel-perfect accuracy.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 24+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (recommended) or another supported AI coding agent

### Installation

1. **Navigate to the template directory**
   ```bash
   cd ai-website-cloner-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start your AI agent** (Claude Code recommended)
   ```bash
   claude --chrome
   ```

4. **Run the website cloner skill**
   ```
   /clone-website <target-url1> [<target-url2> ...]
   ```

   Example:
   ```
   /clone-website https://example.com
   ```

5. **Customize** (optional) — after the base clone is built, modify the code as needed

## 📁 Project Structure

```
macorner-clone/
├── ai-website-cloner-template/    # Main Next.js cloning application
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages and routes
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # shadcn/ui component library
│   │   │   └── icons.tsx           # Extracted SVG icons
│   │   ├── lib/                    # Utility functions
│   │   ├── types/                  # TypeScript type definitions
│   │   └── hooks/                  # Custom React hooks
│   ├── public/                     # Static assets
│   │   ├── images/                 # Downloaded images from target
│   │   ├── videos/                 # Downloaded videos from target
│   │   └── seo/                    # Favicons and OG images
│   ├── docs/                       # Documentation and research
│   │   ├── research/               # Extraction output and component specs
│   │   └── design-references/      # Screenshots and visual references
│   ├── scripts/                    # Utility and sync scripts
│   ├── package.json                # Dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── AGENTS.md                   # AI agent instructions
│   ├── CLAUDE.md                   # Claude Code configuration
│   └── README.md                   # Template-specific documentation
├── docs/                           # Root project documentation
├── skills/                         # AI agent skills
└── README.md                       # This file
```

## 🛠️ Running the AI Website Cloner

### Start Development Server

```bash
cd ai-website-cloner-template
npm run dev
```

The app will be available at `http://localhost:3000`

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run typecheck

# Run all checks (lint + type check + build)
npm run check
```

### Docker Support

If you prefer to run via Docker:

```bash
# Build and run the app
docker compose up app --build

# Run in development mode (port 3001)
docker compose up dev --build
```

## 🔧 Tech Stack

The template uses a modern, battle-tested stack:

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router, React 19, and TypeScript strict mode
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) — Radix primitives with Tailwind CSS
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with oklch design tokens
- **Icons:** [Lucide React](https://lucide.dev/) (replaced by extracted SVGs during cloning)
- **Component Utilities:** CVA (class-variance-authority), clsx, tailwind-merge

## 🤖 Supported AI Agents

The template works with multiple AI coding agents:

| Agent | Status | Notes |
|-------|--------|-------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | ✅ **Recommended** | Best results with Opus 4.7 |
| [GitHub Copilot](https://github.com/features/copilot) | ✅ Supported | |
| [Cursor](https://cursor.com/) | ✅ Supported | |
| [Windsurf](https://codeium.com/windsurf) | ✅ Supported | |
| [Cline](https://github.com/cline/cline) | ✅ Supported | |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✅ Supported | |
| [Continue](https://continue.dev/) | ✅ Supported | |
| [OpenCode](https://opencode.ai/) | ✅ Supported | |
| [Aider](https://aider.chat/) | ✅ Supported | |

For other agents, see `AGENTS.md` in the template directory.

## 📋 How the Cloning Process Works

The `/clone-website` skill runs a sophisticated multi-phase pipeline:

### 1. **Reconnaissance Phase**
- Captures high-resolution screenshots (desktop, tablet, mobile)
- Extracts design tokens (colors, typography, spacing, shadows)
- Sweeps interactions (scroll, click, hover, responsive behavior)
- Documents all visual states

### 2. **Foundation Phase**
- Updates global fonts and CSS variables
- Downloads and optimizes all images and videos
- Sets up color system and design tokens
- Configures Tailwind variables

### 3. **Component Specifications Phase**
- Creates detailed component specs in `docs/research/components/`
- Documents exact computed CSS values
- Lists all component states and variants
- Defines responsive breakpoints
- Specifies interaction behaviors

### 4. **Parallel Build Phase**
- Dispatches AI builder agents in isolated git worktrees
- Each agent builds one section/component independently
- Agents receive full component specifications inline
- Maximum parallelization for speed

### 5. **Assembly & Quality Assurance Phase**
- Merges all worktree branches intelligently
- Resolves any conflicts
- Wires up the complete page
- Runs visual diff against original
- Validates responsive behavior

## 💡 Use Cases

Perfect for:
- **Platform Migration** — Rebuild a site you own from WordPress/Webflow/Squarespace into modern Next.js
- **Lost Source Code** — Your site is live but the repo is gone, the developer left, or the stack is legacy
- **Learning & Reference** — Deconstruct how production sites achieve specific layouts, animations, and responsive behavior
- **Design System Extraction** — Extract reusable components from any live website

## ⚠️ Important Ethical Guidelines

This tool is powerful — please use it responsibly:

**Not Intended For:**
- ❌ **Phishing or impersonation** — Deceptive purposes violate laws and terms of service
- ❌ **IP theft** — Logos, brand assets, and original copy belong to their owners
- ❌ **Terms of Service violations** — Some sites explicitly prohibit scraping or reproduction
- ❌ **Passing off someone else's design as your own** — Always respect intellectual property

**Appropriate Use:**
- ✅ Cloning sites you own
- ✅ Learning and educational purposes
- ✅ Rebuilding sites with lost source code (that you own)
- ✅ Reverse-engineering for legitimate competitive analysis (respecting ToS)

Always check the target website's terms of service and robots.txt before cloning.

## 📚 Documentation

- **[ai-website-cloner-template/README.md](./ai-website-cloner-template/README.md)** — Template-specific documentation
- **[ai-website-cloner-template/AGENTS.md](./ai-website-cloner-template/AGENTS.md)** — Detailed AI agent instructions
- **[ai-website-cloner-template/CLAUDE.md](./ai-website-cloner-template/CLAUDE.md)** — Claude Code configuration
- **[docs/research/INSPECTION_GUIDE.md](./ai-website-cloner-template/docs/research/INSPECTION_GUIDE.md)** — How to inspect websites

## 🔄 Updating for Other Platforms

Two files serve as the source of truth for all platform support:

| File | Purpose | Sync Command |
|------|---------|--------------|
| `AGENTS.md` | Core project instructions | `bash scripts/sync-agent-rules.sh` |
| `.claude/skills/clone-website/SKILL.md` | `/clone-website` skill definition | `node scripts/sync-skills.mjs` |

After editing these files, run the sync commands to regenerate platform-specific versions.

## 📦 Dependencies

Key dependencies in the template:

```json
{
  "next": "16.2.1",
  "react": "19.2.4",
  "tailwindcss": "4.x",
  "shadcn": "4.1.0",
  "lucide-react": "1.6.0",
  "typescript": "5.x"
}
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Component Library](https://ui.shadcn.com)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

## 🐛 Troubleshooting

### Installation Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Default dev server runs on 3000
# To use a different port:
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
# Generate types and rebuild
npm run typecheck
```

### Build Failures
```bash
# Full clean build
npm run clean
npm run build
```

## 🤝 Contributing

Found a bug or have an improvement? 

1. Check the [original repository](https://github.com/JCodesMore/ai-website-cloner-template)
2. Report issues appropriately
3. Submit improvements with clear descriptions

## 📄 License

MIT License — See [LICENSE](./ai-website-cloner-template/LICENSE) file for details.

## 🙏 Acknowledgments

This project is based on the excellent [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template) by JCodesMore. It demonstrates the power of AI-assisted development and multi-agent orchestration.

## 🔗 Links

- [Original Template Repository](https://github.com/JCodesMore/ai-website-cloner-template)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic Discord Community](https://discord.gg/hrTSX5yTpB)

---

**Ready to clone a website?** Run `cd ai-website-cloner-template && npm install && claude --chrome` and then use `/clone-website <url>` to get started! 🚀
