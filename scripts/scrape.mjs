import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Extracts clean text content from a page
 * @param {import('playwright').Page} page - The Playwright page object
 * @returns {Promise<string>} - The extracted text content
 */
async function extractTextContent(page) {
    // Remove script and style elements
    await page.evaluate(() => {
        const elements = document.querySelectorAll('script, style, iframe, img');
        elements.forEach(el => el.remove());
    });

    // Get text content from main content area
    const content = await page.evaluate(() => {
        // Try to find main content area
        const mainContent = 
            document.querySelector('main') || 
            document.querySelector('article') || 
            document.querySelector('.content') || 
            document.body;

        // Get text content and clean it up
        let text = mainContent.innerText;
        
        // Remove excessive whitespace and empty lines
        text = text.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');

        return text;
    });

    return content;
}

/**
 * Scrapes content from a given URL using Playwright with CDP connection
 * @param {string} url - The URL to scrape
 * @returns {Promise<string>} - The scraped content
 */
export async function scrapeUrl(url) {
    if (!process.env.BRIGHT_PLAYWRIGHT_URL) {
        throw new Error('BRIGHT_PLAYWRIGHT_URL environment variable is not set');
    }

    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(url, { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        
        // Get the page title
        const title = await page.title();
        
        // Extract text content instead of HTML
        const content = await extractTextContent(page);
        
        return { title, content };
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

/**
 * Scrapes all links from a given URL and saves their content
 * @param {string} baseUrl - The base URL to scrape links from
 * @param {string} folderName - The name of the folder to save content to
 * @returns {Promise<void>}
 */
export async function scrapeAllLinks(baseUrl, folderName) {
    if (!process.env.BRIGHT_PLAYWRIGHT_URL) {
        throw new Error('BRIGHT_PLAYWRIGHT_URL environment variable is not set');
    }

    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(baseUrl, { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        
        // Get the base page title
        const baseTitle = await page.title();
        console.log(`\nScraping from: ${baseUrl}`);
        console.log(`Page Title: ${baseTitle}\n`);
        
        // Get all links from the page
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => ({
                    href: a.href,
                    text: a.textContent?.trim() || a.href
                }))
                .filter(({ href }) => href && href.startsWith('http')); // Only keep valid http(s) URLs
        });

        const folderPath = path.join(process.cwd(), 'scraped-content', folderName);
        await fs.mkdir(folderPath, { recursive: true });

        // Scrape content from each link and save it
        for (const { href, text } of links) {
            try {
                const { title, content } = await scrapeUrl(href);
                // Create a clean filename from the link text or URL
                const fileName = text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
                    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
                    .substring(0, 50); // Limit length
                
                const filePath = path.join(folderPath, `${fileName}.txt`);
                // Add title at the top of the content
                const contentWithTitle = `Title: ${title}\nURL: ${href}\n\n${content}`;
                await fs.writeFile(filePath, contentWithTitle);
                console.log(`Saved content from "${title}" (${href}) to ${fileName}.txt`);
            } catch (error) {
                console.error(`Error scraping ${href}:`, error);
            }
        }
    } catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

/**
 * Shows all links from a given URL
 * @param {string} url - The URL to get links from
 * @returns {Promise<void>}
 */
async function showLinks(url) {
    if (!process.env.BRIGHT_PLAYWRIGHT_URL) {
        throw new Error('BRIGHT_PLAYWRIGHT_URL environment variable is not set');
    }

    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(url, { timeout: 60000 });
        await page.waitForLoadState('networkidle');
        
        // Get the page title
        const pageTitle = await page.title();
        console.log(`\nPage Title: ${pageTitle}`);
        console.log(`URL: ${url}\n`);
        
        // Get all links from the page
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => ({
                    href: a.href,
                    text: a.textContent?.trim() || a.href
                }))
                .filter(({ href }) => href && href.startsWith('http')); // Only keep valid http(s) URLs
        });

        console.log('Found links:');
        links.forEach(({ href, text }) => {
            console.log(`\nText: ${text}\nURL: ${href}\n${'-'.repeat(50)}`);
        });
        console.log(`\nTotal links found: ${links.length}`);
    } finally {
        await browser.close();
    }
}

/**
 * Shows the text content of a given URL
 * @param {string} url - The URL to show content from
 * @returns {Promise<void>}
 */
async function showContent(url) {
    try {
        const { title, content } = await scrapeUrl(url);
        console.log('\nPage Details:\n');
        console.log('='.repeat(50));
        console.log(`Title: ${title}`);
        console.log(`URL: ${url}`);
        console.log('='.repeat(50));
        console.log('\nContent:\n');
        console.log(content);
        console.log('='.repeat(50));
    } catch (error) {
        console.error('Error showing content:', error);
        throw error;
    }
}

// Main function to handle command line usage
async function main() {
    const [command, ...args] = process.argv.slice(2);

    if (!command || !args.length) {
        console.error('Please provide a command and required arguments.');
        console.error('Usage:');
        console.error('  pnpm run scrape show-link <url>');
        console.error('  pnpm run scrape show-content <url>');
        console.error('  pnpm run scrape <url> <folder-name>');
        process.exit(1);
    }

    try {
        switch (command) {
            case 'show-link':
                await showLinks(args[0]);
                break;
            case 'show-content':
                await showContent(args[0]);
                break;
            default:
                // Handle the original scraping functionality
                const [url, folderName] = [command, args[0]];
                if (!url || !folderName) {
                    console.error('Please provide both a URL to scrape and a folder name.');
                    console.error('Usage: pnpm run scrape <url> <folder-name>');
                    process.exit(1);
                }
                await scrapeAllLinks(url, folderName);
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

// Example usage:
// await scrapeUrl('https://example.com'); 