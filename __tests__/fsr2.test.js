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
