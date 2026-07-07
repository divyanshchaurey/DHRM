const fs = require('fs');
const path = require('path');

const urls = {
  chapters: 'https://raw.githubusercontent.com/gita/gita/main/data/chapters.json',
  verses: 'https://raw.githubusercontent.com/gita/gita/main/data/verse.json',
  translations: 'https://raw.githubusercontent.com/gita/gita/main/data/translation.json'
};

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

async function download() {
    for (const [key, url] of Object.entries(urls)) {
        console.log(`Downloading ${key}...`);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            fs.writeFileSync(path.join(dataDir, `${key}.json`), JSON.stringify(data, null, 2));
            console.log(`Successfully saved ${key}.json (${Array.isArray(data) ? data.length : Object.keys(data).length} entries)`);
        } catch (e) {
            console.error(`Failed to download ${key}:`, e);
        }
    }
}

download();
