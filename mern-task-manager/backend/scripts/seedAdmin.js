// scripts/seedAdmin.js
// Run: node scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin123', 10);
  const user = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
  console.log('Created admin:', user.email);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
