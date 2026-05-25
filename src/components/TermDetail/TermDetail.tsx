import { useEffect } from 'react'
import type { KinshipTerm } from '@/types/kinship-term'

interface TermDetailProps {
  term: KinshipTerm
  anchorId: string
}

export function TermDetail({ term, anchorId }: TermDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Bubble up — parent manages visibility state
        document.dispatchEvent(new CustomEvent('termdetail:dismiss'))
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div
      role="tooltip"
      aria-describedby={anchorId}
      className={[
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
        'bg-white border border-node-border rounded-node shadow-sm',
        'px-3 py-2 min-w-[160px] max-w-[240px]',
        'text-[var(--color-text-primary)] pointer-events-none',
      ].join(' ')}
    >
      <div className="text-[16px] font-bold leading-tight">{term.hangul}</div>
      <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{term.romanization}</div>
      <div className="text-[12px] mt-1 leading-snug">{term.englishGloss}</div>
      {term.usageNote && (
        <div className="text-[11px] text-[var(--color-text-secondary)] mt-1.5 border-t border-gray-100 pt-1.5 leading-snug">
          {term.usageNote}
        </div>
      )}
    </div>
  )
}
