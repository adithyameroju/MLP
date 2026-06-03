import { Search, X } from 'lucide-react'
import { helpSearchInput } from '../../lib/helpUiTokens'

export default function HelpTopicSearch({ value, onChange, placeholder = 'Search guides and videos…' }) {
  const hasQuery = value.trim().length > 0

  return (
    <div className="relative max-w-xl">
      <label htmlFor="help-topic-search" className="sr-only">
        {placeholder}
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
      <input
        id="help-topic-search"
        type="text"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={helpSearchInput}
      />
      {hasQuery ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X size={16} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
