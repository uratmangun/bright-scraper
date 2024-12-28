import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { searchParser } from './convert-search.mjs';
// Load environment variables
dotenv.config({ path: '.env.local' });

async function getGoogleHtml(query = '', baseUrl = 'https://www.google.com/search?q=') {
    const browser = await chromium.connectOverCDP(process.env.BRIGHT_PLAYWRIGHT_URL);
    const searchUrl = baseUrl + encodeURIComponent(query);
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Navigate to the URL
        await page.goto(searchUrl);
        
        // Get the page content
        const content = await page.content();
        
        return content;
    } catch (error) {
        console.error('Error fetching page:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Example usage
async function main() {
    try {
        const query = process.argv[2];
        if (!query) {
            console.error('Please provide a search query. Usage: pnpm run search <query>');
            process.exit(1);
        }
        const html = await getGoogleHtml(query);
        const parsed = await searchParser(html);
        console.log(parsed);
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Run the main function if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main();
}

export { getGoogleHtml };
