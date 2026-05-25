export type SpeechRegister = '존댓말'

export interface KinshipTerm {
  hangul: string
  romanization: string
  englishGloss: string
  usageNote: string | null
  speechRegister: SpeechRegister
}

export const SELF_TERM: KinshipTerm = {
  hangul: '나',
  romanization: 'na',
  englishGloss: 'me / self',
  usageNote: null,
  speechRegister: '존댓말',
}
