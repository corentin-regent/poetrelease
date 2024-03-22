import { debug, getInput, info, setFailed, setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'

const labelPrefix = 'poetrel:'

export default async function getLabel() {
  try {
    const token = getInput('github-token', { required: true })
    const octokit = getOctokit(token)
    const commit = { ...context.repo, commit_sha: context.sha }
    info(`Commit context: ${JSON.stringify(commit)}`)

    const response = await octokit.rest.repos.listPullRequestsAssociatedWithCommit(commit)
    debug(`GET pulls: ${JSON.stringify(response.data)}`)
    if (!response.data.length) {
      throw new Error(`Releases must originate from a Pull Request with a '${labelPrefix}' label`)
    }
    const [pullRequest] = response.data

    const labels = pullRequest.labels
      .map(label => label.name.trim())
      .filter(name => name.startsWith(labelPrefix))

    if (!labels.length) {
      throw new Error(`No '${labelPrefix}' label provided`)
    }
    info(`Relevant labels: ${labels.join(' | ')}`)
    if (labels.length > 1) {
      throw new Error('Only one Poetrel label must be used')
    }

    setOutput('action', labels[0].slice(labelPrefix.length).trim())
  } catch (error) {
    setFailed(error.message)
  }
}
