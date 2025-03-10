// generate-manifest.js
const fs = require('fs');
const path = require('path');

// Define the gallery directory path
const galleryDir = path.join(__dirname, 'assets', 'gallery');
const supportedExtensions = ['.jpg', '.jpeg', '.png'];

console.log(`Scanning directory: ${galleryDir}`);

try {
    // Check if directory exists
    if (!fs.existsSync(galleryDir)) {
        console.error(`Directory does not exist: ${galleryDir}`);
        process.exit(1);
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(galleryDir);
    
    // Filter for image files with supported extensions
    const imageFiles = files.filter(file => {
        const extension = path.extname(file).toLowerCase();
        return supportedExtensions.includes(extension);
    });
    
    console.log(`Found ${imageFiles.length} images with supported extensions`);
    
    // Create the manifest object
    const manifest = {
        images: imageFiles,
        lastUpdated: new Date().toISOString()
    };
    
    // Write the manifest to a JSON file
    const manifestPath = path.join(galleryDir, 'gallery-manifest.json');
    fs.writeFileSync(
        manifestPath,
        JSON.stringify(manifest, null, 2)
    );
    
    console.log(`Generated manifest at: ${manifestPath}`);
    console.log(`Contains ${imageFiles.length} images`);
} catch (error) {
    console.error('Error generating manifest:', error);
    process.exit(1);
}
