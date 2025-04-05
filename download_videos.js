import fs from 'fs/promises';
import axios from 'axios';

const API_URL = 'https://api.douyin.wtf/api/douyin/web/fetch_user_post_videos';
const SEC_USER_ID = 'MS4wLjABAAAAo0hDbJvN_-xEvV3BP6mQJ7azqbhmErfLoPcQES5Lkq4';
const VIDEO_SAVE_PATH = '/videos/latest.mp4'; // overwrite this file every time
const AUDIO_SAVE_PATH = '/audios/latest.mp3'; // overwrite this file every time

async function main() {
  try {
    console.log('🔗 Fetching latest video...');
    const response = await axios.get(`${API_URL}?sec_user_id=${SEC_USER_ID}&count=1&max_cursor=0`, {
      headers: { accept: 'application/json' },
    });

    const videos = response.data?.data?.aweme_list;
    const latestVideo = videos[videos.length - 1];
    if (!latestVideo) {
      console.warn('⚠️ No videos found.');
      return;
    }

    const audioUrl = latestVideo?.music.play_url.url_list[0];
    const videoUrl = latestVideo?.video.play_addr.url_list[0];

    if (!videoUrl || !audioUrl) {
      console.warn('⚠️ No video or audio URL found.');
      return;
    }

    console.log(`📥 Downloading latest video from ${videoUrl}`);
    let res = await axios.get(videoUrl, { responseType: 'stream' });

    let file = (await fs.open(VIDEO_SAVE_PATH, 'w')).createWriteStream();
    res.data.pipe(file);

    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });

    console.log('✅ Video saved as latest.mp3');

    console.log(`📥 Downloading latest audio from ${audioUrl}`);
    res = await axios.get(audioUrl, { responseType: 'stream' });

    file = (await fs.open(AUDIO_SAVE_PATH, 'w')).createWriteStream();
    res.data.pipe(file);

    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });

    console.log('✅ Audio saved as latest.mp3');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
