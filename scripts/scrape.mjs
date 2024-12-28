import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Scrapes content from a given URL using Playwright with CDP connection
 * @param {string} url - The URL to scrape
 * @param {string} format - The output format ('html' or 'text')
 * @returns {Promise<Object>} - The scraped content
 */
export async function scrapeUrl(url, format = 'html') {
    if (!process.env.BRIGHT_PLAYWRIGHT_URL) {
        throw new Error('BRIGHT_PLAYWRIGHT_URL environment variable is not set');
    }

    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(url, { timeout: 60000 });
        await page.waitForLoadState('networkidle');

        if (format === 'text') {
            const text = await page.textContent('body');
            return { text };
        } else {
            const html = await page.content();
            return { html };
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

/**
 * Shows the content of a given URL in specified format
 * @param {string} format - The output format ('html' or 'text')
 * @param {string} url - The URL to show content from
 * @returns {Promise<void>}
 */
async function showContent(format, url) {
    try {
        const result = await scrapeUrl(url, format);
        console.log(result[format]);
    } catch (error) {
        console.error('Error showing content:', error);
        throw error;
    }
}

// Main function to handle command line usage
async function main() {
    const [command, ...args] = process.argv.slice(2);

    if (!command || args.length < 2) {
        console.error('Please provide the format and URL to scrape.');
        console.error('Usage: pnpm run scrape show-content <html|text> <url>');
        process.exit(1);
    }

    try {
        if (command !== 'show-content') {
            console.error('Invalid command. Only "show-content" is supported.');
            console.error('Usage: pnpm run scrape show-content <html|text> <url>');
            process.exit(1);
        }

        const format = args[0].toLowerCase();
        if (format !== 'html' && format !== 'text') {
            console.error('Invalid format. Use either "html" or "text".');
            process.exit(1);
        }

        await showContent(format, args[1]);
    } catch (error) {
        console.error('Operation failed:', error);
        process.exit(1);
    }
}

// Run main function if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
} 