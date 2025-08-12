const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('Image_UI_Generation_Thread.xlsx');

// Get the first worksheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Print the data
console.log('Excel file contents:');
console.log(JSON.stringify(data, null, 2));

// Also write to a JSON file for easier reading
fs.writeFileSync('excel-data.json', JSON.stringify(data, null, 2));
console.log('\nData also saved to excel-data.json');
