/**
 * Unit tests for setting the import date, src/property.js
 */

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockImplementation()
      }
    })
  }
})

// Test logic
const props = require('../src/property')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Set import date', async () => {
    await props.setImportDate(new Date().toISOString())
  })
})
