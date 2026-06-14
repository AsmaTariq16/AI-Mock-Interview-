import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_DB_DIR = path.join(__dirname, '..', '..', 'data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'db.json');

// Ensure data folder exists for JSON fallback
async function ensureJsonDbDir() {
  try {
    await fs.mkdir(JSON_DB_DIR, { recursive: true });
    try {
      await fs.access(JSON_DB_PATH);
    } catch {
      // Create empty db.json structure
      await fs.writeFile(JSON_DB_PATH, JSON.stringify({ users: [], interviews: [] }, null, 2));
    }
  } catch (err) {
    console.error('Error creating JSON DB directory:', err);
  }
}

// ----------------------------------------------------
// MongoDB Schema Definitions
// ----------------------------------------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true },
  level: { type: String, required: true },
  experience: { type: String, required: true },
  focus: { type: String, required: true },
  difficulty: { type: String, required: true },
  questionCount: { type: Number, required: true },
  questions: [{
    questionText: String,
    answerText: String,
    score: Number,
    feedback: String,
    durationSeconds: Number
  }],
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  overallScore: { type: Number, default: 0 },
  finalFeedback: { type: String, default: '' },
  recommendation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

let UserMongo;
let InterviewMongo;

let isMongoConnected = false;

// Connect Database
export async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri);
      isMongoConnected = true;
      UserMongo = mongoose.model('User', userSchema);
      InterviewMongo = mongoose.model('Interview', interviewSchema);
      console.log('MongoDB connected successfully.');
      return;
    } catch (error) {
      console.error('MongoDB connection failed. Falling back to local JSON database.', error);
    }
  }

  // Fallback to JSON file database
  console.log('Using local JSON database at:', JSON_DB_PATH);
  await ensureJsonDbDir();
}

// ----------------------------------------------------
// JSON Database Helper Functions
// ----------------------------------------------------
async function readJsonDb() {
  await ensureJsonDbDir();
  const data = await fs.readFile(JSON_DB_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeJsonDb(data) {
  await ensureJsonDbDir();
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

// Generate unique string ID for JSON mode
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ----------------------------------------------------
// DB Repositories (Unified Interface)
// ----------------------------------------------------
export const User = {
  async findOne({ email }) {
    if (isMongoConnected) {
      return await UserMongo.findOne({ email });
    }
    const db = await readJsonDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async findById(id) {
    if (isMongoConnected) {
      return await UserMongo.findById(id);
    }
    const db = await readJsonDb();
    const user = db.users.find(u => u._id === id);
    return user || null;
  },

  async create({ name, email, password }) {
    if (isMongoConnected) {
      return await UserMongo.create({ name, email, password });
    }
    const db = await readJsonDb();
    const newUser = {
      _id: generateId(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await writeJsonDb(db);
    return newUser;
  }
};

export const Interview = {
  async findById(id) {
    if (isMongoConnected) {
      return await InterviewMongo.findById(id);
    }
    const db = await readJsonDb();
    const interview = db.interviews.find(i => i._id === id);
    return interview || null;
  },

  async find(query) {
    if (isMongoConnected) {
      return await InterviewMongo.find(query).sort({ createdAt: -1 });
    }
    const db = await readJsonDb();
    let results = db.interviews;
    if (query.userId) {
      results = results.filter(i => i.userId === query.userId);
    }
    // Sort descending by createdAt
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(data) {
    if (isMongoConnected) {
      return await InterviewMongo.create(data);
    }
    const db = await readJsonDb();
    const newInterview = {
      _id: generateId(),
      ...data,
      questions: data.questions || [],
      status: data.status || 'in-progress',
      overallScore: data.overallScore || 0,
      finalFeedback: data.finalFeedback || '',
      recommendation: data.recommendation || '',
      createdAt: new Date().toISOString()
    };
    db.interviews.push(newInterview);
    await writeJsonDb(db);
    return newInterview;
  },

  async findByIdAndUpdate(id, updateData, options = {}) {
    if (isMongoConnected) {
      return await InterviewMongo.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }
    const db = await readJsonDb();
    const index = db.interviews.findIndex(i => i._id === id);
    if (index === -1) return null;

    // Apply updates (handles simple flat properties and arrays)
    const current = db.interviews[index];
    const updated = {
      ...current,
      ...updateData,
    };
    
    db.interviews[index] = updated;
    await writeJsonDb(db);
    return updated;
  }
};
