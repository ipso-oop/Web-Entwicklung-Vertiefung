import { config } from '@vue/test-utils'

// Mock fetch globally
global.fetch = jest.fn()

// Mock window.scrollTo
window.scrollTo = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} 