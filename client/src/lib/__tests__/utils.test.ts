import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {

  describe('cn (className utility)', () => {
    it('should combine class names', () => {
      const result = cn('class1', 'class2', 'class3')
      
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      
      expect(result).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      
      expect(result).toBe('base valid')
    })

    it('should handle empty strings', () => {
      const result = cn('base', '', 'valid')
      
      expect(result).toBe('base valid')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'always-present': true,
        'conditionally-present': true,
        'never-present': false,
      })
      
      expect(result).toBe('always-present conditionally-present')
    })
  })



  describe('edge cases', () => {
    it('should handle null/undefined in cn', () => {
      const result = cn(null, undefined, 'valid')

      expect(result).toBe('valid')
    })
  })
})
