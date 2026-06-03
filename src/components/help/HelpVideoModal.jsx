import { useEffect, useRef, useState } from 'react'
import { Captions, Volume2, VolumeX, X } from 'lucide-react'
import { helpCategoryLabel } from '../../lib/helpUiTokens'
import { getTopicTitle } from '../../data/supportHelpMock'

export default function HelpVideoModal({ video, onClose }) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const voiceOnRef = useRef(true)
  const [captionText, setCaptionText] = useState('')
  const [ccOn, setCcOn] = useState(true)
  const [voiceOn, setVoiceOn] = useState(true)

  voiceOnRef.current = voiceOn

  useEffect(() => {
    if (!video) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [video, onClose])

  useEffect(() => {
    if (!video) return
    const el = videoRef.current
    const audio = audioRef.current
    if (!el) return

    const syncPlaybackRate = () => {
      if (!audio?.duration || !el.duration) return
      if (audio.duration > el.duration + 0.15) {
        audio.playbackRate = Math.min(3, audio.duration / el.duration)
      } else {
        audio.playbackRate = 1
      }
    }

    const clampAudioToVideo = () => {
      if (!audio || !el.duration) return
      if (el.currentTime >= el.duration - 0.05) {
        audio.pause()
        audio.currentTime = 0
        return
      }
      if (Math.abs(audio.currentTime - el.currentTime) > 0.3) {
        audio.currentTime = el.currentTime
      }
    }

    const playNarration = () => {
      if (!audio || !video.narrationSrc || !voiceOnRef.current) return
      syncPlaybackRate()
      if (el.duration && el.currentTime >= el.duration - 0.05) return
      audio.currentTime = el.currentTime
      audio.play().catch(() => {})
    }

    const pauseNarration = () => {
      audio?.pause()
    }

    const stopNarration = () => {
      if (!audio) return
      audio.pause()
      audio.currentTime = 0
    }

    const onTimeUpdate = () => {
      const tracks = el.textTracks
      if (tracks?.length > 0 && ccOn) {
        const active = Array.from(tracks).flatMap((t) => Array.from(t.activeCues ?? []))
        setCaptionText(active.map((c) => c.text).join(' ') || '')
      }
      if (voiceOnRef.current) clampAudioToVideo()
    }

    const onSeeked = () => {
      if (!audio || !voiceOnRef.current) return
      audio.currentTime = el.currentTime
    }

    el.addEventListener('loadedmetadata', syncPlaybackRate)
    el.addEventListener('play', playNarration)
    el.addEventListener('pause', pauseNarration)
    el.addEventListener('ended', stopNarration)
    el.addEventListener('seeked', onSeeked)
    el.addEventListener('timeupdate', onTimeUpdate)
    audio?.addEventListener('loadedmetadata', syncPlaybackRate)

    el.play().catch(() => {})

    return () => {
      el.removeEventListener('loadedmetadata', syncPlaybackRate)
      el.removeEventListener('play', playNarration)
      el.removeEventListener('pause', pauseNarration)
      el.removeEventListener('ended', stopNarration)
      el.removeEventListener('seeked', onSeeked)
      el.removeEventListener('timeupdate', onTimeUpdate)
      audio?.removeEventListener('loadedmetadata', syncPlaybackRate)
      el.pause()
      audio?.pause()
    }
  }, [video, ccOn])

  useEffect(() => {
    const el = videoRef.current
    if (!el?.textTracks) return
    Array.from(el.textTracks).forEach((t) => {
      t.mode = ccOn ? 'showing' : 'hidden'
    })
  }, [ccOn, video])

  const toggleVoice = () => {
    setVoiceOn((prev) => {
      const next = !prev
      const el = videoRef.current
      const audio = audioRef.current
      if (!audio) return next
      if (next && el && !el.paused && !el.ended) {
        audio.currentTime = el.currentTime
        audio.play().catch(() => {})
      } else {
        audio.pause()
      }
      return next
    })
  }

  if (!video) return null

  const category = getTopicTitle(video.topicId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close video" onClick={onClose} />
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-video-modal-title"
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className={helpCategoryLabel}>{category}</p>
            <h2 id="help-video-modal-title" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 sm:text-base">
              {video.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="aspect-video w-full"
            controls
            playsInline
            src={video.videoSrc}
          >
            {video.captionsSrc ? (
              <track kind="captions" src={video.captionsSrc} srcLang="en" label="English" default />
            ) : null}
            Your browser does not support video playback.
          </video>
          {ccOn && captionText ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-4">
              <p className="max-w-lg rounded-md bg-black/75 px-3 py-1.5 text-center text-sm font-medium leading-snug text-white">
                {captionText}
              </p>
            </div>
          ) : null}
          {video.narrationSrc ? (
            <audio ref={audioRef} src={video.narrationSrc} preload="auto" className="hidden" />
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="text-xs text-gray-500">
            <span className="tabular-nums font-medium text-gray-700">{video.duration}</span>
            {video.viewCount ? (
              <>
                <span className="mx-2 text-gray-300">·</span>
                <span className="tabular-nums">{video.viewCount} views</span>
              </>
            ) : null}
          </div>
          <div className="flex gap-2">
            {video.captionsSrc ? (
              <button
                type="button"
                onClick={() => setCcOn((v) => !v)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                  ccOn ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600'
                }`}
                aria-pressed={ccOn}
              >
                <Captions size={14} aria-hidden />
                CC
              </button>
            ) : null}
            {video.narrationSrc ? (
              <button
                type="button"
                onClick={toggleVoice}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                  voiceOn ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600'
                }`}
                aria-pressed={voiceOn}
              >
                {voiceOn ? <Volume2 size={14} aria-hidden /> : <VolumeX size={14} aria-hidden />}
                Voice
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
