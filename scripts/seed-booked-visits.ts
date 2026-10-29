import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import { BookedVisit } from "../src/models/booked-visit.model";

interface SeedVisitItem {
  name: string;
  number: string;
  location: string;
  iam: string;
  preferredDate: Date;
  preferredTime: string;
}

function getUpcomingDate(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

const sampleVisits: SeedVisitItem[] = [
  {
    name: "Aditya Kulkarni",
    number: "+91 98234 56789",
    location: "Koramangala, Bangalore",
    iam: "Student",
    preferredDate: getUpcomingDate(2),
    preferredTime: "10:30 AM",
  },
  {
    name: "Tanvi Deshmukh",
    number: "+91 98765 43210",
    location: "HSR Layout, Bangalore",
    iam: "Working Professional",
    preferredDate: getUpcomingDate(3),
    preferredTime: "02:00 PM",
  },
  {
    name: "Rajesh & Sunita Singhal",
    number: "+91 94123 45678",
    location: "Sector 62, Noida",
    iam: "Parent",
    preferredDate: getUpcomingDate(4),
    preferredTime: "11:30 AM",
  },
  {
    name: "Neha Ranganathan",
    number: "+91 99401 23456",
    location: "Viman Nagar, Pune",
    iam: "Student",
    preferredDate: getUpcomingDate(5),
    preferredTime: "04:00 PM",
  },
  {
    name: "Farhan Siddiqui",
    number: "+91 98112 34567",
    location: "North Campus, Delhi",
    iam: "Student",
    preferredDate: getUpcomingDate(6),
    preferredTime: "01:00 PM",
  },
  {
    name: "Ananya Mukherjee",
    number: "+91 98301 23456",
    location: "Andheri West, Mumbai",
    iam: "Working Professional",
    preferredDate: getUpcomingDate(7),
    preferredTime: "05:30 PM",
  },
];

async function runSeed() {
  console.log("\n========================================");
  console.log("    AURUS - Booked Visits Seed Script   ");
  console.log("========================================\n");

  try {
    // 1. Connect to MongoDB
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected successfully.\n");

    let createdCount = 0;
    let existingCount = 0;

    // 2. Iterate and upsert/insert sample visits
    for (const visit of sampleVisits) {
      // Check if a visit with the same phone number and location already exists
      const existing = await BookedVisit.findOne({
        number: visit.number,
        location: visit.location,
      });

      if (existing) {
        console.log(
          `ℹ️  Visit for "${visit.name}" (${visit.number} at ${visit.location}) already exists. Skipping.`
        );
        existingCount++;
      } else {
        const doc = new BookedVisit(visit);
        await doc.save();
        console.log(
          `✅ Created booked visit: "${visit.name}" — ${visit.location} on ${visit.preferredDate.toISOString().slice(0, 10)} at ${visit.preferredTime}`
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
    console.error("❌ Fatal error during booked visits seeding:", error);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

runSeed();

