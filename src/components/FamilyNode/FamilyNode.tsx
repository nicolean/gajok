import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import type { FamilyMember } from '@/types/family-member'

interface FamilyNodeProps {
  member: FamilyMember
  term: KinshipTerm | typeof SELF_TERM
  isSelected: boolean
}

const BASE_CARD: React.CSSProperties = {
  width: 108,
  height: 80,
  padding: '5px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  userSelect: 'none',
  textAlign: 'center',
  overflow: 'hidden',
  boxSizing: 'border-box',
}

export function FamilyNode({ member, term, isSelected }: FamilyNodeProps) {
  const displayTerm = isSelected ? SELF_TERM : term

  const cardStyle: React.CSSProperties = isSelected
    ? { ...BASE_CARD, border: '2px solid #2563EB', background: '#DBEAFE', boxShadow: '0 0 0 3px rgba(37,99,235,0.20)' }
    : { ...BASE_CARD, border: '2px solid #9CA3AF', background: '#FFFFFF' }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${member.roleLabel}: ${displayTerm.hangul} — ${displayTerm.englishGloss}`}
      style={cardStyle}
    >
      {/* english gloss: updates with the speaker perspective, clamped to 2 lines */}
      <div style={{
        fontSize: 10,
        color: '#6B7280',
        lineHeight: 1.25,
        height: 25,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        textTransform: 'capitalize',
      }}>
        {displayTerm.englishGloss}
      </div>

      {/* hangul term: nowrap prevents 5-char terms from wrapping when speaker switches */}
      <div style={{
        fontSize: 16,
        fontWeight: 700,
        color: isSelected ? '#1D4ED8' : '#111827',
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {displayTerm.hangul}
      </div>

      <div style={{
        fontSize: 11,
        color: '#6B7280',
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {isSelected ? 'na' : displayTerm.romanization}
      </div>
    </div>
  )
}
