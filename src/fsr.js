const httpm = require('@actions/http-client')
const jsdom = require("jsdom");
const { createIssue } = require('./issue');
const { JSDOM } = jsdom;

/**
 * Fetch unqualified FSRs and create issues for them in GitHub.
 * @returns number of processed rows
 */
async function fetchFSRs(filterDate) {
  const api = "https://grlc.petapico.org/api/peta-pico/dsw-nanopub-api/list_nonqualified_fsr"
  const http = new httpm.HttpClient()
  const res = await http.get(api)

  // TODO: check the status is HTTP_OK
  //expect(res.message.statusCode).toBe(200)
 
  const body = await res.readBody()

  // parse HTML5 and extract the table
  const dom = new JSDOM(body);
  let oTable = dom.window.document.getElementsByClassName("table")[0];

  /* Process each row, whether th or td, and strip tags
   * This will give us a 2D array containing 4 columns:
   *  np - NanoPub URI - to go in the Issue body
   *  label - the dataset name - to go in the Issue title
   *  types - comma-separated list - to go in the Issue labels as an array
   *  date - the creation date-time.
   */
  let data = [...oTable.rows].map(t => [...t.children].map(u => u.innerHTML.replace(/\n|<.*?>/g,'')))
  //console.log(data);

  var rowCount = data.length
  var processedCount = 0
  if (rowCount > 1) {
    // skip the first row as that's the table header
    for (i = 1; i < rowCount; i++) {
        // date guard to prevent recreating records
        var recordDate = data[i][3]
        if (recordDate > filterDate) {
            console.log("Record date is in range")
            createIssue(data[i][1], data[i][0], data[i][2].split(', '))
            processedCount++
        }
    }
  }

  return processedCount
};

module.exports = {
  fetchFSRs
}