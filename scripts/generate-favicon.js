
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up one level from scripts to root
const rootDir = path.resolve(__dirname, '..');

const srcPath = path.join(rootDir, 'frontend', 'src', 'assets', 'promart-logo.png');
const destPath = path.join(rootDir, 'frontend', 'public', 'favicon.ico');

console.log('--- FAVICON COPY SCRIPT START ---');
console.log(`ROOT: ${rootDir}`);
console.log(`SRC:  ${srcPath}`);
console.log(`DEST: ${destPath}`);

if (!fs.existsSync(srcPath)) {
    console.error('❌ ERROR: Source file does not exist!');
    process.exit(1);
}

try {
    fs.copyFileSync(srcPath, destPath);
    console.log('✅ SUCCESS: Favicon copied!');

    // Verify
    if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        console.log(`   Destination file size: ${stats.size} bytes`);
    } else {
        console.error('❌ ERROR: Copy appeared successful but file is missing!');
    }

} catch (err) {
    console.error(`❌ EXCEPTION: ${err.message}`);
    process.exit(1);
}
console.log('--- FAVICON COPY SCRIPT END ---');
