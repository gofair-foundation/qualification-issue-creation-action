const core = require('@actions/core')
const httpm = require('@actions/http-client')

/**
 * Fetch unqualified FSRs table as JSON and converts them to required objects.
 * @returns Array of retrieved records
 */
async function fetchFSRs() {
  const api =
    'https://query.knowledgepixels.com/api/RAZkMXCwJE_moP0PBZy3QshV8HyOvZwTwxT26fPcAXh7k/list_nonqualifed_fsr'
  const http = new httpm.HttpClient()

  /* eslint-disable-next-line no-useless-computed-key */
  const additionalHeaders = { ['accept']: 'application/json' }
  const res = await http.get(api, additionalHeaders)

  // TODO: check the status is HTTP_OK
  core.debug(`HTTP response status code: ${res.message.statusCode}`)

  const body = await res.readBody()

  // parse JSON
  const obj = JSON.parse(body)
  const data = obj.results.bindings

  // transform from JSON array to array of objects in required form
  const records = data.map(x => ({
    np: x.np.value,
    title: x.label.value,
    labels: x.types.value.split(', ')
  }))

  return records
}

module.exports = {
  fetchFSRs
}
