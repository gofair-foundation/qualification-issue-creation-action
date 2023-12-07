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
 * Reopen an issue.
 * Wraps the GitHub octokit API.
 */
async function reopenIssue(issueNumber) {
  core.debug(`Reopening issue ${issueNumber}`)
  await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    issue_number: issueNumber,
    state: 'open',
    state_reason: 'reopened',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

/*
 * Get (up to 100) issues for the repo that were created by an action.
 * Newest first (as that's the order from petapico).
 */
async function getActionIssuesPage(pageSize, issuePage) {
  core.debug(`Fetching all action-created issues, page ${issuePage}`)
  const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    state: 'all', // Can be one of: open, closed, all
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
    title: x.title,
    state: x.state
  }))
  return records
}

async function getAllActionIssues(pageSize) {
  let pageNumber = 1
  const results = Array()
  let issuesPage = await getActionIssuesPage(pageSize, pageNumber)
  for (const e of issuesPage) {
    results.push(e)
  }
  core.debug(`Issues in page: ${issuesPage.length}, page size: ${pageSize}`)

  while (issuesPage.length === pageSize) {
    pageNumber++

    issuesPage = await getActionIssuesPage(pageSize, pageNumber)
    for (const e of issuesPage) {
      results.push(e)
    }
  }

  return results
}

module.exports = {
  createIssue,
  closeIssue,
  reopenIssue,
  getAllActionIssues
}
