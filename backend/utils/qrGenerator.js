const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrDir = path.join(__dirname, '../uploads/qrcodes');

    // ✅ Create the directory if it doesn't exist
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    // ✅ Generate a unique filename
    const filename = `qr_${Date.now()}.png`;
    const filepath = path.join(qrDir, filename);

    // ✅ Generate the QR code image file
    await QRCode.toFile(filepath, data);

    // ✅ Return the path that can be used in frontend (adjust if needed)
    return `/uploads/qrcodes/${filename}`;
  } catch (error) {
    console.error('❌ Failed to generate QR Code:', error.message);
    return null;
  }
};

module.exports = generateQRCode;
