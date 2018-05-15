#!/bin/sh

yarn buildprod
git checkout gh-pages
git pull
cp -r dist/* .
