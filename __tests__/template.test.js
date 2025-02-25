/**
 * Unit tests for the action's template retrieval, src/template.js
 *
 */

// Prepare the mock expectations
const mockBody = `---
name: FSR curation
about: Curating FSRs
title: ''
labels: ''
assignees: ''

---

# Document quality check

| Item     | Detail     |
| ---- | ---- |
| Person name | |
| ORCID | |
| FSR long name | |
| FSR thing | |
| FSR np identifier | |
| URI of duplicate(s) (multiple separated by ';') | |
| Links correct | |
`

const expectedBodySuffix = `
# Document quality check

| Item     | Detail     |
| ---- | ---- |
| Person name | |
| ORCID | |
| FSR long name | |
| FSR thing | |
| FSR np identifier | |
| URI of duplicate(s) (multiple separated by ';') | |
| Links correct | |
`

// Mock the GitHub Actions core library
// const debugMock = jest.spyOn(core, 'debug').mockImplementation()

// const fs = require('fs')
jest.mock('fs', () => ({
  readFileSync: jest.fn(fileName => {
    return mockBody
  }),
  promises: jest.fn().mockImplementation()
}))

//   // Return the mock constructed instance
//   return {
//     fs: jest.fn().mockImplementation(() => {
//       return {
//         promises: Promise.resolve(() => {
//           return {
//             readFile: () => jest.fn().mockReturnValue(mockBody)
//         // promises: jest.fn().mockImplementation(() => {
//         //   return {
//         //     readFile: jest.fn().mockReturnValue(mockBody)
//           }
//         })
//       }
//     })
//   }
// })

// Test logic
const template = require('../src/template')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Positive case
  it('Gets body suffix from issue template file', async () => {
    Object.assign(process.env, {
      GITHUB_WORKSPACE: 'foo'
    })
    const bodySuffix = await template.fetchTemplate()

    // assertions
    // expect(debugMock).toHaveBeenCalledWith(mockBody)
    expect(bodySuffix).toStrictEqual(expectedBodySuffix)
  })
})
