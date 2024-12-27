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

The scraper supports several commands:

1. Scrape all links from a URL and save their content:
```bash
pnpm run scrape <url> <folder-name>
```
Example:
```bash
pnpm run scrape https://example.com docs
```
This will save all scraped content in `scraped-content/docs/`.

2. Show all links from a URL:
```bash
pnpm run scrape show-link <url>
```

3. Show content from a specific URL:
```bash
pnpm run scrape show-content <url>
```

## Features

- Extracts clean text content from web pages
- Removes scripts, styles, and other non-content elements
- Saves content in organized text files
- Supports recursive link scraping
- CDP connection for browser automation
