const fs = require('fs');
const f = 'e:/Project/Ram/web/src/components/layout/sidebar.tsx';
let text = fs.readFileSync(f, 'utf8');
text = text.replace(/href: "\/admin/g, 'href: "/superadmin');
fs.writeFileSync(f, text);
console.log("Replaced in sidebar");
