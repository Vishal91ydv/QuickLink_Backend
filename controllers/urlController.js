const Url = require('../models/Url');
const generateCode = require('../utils/generateCode');

// validate URL
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

const createShortUrl = async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!longUrl) {
    return res.status(400).json({ message: 'longUrl is required' });
  }

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    // If long URL already exists then It will return existing short url
    let existing = await Url.findOne({ longUrl });
    if (existing) {
      return res.json({ shortUrl: `${baseUrl}/${existing.shortCode}` });
    }

    //Generating unique shortCode 
    let shortCode;
    let found = true;
    let attempts = 0;
    while (found && attempts < 10) {
      shortCode = generateCode(6); // 6 chars
      const existingCode = await Url.findOne({ shortCode });
      if (!existingCode){
        found = false;
      } 
      attempts++;
    }
    if (found) {
      shortCode = generateCode(8);
    }

    const newUrl = new Url({ longUrl, shortCode });
    await newUrl.save();

    return res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const redirectToLongUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) {
      return res.status(404).send('URL not found');
    }

    // increment clicks (optional)
    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    await urlDoc.save();

    return res.redirect(urlDoc.longUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

module.exports = {
  createShortUrl,
  redirectToLongUrl
};
