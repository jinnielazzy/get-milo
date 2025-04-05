import fs from 'fs/promises';
import axios from 'axios';

const API_URL = 'https://api.douyin.wtf/api/douyin/web/fetch_user_post_videos';
const SEC_USER_ID = 'MS4wLjABAAAAo0hDbJvN_-xEvV3BP6mQJ7azqbhmErfLoPcQES5Lkq4';
const SAVE_PATH = '/videos/latest.mp4'; // overwrite this file every time

async function main() {
  try {
    console.log('🔗 Fetching latest video...');
    const response = await axios.get(`${API_URL}?sec_user_id=${SEC_USER_ID}&count=1&max_cursor=0`, {
      headers: { accept: 'application/json' },
    });

    const video = response.data?.data?.aweme_list?.[0];
    const url = video?.video?.play_addr?.url_list?.[0];

    if (!url) {
      console.warn('⚠️ No video URL found.');
      return;
    }

    console.log(`📥 Downloading latest video from ${url}`);
    const res = await axios.get(url, { responseType: 'stream' });

    const file = (await fs.open(SAVE_PATH, 'w')).createWriteStream();
    res.data.pipe(file);

    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });

    console.log('✅ Video saved as latest.mp4');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
