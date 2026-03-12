const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to save game data
app.post('/api/save-data', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, 'public', 'data.json');

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing data.json:', err);
      return res.status(500).json({ success: false, message: 'Error saving data.' });
    }
    res.json({ success: true, message: 'Data saved successfully.' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
