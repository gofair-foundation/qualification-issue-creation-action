const { createActionAuth } = require("@octokit/auth-action");

const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    authStrategy: createActionAuth
  });

/*
 * Wraps the GitHub octokit API.
 */
exports.getRepoProperties = async function() {
  console.log("Get properties")
  return await octokit.request('GET /repos/{owner}/{repo}/properties/values', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
};
