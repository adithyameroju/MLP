/** Build WebVTT from timed cue list */
export function cuesToWebVtt(cues) {
  if (!cues?.length) return ''
  const lines = ['WEBVTT', '']
  cues.forEach((cue, i) => {
    lines.push(String(i + 1))
    lines.push(`${formatVttTime(cue.start)} --> ${formatVttTime(cue.end)}`)
    lines.push(cue.text)
    lines.push('')
  })
  return lines.join('\n')
}

function formatVttTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const whole = Math.floor(s)
  const ms = Math.round((s - whole) * 1000)
  return `${pad(h)}:${pad(m)}:${pad(whole)}.${String(ms).padStart(3, '0')}`
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export function helpVideoCaptionsSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  return `${base}help/videos/captions/${id}.vtt`
}

export function helpVideoNarrationSrc(id) {
  const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/'
  return `${base}help/videos/narration/${id}.mp3`
}

/** Active caption for current playback time */
export function captionAtTime(cues, time) {
  if (!cues?.length) return null
  return cues.find((c) => time >= c.start && time < c.end)?.text ?? null
}
