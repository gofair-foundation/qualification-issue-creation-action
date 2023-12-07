/**
 * Unit tests for the action's Issue retrieval, src/issue.js
 *
 */

jest.mock('@octokit/rest', () => {
  // Return the mock constructed instance
  return {
    Octokit: jest.fn().mockImplementation(() => {
      return {
        request: jest.fn().mockImplementation((r, x) => {
          console.log(
            `Mock octokit request was called: ${x.per_page}, ${x.page}`
          )
          if (x.per_page === 4) {
            return {
              data: [
                { number: '12', body: 'foo', title: 'foo', state: 'open' },
                { number: '23', body: 'bar', title: 'bar', state: 'open' },
                { number: '34', body: 'baz', title: 'baz', state: 'open' }
              ]
            }
          } else if (x.per_page === 3) {
            if (x.page === 1) {
              return {
                data: [
                  { number: '12', body: 'foo', title: 'foo', state: 'open' },
                  { number: '23', body: 'bar', title: 'bar', state: 'open' },
                  { number: '34', body: 'baz', title: 'baz', state: 'open' }
                ]
              }
            } else {
              return { data: [] }
            }
          } else {
            if (x.page === 1) {
              return {
                data: [
                  { number: '12', body: 'foo', title: 'foo', state: 'open' },
                  { number: '23', body: 'bar', title: 'bar', state: 'open' }
                ]
              }
            } else {
              return {
                data: [
                  { number: '34', body: 'baz', title: 'baz', state: 'open' }
                ]
              }
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
    const res = await iss.getAllActionIssues(4)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })

  it('Fetch a full page of issues', async () => {
    const res = await iss.getAllActionIssues(3)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })

  it('Fetch 2 pages of issues', async () => {
    const res = await iss.getAllActionIssues(2)
    // console.log(res)

    // assertions
    expect(res.length).toBe(3)
  })
})
