// Pemakaian: npm run hash-password -- "PasswordAnda"   → cetak nilai ADMIN_PASSWORD_HASH
const auth = require('../api/_lib/auth.js'); const pw = process.argv[2];
if (!pw || pw.length < 8) { console.error('Beri password minimal 8 karakter:  npm run hash-password -- "PasswordAnda"'); process.exit(1); }
console.log('\nADMIN_PASSWORD_HASH=' + auth.hash(pw) + '\n\nSalin baris di atas ke .env (lokal) dan Environment Variables Vercel. Hapus ADMIN_PASSWORD bila memakai hash.\n');
