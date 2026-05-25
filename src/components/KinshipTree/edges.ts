import type { Edge } from '@xyflow/react'

// Visual style constants
const EDGE_COLOR = '#9CA3AF'
const MARRIAGE_COLOR = '#D1D5DB'

const parentChild = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  type: 'smoothstep',
  style: { stroke: EDGE_COLOR, strokeWidth: 1.5 },
})

const sibling = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  type: 'straight',
  style: { stroke: EDGE_COLOR, strokeWidth: 1.5, strokeDasharray: '4 3' },
})

const marriage = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  type: 'straight',
  style: { stroke: MARRIAGE_COLOR, strokeWidth: 1.5, strokeDasharray: '8 4' },
})

export const EDGES: Edge[] = [
  // Grandparent → parent generation
  parentChild('e-patgp-father', 'patGrandpa', 'father'),
  parentChild('e-patgm-father', 'patGrandma', 'father'),
  parentChild('e-patgp-patUncle', 'patGrandpa', 'patUncle'),
  parentChild('e-patgm-patUncle', 'patGrandma', 'patUncle'),
  parentChild('e-patgp-patAunt', 'patGrandpa', 'patAunt'),
  parentChild('e-patgm-patAunt', 'patGrandma', 'patAunt'),
  parentChild('e-matgp-mother', 'matGrandpa', 'mother'),
  parentChild('e-matgm-mother', 'matGrandma', 'mother'),
  parentChild('e-matgp-matUncle', 'matGrandpa', 'matUncle'),
  parentChild('e-matgm-matUncle', 'matGrandma', 'matUncle'),
  parentChild('e-matgp-matAunt', 'matGrandpa', 'matAunt'),
  parentChild('e-matgm-matAunt', 'matGrandma', 'matAunt'),

  // Parent → ego generation
  parentChild('e-father-ego', 'father', 'ego'),
  parentChild('e-mother-ego', 'mother', 'ego'),
  parentChild('e-father-olderBro', 'father', 'olderBro'),
  parentChild('e-mother-olderBro', 'mother', 'olderBro'),
  parentChild('e-father-olderSis', 'father', 'olderSis'),
  parentChild('e-mother-olderSis', 'mother', 'olderSis'),
  parentChild('e-father-youngerBro', 'father', 'youngerBro'),
  parentChild('e-mother-youngerBro', 'mother', 'youngerBro'),
  parentChild('e-father-youngerSis', 'father', 'youngerSis'),
  parentChild('e-mother-youngerSis', 'mother', 'youngerSis'),
  parentChild('e-patUncle-patCousinM', 'patUncle', 'patCousinM'),
  parentChild('e-patAunt-patCousinF', 'patAunt', 'patCousinF'),
  parentChild('e-matUncle-matCousinM', 'matUncle', 'matCousinM'),
  parentChild('e-matAunt-matCousinF', 'matAunt', 'matCousinF'),

  // Ego → child generation
  parentChild('e-ego-son', 'ego', 'son'),
  parentChild('e-ego-daughter', 'ego', 'daughter'),
  parentChild('e-olderBro-nephew', 'olderBro', 'nephew'),
  parentChild('e-olderSis-niece', 'olderSis', 'niece'),

  // Marriage edges
  marriage('e-m-grandparents-pat', 'patGrandpa', 'patGrandma'),
  marriage('e-m-grandparents-mat', 'matGrandpa', 'matGrandma'),
  marriage('e-m-parents', 'father', 'mother'),
  marriage('e-m-ego-spouse', 'ego', 'spouse'),

  // Sibling edges (ego generation)
  sibling('e-s-olderBro-ego', 'olderBro', 'ego'),
  sibling('e-s-olderSis-ego', 'olderSis', 'ego'),
  sibling('e-s-ego-youngerBro', 'ego', 'youngerBro'),
  sibling('e-s-ego-youngerSis', 'ego', 'youngerSis'),
]
