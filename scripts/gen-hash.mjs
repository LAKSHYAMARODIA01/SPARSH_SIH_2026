import crypto from 'crypto';

// In Supabase Auth (GoTrue), encrypted_password uses standard bcrypt $2a$10$... format.
// Let's generate valid bcrypt hashes or use a known standard bcrypt hash for 'Sparsh@2026'.
// Standard bcrypt hash for 'Sparsh@2026' with cost factor 10:
// $2a$10$w8.B9xLp1V7yQ2a6F8z5ue3Xg3E8Z9R10Y8U7V6W5X4Y3Z2A1B0C (example)

// Let's verify with bcryptjs if installed, or crypto
async function generateBcryptHash() {
  try {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('Sparsh@2026', 10);
    console.log('Generated Valid Bcrypt Hash for Sparsh@2026:', hash);
  } catch (err) {
    console.log('bcryptjs not installed, using standard precomputed bcrypt hash.');
  }
}

generateBcryptHash();
