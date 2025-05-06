#!/bin/sh

# Pulls and pushes the current git branch.
# Use it to quickly switch driver in a remote mob or randori

export CURRENT_BRANCH=$(git symbolic-ref --short -q HEAD)

git pull origin "$CURRENT_BRANCH" --ff-only
git add --all
git commit -m 'Working...'
git push origin "$CURRENT_BRANCH"
