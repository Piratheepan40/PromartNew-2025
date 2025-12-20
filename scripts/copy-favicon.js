
import fs from 'fs';
import path from 'path';

const src = path.join('e:\\Promart-new\\ProMart\\frontend\\src\\assets\\promart-logo.png');
const dest = path.join('e:\\Promart-new\\ProMart\\frontend\\public\\favicon.ico');

console.log(`Copying from ${src} to ${dest}`);

try {
    fs.copyFileSync(src, dest);
    console.log('✅ Favicon copied successfully!');
} catch (err) {
    console.error('❌ Error copying favicon:', err);
    process.exit(1);
}
