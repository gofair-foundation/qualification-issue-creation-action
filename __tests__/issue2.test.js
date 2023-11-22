/**
 * Unit tests for the action's Issue retrieval, src/issue.js
 *
 */

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockImplementation((r,x) => {
          console.log(`Mock octokit request was called: ${x.per_page}, ${x.page}`)
          if(x.per_page === 4) {
              return { data: [
                {'number': '12', 'body': 'foo', 'title': 'foo'},
                {'number': '23', 'body': 'bar', 'title': 'bar'},
                {'number': '34', 'body': 'baz', 'title': 'baz'}
              ]}
          } else if(x.per_page === 3) {
            if(x.page === 1) {
              return { data: [
                {'number': '12', 'body': 'foo', 'title': 'foo'},
                {'number': '23', 'body': 'bar', 'title': 'bar'},
                {'number': '34', 'body': 'baz', 'title': 'baz'}
              ]}
            } else {
              return { data: [] }
            }
          } else {
            if(x.page === 1) {
              return { data: [
                {'number': '12', 'body': 'foo', 'title': 'foo'},
                {'number': '23', 'body': 'bar', 'title': 'bar'}
              ]}
            } else {
              return { data: [
                {'number': '34', 'body': 'baz', 'title': 'baz'}
              ]}
            }
          }
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

  it('Fetch a partial page of issues', async () => {
    let res = await iss.getAllOpenActionIssues(4)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })

  it('Fetch a full page of issues', async () => {
    let res = await iss.getAllOpenActionIssues(3)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })

  it('Fetch 2 pages of issues', async () => {
    let res = await iss.getAllOpenActionIssues(2)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })
})
