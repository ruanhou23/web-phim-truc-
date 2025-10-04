const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Convert CSV to JSON
const inputFile = './output.csv';
const outputFile = '../public/user/adult_movies_data.json';

const records = [];

console.log('🔄 Converting CSV to JSON...');

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    // Clean and process data
    const record = {
      id: row.id?.trim() || '',
      title: row.title?.trim() || '',
      originalTitle: row.originalTitle?.trim() || row.title?.trim() || '',
      category: 'adult', // Mark as adult content
      actor: row.actor?.trim() || 'Unknown',
      videoLink: row.videoLink?.trim() || '#',
      filePath: row.filePath?.trim() || '',
      description: row.category?.trim() || '', // Use category field as description
      year: '2024', // Default year
      views: Math.floor(Math.random() * 1000000) + 10000 // Random views
    };
    
    records.push(record);
  })
  .on('end', () => {
    console.log(`✅ Processed ${records.length} records`);
    
    // Write JSON file
    fs.writeFileSync(outputFile, JSON.stringify(records, null, 2));
    console.log(`🎉 JSON file created: ${outputFile}`);
    console.log(`📊 Total movies: ${records.length}`);
  })
  .on('error', (err) => {
    console.error('❌ Error:', err);
  });
