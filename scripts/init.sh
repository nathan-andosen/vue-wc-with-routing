#!/bin/bash

# get the options
while getopts ":n:" opt; do
  case $opt in
    n) 
      name="$OPTARG"
      ;;
    \?) 
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [ -z "$name" ]; then
  echo "ERROR: Please specify a component name. Example: npm run init -- --name my-component"
  exit 1
fi

rm -rf ./dist
npm install
node ./scripts/update-component-name.js --name $name