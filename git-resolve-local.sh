#!/bin/sh
# Script to resolve all git conflicts by choosing local changes

echo "Resolving all git conflicts by choosing local changes..."

# Add all files, favoring local changes
git checkout --ours .

# Add the files to the index
git add .

# Commit the merge with a message
git commit -m "Resolved conflicts by choosing local changes"

echo "All conflicts resolved by choosing local changes."
