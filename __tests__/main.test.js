/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */
const core = require('@actions/core')
const main = require('../src/main')

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockReturnValue({
          data: [
            {'number': '34', 'body': 'baz', 'title': 'baz'},
            {'number': '22', 'body': 'http://purl.org/np/RAS', 'title': 'Test WDCC'}
          ]
        })
      }
    })
  }
})

// Prepare the mock expectations
const mockBody = `<html>
<head>
<title>HTML5 table</title>
</head>
<body>
<table class="table table-striped table-sm table-borderless">
  <tr>
    <th>np</th>
    <th>label</th>
    <th>types</th>
    <th>date</th>
  </tr>
  <tr>
    <td><a href="http://purl.org/np/RAx">http://purl.org/np/RAx</a></td>
    <td><pre>Test ROHub</pre></td>
    <td><pre>Registry</pre></td>
    <td><pre>2023-11-05T09:55:32Z</pre></td>
  </tr>
  <tr>
    <td><a href="http://purl.org/np/RAS">http://purl.org/np/RAS</a></td>
    <td><pre>Test WDCC </pre></td>
    <td><pre>FAIR-Practice</pre></td>
    <td><pre>2023-10-22T21:43:36Z</pre></td>
  </tr>
</table>
</body>
</html>`

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
    expect(debugMock).toHaveBeenNthCalledWith(2, 'Fetching open issues page 1')
    expect(debugMock).toHaveBeenNthCalledWith(3, 'Issues in page: 2, page size: 10')
    expect(debugMock).toHaveBeenNthCalledWith(4, 'Retrieved 2 issue(s) from GitHub')
    expect(debugMock).toHaveBeenNthCalledWith(5, 'HTTP response status code: 200')
    expect(debugMock).toHaveBeenNthCalledWith(6, 'Retrieved 2 unqualified FSR(s) from Petapico')
    expect(debugMock).toHaveBeenNthCalledWith(7, 'Closing issue 34')
    expect(debugMock).toHaveBeenNthCalledWith(8, 'Closed 1 obsolete issue(s)')
    expect(debugMock).toHaveBeenNthCalledWith(9, 'Creating issue for Test ROHub')
    expect(debugMock).toHaveBeenNthCalledWith(10, 'Created issue(s) for 1 new unqualified FSRs')
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
