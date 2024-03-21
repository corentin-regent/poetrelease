import { debug, getInput, setFailed, setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'

const labelPrefix = 'poetrel:'

export default async function getLabel() {
  try {
    const token = getInput('github-token', { required: true })
    const octokit = getOctokit(token)
    const commit = { ...context.repo, commit_sha: context.sha }
    debug(`Commit context: ${commit}`)

    const response = await octokit.rest.repos.listPullRequestsAssociatedWithCommit(commit)
    debug(`GET pulls: ${response.data}`)
    if (!response.data.length) {
      throw new Error('No Pull Request found')
    }

    const [pullRequest] = response.data
    debug(`Retrieved PR: ${pullRequest}`)

    const labels = pullRequest.labels
      .map(label => label.name.trim())
      .filter(name => name.startsWith(labelPrefix))

    if (!labels.length) {
      throw new Error('No Poetrel label provided')
    }
    debug(`Relevant labels: ${labels}`)
    if (labels.length > 1) {
      throw new Error('Only one Poetrel label must be used')
    }

    const [label] = labels[0]
    setOutput('action', label.slice(labelPrefix.length).trim())
  } catch (error) {
    setFailed(error.message)
  }
}

if (require.main === module) {
  getLabel()
}
