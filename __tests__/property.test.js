/**
 * Unit tests for obtaining the import date, src/property.js
 *
 */

const mockResponse = [
  {
    property_name: 'fsr_import_date',
    value: '2020-05-04'
  }
]

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockReturnValue(mockResponse)
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

  it('Fetch import date', async () => {
    const res = await props.getImportDate()

    // assertions
    expect(res).toBe('2020-05-04')
  })
})
