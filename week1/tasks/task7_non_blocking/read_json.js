const fs = require('fs');
const path = require('path');

function readJSONFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        try {
            const json = JSON.parse(data);
            callback(null, json);
        } catch (parseErr) {
            callback(parseErr, null);
        }
    });
}

const filePath = path.join(__dirname, 'sample.json');

readJSONFile(filePath, (err, data) => {
    if (err) {
        console.error('error reading json file:', err.message);
    } else {
        console.log('json file content:', data);
    }
});
