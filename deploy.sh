#!/bin/sh

yarn build
git checkout gh-pages
git pull
cp dist/* .

