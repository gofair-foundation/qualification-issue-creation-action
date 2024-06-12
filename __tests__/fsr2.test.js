/**
 * Unit tests for the action's FSR retrieval, src/fsr.js
 * Created a copy as the mockReturnValueOnce was causing problems.
 */

// Prepare the mock expectations
const mockEmptyTableBody = 
`{
  "head" : {
    "vars" : [
      "np",
      "label",
      "types",
      "date"
    ]
  },
  "results" : {
    "bindings" : [
    ]
  }
}`

const mockNoRowResponse = {
  message: { code: '200', statusCode: '200' }, // not sure which is used?
  readBody: jest.fn().mockImplementation(() => {
    return mockEmptyTableBody
  })
}

jest.mock('@actions/http-client', () => {
  // Return the mock constructed instance
  return {
    HttpClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockReturnValue(mockNoRowResponse)
      }
    })
  }
})

// Test logic
const fsr = require('../src/fsr')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Negative case: no rows in the table (alt return value for http-client)
  it('No rows', async () => {
    const rows = await fsr.fetchFSRs()

    // assertions
    expect(rows.length).toBe(0)
    expect(rows).toStrictEqual([])
  })
})
