#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 v0 to Vercel Auto-Updater${NC}\n"

# Get the project directory (where this script is located)
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_DIR"

# Check if Downloads folder exists
DOWNLOADS_DIR="$HOME/Downloads"
if [ ! -d "$DOWNLOADS_DIR" ]; then
    echo -e "${RED}❌ Downloads folder not found${NC}"
    exit 1
fi

# Find the most recent v0 download
echo -e "${BLUE}📦 Looking for latest v0 download...${NC}"
LATEST_ZIP=$(ls -t "$DOWNLOADS_DIR"/my-v0-project*.zip 2>/dev/null | head -1)

if [ -z "$LATEST_ZIP" ]; then
    echo -e "${RED}❌ No v0 project zip found in Downloads${NC}"
    echo "Please download your project from v0 first"
    exit 1
fi

echo -e "${GREEN}✅ Found: $(basename "$LATEST_ZIP")${NC}"

# Create temp directory
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}📂 Extracting to temporary location...${NC}"

# Extract zip
unzip -q "$LATEST_ZIP" -d "$TEMP_DIR"

# Find the extracted folder (might be nested)
EXTRACTED_DIR=$(find "$TEMP_DIR" -name "package.json" -exec dirname {} \; | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo -e "${RED}❌ Could not find extracted project${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Copy files (excluding node_modules, .git, etc)
echo -e "${BLUE}📋 Copying updated files...${NC}"
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='.env.local' "$EXTRACTED_DIR/" "$PROJECT_DIR/"

# Clean up
rm -rf "$TEMP_DIR"

# Check if there are changes
if [[ -z $(git status -s) ]]; then
    echo -e "${BLUE}ℹ️  No changes detected${NC}"
    exit 0
fi

# Show what changed
echo -e "\n${BLUE}📝 Changes detected:${NC}"
git status -s

# Commit and push
echo -e "\n${BLUE}💾 Committing changes...${NC}"
git add .
git commit -m "Update from v0 - $(date '+%Y-%m-%d %H:%M:%S')"

echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push origin main

echo -e "\n${GREEN}✅ Done! Vercel will deploy automatically.${NC}"
echo -e "${BLUE}🔗 Check deployment: https://vercel.com/dashboard${NC}"
