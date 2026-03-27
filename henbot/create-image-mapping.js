const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Create image mapping from output.csv
const inputFile = './output.csv';
const outputFile = '../public/user/adultImageMapping.js';

const imageMapping = {};
let processedCount = 0;

console.log('🔄 Creating image mapping from output.csv...');

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    const id = row.id?.trim();
    const imageUrl = row.filePath?.trim();
    
    if (id && imageUrl && imageUrl.includes('hentaiz.bot')) {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      if (filename && filename.includes('.')) {
        imageMapping[id] = filename;
        processedCount++;
      }
    }
  })
  .on('end', () => {
    console.log(`✅ Processed ${processedCount} images`);
    
    // Create JavaScript file
    const jsContent = `// Adult Movie Image Mapping - Auto Generated
const adultImageMapping = ${JSON.stringify(imageMapping, null, 2)};

// Function to get adult movie image
function getAdultMovieImage(movieId) {
    const imageName = adultImageMapping[movieId];
    if (imageName) {
        return \`https://hentaiz.bot/img/400/2024/11/08/\${imageName}\`;
    }
    // Fallback to random placeholder
    return \`https://picsum.photos/300/450?blur=3\`;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { adultImageMapping, getAdultMovieImage };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.adultImageMapping = adultImageMapping;
    window.getAdultMovieImage = getAdultMovieImage;
}`;

    fs.writeFileSync(outputFile, jsContent);
    console.log(`🎉 Image mapping created: ${outputFile}`);
    console.log(`📊 Total mappings: ${Object.keys(imageMapping).length}`);
    
    // Show sample mappings
    const sampleIds = Object.keys(imageMapping).slice(0, 5);
    console.log('📋 Sample mappings:');
    sampleIds.forEach(id => {
      console.log(`  ${id}: ${imageMapping[id]}`);
    });
  })
  .on('error', (err) => {
    console.error('❌ Error:', err);
  });
