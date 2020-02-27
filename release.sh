#!/bin/bash
set -euo pipefail
yarn install
yarn build
yarn test
yarn package
npx jsii-release-npm .
