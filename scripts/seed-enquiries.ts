import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import { Enquiry } from "../src/models/enquiry.model";
import { EnquiryStatus } from "../src/types/enquiry.types";

interface SeedEnquiryItem {
  name: string;
  number: string;
  location: string;
  iam: string;
  message: string;
  status: EnquiryStatus;
}

const sampleEnquiries: SeedEnquiryItem[] = [
  {
    name: "Aarav Sharma",
    number: "+91 98765 11223",
    location: "Pune",
    iam: "Working Professional",
    message:
      "Looking for a private single occupancy room with dedicated workspace starting next month. Does the monthly rent include housekeeping, laundry, and high-speed Wi-Fi?",
    status: "new",
  },
  {
    name: "Sneha Patel",
    number: "+91 98220 33445",
    location: "Pune",
    iam: "Student",
    message:
      "Looking for twin sharing accommodation near Symbiosis campus. Could you please share the security deposit details and notice period policy?",
    status: "read",
  },
  {
    name: "Rohan Verma",
    number: "+91 97112 55667",
    location: "Mumbai",
    iam: "Working Professional",
    message:
      "Please arrange a callback regarding long-term corporate booking options and group discounts.",
    status: "complete",
  },
  {
    name: "Kavya Nair",
    number: "+91 90080 99001",
    location: "Bangalore",
    iam: "Intern",
    message:
      "Do you provide short-term stays (3 months) for summer internship students? Please share available options and check-in procedure.",
    status: "new",
  },
  {
    name: "Dr. Meenakshi Sundaram",
    number: "+91 94440 77889",
    location: "Noida",
    iam: "Parent",
    message:
      "Requesting a callback from the residence warden to understand 24/7 security, biometric access, and meal plans for my daughter.",
    status: "read",
  },
  {
    name: "Vikramaditya Roy",
    number: "+91 98300 22334",
    location: "Delhi",
    iam: "Student",
    message:
      "Immediate move-in needed this weekend near Delhi University. Please call me back with available bed availability.",
    status: "complete",
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
      const existing = await Enquiry.findOne({
        number: enquiry.number,
        name: enquiry.name,
      });

      if (existing) {
        console.log(
          `ℹ️  Enquiry from "${enquiry.name}" (${enquiry.number}) already exists. Skipping.`
        );
        existingCount++;
      } else {
        await Enquiry.create({
          name: enquiry.name,
          number: enquiry.number,
          location: enquiry.location,
          iam: enquiry.iam,
          message: enquiry.message,
          status: enquiry.status,
        });

        console.log(
          `✅ Created enquiry from: "${enquiry.name}" (${enquiry.number}) [Status: ${enquiry.status}]`
        );
        createdCount++;
      }
    }

    console.log("\n========================================");
    console.log("             Seed Summary               ");
    console.log("========================================");
    console.log(`Total sample records: ${sampleEnquiries.length}`);
    console.log(`Newly created:        ${createdCount}`);
    console.log(`Already existed:      ${existingCount}`);
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runSeed();
