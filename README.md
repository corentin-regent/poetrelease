# Poetrel

[![CI](https://github.com/corentin-regent/poetrelease/actions/workflows/ci.yml/badge.svg)](https://github.com/corentin-regent/poetrelease/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/pypi/l/rate-control?logo=unlicense)](https://github.com/corentin-regent/poetrel/blob/main/LICENSE)

Poetrel is a GitHub Action that automates GitHub releases for [Poetry](https://python-poetry.org/)
projects.

Poetrel also handles publishing the project to PyPI, if provided the `pypi-token` input.

## Usage

Before merging a pull request on your main branch, you can set a `poetrel:` label to this PR, for
Poetrel to:

- Bump the project version accordingly
- Update the project Changelog
- Optionally publish the new version to PyPI
- And create a GitHub release describing the changes as detailed in the Changelog

Here are some example labels that you may use:

![poetrel:major](https://img.shields.io/badge/poetrel:major-ff0000)
![poetrel:prerelease --next-phase](https://img.shields.io/badge/poetrel:prerelease_----next--phase-007f00)

Supported actions are listed in
[the Poetry documentation](https://python-poetry.org/docs/cli/#version).

Alternatively, you can specify Poetrel to create a release without updating the `pyproject.toml`
version, by using the following label:
![poetrel:no-bump](https://img.shields.io/badge/poetrel:no--bump-0000ff)

It can be useful if you are preparing the first release of your project for example.

> [!NOTE]  
> The Poetrel action will fail if the commit that triggered the workflow did not originate from a PR
> with a `poetrel:` label.

Here is how you can integrate Poetrel in your workflow:

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest

    permissions:
      # Give the GITHUB_TOKEN write permission to commit
      # and push the updated Changelog and pyproject.toml
      contents: write

    steps:
      - name: Checkout project
        uses: actions/checkout@v4

      - name: Release project
        uses: corentin-regent/poetrel@v1
        with:
          changelog: CHANGELOG.md
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pypi-token: ${{ secrets.PYPI_TOKEN }}
```

The `PYPI_TOKEN` secret can be generated [here](https://pypi.org/manage/account/#api-tokens) for
your project and has to be added to your repository secrets in the GitHub settings.

The `GITHUB_TOKEN` secret on the other hand is builtin, and is provided by GitHub without any action
required.

## Changelog format

Poetrel supports both the Markdown format and the reStructuredText format for the Changelog file
(inferred from the file extension).

All you have to do is list your changes in an `Unreleased` section, and Poetrel will handle adding
the versions to the Changelog each time the project is released.

The content of this `Unreleased` section is used as the description of the GitHub release that is
created.

## Protected branches

Poetrel needs `contents: write` permissions in order to push the modified Changelog and
pyproject.toml.

If your main branch is
[protected](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
granting the permissions to the GITHUB_TOKEN will not suffice. Instead you will need to use either a
[personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens),
[deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#deploy-keys),
or a service account.

Here is how you would use Poetrel using a personal access token:

```yaml
steps:
  - name: Check out repository
    uses: actions/checkout@v4
    with:
      token: ${{ secrets.PAT }}

  - name: Release project
    uses: corentin-regent/poetrel@v1
    with:
      changelog: CHANGELOG.md
      github-token: ${{ secrets.GITHUB_TOKEN }}
      pypi-token: ${{ secrets.PYPI_TOKEN }}
```

## Inputs

Here is the reference of supported inputs:

```yaml
inputs:
  changelog:
    description: The path to the Changelog file
    required: true
  commit-prefix:
    description: The message to display before the version in the commit message
    required: false
    default: '[skip actions] Release '
  github-token:
    description: The repository token (secrets.GITHUB_TOKEN)
    required: true
  pypi-token:
    description: The PyPI API token if you want to publish to PyPI
    required: false
  setup-poetry:
    description: Whether Poetrel should setup Python and Poetry
    required: false
    default: 'true'
```

You can choose to setup Python and Poetry yourself in your workflow, and pass `setup-poetry: false`
as an argument to Poetrel.

If you wish to override the commit message, make sure to still include `[skip actions]` if you would
like Poetrel's commit not to trigger additional workflow runs.

## Synchronizing the labels in your repo

For the Poetrel labels to be maintainable in your repository, we offer a
`corentin-regent/poetrel/sync-labels` action, which will synchronize your labels with the ones
defined [here](/.github/labels.toml).

Here is an example workflow that would synchronize your labels with Poetrel everyday:

```yaml
name: Synchronize Poetrel labels

on:
  schedule:
    - cron: '0 0 * * *' # once a day

jobs:
  sync:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Sync labels with GitHub
        uses: corentin-regent/poetrel/sync-labels@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

Here is the reference of supported inputs for this `sync-labels` action:

```yaml
inputs:
  github-token:
    description: The repository token (secrets.GITHUB_TOKEN)
    required: true
  setup-python:
    description: Whether Poetrel should setup Python
    required: false
    default: 'true'
```
