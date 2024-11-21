/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */
process.env.GITHUB_WORKSPACE = '../fsr_curation/'
const core = require('@actions/core')
const main = require('../src/main')

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockReturnValue({
          data: [
            {
              number: '34',
              body: 'baz\n# Review\n\n| Item     | Detail     |',
              title: 'baz',
              state: 'open'
            },
            {
              number: '22',
              body: 'http://purl.org/np/RAS\r\n# Review\r\n\r\n| Item     | Detail     |',
              title: 'Test WDCC',
              state: 'open'
            },
            {
              number: '23',
              body: 'http://purl.org/np/RAS\n# Duplicate\n',
              title: 'Test WDCC',
              state: 'closed'
            },
            {
              number: '11',
              body: 'http://purl.org/np/RAv',
              title: 'Test SKOS',
              state: 'closed'
            }
          ]
        })
      }
    })
  }
})

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
          "value" : "2023-11-05T09:55:32Z"
        },
        "np" : {
          "type" : "uri",
          "value" : "http://purl.org/np/RAx"
        },
        "label" : {
          "type" : "literal",
          "value" : "Test ROHub"
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
          "value" : "2023-10-22T21:43:36Z"
        },
        "np" : {
          "type" : "uri",
          "value" : "http://purl.org/np/RAS"
        },
        "label" : {
          "type" : "literal",
          "value" : "Test WDCC"
        },
        "types" : {
          "type" : "literal",
          "value" : "FAIR-Practice"
        }
      },
      {
        "date" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#dateTime",
          "type" : "literal",
          "value" : "2022-09-22T11:23:34Z"
        },
        "np" : {
          "type" : "uri",
          "value" : "http://purl.org/np/RAv"
        },
        "label" : {
          "type" : "literal",
          "value" : "Test SKOS"
        },
        "types" : {
          "type" : "literal",
          "value" : "Semantic-model"
        }
      }
    ]
  }
}`

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

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()

// Spy on the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates some issues', async () => {
    await main.run(10)
    expect(runMock).toHaveReturned()

    // Verify that the collaborators were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Issues page size set to 10')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'Fetching all action-created issues, page 1'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      'Issues in page: 4, page size: 10'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      4,
      'Retrieved 4 issue(s) from GitHub'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      5,
      'HTTP response status code: 200'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      6,
      'Retrieved 3 unqualified FSR(s) from Petapico'
    )
    expect(debugMock).toHaveBeenNthCalledWith(7, 'Closing issue 34')
    expect(debugMock).toHaveBeenNthCalledWith(8, 'Closed 1 obsolete issue(s)')
    expect(debugMock).toHaveBeenNthCalledWith(
      9,
      'Creating issue for Test ROHub'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      10,
      'Created issue(s) for 1 new unqualified FSRs'
    )
    expect(debugMock).toHaveBeenNthCalledWith(11, 'Reopening issue 11')
    expect(debugMock).toHaveBeenNthCalledWith(
      12,
      'Reopened 1 unresolved issue(s)'
    )
  })

  const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  it('Set to fail on error', async () => {
    // Force an error
    debugMock.mockImplementation(() => {
      throw new Error('Fail')
    })

    await main.run(1)
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Fail')
  })
})
