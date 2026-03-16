import * as core from '@actions/core'
import * as httpm from '@actions/http-client'

/**
 * Fetch unqualified FSRs table as JSON and converts them to required objects.
 * @returns Array of retrieved records
 */
export async function fetchFSRs() {
  const api = process.env.QUERYAPI
  core.debug(`API endpoint: ${api}`)

  const http = new httpm.HttpClient()

  const additionalHeaders = { ['accept']: 'application/json' }
  const res = await http.get(api, additionalHeaders)

  // TODO: check the status is HTTP_OK
  core.debug(`HTTP response status code: ${res.message.statusCode}`)

  const body = await res.readBody()

  // parse JSON
  const obj = JSON.parse(body)
  const data = obj.results.bindings

  // transform from JSON array to array of objects in required form
  const records = data.map((x) => ({
    np: x.np.value,
    title: x.label.value,
    labels: x.types.value.split(', ')
  }))

  return records
}
