import { sequelize } from '../config/db.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Blog from '../models/Blog.js';
import Contact from '../models/Contact.js';
import Notification from '../models/Notification.js';
import OTP from '../models/otpModel.js';

const verify = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Connected successfully.');

        // 🛠️ Sync Database (Create Tables if they don't exist)
        console.log('🔄 Syncing Database Models...');
        await sequelize.sync({ alter: true });
        console.log('✅ Tables created/verified.');

        const userCount = await User.count();
        const listingCount = await Listing.count();
        const blogCount = await Blog.count();

        console.log(`✅ Tables Verified:`);
        console.log(` - Users: ${userCount}`);
        console.log(` - Listings: ${listingCount}`);
        console.log(` - Blogs: ${blogCount}`);
        console.log(` - Contacts: ${await Contact.count()}`);
        console.log(` - Notifications: ${await Notification.count()}`);
        console.log(` - OTPs: ${await OTP.count()}`);

        if (userCount > 0) {
            console.log('✅ Data migration verified: Users exist.');
        } else {
            console.warn('⚠️ No users found. Data migration might have failed or database was empty.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    }
};

verify();
