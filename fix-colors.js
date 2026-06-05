const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'web', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    const originalContent = fs.readFileSync(file, 'utf8');
    let newContent = originalContent;
    
    // Replace hardcoded dark backgrounds with responsive semantic bg
    newContent = newContent.replace(/bg-\[#0[0-9a-fA-F]{2,5}\]/g, 'bg-background');
    newContent = newContent.replace(/bg-slate-900/g, 'bg-background');
    newContent = newContent.replace(/bg-slate-950/g, 'bg-background');
    
    // Replace hardcoded white transparent backgrounds with muted foregrounds
    newContent = newContent.replace(/bg-white\/5/g, 'bg-muted/5');
    newContent = newContent.replace(/bg-black\/5/g, 'bg-muted/5');
    
    // Replace text-white
    newContent = newContent.replace(/text-white\/10/g, 'text-muted-foreground/10');
    
    if (newContent !== originalContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
    }
});

console.log(`Successfully updated ${changedFiles} files to fix light mode hardcoded colors.`);
