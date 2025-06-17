// hash-gen.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const plainPassword = 'test123'; // 👈 change to any password you want
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hash);
}

generateHash();
