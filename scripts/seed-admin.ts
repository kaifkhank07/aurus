import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectToDatabase from "../src/lib/mongodb";
import { Admin } from "../src/models/admin.model";

async function runSeed() {
  const name = process.env.DEFAULT_ADMIN_NAME;
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  console.log("\n========================================");
  console.log("      AURUS - Admin Seed Script         ");
  console.log("========================================\n");

  if (!name || !name.trim()) {
    console.error("❌ Error: DEFAULT_ADMIN_NAME environment variable is missing.");
    process.exit(1);
  }

  if (!email || !email.trim()) {
    console.error("❌ Error: DEFAULT_ADMIN_EMAIL environment variable is missing.");
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error(
      "❌ Error: DEFAULT_ADMIN_PASSWORD must be defined and at least 8 characters long."
    );
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Connect to MongoDB using the shared connectToDatabase utility
    await connectToDatabase();

    // 2. Check if admin with this email already exists
    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      console.log(
        `ℹ️  Admin with email "${normalizedEmail}" already exists (Status: ${existing.status}).`
      );
      console.log("🔒 Skipping creation: Existing admin password is preserved.");
    } else {
      // 3. Hash password and create default admin
      console.log(`Creating default Admin: "${name.trim()}" <${normalizedEmail}>...`);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = new Admin({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        status: "active",
      });

      await newAdmin.save();
      console.log("✅ Default Admin created successfully!");
    }

    // 4. Close connection cleanly
    await mongoose.disconnect();
    console.log("Database connection closed cleanly.\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during admin seeding:", error);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

runSeed();
