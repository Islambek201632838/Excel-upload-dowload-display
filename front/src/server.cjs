const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs/promises');

const app = express();
const port = 8003;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create multer instance
const upload = multer({ storage });

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded.');
  } else {
    res.send('File uploaded successfully.');
  }
});

// Handle file downloads
app.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  try {
    await fs.access(filePath);
    res.download(filePath, filename);
  } catch (error) {
    res.status(404).send('File not found.');
  }
});

// Get file list
app.get('/files', async (req, res) => {
  try {
    const fileList = await fs.readdir(path.join(__dirname, 'uploads'));
    res.json({ files: fileList });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
