const core = require('@actions/core')
const fsr = require('./fsr')
const iss = require('./issue')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run(pageSize) {
  // 1. Get the GitHub issues set
  // 2. Get the Unqualified FSRs set
  // 3. Derive a close list based on set difference
  // 4. Derive a create list based on set difference
  // 5. Close list for each: closeIssue
  // 6. Create list for each: createIssue

  try {
    core.debug(`Issues page size set to ${pageSize}`)
    const issues = await iss.getAllOpenActionIssues(pageSize)
    core.debug(`Retrieved ${issues.length} issue(s) from GitHub`)
    const fsrs = await fsr.fetchFSRs()
    core.debug(`Retrieved ${fsrs.length} unqualified FSR(s) from Petapico`)

    // TODO: this isn't particularly efficient - use maps instead?
    const obsolete = issues.filter(x => !fsrs.some(e => e.body === x.body))
    const newlyUnqualified = fsrs.filter(
      x => !issues.some(e => e.body === x.body)
    )

    for (const x of obsolete) {
      iss.closeIssue(x.number)
    }
    core.debug(`Closed ${obsolete.length} obsolete issue(s)`)

    for (const x of newlyUnqualified) {
      iss.createIssue(x.title, x.body, x.labels)
    }
    core.debug(
      `Created issue(s) for ${newlyUnqualified.length} new unqualified FSRs`
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
