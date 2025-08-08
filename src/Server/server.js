require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const msal = require("@azure/msal-node");

const CollectedItem = require('./models/collecteditem');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Azure AD configuration (from env vars)
const config = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: process.env.AZURE_AUTHORITY,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const pca = new msal.ConfidentialClientApplication(config);

const authCodeUrlParameters = {
  scopes: ["user.read"], 
  redirectUri: process.env.AZURE_REDIRECT_URI,
};

app.get("/", async (req, res) => {
  try {
    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).send("Authentication error");
  }
});

app.get("/auth-callback", async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["user.read"],
    redirectUri: process.env.AZURE_REDIRECT_URI,
  };

  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    console.log("Token acquired:", response.accessToken);
    res.redirect("/home");
  } catch (error) {
    console.error("Error during token acquisition:", error);
    res.status(500).send("Error during token acquisition.");
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Multer storage configurations
const createStorage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `./${folderName}`),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  },
});

const foundItemUpload = multer({ storage: createStorage('foundItemImages') });
const lostItemUpload = multer({ storage: createStorage('lostItemImages') });

// Mongoose schemas
const foundItemSchema = new mongoose.Schema({
  description: String,
  date: String,
  category: String,
  subcategory: String,
  itemName: String,
  place: String,
  ownerName: String,
  details: String,
  isIdentifiable: Boolean,
  itemImage: String,
}, { collection: 'foundItem' });

const FoundItem = mongoose.model('FoundItem', foundItemSchema);

const lostItemSchema = new mongoose.Schema({
  description: String,
  date: String,
  phone: String,
  name: String,
  sapId: String,
  category: String,
  subcategory: String,
  itemName: String,
  itemImage: String,
  place: String,
}, { collection: 'lostItem' });

const LostItem = mongoose.model('LostItem', lostItemSchema);

// API routes
app.post('/api/submitFoundItem', foundItemUpload.single('itemImage'), async (req, res) => {
  try {
    const newItem = new FoundItem({ ...req.body, itemImage: req.file.filename });
    await newItem.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error submitting found item:', error);
    res.sendStatus(500);
  }
});

app.post('/api/submitLostItem', lostItemUpload.single('itemImage'), async (req, res) => {
  try {
    const newItem = new LostItem({ ...req.body, itemImage: req.file ? req.file.filename : null });
    await newItem.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error submitting lost item:', error);
    res.sendStatus(500);
  }
});

app.post('/getAllItems', async (req, res) => {
  try {
    const items = await FoundItem.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching found items:", error);
    res.sendStatus(500);
  }
});

app.post('/getLostItems', async (req, res) => {
  try {
    const items = await LostItem.find();
    res.json(items);
  } catch (error) {
    console.error("Error fetching lost items:", error);
    res.sendStatus(500);
  }
});

app.post('/claimItem/:id', async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const collectedItem = new CollectedItem({ ...item.toObject(), ...req.body });
    await collectedItem.save();
    await FoundItem.findByIdAndDelete(req.params.id);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error claiming item:', error);
    res.sendStatus(500);
  }
});

app.use('/feedback', require('./routes/feedback'));

// Static image serving
app.use('/foundItemImages', express.static(path.join(__dirname, 'foundItemImages')));
app.use('/lostItemImages', express.static(path.join(__dirname, 'lostItemImages')));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
