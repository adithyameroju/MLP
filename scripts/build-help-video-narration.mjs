/**
 * Generates .vtt captions and .mp3 narration from videoTutorials captionCues in mock export.
 * Requires macOS `say` + ffmpeg (Playwright ffmpeg or system ffmpeg).
 */
import { execSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CAPTIONS_DIR = path.join(ROOT, 'public', 'help', 'videos', 'captions')
const NARRATION_DIR = path.join(ROOT, 'public', 'help', 'videos', 'narration')

/** Inline cue data — keep in sync with supportHelpMock videoTutorials */
const VIDEO_NARRATION = [
  {
    id: 'vid_quick_add',
    cues: [
      { start: 0, end: 2, text: 'Step one: open Quick Add from the endorsements menu.' },
      { start: 2, end: 4.5, text: 'Step two: enter employee details and choose the plan.' },
      { start: 4.5, end: 6.5, text: 'Step three: preview CD impact, then submit the batch.' },
    ],
  },
  {
    id: 'vid_cd_wallet',
    cues: [
      { start: 0, end: 2.5, text: 'Your CD wallet shows cash deposit balance and runway.' },
      { start: 2.5, end: 5, text: 'Review inflows, outflows, and pending endorsements.' },
      { start: 5, end: 6.5, text: 'Recharge before runway drops into the warning band.' },
    ],
  },
  {
    id: 'vid_hrms',
    cues: [
      { start: 0, end: 2.5, text: 'HRMS sync pulls pending changes from your HR system.' },
      { start: 2.5, end: 5, text: 'Review each row and approve or reject with a reason.' },
      { start: 5, end: 6.5, text: 'Approved rows flow into the endorsement schedule.' },
    ],
  },
  {
    id: 'vid_claims_status',
    cues: [
      { start: 0, end: 2.5, text: 'The claims list shows status for every employee claim.' },
      { start: 2.5, end: 5, text: 'Filter by status or search to find cases needing HR action.' },
      { start: 5, end: 6.5, text: 'Open a claim to see timeline, documents, and next steps.' },
    ],
  },
  {
    id: 'vid_policy_bands',
    cues: [
      { start: 0, end: 2.5, text: 'Policy coverage lists bands and sum insured by grade.' },
      { start: 2.5, end: 5, text: 'Search plain language questions—like LASIK or maternity.' },
      { start: 5, end: 6.5, text: 'Share answers with employees without opening the full PDF.' },
    ],
  },
  {
    id: 'vid_enrolment_tracking',
    cues: [
      { start: 0, end: 2.5, text: 'Track who has completed enrolment and who is pending.' },
      { start: 2.5, end: 5, text: 'Filter by department or eligibility window.' },
      { start: 5, end: 6.5, text: 'Nudge employees before the enrolment deadline closes.' },
    ],
  },
  {
    id: 'vid_reports_generate',
    cues: [
      { start: 0, end: 2.5, text: 'Choose a report type and date range to generate.' },
      { start: 2.5, end: 5, text: 'Wait for processing—status moves from queued to ready.' },
      { start: 5, end: 6.5, text: 'Download once complete and share through approved channels.' },
    ],
  },
  {
    id: 'vid_portal_overview',
    cues: [
      { start: 0, end: 2.5, text: 'Welcome—this is your employer portal home.' },
      { start: 2.5, end: 5, text: 'Use the sidebar for endorsements, claims, CD, and policy.' },
      { start: 5, end: 6.5, text: 'Help center has guides, FAQs, and video walkthroughs.' },
    ],
  },
]

function formatVttTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const whole = Math.floor(s)
  const ms = Math.round((s - whole) * 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(whole).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

function cuesToWebVtt(cues) {
  const lines = ['WEBVTT', '']
  cues.forEach((cue, i) => {
    lines.push(String(i + 1))
    lines.push(`${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}`)
    lines.push(cue.text)
    lines.push('')
  })
  return lines.join('\n')
}

function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function resolveFfmpeg() {
  if (hasCommand('ffmpeg')) return 'ffmpeg'
  try {
    const out = execSync('npx playwright install --dry-run ffmpeg 2>/dev/null || true', { encoding: 'utf8' })
    const match = out.match(/ffmpeg[^\n]*/i)
    if (match && hasCommand('ffmpeg')) return 'ffmpeg'
  } catch {
    /* ignore */
  }
  return null
}

function convertAiffToM4a(aiffPath, m4aPath) {
  const ffmpeg = resolveFfmpeg()
  if (ffmpeg) {
    execSync(`${ffmpeg} -y -i ${JSON.stringify(aiffPath)} -codec:a aac -b:a 128k ${JSON.stringify(m4aPath)}`, {
      stdio: 'ignore',
    })
    return
  }
  if (process.platform === 'darwin' && hasCommand('afconvert')) {
    execSync(`afconvert -f m4af -d aac ${JSON.stringify(aiffPath)} ${JSON.stringify(m4aPath)}`, { stdio: 'ignore' })
    return
  }
  throw new Error('No ffmpeg or afconvert available for narration conversion')
}

async function main() {
  await mkdir(CAPTIONS_DIR, { recursive: true })
  await mkdir(NARRATION_DIR, { recursive: true })

  const canSay = process.platform === 'darwin' && hasCommand('say')

  for (const video of VIDEO_NARRATION) {
    const vttPath = path.join(CAPTIONS_DIR, `${video.id}.vtt`)
    await writeFile(vttPath, cuesToWebVtt(video.cues), 'utf8')
    console.log(`✓ captions ${video.id}.vtt`)

    if (canSay) {
      const aiffPath = path.join(NARRATION_DIR, `${video.id}.aiff`)
      const m4aPath = path.join(NARRATION_DIR, `${video.id}.m4a`)
      const script = video.cues.map((c) => c.text).join(' ')
      execSync(`say -o ${JSON.stringify(aiffPath)} ${JSON.stringify(script)}`)
      try {
        convertAiffToM4a(aiffPath, m4aPath)
        console.log(`✓ narration ${video.id}.m4a`)
      } catch (err) {
        console.log(`  (skip narration — ${err.message ?? err})`)
      }
    }
  }

  if (!canSay) {
    console.log('\nNote: macOS `say` not available — captions only. Modal still shows on-screen captions.')
  }
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
