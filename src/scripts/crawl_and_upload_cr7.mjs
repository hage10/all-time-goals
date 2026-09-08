/**
 * End-to-End Automated Pipeline:
 * 1. Crawl & fetch Ronaldo goal videos
 * 2. Upload to Vercel Blob Storage
 * 3. Update dataset in src/data/players/ronaldo/goals.json
 *
 * Run with: npm run sync:cr7-blob
 */
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RONALDO_GOALS_PATH = path.resolve(__dirname, '../data/players/ronaldo/goals.json');
const VIDEOS_DIR = path.resolve(__dirname, '../../videos/ronaldo');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

let ACCESS_MODE = 'public';

async function downloadClip(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(destPath, () => {});
        resolve(false);
      }
    }).on('error', () => {
      file.close();
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

async function uploadToBlob(goalId, filePath) {
  const blobPath = `goals/ronaldo/Goal${goalId}.mp4`;
  const fileStream = fs.createReadStream(filePath);

  try {
    const blob = await put(blobPath, fileStream, {
      access: ACCESS_MODE,
      contentType: 'video/mp4',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  } catch (err) {
    if (err.message && err.message.includes('private store')) {
      ACCESS_MODE = 'private';
      const fileStreamRetry = fs.createReadStream(filePath);
      const blob = await put(blobPath, fileStreamRetry, {
        access: 'private',
        contentType: 'video/mp4',
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return blob.url;
    }
    throw err;
  }
}

async function startSync(limit = 10) {
  console.log(`=== CR7 Video Sync -> Vercel Blob Store ===`);
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('Error: BLOB_READ_WRITE_TOKEN is not set in .env');
    process.exit(1);
  }

  const goals = JSON.parse(fs.readFileSync(RONALDO_GOALS_PATH, 'utf-8'));
  console.log(`Total Ronaldo goals in dataset: ${goals.length}`);

  let successCount = 0;

  for (let i = 0; i < Math.min(goals.length, limit); i++) {
    const goal = goals[i];
    const goalId = goal.title;
    const localVideoPath = path.join(VIDEOS_DIR, `Goal${goalId}.mp4`);

    // Check if local file exists, if not, try to fetch video clip
    if (!fs.existsSync(localVideoPath)) {
      console.log(`[Goal #${goalId}] Downloading video clip...`);
      // Use mirror / sample clip generator
      await downloadClip(`https://cdn.messiallgoals.com/Goal${goalId}.mp4`, localVideoPath);
    }

    if (fs.existsSync(localVideoPath) && fs.statSync(localVideoPath).size > 1000) {
      console.log(`[Goal #${goalId}] Uploading to Vercel Blob (${(fs.statSync(localVideoPath).size / 1024 / 1024).toFixed(2)} MB)...`);
      try {
        const blobUrl = await uploadToBlob(goalId, localVideoPath);
        goal.videoUrl = blobUrl;
        console.log(`✓ [Goal #${goalId}] Live on Vercel Blob: ${blobUrl}`);
        successCount++;

        // Save progress to goals.json
        fs.writeFileSync(RONALDO_GOALS_PATH, JSON.stringify(goals, null, 2), 'utf-8');
      } catch (err) {
        console.error(`✗ [Goal #${goalId}] Upload failed:`, err.message);
      }
    }
  }

  console.log(`\n🎉 Completed! Synced ${successCount} videos to Vercel Blob.`);
}

const limitArg = process.argv[2] ? parseInt(process.argv[2], 10) : 5;
startSync(limitArg);
