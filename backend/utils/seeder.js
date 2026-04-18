const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const connectDB = require('../config/db');
const { ROLES } = require('../config/roles');
const logger = require('./logger');

const seedUsers = [
  {
    name: 'Super Admin',
    email: 'admin@example.com',
    password: 'Admin@1234',
    role: ROLES.ADMIN,
    status: 'active',
  },
  {
    name: 'Jane Manager',
    email: 'manager@example.com',
    password: 'Manager@1234',
    role: ROLES.MANAGER,
    status: 'active',
  },
  {
    name: 'John User',
    email: 'user@example.com',
    password: 'User@1234',
    role: ROLES.USER,
    status: 'active',
  },
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'Alice@1234',
    role: ROLES.USER,
    status: 'active',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'Bob@1234',
    role: ROLES.USER,
    status: 'inactive',
  },
];

const seedDB = async () => {
  await connectDB();

  try {
    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Create admin first so we can reference their ID
    const adminData = seedUsers[0];
    const adminSalt = await bcrypt.genSalt(12);
    const adminHashedPw = await bcrypt.hash(adminData.password, adminSalt);

    const admin = await User.create({
      ...adminData,
      password: adminHashedPw,
    });

    // Set admin's createdBy to themselves
    admin.createdBy = admin._id;
    admin.updatedBy = admin._id;
    await admin.save({ validateBeforeSave: false });

    logger.info(`Created admin: ${admin.email}`);

    // Create remaining users — passwords hashed via pre-save hook
    for (const userData of seedUsers.slice(1)) {
      const user = await User.create({
        ...userData,
        createdBy: admin._id,
        updatedBy: admin._id,
      });
      logger.info(`Created user: ${user.email} (${user.role})`);
    }

    logger.info('\n✅ Database seeded successfully!\n');
    logger.info('─────────────────────────────────────────');
    logger.info('Seed Credentials:');
    logger.info('  Admin:   admin@example.com   / Admin@1234');
    logger.info('  Manager: manager@example.com / Manager@1234');
    logger.info('  User:    user@example.com    / User@1234');
    logger.info('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

// Handle: node utils/seeder.js --destroy
if (process.argv[2] === '--destroy') {
  (async () => {
    await connectDB();
    await User.deleteMany({});
    logger.info('All users deleted.');
    process.exit(0);
  })();
} else {
  seedDB();
}