#!/bin/bash
set -e

# Setup SSH Key
KEY_PATH="/root/project-manage/github_deploy_key"
chmod 600 $KEY_PATH

# Configure Git to use the key
export GIT_SSH_COMMAND="ssh -i $KEY_PATH -o StrictHostKeyChecking=no"

# Clone
REPO_URL="git@github.com:weibill1107-test/123.git"
CLONE_DIR="/tmp/test_repo_$(date +%s)"


echo "Cloning $REPO_URL to $CLONE_DIR..."
git clone $REPO_URL $CLONE_DIR

cd $CLONE_DIR

# Modify
echo "Sync Test from Server at $(date)" >> server_sync_log.txt

# Push
git config user.email "server@project-manage.com"
git config user.name "Project Manage Server"
git add .
git commit -m "Server Sync Test"
git push

echo "Push Successful!"
