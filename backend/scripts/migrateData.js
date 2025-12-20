import mongoose from "mongoose";
import dotenv from "dotenv";
import { sequelize } from "../config/db.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Blog from "../models/Blog.js";
import Contact from "../models/Contact.js";
import Notification from "../models/Notification.js";
import OTP from "../models/otpModel.js";

dotenv.config();

// Temporary Mongoose Schemas (Just for reading)
const mongoUserSchema = new mongoose.Schema({
    companyName: String,
    email: String,
    phone: String,
    password: String, // Hashed
    verified: Boolean,
    role: String,
    passwordChangedAt: Date,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
});

const mongoListingSchema = new mongoose.Schema({
    companyId: mongoose.Schema.Types.ObjectId,
    companyName: String,
    title: String,
    description: String,
    category: String,
    location: String,
    website: String,
    keyFeatures: [String],
    attachments: Array,
    verificationDocuments: Array,
    status: String,
    createdAt: Date,
    updatedAt: Date
});

const mongoBlogSchema = new mongoose.Schema({
    title: String,
    excerpt: String,
    content: String,
    author: String,
    readTime: String,
    category: String,
    image: String,
    date: Date,
    createdAt: Date,
    updatedAt: Date
});

const mongoContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    status: String,
    createdAt: Date,
    updatedAt: Date
});

// Models for Reading
const MongoUser = mongoose.model("User", mongoUserSchema);
const MongoListing = mongoose.model("Listing", mongoListingSchema);
const MongoBlog = mongoose.model("Blog", mongoBlogSchema);
const MongoContact = mongoose.model("Contact", mongoContactSchema);

const migrate = async () => {
    try {
        // Connect to Mongo
        console.log("Connecting to MongoDB...", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Connect to MySQL and Sync
        console.log("Connecting to MySQL...");
        await sequelize.authenticate();
        console.log("✅ MySQL Connected");
        await sequelize.sync({ force: true }); // WARNING: This drops existing tables
        console.log("✅ MySQL Synced (Tables Recreated)");

        // 1. Migrate Users
        console.log("Migrating Users...");
        const mongoUsers = await MongoUser.find({});
        const userIdMap = {}; // Map Mongo ID -> MySQL ID

        for (const mUser of mongoUsers) {
            const newUser = await User.create({
                companyName: mUser.companyName,
                email: mUser.email,
                phone: mUser.phone,
                password: mUser.password, // Keep existing hash
                verified: mUser.verified,
                role: mUser.role || "company",
                passwordChangedAt: mUser.passwordChangedAt,
                isActive: mUser.isActive,
                createdAt: mUser.createdAt,
                updatedAt: mUser.updatedAt
            });
            userIdMap[mUser._id.toString()] = newUser.id;
        }
        console.log(`Migrated ${mongoUsers.length} Users.`);

        // 2. Migrate Listings
        console.log("Migrating Listings...");
        const mongoListings = await MongoListing.find({});
        for (const mListing of mongoListings) {
            const mysqlUserId = userIdMap[mListing.companyId?.toString()];
            if (mysqlUserId) {
                await Listing.create({
                    companyId: mysqlUserId,
                    companyName: mListing.companyName,
                    title: mListing.title,
                    description: mListing.description,
                    category: mListing.category,
                    location: mListing.location,
                    website: mListing.website,
                    keyFeatures: mListing.keyFeatures, // JSON
                    attachments: mListing.attachments, // JSON
                    verificationDocuments: mListing.verificationDocuments, // JSON
                    status: mListing.status,
                    createdAt: mListing.createdAt,
                    updatedAt: mListing.updatedAt
                });
            } else {
                console.warn(`Skipping listing ${mListing.title} - User not found.`);
            }
        }
        console.log(`Migrated ${mongoListings.length} Listings.`);

        // 3. Migrate Blogs
        console.log("Migrating Blogs...");
        const mongoBlogs = await MongoBlog.find({});
        for (const mBlog of mongoBlogs) {
            await Blog.create({
                title: mBlog.title,
                excerpt: mBlog.excerpt,
                content: mBlog.content,
                author: mBlog.author,
                readTime: mBlog.readTime,
                category: mBlog.category,
                image: mBlog.image,
                date: mBlog.date,
                createdAt: mBlog.createdAt,
                updatedAt: mBlog.updatedAt
            });
        }
        console.log(`Migrated ${mongoBlogs.length} Blogs.`);

        // 4. Migrate Contacts
        console.log("Migrating Contacts...");
        const mongoContacts = await MongoContact.find({});
        for (const mContact of mongoContacts) {
            await Contact.create({
                name: mContact.name,
                email: mContact.email,
                subject: mContact.subject,
                message: mContact.message,
                status: mContact.status,
                createdAt: mContact.createdAt,
                updatedAt: mContact.updatedAt
            });
        }
        console.log(`Migrated ${mongoContacts.length} Contacts.`);

        // 5. Migrate Notifications
        const mongoNotificationSchema = new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            type: String,
            message: String,
            listingId: mongoose.Schema.Types.ObjectId,
            read: Boolean,
            createdAt: Date
        });
        const MongoNotification = mongoose.model("Notification", mongoNotificationSchema);

        console.log("Migrating Notifications...");
        const mongoNotifications = await MongoNotification.find({});
        for (const mNotif of mongoNotifications) {
            const mysqlUserId = userIdMap[mNotif.userId?.toString()];
            if (mysqlUserId) {
                await Notification.create({
                    userId: mysqlUserId,
                    type: mNotif.type,
                    message: mNotif.message,
                    read: mNotif.read,
                    // listingId: mNotif.listingId, // Skipping listing ID map for now as it's complex without separate map
                    createdAt: mNotif.createdAt
                });
            }
        }
        console.log(`Migrated ${mongoNotifications.length} Notifications.`);

        // 6. Migrate OTPs
        const mongoOTPSchema = new mongoose.Schema({
            email: String,
            code: String,
            expiresAt: Date
        });
        const MongoOTP = mongoose.model("OTP", mongoOTPSchema);

        console.log("Migrating OTPs...");
        const mongoOTPs = await MongoOTP.find({});
        for (const mOTP of mongoOTPs) {
            await OTP.create({
                email: mOTP.email,
                code: mOTP.code,
                expiresAt: mOTP.expiresAt
            });
        }
        console.log(`Migrated ${mongoOTPs.length} OTPs.`);

        console.log("🎉 Migration Completed Successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Migration Failed:", error);
        process.exit(1);
    }
};

migrate();
