/**
 * Unit tests for the action's FSR retrieval, src/fsr.js
 *
 */

process.env.QUERYAPI = 'https://example.com/dummy'

// Prepare the mock expectations
const mockBody = `{
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
      {
        "date" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#dateTime",
          "type" : "literal",
          "value" : "2024-06-11T11:08:35.842Z"
        },
        "np" : {
          "type" : "uri",
          "value" : "https://w3id.org/np/RAGD"
        },
        "label" : {
          "type" : "literal",
          "value" : "Research object management platform"
        },
        "types" : {
          "type" : "literal",
          "value" : "Registry"
        }
      },
      {
        "date" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#dateTime",
          "type" : "literal",
          "value" : "2024-06-11T11:04:08.237Z"
        },
        "np" : {
          "type" : "uri",
          "value" : "https://w3id.org/np/RAcs"
        },
        "label" : {
          "type" : "literal",
          "value" : "FAIR Data Station"
        },
        "types" : {
          "type" : "literal",
          "value" : "Registry, Fake"
        }
      }
    ]
  }
}`

const expectedRows = [
  {
    np: 'https://w3id.org/np/RAGD',
    labels: ['Registry'],
    title: 'Research object management platform'
  },
  {
    np: 'https://w3id.org/np/RAcs',
    labels: ['Registry', 'Fake'],
    title: 'FAIR Data Station'
  }
]

const mockResponse = {
  message: { code: '200', statusCode: '200' }, // not sure which is used?
  readBody: jest.fn().mockImplementation(() => {
    return mockBody
  })
}

jest.mock('@actions/http-client', () => {
  // Return the mock constructed instance
  return {
    HttpClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockReturnValue(mockResponse)
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

  // Positive case
  it('Gets rows from JSON', async () => {
    const rows = await fsr.fetchFSRs()

    // assertions
    expect(rows.length).toBe(2)
    expect(rows).toStrictEqual(expectedRows)
  })
})
