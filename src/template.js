const fs = require('fs')
const path = require('path')

/**
 * Fetch the repo issue template.
 * @returns String containing a Markdown table.
 */
async function fetchTemplate() {
  const templatePath = '.github/ISSUE_TEMPLATE/fsr-qualification.md'
  const workspace = process.env.GITHUB_WORKSPACE

  const templateFQPath = path.join(workspace, templatePath)
  const template = fs.readFileSync(templateFQPath, 'utf-8')

  // Drop the first 8 lines
  const lines = String(template).split('\n')
  lines.splice(0, 8)
  return lines.join('\n')
}

module.exports = {
  fetchTemplate
}
