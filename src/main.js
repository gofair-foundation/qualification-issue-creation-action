const core = require('@actions/core')
const { getImportDate, setImportDate } = require('./property')
const fsr = require('./fsr')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  // 1. Get the import date
  // 2. Fetch new unqualified FSRs and create issues for them
  // 3. Update the import date (`new Date().toISOString()`)

  try {
    const importDate = await getImportDate()
    console.log(`main: ${importDate}`)
    const rowCount = await fsr.fetchFSRs(importDate)
    core.debug(`Processed ${rowCount} row(s)`)

    var currentDateTime = new Date().toISOString()
    core.debug(`Setting fsr_import_date to ${currentDateTime}`)
    await setImportDate(currentDateTime)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
