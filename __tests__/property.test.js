/**
 * Unit tests for the action's Issue creation, src/issue.js
 *
 */

mockResponse = [
  {
    "property_name": "fsr_import_date",
    "value": "2020-05-04"
  }
]

jest.mock("@octokit/rest", () => {
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

  it('Fetch repo props', async () => {
    var res = await props.getRepoProperties()

    // TODO: assertions
  })
})
