import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userIdAtom = atomWithStorage('userId', null)