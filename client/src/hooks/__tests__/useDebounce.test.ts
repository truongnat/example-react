import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

// Mock timers
vi.useFakeTimers()

describe('useDebounce', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.useFakeTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 250ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(250)
    })

    // Value should still be the initial value
    expect(result.current).toBe('initial')

    // Fast-forward time by another 250ms (total 500ms)
    act(() => {
      vi.advanceTimersByTime(250)
    })

    // Now the value should be updated
    expect(result.current).toBe('updated')
  })

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update the value multiple times rapidly
    rerender({ value: 'update1', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    rerender({ value: 'update2', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(250)
    })

    rerender({ value: 'final', delay: 500 })

    // Value should still be initial because timer keeps resetting
    expect(result.current).toBe('initial')

    // Fast-forward the full delay
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now it should show the final value
    expect(result.current).toBe('final')
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 1000 })

    // Fast-forward by 500ms (less than 1000ms delay)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('initial')

    // Fast-forward by another 500ms (total 1000ms)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 0 })

    // With zero delay, it should update immediately after next tick
    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })

  it('should work with different data types', () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 300 },
      }
    )

    expect(numberResult.current).toBe(0)

    numberRerender({ value: 42, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(numberResult.current).toBe(42)

    // Test with objects
    const initialObj = { name: 'initial' }
    const updatedObj = { name: 'updated' }

    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 300 },
      }
    )

    expect(objectResult.current).toBe(initialObj)

    objectRerender({ value: updatedObj, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(objectResult.current).toBe(updatedObj)

    // Test with arrays
    const initialArray = [1, 2, 3]
    const updatedArray = [4, 5, 6]

    const { result: arrayResult, rerender: arrayRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialArray, delay: 300 },
      }
    )

    expect(arrayResult.current).toBe(initialArray)

    arrayRerender({ value: updatedArray, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(arrayResult.current).toBe(updatedArray)
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    rerender({ value: 'updated', delay: 500 })

    // Unmount before timeout completes
    unmount()

    // clearTimeout should have been called
    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    // Change delay while waiting
    rerender({ value: 'updated', delay: 1000 })

    // Fast-forward by original delay (500ms)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should still be initial because delay was changed to 1000ms
    expect(result.current).toBe('initial')

    // Fast-forward by additional 500ms (total 1000ms)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now it should be updated
    expect(result.current).toBe('updated')
  })
})
