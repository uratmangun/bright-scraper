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
        
        // Get only the body content and remove unnecessary tags
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

// Example usage
async function main() {
    try {
        const query = process.argv[2];
        if (!query) {
            console.error('Please provide a search query. Usage: pnpm run search <query>');
            process.exit(1);
        }
        console.log('Getting google html');
        const html = await getGoogleHtml(query);
        console.log("parsing html");
        const parsed = await searchParser(html);
        console.log(parsed.choices[0].message.content);
        // Import the fs promises API
        
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Run the main function if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main();
}

export { getGoogleHtml };
