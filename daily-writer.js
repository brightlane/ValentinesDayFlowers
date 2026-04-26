const fs = require('fs');
const path = require('path');

// ... [Keep your existing generateContent() and htmlTemplate code here] ...

// NEW LOGIC: Ensure the 'blog' directory exists before writing
const blogDir = path.join(__dirname, 'blog');

if (!fs.existsSync(blogDir)) {
    console.log("Blog directory missing. Creating it now...");
    fs.mkdirSync(blogDir, { recursive: true });
}

// Save the file using the absolute path
const filePath = path.join(blogDir, content.slug);
fs.writeFileSync(filePath, htmlTemplate);

console.log(`Successfully generated: ${content.slug}`);
