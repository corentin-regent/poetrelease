# Poetrel

[![Continuous Integration](https://github.com/corentin-regent/poetrel/actions/workflows/ci.yml/badge.svg)](https://github.com/corentin-regent/poetrel/actions/workflows/ci.yml)
[![Continuous Deployment](https://github.com/corentin-regent/poetrel/actions/workflows/cd.yml/badge.svg)](https://github.com/corentin-regent/poetrel/actions/workflows/cd.yml)
[![Latest Release](https://img.shields.io/github/v/release/corentin-regent/poetrel?logo=github&sort=semver)](https://github.com/corentin-regent/poetrel/releases)
[![MIT License](https://img.shields.io/pypi/l/rate-control?logo=unlicense)](https://github.com/corentin-regent/poetrel/blob/main/LICENSE)

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=corentin-regent_poetrel&metric=alert_status)](https://sonarcloud.io/summary/overall?id=corentin-regent_poetrel)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=corentin-regent_poetrel&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=corentin-regent_poetrel)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=corentin-regent_poetrel&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=corentin-regent_poetrel)
[![Security](https://sonarcloud.io/api/project_badges/measure?project=corentin-regent_poetrel&metric=security_rating)](https://sonarcloud.io/summary/overall?id=corentin-regent_poetrel)

Poetrel is a GitHub Action that automates GitHub releases for [Poetry](https://python-poetry.org/)
projects.

It can also handle publishing the project to PyPI, if provided the `pypi-token` input.

As a composite action of Javascript actions, any OS is supported.

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

    concurrency: pypi
    environment:
      name: pypi
      url: https://pypi.org/project/<YOUR_PROJECT_NAME>/

    steps:
      - name: Checkout project
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Release project
        uses: corentin-regent/poetrel@v1
        with:
          pypi-token: ${{ secrets.PYPI_TOKEN }}
```

The `PYPI_TOKEN` secret can be generated [here](https://pypi.org/manage/account/#api-tokens) for
your project and has to be added to your repository secrets in the GitHub settings.

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
      fetch-depth: 0
      token: ${{ secrets.PAT }}

  - name: Release project
    uses: corentin-regent/poetrel@v1
    with:
      pypi-token: ${{ secrets.PYPI_TOKEN }}
```

## Inputs

See the [action.yml](/action.yml) file for a reference of all supported inputs.

Notably, you can choose to setup Python and Poetry yourself in your workflow, and pass
`setup-poetry: false` as an argument to Poetrel.

If you wish to override the commit message, make sure to still include `[skip ci]` if you would like
Poetrel's commit not to trigger additional workflow runs.

## Automatic releases for a GitHub Action

Poetrel also offers an action for releasing GitHub Actions, in a similar fashion.

Poetrel will, when merging a pull request with one of the following labels:

![poetrel:major](https://img.shields.io/badge/poetrel:major-ff0000)
![poetrel:minor](https://img.shields.io/badge/poetrel:minor-ff7f00)
![poetrel:patch](https://img.shields.io/badge/poetrel:patch-ffff00)

- Infer the current project version from the changelog
- Bump it accordingly and write the new version in the changelog
- Create a GitHub release for this new version
- Create or update the tag for the corresponding major version (e.g. `v1`)

> [!NOTE]  
> Only the these three labels are supported for this `poetrel/release-gh-action` action.

However, you will still need to create manually the first release of your action, to populate the
Changelog and list your Action in the
[GitHub Marketplace](https://github.com/marketplace?type=actions).

Here is how you can integrate this action in your workflow:

```yaml
name: Continuous Deployment

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
    concurrency: github-marketplace
    environment:
      name: github-marketplace
      url: https://github.com/marketplace/actions/<YOUR_ACTION_NAME>

    steps:
      - name: Check out repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.PAT }}

      - name: Release the GitHub Action
        uses: corentin-regent/poetrel/release-gh-action@v1
```

See [release-gh-action/action.yml](/release-gh-action/action.yml) for a reference of supported
inputs.

## Synchronizing the labels in your repo

For the Poetrel labels to be maintainable in your repository, we offer a
`corentin-regent/poetrel/sync-labels` action, which will synchronize your labels with the ones
defined [here](/sync-labels/labels.toml).

In order to also keep your existing labels, you will need to list them in a `labels.toml` file in
your repository. The [labels](https://github.com/hackebrot/labels) package can do this for you.

You will only need to setup a
[personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
with `issues: read` permissions, and fill in and run the following commands:

```bash
pip install labels
export LABELS_USERNAME="<GITHUB_USERNAME>"
export LABELS_TOKEN="<PERSONAL_ACCESS_TOKEN>"
labels fetch -o <REPO_OWNER> -r <REPO_NAME> -f .github/labels.toml
```

Here is an example workflow that would then synchronize your labels with Poetrel everyday:

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
```

See the [sync-labels/action.yml](/sync-labels/action.yml) file for a reference of all supported
inputs.
