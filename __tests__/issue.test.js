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
    const createMock = jest.spyOn(iss, 'createIssue')
    await iss.createIssue('foo', 'bar', ['Registry', 'Service'])

    // TODO: assertions
    expect(createMock).toHaveBeenCalled()
  })

  it('Close an issue', async () => {
    const closeMock = jest.spyOn(iss, 'closeIssue')
    await iss.closeIssue(172)

    // TODO: assertions
    expect(closeMock).toHaveBeenCalled()
  })

  it('Reopen an issue', async () => {
    const reopenMock = jest.spyOn(iss, 'reopenIssue')
    await iss.reopenIssue(172)

    // TODO: assertions
    expect(reopenMock).toHaveBeenCalled()
  })
})
