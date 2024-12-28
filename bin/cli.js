#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptPath = join(__dirname, '..', 'scripts', 'scrape-or-search.mjs');

const args = process.argv.slice(2);
const child = spawn('node', [scriptPath, ...args], { stdio: 'inherit' });

child.on('error', (error) => {
    console.error('Failed to start subprocess:', error);
    process.exit(1);
});

child.on('close', (code) => {
    process.exit(code);
}); 