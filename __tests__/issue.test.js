/**
 * Unit tests for the action's Issue creation, src/issue.js
 *
 */

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockImplementation(() => {
          console.log('Mock octokit request was called')
        })
      }
    })
  }
})

// Test logic
const iss = require('../src/issue')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Create an issue', async () => {
    await iss.createIssue('foo', 'bar', ['Registry', 'Service'])

    // TODO: assertions
  })
})
