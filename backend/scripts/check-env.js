import dotenv from 'dotenv';
dotenv.config();

const requiredInfo = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'MONGO_URI'
];

console.log('--- Checking Environment Variables ---');
const missing = [];
requiredInfo.forEach(key => {
    if (process.env[key]) {
        console.log(`✅ ${key} is set.`);
    } else {
        console.error(`❌ ${key} is MISSING.`);
        missing.push(key);
    }
});

if (missing.length > 0) {
    console.error(`\n⚠️ Missing ${missing.length} environment variables. Migration will likely fail.`);
} else {
    console.log('\n✅ All required environment variables are present.');
}
