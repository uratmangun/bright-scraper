import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { searchParser } from './convert-search.mjs';

dotenv.config({ path: '.env.local' });

/**
 * Scrapes content from a given URL using Playwright with CDP connection
 * @param {string} url - The URL to scrape
 * @param {string} format - The output format ('html' or 'text')
 * @returns {Promise<Object>} - The scraped content
 */
async function scrapeUrl(url, format = 'html') {
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
 * Gets Google search results HTML
 * @param {string} query - Search query
 * @param {string} baseUrl - Base URL for Google search
 * @returns {Promise<string>} - HTML content
 */
async function getGoogleHtml(query = '', baseUrl = 'https://www.google.com/search?q=') {
    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);
    const searchUrl = baseUrl + encodeURIComponent(query);
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(searchUrl);
        
        const bodyContent = await page.evaluate(() => {
            const body = document.body;
            if (!body) return '';
            
            // Remove all script tags
            const scripts = body.getElementsByTagName('script');
            while (scripts.length > 0) {
                scripts[0].parentNode.removeChild(scripts[0]);
            }
            
            // Remove all style tags
            const styles = body.getElementsByTagName('style');
            while (styles.length > 0) {
                styles[0].parentNode.removeChild(styles[0]);
            }
            
            // Remove all noscript tags
            const noscripts = body.getElementsByTagName('noscript');
            while (noscripts.length > 0) {
                noscripts[0].parentNode.removeChild(noscripts[0]);
            }
            
            return body.innerHTML;
        });
        
        return bodyContent;
    } catch (error) {
        console.error('Error fetching page:', error);
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

/**
 * Performs a Google search and shows the results
 * @param {string} query - Search query
 * @returns {Promise<void>}
 */
async function search(query) {
    try {
        
        const html = await getGoogleHtml(query);
        
        const parsed = await searchParser(html);
        console.log(parsed.choices[0].message.content);
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
}

// Main function to handle command line usage
async function main() {
    const [command, ...args] = process.argv.slice(2);

    if (!command) {
        console.error('Please provide a command.');
        console.error('Usage:');
        console.error('  pnpm run tool scrape <html|text> <url>');
        console.error('  pnpm run tool search <query>');
        process.exit(1);
    }

    try {
        switch (command.toLowerCase()) {
            case 'scrape':
                if (args.length < 2) {
                    console.error('Please provide the format and URL to scrape.');
                    console.error('Usage: pnpm run tool scrape <html|text> <url>');
                    process.exit(1);
                }
                const format = args[0].toLowerCase();
                if (format !== 'html' && format !== 'text') {
                    console.error('Invalid format. Use either "html" or "text".');
                    process.exit(1);
                }
                await showContent(format, args[1]);
                break;

            case 'search':
                if (args.length < 1) {
                    console.error('Please provide a search query.');
                    console.error('Usage: pnpm run tool search <query>');
                    process.exit(1);
                }
                await search(args.join(' '));
                break;

            default:
                console.error('Invalid command. Use either "scrape" or "search".');
                console.error('Usage:');
                console.error('  pnpm run tool scrape <html|text> <url>');
                console.error('  pnpm run tool search <query>');
                process.exit(1);
        }
    } catch (error) {
        console.error('Operation failed:', error);
        process.exit(1);
    }
}

// Run main function if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}

export { scrapeUrl, getGoogleHtml }; 