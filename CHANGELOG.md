# Changelog

This project adheres to [Semantic Versioning 2.0](http://semver.org/).

## Unreleased

Added [GitHub Deployments](https://docs.github.com/en/actions/deployment/about-deployments) with
`environment` and `concurrency` in the docs examples.

## 1.4.0

Added the default value of `github.token` for the `github-token` inputs of all actions

## 1.3.0

Replaced `[skip actions]` marker with the shorter `[skip ci]`

## 1.2.1

Fixed the documentation for `poetrel/sync-labels` and `poetrel/release-gh-action`

## 1.2.0

### New Actions

- Added the `poetrel/release-gh-action` action for automatic releases of GitHub actions.
- Added the `poetrel/sync-labels` action for synchronizing your repository with Poetrel labels.

### Miscellaneous

- Added a simple message in the `Unreleased` section to reduce conflicts
- Added a default value for the `changelog` input
- Stopped using the [git-auto-commit](https://github.com/stefanzweifel/git-auto-commit-action)
  action, to support any OS.
- Added the ability to specify the git user, email and author for the commmit.
- Setup Python with the latest version, if `setup-poetry` is set to `true`.

## 1.1.1

Fixed branch protection bypass by removing checkout in the action

## 1.1.0

Added support for publishing to PyPI

## 1.0.0

First release of the action
