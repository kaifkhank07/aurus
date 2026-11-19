import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import { BookedVisit } from "../src/models/booked-visit.model";
import { BookedVisitStatus } from "../src/types/booked-visit.types";

interface SeedVisitItem {
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  collegeName: string;
  wantToVisit: Date;
  status: BookedVisitStatus;
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
    email: "aditya.kulkarni@example.com",
    collegeName: "Christ University",
    hostelCity: "Pune",
    wantToVisit: getUpcomingDate(2),
    status: "new",
  },
  {
    name: "Tanvi Deshmukh",
    number: "+91 98765 43210",
    email: "tanvi.deshmukh@example.com",
    collegeName: "NMIMS Mumbai",
    hostelCity: "Mumbai",
    wantToVisit: getUpcomingDate(3),
    status: "read",
  },
  {
    name: "Rajesh Singhal",
    number: "+91 94123 45678",
    email: "rajesh.singhal@example.com",
    collegeName: "Amity University, Noida",
    hostelCity: "Noida",
    wantToVisit: getUpcomingDate(4),
    status: "complete",
  },
  {
    name: "Neha Ranganathan",
    number: "+91 99401 23456",
    email: "neha.ranganathan@example.com",
    collegeName: "Symbiosis Institute, Pune",
    hostelCity: "Pune",
    wantToVisit: getUpcomingDate(5),
    status: "new",
  },
  {
    name: "Farhan Siddiqui",
    number: "+91 98112 34567",
    email: null,
    collegeName: "Delhi University",
    hostelCity: "Jalandhar",
    wantToVisit: getUpcomingDate(6),
    status: "read",
  },
  {
    name: "Ananya Mukherjee",
    number: "+91 98301 23456",
    email: "ananya.mukherjee@example.com",
    collegeName: "Nirma University",
    hostelCity: "Ahmedabad",
    wantToVisit: getUpcomingDate(7),
    status: "complete",
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

    // 2. Iterate and insert sample visits
    for (const visit of sampleVisits) {
      const existing = await BookedVisit.findOne({
        number: visit.number,
        hostelCity: visit.hostelCity,
      });

      if (existing) {
        console.log(
          `ℹ️  Visit for "${visit.name}" (${visit.number} at ${visit.hostelCity}) already exists. Skipping.`
        );
        existingCount++;
      } else {
        await BookedVisit.create({
          name: visit.name,
          number: visit.number,
          email: visit.email,
          hostelCity: visit.hostelCity,
          collegeName: visit.collegeName,
          wantToVisit: visit.wantToVisit,
          status: visit.status,
        });

        console.log(
          `✅ Created booked visit: "${visit.name}" (${visit.number}) for ${visit.wantToVisit.toDateString()} [Status: ${visit.status}]`
        );
        createdCount++;
      }
    }

    console.log("\n========================================");
    console.log("             Seed Summary               ");
    console.log("========================================");
    console.log(`Total sample records: ${sampleVisits.length}`);
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
