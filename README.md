# Poetrelease

[![CI](https://github.com/corentin-regent/poetrelease/actions/workflows/ci.yml/badge.svg)](https://github.com/corentin-regent/poetrelease/actions/workflows/ci.yml)
[![Lint](https://github.com/corentin-regent/poetrelease/actions/workflows/linter.yml/badge.svg)](https://github.com/corentin-regent/poetrelease/actions/workflows/linter.yml)
![Coverage](https://raw.githubusercontent.com/corentin-regent/poetrelease/main/badges/coverage.svg)

Poetrelease is a GitHub Action that automates releases
for [Poetry](https://python-poetry.org/) projects,
using [Semantic Versioning](https://semver.org/).

It is a Javascript action, which supports any operating system.

## Features

* Bump the project version according to the commit tag
* Deploy the project to PyPI
* Create a GitHub release, describing the changes
  as detailed in the project Changelog
* Update the project Changelog to specify the newly released version,
  and prepare it for the next changes

## Usage

Supported tags are listed in [the Poetry documentation](https://python-poetry.org/docs/cli/#version).
