const core = require('@actions/core')
const httpm = require('@actions/http-client')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

/**
 * Fetch unqualified FSRs HTML table and converts them to JS objects.
 * @returns Array of retrieved records
 */
async function fetchFSRs() {
  const api =
    'https://grlc.petapico.org/api/peta-pico/dsw-nanopub-api/list_nonqualified_fsr'
  const http = new httpm.HttpClient()
  const additionalHeaders = { ['accept']: 'text/html' }
  const res = await http.get(api, additionalHeaders)

  // TODO: check the status is HTTP_OK
  core.debug(`HTTP response status code: ${res.message.statusCode}`)

  const body = await res.readBody()

  // parse HTML5 and extract the table
  const dom = new JSDOM(body)
  const oTable = dom.window.document.getElementsByClassName('table')[0]

  /* Process each row, whether th or td, and strip tags
   * This will give us a 2D array containing 4 columns:
   *  np - NanoPub URI - to go in the Issue body
   *  label - the dataset name - to go in the Issue title
   *  types - comma-separated list - to go in the Issue labels as an array
   *  date - the creation date-time.
   */
  const data = [...oTable.rows].map(t =>
    [...t.children].map(u => u.innerHTML.replace(/\n|<.*?>/g, ''))
  )

  // remove the table header
  data.splice(0,1) 
  
  // convert from 2D array to array of objects
  const records = data.map(x => ({'body': x[0], 'title': x[1], 'labels': x[2].split(', ')}))
  
  return records
}

module.exports = {
  fetchFSRs
}
