import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Sequelize, DataTypes } from 'sequelize';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer Storage for Posters
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// Upload Route
app.post('/api/upload', upload.single('poster'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});


// --- DATABASE SETUP (MySQL) ---
const sequelize = new Sequelize('eventsphere_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Helper to ensure DB exists (Basic check, usually run separately)
// For this code to run, 'eventsphere_db' must exist. 
// Run 'node init_db.js' first.


// --- MODELS ---

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }, // 'student','faculty','admin'
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // 'pending','approved','rejected'
    occupation: DataTypes.STRING,
    department: DataTypes.STRING,
    lastLogin: DataTypes.STRING,
    savedEventIds: {
        type: DataTypes.JSON, // Store array as JSON string
        defaultValue: []
    }
});

const Venue = sequelize.define('Venue', {
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false }
});

const Approval = sequelize.define('Approval', {
    event: DataTypes.STRING,
    organizer: DataTypes.STRING,
    organizerPhone: DataTypes.STRING,
    date: DataTypes.STRING, // YYYY-MM-DD
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    venue: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    posterUrl: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    adminNotes: DataTypes.TEXT,
    createdByEmail: DataTypes.STRING
});

// Public Events Table
const Event = sequelize.define('Event', {
    // We manually set ID to match Approval ID for consistency
    id: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    location: DataTypes.STRING,
    attendees: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING, defaultValue: 'Upcoming' },
    imageGradient: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    organizer: DataTypes.STRING,
    organizerPhone: DataTypes.STRING,
    approvedBy: DataTypes.STRING,
    approvalDate: DataTypes.STRING,
    adminNotes: DataTypes.TEXT,
    posterUrl: DataTypes.STRING,
    createdByEmail: DataTypes.STRING
});

// Sync Database
const initDb = async () => {
    try {
        await sequelize.sync(); // Create tables if not exist
        console.log("Database synced successfully.");

        // Seed Venues if empty
        const venueCount = await Venue.count();
        if (venueCount === 0) {
            await Venue.bulkCreate([
                { name: 'Main Auditorium', capacity: 500 },
                { name: 'Seminar Hall A', capacity: 100 },
                { name: 'Computer Lab 1', capacity: 50 },
                { name: 'Open Ground', capacity: 1000 }
            ]);
            console.log("Venues seeded.");
        }

        // Seed Admin if empty
        const userCount = await User.count();
        if (userCount === 0) {
            await User.create({
                name: 'Admin User',
                email: 'admin@eventsphere.com',
                role: 'admin',
                status: 'approved',
                occupation: 'System Admin'
            });
            await User.create({
                name: 'Student User',
                email: 'student@eventsphere.com',
                role: 'student',
                status: 'approved',
                occupation: 'Student'
            });
            console.log("Admin seeded.");
        }

    } catch (error) {
        console.error("Database sync error:", error);
    }
};
initDb();

// --- ROUTES ---

// AUTH
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (user.status === 'pending') return res.status(403).json({ success: false, message: 'Account pending.' });
        if (user.status === 'rejected') return res.status(403).json({ success: false, message: 'Account rejected.' });

        const now = new Date();
        user.lastLogin = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        await user.save();

        res.json({ success: true, user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, role, occupation, department } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ success: false, message: 'Email exists.' });

        // Auto-approve first user as Admin to prevent lockout
        const userCount = await User.count();
        const isFirstUser = userCount === 0;
        const finalRole = isFirstUser ? 'admin' : role;
        const finalStatus = isFirstUser ? 'approved' : 'pending';

        const newUser = await User.create({
            name,
            email,
            role: finalRole,
            status: finalStatus,
            occupation,
            department
        });

        const msg = isFirstUser
            ? 'First user registered as Admin (Approved).'
            : 'Registration submitted. Awaiting approval.';

        res.json({ success: true, user: newUser, message: msg });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        // Comment: Returns list of all registered users
        res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/users/:id/status', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.status = req.body.status;
        await user.save();
        res.json({ success: true, user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const count = await User.destroy({ where: { id: req.params.id } });
        if (count === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// DATA
app.get('/api/data', async (req, res) => {
    try {
        const events = await Event.findAll();
        const approvals = await Approval.findAll();
        const venues = await Venue.findAll();
        res.json({ events, approvals, venues });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// APPROVALS
app.post('/api/approvals', async (req, res) => {
    try {
        const newApproval = await Approval.create({
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'pending'
        });
        res.json(newApproval);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/approvals/:id', async (req, res) => {
    try {
        const { status, adminNotes, approvedBy } = req.body;
        const approval = await Approval.findByPk(req.params.id);
        if (!approval) return res.status(404).json({ error: 'Request not found' });

        approval.status = status;
        approval.adminNotes = adminNotes;
        await approval.save();

        if (status === 'approved') {
            // Create Public Event
            await Event.create({
                id: approval.id, // Match ID
                title: approval.event,
                date: approval.date,
                startTime: approval.startTime,
                endTime: approval.endTime,
                location: approval.venue,
                category: approval.category,
                description: approval.description,
                organizer: approval.organizer,
                organizerPhone: approval.organizerPhone,
                approvedBy: approvedBy || 'Admin',
                approvalDate: new Date().toISOString(),
                adminNotes: adminNotes,
                posterUrl: approval.posterUrl,
                createdByEmail: approval.createdByEmail,
                imageGradient: 'from-blue-500 to-indigo-600'
            });
        } else if (status === 'removed' || status === 'rejected') {
            // Remove from Event table if it exists
            const event = await Event.findByPk(req.params.id);
            if (event) {
                // We update status instead of deleting to keep history?
                // Frontend logic shows 'removed'.
                event.status = 'Removed';
                event.adminNotes = adminNotes;
                await event.save();
            }
        }

        res.json({ success: true, approval });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// VENUES
app.get('/api/venues', async (req, res) => {
    const venues = await Venue.findAll();
    res.json(venues);
});

app.post('/api/venues', async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        res.json(venue);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/venues/:name', async (req, res) => {
    try {
        const venue = await Venue.findOne({ where: { name: req.params.name } });
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        venue.name = req.body.name;
        venue.capacity = req.body.capacity;
        await venue.save();
        res.json(venue);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/venues/:name', async (req, res) => {
    try {
        const count = await Venue.destroy({ where: { name: req.params.name } });
        if (count === 0) return res.status(404).json({ error: 'Venue not found' });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
