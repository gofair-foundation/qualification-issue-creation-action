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
        request: jest.fn().mockReturnValue([
          {
            property_name: 'fsr_import_date',
            value: '2020-05-04'
          }
        ])
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
    <td><a href="http://purl.org/np/RAxaKu-Y3edH3QMGTAXZBueTlLfmARzPew9qDWo6GUzOQ">http://purl.org/np/RAxaKu-Y3edH3QMGTAXZBueTlLfmARzPew9qDWo6GUzOQ</a></td>
    <td><pre>Test - Research Object Hub (ROHub)</pre></td>
    <td><pre>Registry</pre></td>
    <td><pre>2023-11-05T09:55:32Z</pre></td>
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

const propertyMock = jest.mock('../src/property', () => {
  return {
    getImportDate: jest.fn().mockReturnValue('2020-05-04'),
    setImportDate: jest.fn().mockImplementation()
  }
})
const fsrMock = jest.mock('../src/fsr', () => {
  return {
    fetchFSRs: jest.fn().mockReturnValue(1)
  }
})

// Spy on the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates some issues', async () => {
    // Set the action's inputs as return values from core.getInput()

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the collaborators were called correctly
    //expect(propertyMock.getImportDate).toHaveBeenCalledTimes(1)
    // expect(propertyMock2).toHaveBeenCalledTimes(1)
    //expect(fsrMock.mock.instances[0].fetchFSRs).toHaveBeenCalledWith("2020-05-04")
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Processed 1 row(s)')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('Setting fsr_import_date to ')
    )
  })

  const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  it('Set to fail on error', async () => {
    // Set the action's inputs as return values from core.getInput()
    debugMock.mockImplementation(() => {
      throw new Error('Fail')
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Fail')
  })
})
