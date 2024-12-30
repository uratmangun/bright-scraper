import dotenv from 'dotenv';
import { searchBrave } from './brave.mjs';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Example usage
async function main() {
    try {
        const query = process.argv[2];
        if (!query) {
            console.error('Please provide a search query. Usage: pnpm run search <query>');
            process.exit(1);
        }
        console.log('Searching with Brave...');
        const results = await searchBrave(query);
        // console.log(results);
        const simplifiedResults = results.web.results.map(({ title, url, description }) => ({
            title,
            url,
            description
        }));
        console.log(JSON.stringify(simplifiedResults, null, 2));
    } catch (error) {
        console.error('Main error:', error);
    }
}

// Run the main function if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    main();
}

export { searchBrave };
