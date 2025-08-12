import XLSX from 'xlsx';
import fs from 'fs';

// Read the Excel file
const workbook = XLSX.readFile('Image_UI_Generation_Thread_updated.xlsx');

// Get the first worksheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Print the data
console.log('Updated Excel file contents:');
console.log(JSON.stringify(data, null, 2));

// Also write to a JSON file for easier reading
fs.writeFileSync('updated-excel-data.json', JSON.stringify(data, null, 2));
console.log('\nData also saved to updated-excel-data.json');
