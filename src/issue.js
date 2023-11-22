const core = require('@actions/core')
const { createActionAuth } = require('@octokit/auth-action')

const { Octokit } = require('@octokit/rest')
const octokit = new Octokit({
  authStrategy: createActionAuth
})

/*
 * Create an issue.
 * Wraps the GitHub octokit API.
 */
async function createIssue(issueName, issueDescription, issueLabels) {
  core.debug(`Creating issue for ${issueName}`)
  await octokit.request('POST /repos/{owner}/{repo}/issues', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    title: issueName,
    body: issueDescription,
    labels: issueLabels,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

/*
 * Close an issue.
 * Wraps the GitHub octokit API.
 */
async function closeIssue(issueNumber) {
  core.debug(`Closing issue ${issueNumber}`)
  await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    issue_number: issueNumber,
    state: 'closed',
    state_reason: 'not_planned',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

/*
 * Get (up to 100) open issues for the repo that were created by an action.
 * Newest first (as that's the order from petapico).
 */
async function getOpenActionIssuesPage(pageSize, issuePage) {
  core.debug(`Fetching open issues page ${issuePage}`)
  const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    state: 'open',
    creator: 'app/github-actions',
    sort: 'created',
    direction: 'desc',
    per_page: pageSize,
    page: issuePage,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  // map necessary fields & return
  const records = response.data.map(x => ({
    number: x.number,
    body: x.body,
    title: x.title
  }))
  return records
}

async function getAllOpenActionIssues(pageSize) {
  let pageNumber = 1
  const results = Array()
  let issuesPage = await getOpenActionIssuesPage(pageSize, pageNumber)
  for (const e of issuesPage) {
    results.push(e)
  }
  core.debug(`Issues in page: ${issuesPage.length}, page size: ${pageSize}`)

  while (issuesPage.length === pageSize) {
    pageNumber++

    issuesPage = await getOpenActionIssuesPage(pageSize, pageNumber)
    for (const e of issuesPage) {
      results.push(e)
    }
  }

  return results
}

module.exports = {
  createIssue,
  closeIssue,
  getAllOpenActionIssues
}
