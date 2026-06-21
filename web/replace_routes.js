const fs = require('fs');

const f1 = 'e:/Project/Ram/web/src/lib/api/api-client.ts';
let text1 = fs.readFileSync(f1, 'utf8');
text1 = text1.replace(/\/admin/g, '/superadmin');
fs.writeFileSync(f1, text1);

const f2 = 'e:/Project/Ram/web/src/lib/api/admin-api.ts';
let text2 = fs.readFileSync(f2, 'utf8');
text2 = text2.replace(/\/admin/g, '/superadmin');
fs.writeFileSync(f2, text2);

console.log("Done");
