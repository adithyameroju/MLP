/**
 * Records short screen walkthroughs for help-center video tutorials.
 * Requires: dev server on BASE_URL (default http://127.0.0.1:5173) and Playwright Chromium.
 *
 * Usage: npm run dev (separate terminal) → npm run record:help-videos
 */
import { mkdir, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'help', 'videos')
const BASE_URL = process.env.HELP_VIDEO_BASE_URL ?? 'http://127.0.0.1:5173'
const RECORD_ONLY = process.env.RECORD_ONLY?.split(',').map((s) => s.trim()).filter(Boolean) ?? null

/** id must match supportHelpMock videoTutorials */
const FLOWS = [
  { id: 'vid_portal_overview', path: '/dashboard', waitMs: 5500 },
  { id: 'vid_quick_add', path: '/add/quick', waitMs: 5500 },
  { id: 'vid_cd_wallet', path: '/cd-balance', waitMs: 5500 },
  { id: 'vid_hrms', path: '/hrms-sync', waitMs: 5500 },
  { id: 'vid_claims_status', path: '/claims', waitMs: 5500 },
  { id: 'vid_policy_bands', path: '/policy-management/coverage', waitMs: 5500 },
  { id: 'vid_enrolment_tracking', path: '/enrolment', waitMs: 5500 },
  { id: 'vid_reports_generate', path: '/reports', waitMs: 5500 },
]

async function ensureDevServer() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error(`status ${res.status}`)
  } catch {
    throw new Error(
      `Dev server not reachable at ${BASE_URL}. Start it with: npm run dev`,
    )
  }
}

async function recordFlow(browser, { id, path: routePath, waitMs }) {
  const outFile = path.join(OUT_DIR, `${id}.webm`)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
  })
  const page = await context.newPage()

  await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(800)
  await page.mouse.wheel(0, 280)
  await page.waitForTimeout(waitMs - 800)

  const video = page.video()
  await context.close()

  if (!video) {
    throw new Error(`No video captured for ${id}`)
  }

  const tempPath = await video.path()
  try {
    await unlink(outFile)
  } catch {
    /* fresh file */
  }
  await rename(tempPath, outFile)
  console.log(`✓ ${id} → public/help/videos/${id}.webm`)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await ensureDevServer()

  let browser
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' })
  } catch {
    browser = await chromium.launch({ headless: true })
  }
  try {
    const flows = RECORD_ONLY ? FLOWS.filter((f) => RECORD_ONLY.includes(f.id)) : FLOWS
    if (flows.length === 0) {
      throw new Error(`No flows matched RECORD_ONLY=${process.env.RECORD_ONLY}`)
    }
    for (const flow of flows) {
      await recordFlow(browser, flow)
    }
  } finally {
    await browser.close()
  }

  console.log('\nDone. Update videoSrc in supportHelpMock.js if paths changed.')
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
