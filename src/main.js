const core = require('@actions/core')
const fsr = require('./fsr')
const iss = require('./issue')
const template = require('../src/template')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run (pageSize) {
  // 1. Get the GitHub issues set
  // 2. Get the Unqualified FSRs set
  // 3. Derive a close list based on set difference
  // 4. Derive a create list based on set difference
  // 5. Derive a reopen list based on set intersection
  // 6. Close list for each: closeIssue
  // 7. Create list for each: createIssue
  // 8. Reopen list for each: reopenIssue

  try {
    core.debug(`Issues page size set to ${pageSize}`)
    const issues = await iss.getAllActionIssues(pageSize)
    core.debug(`Retrieved ${issues.length} issue(s) from GitHub`)
    const openIssues = issues.filter(x => x.state === 'open')
    const closedIssues = issues.filter(x => x.state === 'closed')

    const fsrs = await fsr.fetchFSRs()
    core.debug(`Retrieved ${fsrs.length} unqualified FSR(s) from Petapico`)

    // TODO: these comparisons aren't particularly efficient - use maps instead?
    // With a templated body, we can't use use an equality check, so instead we
    // check for the existence of the NanoPub URI within the first line of the issue body

    // Find the open issues without a corresponding unqualified FSR
    const obsolete = openIssues.filter(
      x => !fsrs.some(e => e.np === x.firstLine)
    )

    // Find unqualified FSRs without an issue (open or closed)
    const newlyUnqualified = fsrs.filter(
      x => !issues.some(e => e.firstLine === x.np)
    )

    // Intersection of closed issues and unqualified FSRs
    const reopen = closedIssues
      .filter(x => fsrs.some(e => e.np === x.firstLine))
      .filter(
        // check the open issues in case it was closed as a duplicate
        c => !openIssues.some(o => o.firstLine === c.firstLine)
      )

    // Process the three lists: close, create, reopen
    for (const x of obsolete) {
      await iss.closeIssue(x.number)
    }
    core.debug(`Closed ${obsolete.length} obsolete issue(s)`)

    // obtain the template
    const bodySuffix = await template.fetchTemplate()

    for (const x of newlyUnqualified) {
      // The body is augmented by the issue template
      await iss.createIssue(x.title, `${x.np}\n\n${bodySuffix}`, x.labels)
    }
    core.debug(
      `Created issue(s) for ${newlyUnqualified.length} new unqualified FSRs`
    )

    for (const x of reopen) {
      await iss.reopenIssue(x.number)
    }
    core.debug(`Reopened ${reopen.length} unresolved issue(s)`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
