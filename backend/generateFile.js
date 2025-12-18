const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// 1. Define the folder path where files will be saved
const dirCodes = path.join(__dirname, 'temp'); 

// 2. AUTOMATICALLY CREATE FOLDER IF MISSING
// This is critical for Render/Docker because the folder won't exist by default
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content) => {
    // Generate a unique ID for the file (e.g., "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed")
    const jobId = uuid();
    
    // Create the full filename (e.g., "jobId.cpp" or "jobId.txt")
    const filename = `${jobId}.${format}`;
    
    // Create the full path (e.g., "C:\Users\...\backend\temp\jobId.cpp")
    const filePath = path.join(dirCodes, filename);
    
    // Write the content to the file
    await fs.writeFileSync(filePath, content);
    
    // Return the path so executeCode knows where to find it
    return filePath;
};

module.exports = { generateFile };