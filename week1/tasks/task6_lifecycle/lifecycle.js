// lifecycle.js

console.log('start');

process.nextTick(() => {
    console.log('nextTick callback');
});

process.on('exit', (code) => {
    console.log(`exit code：${code}`);
});

console.log('end');
