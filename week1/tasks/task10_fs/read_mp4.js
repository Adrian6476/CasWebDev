const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sample.mp4');

fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error('error reading the file:', err);
        return;
    }
    console.log('file read successfully. data length:', data.length);

    const bufferString = data.toString('hex').substring(0, 100);
    console.log('buffer content (first 100 characters):', bufferString);
});
