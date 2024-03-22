#!/bin/bash

declare -a files=("get-label" "save-notes" "write-version")

for file in "${files[@]}"; do
    npx ncc build "src/${file}.ts" -o "dist/${file}" --license licenses.txt --minify
done
