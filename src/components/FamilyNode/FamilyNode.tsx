import { useState, useCallback, useRef, useEffect } from 'react'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import type { FamilyMember } from '@/types/family-member'
import { TermDetail } from '@/components/TermDetail/TermDetail'

interface FamilyNodeProps {
  member: FamilyMember
  term: KinshipTerm | typeof SELF_TERM
  isSelected: boolean
  onSelect: () => void
}

export function FamilyNode({ member, term, isSelected, onSelect }: FamilyNodeProps) {
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const isSelf = isSelected

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect()
      }
    },
    [onSelect]
  )

  const handleTermClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDetailVisible((v) => !v)
  }, [])

  useEffect(() => {
    if (!isDetailVisible) return
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setIsDetailVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDetailVisible])

  const displayTerm = isSelf ? SELF_TERM : term
  const ariaLabel = isSelf
    ? `${member.roleLabel}: 나 (you / self)`
    : `${member.roleLabel}: ${displayTerm.hangul} — ${displayTerm.englishGloss}`

  return (
    <div ref={nodeRef} className="relative">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-label={ariaLabel}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        className={[
          'flex flex-col items-center gap-0.5 px-3 py-2 rounded-node border cursor-pointer select-none',
          'transition-colors duration-100 min-w-[90px]',
          isSelected
            ? 'border-[2px] border-node-selected bg-node-selected-bg'
            : 'border border-node-border bg-white hover:border-gray-300',
        ].join(' ')}
      >
        <span className="text-[10px] text-[var(--color-text-secondary)] leading-none">
          {member.roleLabel}
        </span>

        <span
          id={`term-${member.id}`}
          className="text-[16px] font-bold text-[var(--color-text-primary)] leading-tight cursor-pointer"
          onClick={handleTermClick}
          onMouseEnter={() => !isSelf && setIsDetailVisible(true)}
          onMouseLeave={() => setIsDetailVisible(false)}
        >
          {isSelf ? '나' : displayTerm.hangul}
        </span>

        {!isSelf && (
          <span className="text-[11px] text-[var(--color-text-secondary)] leading-none">
            {displayTerm.romanization}
          </span>
        )}

        {isSelf && (
          <span className="text-[11px] text-[var(--color-text-secondary)] leading-none">na</span>
        )}
      </div>

      {isDetailVisible && !isSelf && (
        <TermDetail
          term={term as KinshipTerm}
          anchorId={`term-${member.id}`}
        />
      )}
    </div>
  )
}
