# Web Scraper

A powerful web scraping utility built with Playwright that can extract content from websites and perform Brave searches.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Environment variables configured

## Installation & Usage

You can use this tool in two ways:

### 1. Using npx (Recommended)

Run directly without installation using npx:

```bash
# For scraping content
npx @uratmangun/scraper-tool scrape <url>

# For searching
npx @uratmangun/scraper-tool search "<query>"
```

### 2. Local Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and set your `BRIGHT_PLAYWRIGHT_URL` for the Playwright CDP connection.

## Commands

### Scrape Content
```bash
# Using npx
npx @uratmangun/scraper-tool scrape <url>

# Using local installation
pnpm run tool scrape <url>
```

This will scrape the content from the specified URL and convert it to markdown format.

### Brave Search
```bash
# Using npx
npx @uratmangun/scraper-tool search "<query>"

# Using local installation
pnpm run tool search "<query>"
```

Example:
```bash
npx @uratmangun/scraper-tool search "web scraping tutorials"
```

This will return search results from Brave Search API in the following format:
```json
[
  {
    "title": "Result Title",
    "url": "https://example.com",
    "description": "Result description..."
  }
  // ...more results
]
```

## Features

- Connects to browser using CDP (Chrome DevTools Protocol)
- Waits for network idle state before scraping
- Handles page timeouts (60 seconds)
- Converts HTML content to markdown
- Removes unnecessary elements (scripts, styles, noscript tags)
- Brave Search API integration
- Environment variable configuration
- Error handling and reporting
