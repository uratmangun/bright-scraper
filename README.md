# Web Scraper

A powerful web scraping utility built with Playwright that can extract content and links from websites.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or bun

## Setup

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

## Usage

The scraper currently supports viewing content from web pages:

```bash
pnpm run scrape show-content <url>
```

Example:
```bash
pnpm run scrape show-content https://example.com
```

This will display the HTML content of the specified URL.

## Features

- Connects to browser using CDP
- Waits for network idle state before scraping
- Handles page timeouts (60 seconds)
- Error handling and reporting
- Environment variable configuration
