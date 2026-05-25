import type { FamilyMember } from '@/types/family-member'

export const FAMILY_MEMBERS: FamilyMember[] = [
  // Generation -2: Grandparents
  { id: 'patGrandpa', gender: 'male',   generation: -2, lineageSide: 'paternal', ageOrder: 'n/a', roleLabel: 'Paternal Grandfather' },
  { id: 'patGrandma', gender: 'female', generation: -2, lineageSide: 'paternal', ageOrder: 'n/a', roleLabel: 'Paternal Grandmother' },
  { id: 'matGrandpa', gender: 'male',   generation: -2, lineageSide: 'maternal', ageOrder: 'n/a', roleLabel: 'Maternal Grandfather' },
  { id: 'matGrandma', gender: 'female', generation: -2, lineageSide: 'maternal', ageOrder: 'n/a', roleLabel: 'Maternal Grandmother' },

  // Generation -1: Parents, aunts, uncles
  { id: 'patUncle',  gender: 'male',   generation: -1, lineageSide: 'paternal', ageOrder: 'n/a', roleLabel: "Father's Older Brother" },
  { id: 'father',    gender: 'male',   generation: -1, lineageSide: 'paternal', ageOrder: 'n/a', roleLabel: 'Father' },
  { id: 'patAunt',   gender: 'female', generation: -1, lineageSide: 'paternal', ageOrder: 'n/a', roleLabel: "Father's Sister" },
  { id: 'mother',    gender: 'female', generation: -1, lineageSide: 'maternal', ageOrder: 'n/a', roleLabel: 'Mother' },
  { id: 'matUncle',  gender: 'male',   generation: -1, lineageSide: 'maternal', ageOrder: 'n/a', roleLabel: "Mother's Brother" },
  { id: 'matAunt',   gender: 'female', generation: -1, lineageSide: 'maternal', ageOrder: 'n/a', roleLabel: "Mother's Sister" },

  // Generation 0: Ego's generation
  { id: 'patCousinM', gender: 'male',   generation: 0, lineageSide: 'paternal', ageOrder: 'older',   roleLabel: 'Older Paternal Male Cousin' },
  { id: 'patCousinF', gender: 'female', generation: 0, lineageSide: 'paternal', ageOrder: 'older',   roleLabel: 'Older Paternal Female Cousin' },
  { id: 'olderBro',   gender: 'male',   generation: 0, lineageSide: 'self',      ageOrder: 'older',   roleLabel: 'Older Brother' },
  { id: 'olderSis',   gender: 'female', generation: 0, lineageSide: 'self',      ageOrder: 'older',   roleLabel: 'Older Sister' },
  { id: 'ego',        gender: 'male',   generation: 0, lineageSide: 'self',      ageOrder: 'n/a',     roleLabel: '자신 (Self)' },
  { id: 'spouse',     gender: 'female', generation: 0, lineageSide: 'spouse',   ageOrder: 'n/a',     roleLabel: 'Spouse (Wife)' },
  { id: 'youngerBro', gender: 'male',   generation: 0, lineageSide: 'self',      ageOrder: 'younger', roleLabel: 'Younger Brother' },
  { id: 'youngerSis', gender: 'female', generation: 0, lineageSide: 'self',      ageOrder: 'younger', roleLabel: 'Younger Sister' },
  { id: 'matCousinM', gender: 'male',   generation: 0, lineageSide: 'maternal', ageOrder: 'older',   roleLabel: 'Older Maternal Male Cousin' },
  { id: 'matCousinF', gender: 'female', generation: 0, lineageSide: 'maternal', ageOrder: 'older',   roleLabel: 'Older Maternal Female Cousin' },

  // Generation +1: Children and nieces/nephews
  { id: 'son',      gender: 'male',   generation: 1, lineageSide: 'self', ageOrder: 'n/a', roleLabel: 'Son' },
  { id: 'daughter', gender: 'female', generation: 1, lineageSide: 'self', ageOrder: 'n/a', roleLabel: 'Daughter' },
  { id: 'nephew',   gender: 'male',   generation: 1, lineageSide: 'self', ageOrder: 'n/a', roleLabel: "Brother's Son" },
  { id: 'niece',    gender: 'female', generation: 1, lineageSide: 'self', ageOrder: 'n/a', roleLabel: "Sister's Daughter" },
]

export const FAMILY_MEMBER_MAP = new Map(FAMILY_MEMBERS.map((m) => [m.id, m]))
