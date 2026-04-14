const fs = require('fs');
const mongoose = require('mongoose');
const argon2 = require('argon2');
const path = require('path');

async function seed() {
  try {
    // Read local env file
    const envPath = path.join(__dirname, '..', '.env.local');
    const envLocal = fs.readFileSync(envPath, 'utf8');
    const mongoUriMatch = envLocal.match(/MONGO_URI=(.*)/);
    const MONGO_URI = mongoUriMatch ? mongoUriMatch[1].trim() : '';

    if (!MONGO_URI) {
      console.error("❌ MONGO_URI not found in .env.local");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB");

    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true },
      squad: { type: Number },
      batch: { type: Number },
      defaultSeat: { type: Number },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Clear existing users
    await User.deleteMany({});

    const passwordHash = await argon2.hash("Wissen123");

    const names = [
      "Aarohi", "Abeer", "Aditya", "Aisha", "Akshay", "Alina", "Aman", "Anika",
      "Arhaan", "Aria", "Avni", "Bhavin", "Chetan", "Dhwani", "Dev", "Diya",
      "Eshan", "Farah", "Gauri", "Harit", "Ira", "Jai", "Karthik", "Kiara",
      "Laksh", "Mahira", "Naman", "Navya", "Omkar", "Parth", "Rhea", "Ritvik",
      "Saanvi", "Samar", "Tanvi", "Tushar", "Uday", "Vaani", "Vihaan", "Yamini",
      "Aadvik", "Barkha", "Chirag", "Darsh", "Esha", "Falak", "Gautam", "Himani",
      "Ishita", "Janvi", "Kabir", "Krisha", "Lavit", "Mehul", "Neha", "Nirav",
      "Ojas", "Pallavi", "Prisha", "Raghav", "Reyansh", "Sakshi", "Shaurya", "Trisha",
      "Urvashi", "Ved", "Vanya", "Yashvi", "Zubin", "Ameya", "Bhavya", "Chahat",
      "Divit", "Elina", "Hrida", "Jivika", "Krupal", "Mitali", "Nisarg", "Rupali"
    ];

    const usersData = names.map((name, index) => {
      const position = index + 1;
      const squad = Math.ceil(position / 8);
      const batch = squad <= 5 ? 1 : 2;
      const defaultSeat = ((position - 1) % 40) + 1;
      const localPart = name.toLowerCase().replace(/[^a-z0-9]+/g, '');

      return {
        name,
        email: `squad${squad}.${localPart}@wissen.com`,
        squad,
        batch,
        defaultSeat,
      };
    });

    let createdCount = 0;
    for (const u of usersData) {
      const user = new User({
        ...u,
        password: passwordHash
      });
      await user.save();
      console.log(`  ✅  Created: ${u.name} <${u.email}> — Squad ${u.squad}, Batch ${u.batch}, Seat ${u.defaultSeat}`);
      createdCount++;
    }

    console.log(`\n🌱  Done. Created ${createdCount} users, skipped 0.`);
    console.log(`📝  Default password: "Wissen123"`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();