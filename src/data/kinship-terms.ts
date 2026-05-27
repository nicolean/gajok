import type { RelationshipMapping } from '@/types/relationship'
import { RelationshipType } from '@/types/relationship'
import type { KinshipTerm } from '@/types/kinship-term'

// All terms verified against 국립국어원 표준국어대사전 (stdict.korean.go.kr)
// and 국립국어원 가족 호칭·지칭어 guidance.
// Primary form shown is the address form (호칭). Speech register: 존댓말 throughout.

const t = (
  hangul: string,
  romanization: string,
  englishGloss: string,
  usageNote: string | null = null
): KinshipTerm => ({ hangul, romanization, englishGloss, usageNote, speechRegister: '존댓말' })

// ─── Gender-neutral terms (same for male and female speaker) ─────────────────

const NEUTRAL: Partial<Record<RelationshipType, KinshipTerm>> = {
  [RelationshipType.PATERNAL_GRANDFATHER]: t('할아버지', 'harabeoji', 'paternal grandfather'),
  [RelationshipType.PATERNAL_GRANDMOTHER]: t('할머니', 'halmeoni', 'paternal grandmother'),
  [RelationshipType.MATERNAL_GRANDFATHER]: t('외할아버지', 'oeharabeoji', 'maternal grandfather'),
  [RelationshipType.MATERNAL_GRANDMOTHER]: t('외할머니', 'oehalmeoni', 'maternal grandmother'),
  [RelationshipType.FATHER]:               t('아버지', 'abeoji', 'father'),
  [RelationshipType.MOTHER]:               t('어머니', 'eomeoni', 'mother'),
  [RelationshipType.PATERNAL_UNCLE]:       t('큰아버지', 'keun-abeoji', 'paternal uncle', "Used when father's brother is older than father. 작은아버지 (jageunabeoji) is used if younger."),
  [RelationshipType.PATERNAL_AUNT]:        t('고모', 'gomo', 'paternal aunt'),
  [RelationshipType.MATERNAL_UNCLE]:       t('외삼촌', 'oe-samchon', 'maternal uncle'),
  [RelationshipType.MATERNAL_AUNT]:        t('이모', 'imo', 'maternal aunt'),
  [RelationshipType.SON]:                  t('아들', 'adeul', 'son'),
  [RelationshipType.DAUGHTER]:             t('딸', 'ttal', 'daughter'),
  [RelationshipType.NEPHEW]:               t('조카', 'joka', 'nephew'),
  [RelationshipType.NIECE]:               t('조카', 'joka', 'niece', "Same term 조카 is used for both niece and nephew in modern Korean."),
  [RelationshipType.YOUNGER_BROTHER]:      t('남동생', 'nam-dongsaeng', 'younger brother'),
  [RelationshipType.YOUNGER_SISTER]:       t('여동생', 'yeo-dongsaeng', 'younger sister'),

  // Grandchildren
  [RelationshipType.GRANDSON]:             t('손자', 'sonja', 'grandson'),
  [RelationshipType.GRANDDAUGHTER]:        t('손녀', 'sonnyeo', 'granddaughter'),

  // Great-grandchildren
  [RelationshipType.GREAT_GRANDSON]:       t('증손자', 'jeungsonja', 'great-grandson'),
  [RelationshipType.GREAT_GRANDDAUGHTER]:  t('증손녀', 'jeungsonnyeo', 'great-granddaughter'),

  // Great-grandparents
  [RelationshipType.PATERNAL_GREAT_GRANDFATHER]: t('증조할아버지', 'jeungjo-harabeoji', 'paternal great-grandfather'),
  [RelationshipType.PATERNAL_GREAT_GRANDMOTHER]: t('증조할머니',   'jeungjo-halmeoni',  'paternal great-grandmother'),
  [RelationshipType.MATERNAL_GREAT_GRANDFATHER]: t('외증조할아버지', 'oe-jeungjo-harabeoji', 'maternal great-grandfather'),
  [RelationshipType.MATERNAL_GREAT_GRANDMOTHER]: t('외증조할머니',   'oe-jeungjo-halmeoni',  'maternal great-grandmother'),
}

// ─── Gender-dependent terms ───────────────────────────────────────────────────

const MALE_SPECIFIC: Partial<Record<RelationshipType, KinshipTerm>> = {
  [RelationshipType.OLDER_BROTHER]: t('형', 'hyeong', 'older brother'),
  [RelationshipType.OLDER_SISTER]:  t('누나', 'nuna', 'older sister'),
  [RelationshipType.SPOUSE]:        t('아내', 'anae', 'wife'),
  [RelationshipType.PATERNAL_COUSIN_MALE_OLDER]:   t('형', 'hyeong', 'older male paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_FEMALE_OLDER]: t('누나', 'nuna', 'older female paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_MALE_YOUNGER]: t('남동생', 'nam-dongsaeng', 'younger male paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_FEMALE_YOUNGER]: t('여동생', 'yeo-dongsaeng', 'younger female paternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_MALE_OLDER]:   t('형', 'hyeong', 'older male maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_FEMALE_OLDER]: t('누나', 'nuna', 'older female maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_MALE_YOUNGER]: t('남동생', 'nam-dongsaeng', 'younger male maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_FEMALE_YOUNGER]: t('여동생', 'yeo-dongsaeng', 'younger female maternal cousin'),
}

const FEMALE_SPECIFIC: Partial<Record<RelationshipType, KinshipTerm>> = {
  [RelationshipType.OLDER_BROTHER]: t('오빠', 'oppa', 'older brother'),
  [RelationshipType.OLDER_SISTER]:  t('언니', 'eonni', 'older sister'),
  [RelationshipType.SPOUSE]:        t('남편', 'nampyeon', 'husband'),
  [RelationshipType.PATERNAL_COUSIN_MALE_OLDER]:   t('오빠', 'oppa', 'older male paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_FEMALE_OLDER]: t('언니', 'eonni', 'older female paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_MALE_YOUNGER]: t('남동생', 'nam-dongsaeng', 'younger male paternal cousin'),
  [RelationshipType.PATERNAL_COUSIN_FEMALE_YOUNGER]: t('여동생', 'yeo-dongsaeng', 'younger female paternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_MALE_OLDER]:   t('오빠', 'oppa', 'older male maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_FEMALE_OLDER]: t('언니', 'eonni', 'older female maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_MALE_YOUNGER]: t('남동생', 'nam-dongsaeng', 'younger male maternal cousin'),
  [RelationshipType.MATERNAL_COUSIN_FEMALE_YOUNGER]: t('여동생', 'yeo-dongsaeng', 'younger female maternal cousin'),
}

// ─── Build the full mapping ───────────────────────────────────────────────────

function buildMapping(): RelationshipMapping {
  const mapping: Partial<RelationshipMapping> = {}

  for (const type of Object.values(RelationshipType)) {
    const neutral = NEUTRAL[type]
    const male = MALE_SPECIFIC[type] ?? neutral
    const female = FEMALE_SPECIFIC[type] ?? neutral

    if (male) mapping[`male:${type}`] = male
    if (female) mapping[`female:${type}`] = female
  }

  return mapping as RelationshipMapping
}

export const KINSHIP_TERMS: RelationshipMapping = buildMapping()
