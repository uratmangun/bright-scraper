# Web Scraper

A powerful web scraping utility built with Playwright that can extract content and links from websites.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or bun

## Installation & Usage

You can use this tool in two ways:

### 1. Using npx (Recommended)

Run directly without installation using npx:

```bash
npx @uratmangun/scraper-tool scrape <text|html> <url>
# or
npx @uratmangun/scraper-tool search "<query>"
```

### 2. Local Installation

1. Install dependencies:
```bash
pnpm install
# or
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and set your `BRIGHT_PLAYWRIGHT_URL` for the Playwright CDP connection.

## Commands

### View Content
```bash
# Using npx
npx @uratmangun/scraper-tool scrape <html|text> <url>

# Using local installation
pnpm run scrape scrape <html|text> <url>
```

Example:
```bash
npx @uratmangun/scraper-tool scrape html https://example.com
# or
npx @uratmangun/scraper-tool scrape text https://example.com
```

This will display either the HTML or plain text content of the specified URL, depending on the format chosen.

### Google Search
```bash
# Using npx
npx @uratmangun/scraper-tool search "<query>"

# Using local installation
pnpm run search "<query>"
```

Example:
```bash
npx @uratmangun/scraper-tool search "web scraping tutorials"
```

This will fetch and display the HTML content of Google search results for your query.

## Features

- Connects to browser using CDP
- Waits for network idle state before scraping
- Handles page timeouts (60 seconds)
- Error handling and reporting
- Environment variable configuration
- Google search functionality
