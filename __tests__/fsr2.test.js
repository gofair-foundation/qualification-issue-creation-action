/**
 * Unit tests for the action's FSR retrieval, src/fsr.js
 * Created a copy as the mockReturnValueOnce was causing problems.
 */

// Prepare the mock expectations
const mockEmptyTableBody = `<!DOCTYPE html>
<html>
<head>
<title>HTML5 table</title>
</head>
<body>
<div class="container-fluid">
<table class="table table-striped table-sm table-borderless">
  <tr>
    <th>np</th>
    <th>label</th>
    <th>types</th>
    <th>date</th>
  </tr>
</table></div>
</body>
</html>`

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

// Have to mock the create issue (or @octokit/rest) to prevent the API being invoked
const issueMock = jest.mock('../src/issue', () => {
  return {
    createIssue: jest.fn().mockImplementation(() => {
      console.log('Mock createIssue was called')
    })
  }
})
// If you really do want to invoke the API,
// then comment out the above lines and supply a personal access token:
//process.env.GITHUB_TOKEN = 'YOUR-TOKEN'

// Test logic
const fsr = require('../src/fsr')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Negative case: no rows in the table (alt return value for http-client)
  it('No rows', async () => {
    const rowCount = await fsr.fetchFSRs('2020-05-04')
    expect(rowCount).toBe(0)

    // assertions
    setTimeout(() => {
      // wait to allow the promise to resolve
      const mockInstance = issueMock.mock.instances[0]
      expect(mockInstance.createIssue).toHaveBeenCalledTimes(0)
    }, 5000)
  })
})
