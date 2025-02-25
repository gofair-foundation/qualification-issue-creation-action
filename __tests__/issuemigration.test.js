/**
 * Unit test to migrate issues.
 * This has been completed - do not run the actual update without mocking!
 */

// const core = require('@actions/core')
process.env.GITHUB_WORKSPACE = './'
// process.env.GITHUB_TOKEN = '<TOKEN_HERE>'
// process.env.GITHUB_ACTION = "true"

// const iss = require('../src/issue')
const template = require('../src/template')

describe('action', () => {
  beforeEach(() => {})

  it('Revise all issues - disarmed', async () => {
    const bodySuffix = await template.fetchTemplate()
    expect(bodySuffix.substring(0, 25)).toStrictEqual(
      '\n# Document quality check'
    )

    // const issues = await iss.getAllActionIssues(100)
    // core.debug(`Retrieved ${issues.length} issue(s) from GitHub`)
    // const openIssues = issues.filter(x => x.state === 'open')

    // for (const x of openIssues) {
    //   // This method has been commented out as we don't need it anymore
    //   await iss.updateIssueBody(x.number, `${x.body}\n\n${bodySuffix}`)
    // }
  })
})
