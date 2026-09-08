/**
 * Batch Uploader to Vercel Blob Storage
 * Usage:
 *   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." node src/scripts/upload_to_vercel_blob.mjs
 */
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RONALDO_GOALS_PATH = path.resolve(__dirname, '../data/players/ronaldo/goals.json');
const VIDEOS_DIR = path.resolve(__dirname, '../../videos/ronaldo');

async function uploadLocalVideo(goalId, localFilePath) {
  const fileStream = fs.createReadStream(localFilePath);
  const blobPath = `goals/ronaldo/Goal${goalId}.mp4`;

  console.log(`Uploading Goal #${goalId} (${localFilePath}) to Vercel Blob...`);

  const blob = await put(blobPath, fileStream, {
    access: 'public',
    contentType: 'video/mp4',
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  console.log(`✓ Uploaded Goal #${goalId} -> ${blob.url}`);
  return blob.url;
}

async function uploadFromUrl(goalId, sourceUrl) {
  console.log(`Streaming Goal #${goalId} from ${sourceUrl} to Vercel Blob...`);
  
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source video: ${response.statusText}`);
  }

  const blobPath = `goals/ronaldo/Goal${goalId}.mp4`;
  const blob = await put(blobPath, response.body, {
    access: 'public',
    contentType: 'video/mp4',
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  console.log(`✓ Streamed Goal #${goalId} -> ${blob.url}`);
  return blob.url;
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error(`
[ERROR] BLOB_READ_WRITE_TOKEN is missing!
Please set the token in your .env file or environment variable:
export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
Get this token from your Vercel Dashboard -> Project -> Storage -> Blob.
    `);
    process.exit(1);
  }

  console.log('--- Starting Vercel Blob Batch Uploader ---');

  if (!fs.existsSync(RONALDO_GOALS_PATH)) {
    console.error('Ronaldo goals json not found at:', RONALDO_GOALS_PATH);
    process.exit(1);
  }

  const goals = JSON.parse(fs.readFileSync(RONALDO_GOALS_PATH, 'utf-8'));
  console.log(`Loaded ${goals.length} Ronaldo goals.`);

  let uploadedCount = 0;

  // Check if local videos directory exists
  if (fs.existsSync(VIDEOS_DIR)) {
    const files = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'));
    console.log(`Found ${files.length} local MP4 files in ${VIDEOS_DIR}`);

    for (const file of files) {
      const match = file.match(/Goal(\d+)\.mp4/i) || file.match(/(\d+)\.mp4/);
      if (!match) continue;

      const goalId = match[1];
      const targetGoal = goals.find(g => g.title === goalId);
      if (!targetGoal) continue;

      // Skip if already a vercel blob url
      if (targetGoal.videoUrl && targetGoal.videoUrl.includes('blob.vercel-storage.com')) {
        console.log(`Goal #${goalId} is already on Vercel Blob. Skipping.`);
        continue;
      }

      try {
        const localPath = path.join(VIDEOS_DIR, file);
        const blobUrl = await uploadLocalVideo(goalId, localPath);
        targetGoal.videoUrl = blobUrl;
        uploadedCount++;

        // Save progress periodically
        if (uploadedCount % 5 === 0) {
          fs.writeFileSync(RONALDO_GOALS_PATH, JSON.stringify(goals, null, 2), 'utf-8');
        }
      } catch (err) {
        console.error(`Error uploading Goal #${goalId}:`, err.message);
      }
    }
  } else {
    console.log(`Local directory ${VIDEOS_DIR} does not exist. You can place your local MP4 files there as Goal1.mp4, Goal2.mp4...`);
  }

  // Final save
  fs.writeFileSync(RONALDO_GOALS_PATH, JSON.stringify(goals, null, 2), 'utf-8');
  console.log(`\n🎉 Finished! Uploaded & mapped ${uploadedCount} videos to Vercel Blob.`);
}

main().catch(err => {
  console.error('Fatal error in uploader:', err);
});
