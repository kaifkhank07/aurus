import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import { Enquiry } from "../src/models/enquiry.model";

interface SeedEnquiryItem {
  type: "query" | "request";
  name: string;
  number: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
}

const sampleEnquiries: SeedEnquiryItem[] = [
  {
    type: "query",
    name: "Aarav Sharma",
    number: "+91 98765 11223",
    location: "Koramangala, Bangalore",
    iam: "Working Professional",
    message:
      "Looking for a private single occupancy room with dedicated workspace starting next month. Does the monthly rent include housekeeping, laundry, and high-speed Wi-Fi?",
  },
  {
    type: "query",
    name: "Sneha Patel",
    number: "+91 98220 33445",
    location: "Viman Nagar, Pune",
    iam: "Student",
    message:
      "Looking for twin sharing accommodation near Symbiosis campus. Could you please share the security deposit details and notice period policy?",
  },
  {
    type: "request",
    name: "Rohan Verma",
    number: "+91 97112 55667",
    location: "Andheri West, Mumbai",
    iam: "Working Professional",
    message:
      "Please arrange a callback regarding long-term corporate booking options and group discounts.",
  },
  {
    type: "query",
    name: "Kavya Nair",
    number: "+91 90080 99001",
    location: "Indiranagar, Bangalore",
    iam: "Intern",
    message:
      "Do you provide short-term stays (3 months) for summer internship students? Please share available options and check-in procedure.",
  },
  {
    type: "request",
    name: "Dr. Meenakshi Sundaram",
    number: "+91 94440 77889",
    location: "Sector 62, Noida",
    iam: "Parent",
    message:
      "Requesting a callback from the residence warden to understand 24/7 security, biometric access, and meal plans for my daughter.",
  },
  {
    type: "request",
    name: "Vikramaditya Roy",
    number: "+91 98300 22334",
    location: "North Campus, Delhi",
    iam: "Student",
    message:
      "Immediate move-in needed this weekend near Delhi University. Please call me back with available bed availability.",
  },
];

async function runSeed() {
  console.log("\n========================================");
  console.log("      AURUS - Enquiries Seed Script     ");
  console.log("========================================\n");

  try {
    // 1. Connect to MongoDB
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected successfully.\n");

    let createdCount = 0;
    let existingCount = 0;

    // 2. Iterate and insert sample enquiries
    for (const enquiry of sampleEnquiries) {
      // Check if an enquiry with this phone number and type already exists
      const existing = await Enquiry.findOne({
        number: enquiry.number,
        type: enquiry.type,
      });

      if (existing) {
        console.log(
          `ℹ️  Enquiry from "${enquiry.name}" (${enquiry.type}: ${enquiry.number}) already exists. Skipping.`
        );
        existingCount++;
      } else {
        const doc = new Enquiry(enquiry);
        await doc.save();
        console.log(
          `✅ Created enquiry [${enquiry.type.toUpperCase()}]: "${enquiry.name}" (${enquiry.number}) — Location: ${enquiry.location || "N/A"}`
        );
        createdCount++;
      }
    }

    console.log("\n----------------------------------------");
    console.log(`Summary: ${createdCount} created, ${existingCount} already existed.`);
    console.log("----------------------------------------\n");

    // 3. Disconnect cleanly
    await mongoose.disconnect();
    console.log("Database connection closed cleanly.\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error during enquiries seeding:", error);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

runSeed();

