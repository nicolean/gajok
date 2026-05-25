import type { FamilyMember } from '@/types/family-member'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import { RelationshipType } from '@/types/relationship'
import type { RelationshipMapping } from '@/types/relationship'
import { FAMILY_MEMBERS } from '@/data/family-tree'

// Canonical IDs of ego's direct children
const DIRECT_CHILD_IDS = new Set(['son', 'daughter'])

// Birth-order index from canonical array position (lower index = older)
const BIRTH_ORDER = new Map(FAMILY_MEMBERS.map((m, i) => [m.id, i]))

export function deriveRelationshipType(
  speaker: FamilyMember,
  target: FamilyMember
): RelationshipType {
  const genDiff = target.generation - speaker.generation

  // Target is grandparent-level relative to speaker (genDiff <= -2)
  if (genDiff <= -2) {
    const side = resolveLineageSide(target, speaker)
    if (side === 'paternal') {
      return target.gender === 'male'
        ? RelationshipType.PATERNAL_GRANDFATHER
        : RelationshipType.PATERNAL_GRANDMOTHER
    }
    return target.gender === 'male'
      ? RelationshipType.MATERNAL_GRANDFATHER
      : RelationshipType.MATERNAL_GRANDMOTHER
  }

  // Target is parent/uncle/aunt level (genDiff === -1)
  if (genDiff === -1) {
    if (target.id === 'father') return RelationshipType.FATHER
    if (target.id === 'mother') return RelationshipType.MOTHER
    if (target.lineageSide === 'paternal') {
      return target.gender === 'male'
        ? RelationshipType.PATERNAL_UNCLE
        : RelationshipType.PATERNAL_AUNT
    }
    return target.gender === 'male'
      ? RelationshipType.MATERNAL_UNCLE
      : RelationshipType.MATERNAL_AUNT
  }

  // Same generation (genDiff === 0)
  if (genDiff === 0) {
    if (target.lineageSide === 'spouse') return RelationshipType.SPOUSE

    const targetIsOlder = isOlderThan(target, speaker)

    if (target.lineageSide === 'self') {
      return targetIsOlder
        ? target.gender === 'male' ? RelationshipType.OLDER_BROTHER : RelationshipType.OLDER_SISTER
        : target.gender === 'male' ? RelationshipType.YOUNGER_BROTHER : RelationshipType.YOUNGER_SISTER
    }

    if (target.lineageSide === 'paternal') {
      if (target.gender === 'male') {
        return targetIsOlder ? RelationshipType.PATERNAL_COUSIN_MALE_OLDER : RelationshipType.PATERNAL_COUSIN_MALE_YOUNGER
      }
      return targetIsOlder ? RelationshipType.PATERNAL_COUSIN_FEMALE_OLDER : RelationshipType.PATERNAL_COUSIN_FEMALE_YOUNGER
    }

    if (target.gender === 'male') {
      return targetIsOlder ? RelationshipType.MATERNAL_COUSIN_MALE_OLDER : RelationshipType.MATERNAL_COUSIN_MALE_YOUNGER
    }
    return targetIsOlder ? RelationshipType.MATERNAL_COUSIN_FEMALE_OLDER : RelationshipType.MATERNAL_COUSIN_FEMALE_YOUNGER
  }

  // Target is child/niece/nephew level (genDiff === 1)
  if (genDiff === 1) {
    const isDirectChild = DIRECT_CHILD_IDS.has(target.id) ||
      (speaker.id === 'spouse' && DIRECT_CHILD_IDS.has(target.id))
    if (isDirectChild) {
      return target.gender === 'male' ? RelationshipType.SON : RelationshipType.DAUGHTER
    }
    return target.gender === 'male' ? RelationshipType.NEPHEW : RelationshipType.NIECE
  }

  // genDiff >= 2: target is grandchild level — speaker looks down 2+ generations
  return target.gender === 'male' ? RelationshipType.SON : RelationshipType.DAUGHTER
}

// Resolve which lineage side a target belongs to from a non-ego speaker's perspective
function resolveLineageSide(target: FamilyMember, _speaker: FamilyMember) {
  return target.lineageSide
}

// Target is older than speaker: compare ageOrder rank first, array index as tiebreaker
function isOlderThan(target: FamilyMember, speaker: FamilyMember): boolean {
  const RANK: Record<string, number> = { older: 0, 'n/a': 1, younger: 2 }
  const tRank = RANK[target.ageOrder] ?? 1
  const sRank = RANK[speaker.ageOrder] ?? 1
  if (tRank !== sRank) return tRank < sRank
  // Tiebreaker: canonical array position (lower index = born earlier)
  const tIdx = BIRTH_ORDER.get(target.id) ?? 999
  const sIdx = BIRTH_ORDER.get(speaker.id) ?? 999
  return tIdx < sIdx
}

export function lookupTerm(
  speaker: FamilyMember,
  target: FamilyMember,
  mapping: RelationshipMapping
): KinshipTerm | typeof SELF_TERM {
  if (speaker.id === target.id) return SELF_TERM

  const relationshipType = deriveRelationshipType(speaker, target)
  const key = `${speaker.gender}:${relationshipType}` as const
  return mapping[key] ?? {
    hangul: '—',
    romanization: '—',
    englishGloss: 'relationship not defined',
    usageNote: null,
    speechRegister: '존댓말' as const,
  }
}
