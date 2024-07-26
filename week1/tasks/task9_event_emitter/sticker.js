const EventEmitter = require('events');

class StickerManager extends EventEmitter {
    constructor() {
        super();
        this.library = [];
        this.on('create', this.onCreate);
        this.on('update', this.onUpdate);
        this.on('destroy', this.onDestroy);
    }

    onCreate() {
        console.log('library initialised');
    }

    onUpdate() {
        console.log('library updated:', this.library);
    }

    onDestroy() {
        const totalWords = this.library.reduce((acc, sticker) => acc + sticker.content.length, 0);
        console.log(`total words in library: ${totalWords}`);
    }

    add(content = '', color = 'default') {
        const newSticker = {
            id: Math.random().toString(36).substring(2, 18),
            content,
            color,
            create: new Date().toISOString()
        };
        this.library.push(newSticker);
        this.emit('update');
    }
}

const stickerManager = new StickerManager();
stickerManager.emit('create');
stickerManager.add('first note', 'yellow');
stickerManager.add('second note', 'blue');
stickerManager.emit('destroy');
