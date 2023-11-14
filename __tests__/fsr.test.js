/**
 * Unit tests for the action's FSR retrieval, src/fsr.js
 *
 */

// Prepare the mock expectations
let mockBody = `<!DOCTYPE html>
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
  <tr>
    <td><a href="http://purl.org/np/RAxaKu-Y3edH3QMGTAXZBueTlLfmARzPew9qDWo6GUzOQ">http://purl.org/np/RAxaKu-Y3edH3QMGTAXZBueTlLfmARzPew9qDWo6GUzOQ</a></td>
    <td><pre>Research Object Hub (ROHub)</pre></td>
    <td><pre>Registry</pre></td>
    <td><pre>2023-11-05T09:55:32Z</pre></td>
  </tr>
  <tr>
    <td><a href="http://purl.org/np/RASVX6uLXb-J6INeO07sLCbjJqw5w9H2YeaNLbj21Djxo">http://purl.org/np/RASVX6uLXb-J6INeO07sLCbjJqw5w9H2YeaNLbj21Djxo</a></td>
    <td><pre>WDCC User Guide</pre></td>
    <td><pre>FAIR-Practice</pre></td>
    <td><pre>2023-10-22T21:43:36Z</pre></td>
  </tr>
</table></div>
</body>
</html>`

let mockEmptyTableBody = `<!DOCTYPE html>
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

mockResponse = {
    message: { "code" : "200", "statusCode" : "200" }, // not sure which is used?
    readBody: jest.fn().mockImplementation(() => { return mockBody } )
}

jest.mock("@actions/http-client", () => {
  // Return the mock constructed instance
  return {
    HttpClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockReturnValue(mockResponse)
      }
    })
  }
})

// Have to mock the property (or @octokit/rest) to prevent the API being invoked
jest.mock("../src/property", () => {
  return {
    getRepoProperties: jest.fn().mockReturnValue([
      {
        "property_name": "fsr_import_date",
        "value": "2020-05-04"
      }
    ])
  }
})
// If you really do want to invoke the API, 
// then comment out the above lines and supply a personal access token:
//process.env.GITHUB_TOKEN = 'YOUR-TOKEN'

// Have to mock the create issue (or @octokit/rest) to prevent the API being invoked
jest.mock("../src/issue", () => {
  return {
    createIssue: jest.fn().mockImplementation(() => {
      console.log('Mock createIssue was called');
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

  it('Gets HTML5', async () => {
    await fsr.fetchFSRs()

    // TODO: assertions
  })

  // FIXME: negative cases
  // 1. no rows in the table (alt mock for http-client)
  // 2. no new rows in the table (alt mock for property)
})
