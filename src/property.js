const { createActionAuth } = require("@octokit/auth-action");

const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    authStrategy: createActionAuth
  });

/*
 * Wraps the GitHub octokit API.
 */
async function getRepoProperties() {
  console.log("Get properties")
  return await octokit.request('GET /repos/{owner}/{repo}/properties/values', {
    owner: 'gofair-foundation',
    repo: 'fsr_qualification',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
};

async function getRepoPropertyValue(propertyName) {
  const props = await getRepoProperties()
  const property = props.filter(obj => {
      return obj.property_name === propertyName
  })[0].value
  console.log(property)
  return property
};

async function getImportDate() {
    const importDate = await getRepoPropertyValue("fsr_import_date")
    return importDate
};

async function setImportDate(importDate) {
  await octokit.request('PATCH /orgs/{org}/properties/values', {
    org: 'gofair-foundation',
    repository_names: [
      'fsr_qualification'
    ],
    properties: [
      {
        property_name: 'fsr_import_date',
        value: importDate
      }
    ],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
};

module.exports = {
  getImportDate, setImportDate
}
