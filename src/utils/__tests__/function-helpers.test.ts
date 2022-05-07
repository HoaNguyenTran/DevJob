import { getErrorText, removeAccents } from '../helper'
import { isExternalLink } from '../patterns'

test('remove accents function in helpers', () => {
   expect(removeAccents("Được")).toBe("Duoc")
})
