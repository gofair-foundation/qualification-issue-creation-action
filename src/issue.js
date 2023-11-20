const { createActionAuth } = require('@octokit/auth-action')

const { Octokit } = require('@octokit/rest')
const octokit = new Octokit({
  authStrategy: createActionAuth
})

/*
 * Wraps the GitHub octokit API.
 */
exports.createIssue = async function (
  issueName,
  issueDescription,
  issueLabels
) {
  console.log(`Creating issues for ${issueName}`)
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
