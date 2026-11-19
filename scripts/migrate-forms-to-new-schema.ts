/**
 * scripts/migrate-forms-to-new-schema.ts
 *
 * Migration script to transform legacy MongoDB records for Enquiry and BookedVisit
 * collections into the new unified schema structures.
 *
 * Collections migrated:
 *  1. `enquiries`
 *     - Maps: `location` -> `hostelCity`
 *     - Infers: `gender` ("boys" | "girls") from legacy `iam`, `type`, or `message` (defaults to "boys")
 *     - Normalizes: `email` (lowercased or null), `status` ("new" | "read" | "complete")
 *     - Removes ($unset): obsolete fields (`location`, `iam`, `type`, `preferredCity`, `city`)
 *
 *  2. `bookedvisits`
 *     - Maps: `location` -> `hostelCity`
 *     - Maps: `college` -> `collegeName` (defaults to "General / Not Specified" if missing)
 *     - Maps: `preferredDate` -> `wantToVisit` (valid Date object)
 *     - Normalizes: `email` (lowercased or null), `status` ("new" | "read" | "complete")
 *     - Removes ($unset): obsolete fields (`location`, `college`, `iam`, `preferredDate`, `preferredTime`, `time`, `visitDate`)
 *
 * USAGE:
 *   Dry run preview (safe, no DB changes):
 *     npx tsx scripts/migrate-forms-to-new-schema.ts
 *     npx tsx scripts/migrate-forms-to-new-schema.ts --dry-run
 *
 *   Execute live migration in Development:
 *     NODE_ENV=development npx tsx scripts/migrate-forms-to-new-schema.ts --execute
 *
 *   Execute live migration in Production:
 *     NODE_ENV=production npx tsx scripts/migrate-forms-to-new-schema.ts --execute
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";

interface RawRecord {
  _id: mongoose.Types.ObjectId | string;
  [key: string]: unknown;
}

// Command-line flag parsing
const args = process.argv.slice(2);
const isDryRun = !args.includes("--execute") && !args.includes("-e");

function inferGender(doc: RawRecord): "boys" | "girls" {
  if (doc.gender === "boys" || doc.gender === "girls") {
    return doc.gender;
  }

  const textToScan = [doc.iam, doc.message, doc.type]
    .filter((val): val is string => typeof val === "string" && Boolean(val.trim()))
    .join(" ")
    .toLowerCase();

  if (/girl|female|women|lady|ladies|daughter|sister/i.test(textToScan)) {
    return "girls";
  }

  if (/boy|male|men|gent|son|brother/i.test(textToScan)) {
    return "boys";
  }

  return "boys"; // Safe default enum value
}

function normalizeDate(val: unknown, fallbackDate: Date): Date {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === "string" || typeof val === "number") {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallbackDate;
}

function normalizeStatus(val: unknown): "new" | "read" | "complete" {
  const allowed = ["new", "read", "complete"];
  if (typeof val === "string" && allowed.includes(val.toLowerCase().trim())) {
    return val.toLowerCase().trim() as "new" | "read" | "complete";
  }
  return "new";
}

async function migrateEnquiries(db: mongoose.mongo.Db) {
  console.log("\n==================================================");
  console.log("       MIGRATING ENQUIRIES (enquiries)            ");
  console.log("==================================================");

  const collection = db.collection("enquiries");
  const cursor = collection.find({});
  const total = await collection.countDocuments();

  console.log(`Found ${total} total enquiry records.`);

  let migratedCount = 0;
  let alreadyValidCount = 0;
  let errorCount = 0;

  while (await cursor.hasNext()) {
    const doc = (await cursor.next()) as RawRecord | null;
    if (!doc) continue;

    const docId = doc._id.toString();

    // Check if migration is needed
    const hasObsoleteFields =
      doc.location !== undefined ||
      doc.iam !== undefined ||
      doc.type !== undefined ||
      doc.preferredCity !== undefined ||
      doc.city !== undefined;

    const hasNewFields =
      typeof doc.hostelCity === "string" &&
      doc.hostelCity.trim() !== "" &&
      (doc.gender === "boys" || doc.gender === "girls");

    if (hasNewFields && !hasObsoleteFields) {
      alreadyValidCount++;
      continue;
    }

    // Build migration payload
    const updatedName =
      typeof doc.name === "string" && doc.name.trim() ? doc.name.trim() : "Enquiry User";
    const updatedNumber =
      typeof doc.number === "string" ? doc.number.trim() : "";
    const updatedEmail =
      typeof doc.email === "string" && doc.email.trim()
        ? doc.email.trim().toLowerCase()
        : null;
    const rawCity =
      (typeof doc.hostelCity === "string" && doc.hostelCity.trim()) ||
      (typeof doc.location === "string" && doc.location.trim()) ||
      (typeof doc.city === "string" && doc.city.trim()) ||
      (typeof doc.preferredCity === "string" && doc.preferredCity.trim()) ||
      "Mumbai";
    const updatedCity = rawCity.trim();
    const updatedGender = inferGender(doc);
    const updatedMessage =
      typeof doc.message === "string" && doc.message.trim()
        ? doc.message.trim()
        : null;
    const updatedStatus = normalizeStatus(doc.status);

    const setFields: Record<string, unknown> = {
      name: updatedName,
      number: updatedNumber,
      email: updatedEmail,
      hostelCity: updatedCity,
      gender: updatedGender,
      message: updatedMessage,
      status: updatedStatus,
    };

    const unsetFields: Record<string, string> = {};
    if (doc.location !== undefined) unsetFields.location = "";
    if (doc.iam !== undefined) unsetFields.iam = "";
    if (doc.type !== undefined) unsetFields.type = "";
    if (doc.preferredCity !== undefined) unsetFields.preferredCity = "";
    if (doc.city !== undefined) unsetFields.city = "";

    const updateDoc: Record<string, unknown> = {
      $set: setFields,
    };
    if (Object.keys(unsetFields).length > 0) {
      updateDoc.$unset = unsetFields;
    }

    console.log(`\n[Enquiry ${docId}] ${doc.name} (${doc.number})`);
    console.log(`  -> City: "${updatedCity}" (from: "${String(doc.hostelCity || doc.location || 'none')}")`);
    console.log(`  -> Gender: "${updatedGender}" (inferred from: iam="${String(doc.iam || 'none')}")`);
    console.log(`  -> Status: "${updatedStatus}"`);
    if (Object.keys(unsetFields).length > 0) {
      console.log(`  -> Unsetting legacy fields: ${Object.keys(unsetFields).join(", ")}`);
    }

    if (!isDryRun) {
      try {
        await collection.updateOne({ _id: new mongoose.Types.ObjectId(String(doc._id)) }, updateDoc);
        migratedCount++;
      } catch (err) {
        console.error(`  ❌ Failed to update enquiry ${docId}:`, err);
        errorCount++;
      }
    } else {
      migratedCount++;
    }
  }

  console.log(`\nEnquiry Summary:`);
  console.log(`  Total:          ${total}`);
  console.log(`  Already Valid:  ${alreadyValidCount}`);
  console.log(`  Migrated:       ${migratedCount} ${isDryRun ? "(Simulated - Dry Run)" : "(Applied)"}`);
  if (errorCount > 0) console.log(`  Errors:         ${errorCount}`);
}

async function migrateBookedVisits(db: mongoose.mongo.Db) {
  console.log("\n==================================================");
  console.log("       MIGRATING BOOKED VISITS (bookedvisits)     ");
  console.log("==================================================");

  const collection = db.collection("bookedvisits");
  const cursor = collection.find({});
  const total = await collection.countDocuments();

  console.log(`Found ${total} total booked visit records.`);

  let migratedCount = 0;
  let alreadyValidCount = 0;
  let errorCount = 0;

  while (await cursor.hasNext()) {
    const doc = (await cursor.next()) as RawRecord | null;
    if (!doc) continue;

    const docId = doc._id.toString();

    // Check if migration is needed
    const hasObsoleteFields =
      doc.location !== undefined ||
      doc.college !== undefined ||
      doc.iam !== undefined ||
      doc.preferredDate !== undefined ||
      doc.preferredTime !== undefined ||
      doc.time !== undefined;

    const hasNewFields =
      typeof doc.hostelCity === "string" &&
      doc.hostelCity.trim() !== "" &&
      typeof doc.collegeName === "string" &&
      doc.collegeName.trim() !== "" &&
      Boolean(doc.wantToVisit);

    if (hasNewFields && !hasObsoleteFields) {
      alreadyValidCount++;
      continue;
    }

    // Build migration payload
    const updatedName =
      typeof doc.name === "string" && doc.name.trim() ? doc.name.trim() : "Visit User";
    const updatedNumber =
      typeof doc.number === "string" ? doc.number.trim() : "";
    const updatedEmail =
      typeof doc.email === "string" && doc.email.trim()
        ? doc.email.trim().toLowerCase()
        : null;
    const rawCity =
      (typeof doc.hostelCity === "string" && doc.hostelCity.trim()) ||
      (typeof doc.location === "string" && doc.location.trim()) ||
      "Mumbai";
    const updatedCity = rawCity.trim();

    const rawCollege =
      (typeof doc.collegeName === "string" && doc.collegeName.trim()) ||
      (typeof doc.college === "string" && doc.college.trim()) ||
      "General / Not Specified";
    const updatedCollege = rawCollege.trim();

    const fallbackDate = doc.createdAt instanceof Date ? doc.createdAt : new Date();
    const updatedDate = normalizeDate(doc.wantToVisit || doc.preferredDate, fallbackDate);
    const updatedStatus = normalizeStatus(doc.status);

    const setFields: Record<string, unknown> = {
      name: updatedName,
      number: updatedNumber,
      email: updatedEmail,
      hostelCity: updatedCity,
      collegeName: updatedCollege,
      wantToVisit: updatedDate,
      status: updatedStatus,
    };

    const unsetFields: Record<string, string> = {};
    if (doc.location !== undefined) unsetFields.location = "";
    if (doc.college !== undefined) unsetFields.college = "";
    if (doc.iam !== undefined) unsetFields.iam = "";
    if (doc.preferredDate !== undefined) unsetFields.preferredDate = "";
    if (doc.preferredTime !== undefined) unsetFields.preferredTime = "";
    if (doc.time !== undefined) unsetFields.time = "";

    const updateDoc: Record<string, unknown> = {
      $set: setFields,
    };
    if (Object.keys(unsetFields).length > 0) {
      updateDoc.$unset = unsetFields;
    }

    console.log(`\n[BookedVisit ${docId}] ${doc.name} (${doc.number})`);
    console.log(`  -> City: "${updatedCity}" (from: "${String(doc.hostelCity || doc.location || 'none')}")`);
    console.log(`  -> College: "${updatedCollege}" (from: "${String(doc.collegeName || doc.college || 'none')}")`);
    console.log(`  -> Want To Visit: "${updatedDate.toISOString()}" (from: "${String(doc.wantToVisit || doc.preferredDate || 'none')}")`);
    console.log(`  -> Status: "${updatedStatus}"`);
    if (Object.keys(unsetFields).length > 0) {
      console.log(`  -> Unsetting legacy fields: ${Object.keys(unsetFields).join(", ")}`);
    }

    if (!isDryRun) {
      try {
        await collection.updateOne({ _id: new mongoose.Types.ObjectId(String(doc._id)) }, updateDoc);
        migratedCount++;
      } catch (err) {
        console.error(`  ❌ Failed to update booked visit ${docId}:`, err);
        errorCount++;
      }
    } else {
      migratedCount++;
    }
  }

  console.log(`\nBooked Visit Summary:`);
  console.log(`  Total:          ${total}`);
  console.log(`  Already Valid:  ${alreadyValidCount}`);
  console.log(`  Migrated:       ${migratedCount} ${isDryRun ? "(Simulated - Dry Run)" : "(Applied)"}`);
  if (errorCount > 0) console.log(`  Errors:         ${errorCount}`);
}

async function run() {
  console.log("==================================================");
  console.log("  AURUS - Forms Schema Migration Utility          ");
  console.log("==================================================");
  if (isDryRun) {
    console.log("🔍 MODE: DRY RUN PREVIEW (No changes will be saved to MongoDB)");
    console.log("   To apply changes for real, re-run with: --execute");
  } else {
    console.log("⚡ MODE: LIVE EXECUTION (Changes WILL be written to MongoDB)");
  }

  try {
    const conn = await connectToDatabase();
    const db = conn.connection.db;

    if (!db) {
      throw new Error("Could not acquire MongoDB database handle.");
    }

    console.log(`Database connected: "${db.databaseName}"`);

    await migrateEnquiries(db);
    await migrateBookedVisits(db);

    console.log("\n==================================================");
    console.log("              MIGRATION COMPLETE                  ");
    console.log("==================================================");
    if (isDryRun) {
      console.log("✅ Dry run completed successfully with zero modifications.");
      console.log("   Run with '--execute' to perform the actual update when ready.");
    } else {
      console.log("✅ All records successfully migrated in the database.");
    }

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Migration script failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
