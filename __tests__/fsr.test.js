/**
 * Unit tests for the action's FSR retrieval, src/fsr.js
 *
 */

// Prepare the mock expectations
const mockBody = `<!DOCTYPE html>
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
</table></div>
</body>
</html>`

const expectedRows = [
  {
    body: 'http://purl.org/np/RAx',
    labels: ['Registry'],
    title: 'Test ROHub'
  },
  {
    body: 'http://purl.org/np/RAS',
    labels: ['FAIR-Practice'],
    title: 'Test WDCC '
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
  it('Gets rows from HTML5', async () => {
    const rows = await fsr.fetchFSRs()

    // assertions
    expect(rows.length).toBe(2)
    expect(rows).toStrictEqual(expectedRows)
  })
})
