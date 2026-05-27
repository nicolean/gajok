import type { FamilyMember } from '@/types/family-member'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import { RelationshipType } from '@/types/relationship'
import type { RelationshipMapping } from '@/types/relationship'
import { FAMILY_MEMBERS } from '@/data/family-tree'

// Actual parent-child edges in the family tree (mirrors edges.ts)
const PARENT_CHILD_MAP: Map<string, ReadonlySet<string>> = new Map([
  ['patGrandpa', new Set(['father', 'patUncle', 'patAunt'])],
  ['patGrandma', new Set(['father', 'patUncle', 'patAunt'])],
  ['matGrandpa', new Set(['mother', 'matUncle', 'matAunt'])],
  ['matGrandma', new Set(['mother', 'matUncle', 'matAunt'])],
  ['father',     new Set(['ego', 'olderBro', 'olderSis', 'youngerBro', 'youngerSis'])],
  ['mother',     new Set(['ego', 'olderBro', 'olderSis', 'youngerBro', 'youngerSis'])],
  ['patUncle',   new Set(['patCousinM'])],
  ['patAunt',    new Set(['patCousinF'])],
  ['matUncle',   new Set(['matCousinM'])],
  ['matAunt',    new Set(['matCousinF'])],
  ['ego',        new Set(['son', 'daughter'])],
  ['spouse',     new Set(['son', 'daughter'])],
  ['olderBro',   new Set(['nephew'])],
  ['olderSis',   new Set(['niece'])],
])

function isParentOf(parent: FamilyMember, child: FamilyMember): boolean {
  return PARENT_CHILD_MAP.get(parent.id)?.has(child.id) ?? false
}

// Birth-order index from canonical array position (lower index = older)
const BIRTH_ORDER = new Map(FAMILY_MEMBERS.map((m, i) => [m.id, i]))

export function deriveRelationshipType(
  speaker: FamilyMember,
  target: FamilyMember
): RelationshipType {
  const genDiff = target.generation - speaker.generation

  // Target is great-grandparent or beyond
  if (genDiff <= -3) {
    return target.lineageSide === 'paternal'
      ? (target.gender === 'male' ? RelationshipType.PATERNAL_GREAT_GRANDFATHER : RelationshipType.PATERNAL_GREAT_GRANDMOTHER)
      : (target.gender === 'male' ? RelationshipType.MATERNAL_GREAT_GRANDFATHER : RelationshipType.MATERNAL_GREAT_GRANDMOTHER)
  }

  // Target is grandparent level
  if (genDiff === -2) {
    // For gen+1 speakers, all gen-1 members are on their paternal side (since only
    // ego's family appears in the tree — spouse's parents are absent)
    const side = speaker.generation === 1 ? 'paternal' : target.lineageSide
    return side === 'paternal'
      ? (target.gender === 'male' ? RelationshipType.PATERNAL_GRANDFATHER : RelationshipType.PATERNAL_GRANDMOTHER)
      : (target.gender === 'male' ? RelationshipType.MATERNAL_GRANDFATHER : RelationshipType.MATERNAL_GRANDMOTHER)
  }

  // Target is parent/uncle/aunt level
  if (genDiff === -1) {
    if (isParentOf(target, speaker)) {
      return target.gender === 'male' ? RelationshipType.FATHER : RelationshipType.MOTHER
    }
    // Collateral: lineageSide 'self' = ego's sibling = speaker's paternal uncle/aunt
    if (target.lineageSide === 'paternal' || target.lineageSide === 'self') {
      return target.gender === 'male' ? RelationshipType.PATERNAL_UNCLE : RelationshipType.PATERNAL_AUNT
    }
    return target.gender === 'male' ? RelationshipType.MATERNAL_UNCLE : RelationshipType.MATERNAL_AUNT
  }

  // Same generation
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

  // Target is child/niece/nephew level
  if (genDiff === 1) {
    if (isParentOf(speaker, target)) {
      return target.gender === 'male' ? RelationshipType.SON : RelationshipType.DAUGHTER
    }
    return target.gender === 'male' ? RelationshipType.NEPHEW : RelationshipType.NIECE
  }

  // Target is grandchild level
  if (genDiff === 2) {
    return target.gender === 'male' ? RelationshipType.GRANDSON : RelationshipType.GRANDDAUGHTER
  }

  // Target is great-grandchild or beyond
  return target.gender === 'male' ? RelationshipType.GREAT_GRANDSON : RelationshipType.GREAT_GRANDDAUGHTER
}

// Target is older than speaker: compare ageOrder rank first, array index as tiebreaker
function isOlderThan(target: FamilyMember, speaker: FamilyMember): boolean {
  const RANK: Record<string, number> = { older: 0, 'n/a': 1, younger: 2 }
  const tRank = RANK[target.ageOrder] ?? 1
  const sRank = RANK[speaker.ageOrder] ?? 1
  if (tRank !== sRank) return tRank < sRank
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
