/**
 * Captures JPG thumbnails from the portal routes each tutorial covers.
 * Requires dev server: npm run dev → npm run generate:help-thumbnails
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const THUMB_DIR = path.join(ROOT, 'public', 'help', 'videos', 'thumbnails')
const BASE_URL = process.env.HELP_VIDEO_BASE_URL ?? 'http://127.0.0.1:5173'

/** id + route — must match supportHelpMock videoTutorials flowPath */
const FLOWS = [
  { id: 'vid_portal_overview', path: '/dashboard' },
  { id: 'vid_quick_add', path: '/add/quick' },
  { id: 'vid_cd_wallet', path: '/cd-balance' },
  { id: 'vid_hrms', path: '/hrms-sync' },
  { id: 'vid_claims_status', path: '/claims' },
  { id: 'vid_policy_bands', path: '/policy-management/coverage' },
  { id: 'vid_enrolment_tracking', path: '/enrolment' },
  { id: 'vid_reports_generate', path: '/reports' },
]

async function ensureDevServer() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) throw new Error(`status ${res.status}`)
  } catch {
    throw new Error(`Dev server not reachable at ${BASE_URL}. Start it with: npm run dev`)
  }
}

async function captureThumbnail(browser, { id, path: routePath }, outPath) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(900)
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 82, fullPage: false })
  await page.close()
}

async function main() {
  await mkdir(THUMB_DIR, { recursive: true })
  await ensureDevServer()

  let browser
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' })
  } catch {
    browser = await chromium.launch({ headless: true })
  }

  try {
    for (const flow of FLOWS) {
      const outPath = path.join(THUMB_DIR, `${flow.id}.jpg`)
      await captureThumbnail(browser, flow, outPath)
      console.log(`✓ ${flow.id}.jpg`)
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
