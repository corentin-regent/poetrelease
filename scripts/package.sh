declare -a files=("get-label" "get-notes" "write-version")

for file in "${files[@]}"
do
  npx ncc build src/${file}.ts -o dist/${file} --license licenses.txt --minify
done
