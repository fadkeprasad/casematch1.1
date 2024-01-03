const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const csvFilePath = path.join("C:\\Users\\ANJU\\Downloads", 'data.csv'); // Path to your CSV file
const outputJsonPath = path.join("C:\\Users\\ANJU\\casematch1.1", 'casebank.json'); // Path for the output JSON file

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        fs.writeFile(outputJsonPath, JSON.stringify(jsonObj, null, 2), (err) => {
            if (err) {
                console.error('An error occurred:', err);
                return;
            }
            console.log('JSON saved to ' + outputJsonPath);
        });
    })
    .catch(err => {
        console.error("Error converting file:", err);
    });

