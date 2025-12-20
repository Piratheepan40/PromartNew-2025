import dotenv from 'dotenv';
import { generateToken, verifyToken } from '../utils/jwt.js';

dotenv.config();

console.log('🔍 Debugging Auth Token Logic');
console.log('-----------------------------');
console.log('🔑 JWT_SECRET present:', !!process.env.JWT_SECRET);
if (!process.env.JWT_SECRET) {
    console.error('❌ Critical: JWT_SECRET is missing!');
    process.exit(1);
}

// 1. Generate a Test Token
const mockUser = { id: '12345', role: 'company' };
console.log('👤 Mock User:', mockUser);

try {
    const token = generateToken(mockUser.id);
    console.log('📝 Generated Token:', token);

    // 2. Immediate Verify
    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        console.log('✅ Token Verified Successfully!');
        console.log('   Decoded:', decoded);

        if (decoded.id === mockUser.id) {
            console.log('   ID Match: YES');
        } else {
            console.error('❌ ID Match: NO');
        }

    } catch (verifyError) {
        console.error('❌ Token Verification Failed:', verifyError.message);
    }

} catch (genError) {
    console.error('❌ Token Generation Failed:', genError.message);
}
console.log('-----------------------------');
