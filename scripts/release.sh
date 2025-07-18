#!/bin/bash

set -e

echo "🚀 Creating release..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository${NC}"
    exit 1
fi

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Working directory is not clean${NC}"
    echo "Please commit or stash your changes before creating a release"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📦 Current version: $CURRENT_VERSION${NC}"

# Ask for new version
echo "Select version bump:"
echo "1) Patch (0.1.0 → 0.1.1)"
echo "2) Minor (0.1.0 → 0.2.0)"
echo "3) Major (0.1.0 → 1.0.0)"
echo "4) Custom"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."$2"."($3+1)}')
        ;;
    2)
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print $1"."($2+1)".0"}')
        ;;
    3)
        NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{print ($1+1)".0.0"}')
        ;;
    4)
        read -p "Enter new version (e.g., 0.1.1): " NEW_VERSION
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ New version: $NEW_VERSION${NC}"

# Update version in package.json
npm version $NEW_VERSION --no-git-tag-version

# Update version in Cargo.toml
sed -i.bak "s/version = \".*\"/version = \"$NEW_VERSION\"/" src-tauri/Cargo.toml
rm src-tauri/Cargo.toml.bak

# Create release notes template
CHANGELOG_FILE="CHANGELOG.md"
if [[ ! -f "$CHANGELOG_FILE" ]]; then
    cat > $CHANGELOG_FILE << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- 

### Changed
- 

### Fixed
- 

EOF
fi

# Ask user to edit changelog
echo -e "${YELLOW}📝 Please edit CHANGELOG.md to add release notes${NC}"
read -p "Press Enter when done..."

# Check if changelog was edited
if [[ -z $(git diff CHANGELOG.md 2>/dev/null || true) ]]; then
    echo -e "${RED}❌ CHANGELOG.md was not modified${NC}"
    read -p "Continue anyway? (y/N): " confirm
    if [[ $confirm != "y" && $confirm != "Y" ]]; then
        exit 1
    fi
fi

# Commit version changes
git add package.json src-tauri/Cargo.toml CHANGELOG.md
git commit -m "chore: release version $NEW_VERSION"

# Create git tag
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

# Push changes
echo -e "${YELLOW}📤 Pushing changes...${NC}"
git push origin main
git push origin "v$NEW_VERSION"

echo -e "${GREEN}✅ Release created successfully!${NC}"
echo ""
echo "🎉 Release v$NEW_VERSION is ready!"
echo ""
echo "Next steps:"
echo "1. GitHub Actions will automatically build and release"
echo "2. Check the release page for built artifacts"
echo "3. Download and test the builds"
echo ""
echo "To trigger a manual build:"
echo "  ./scripts/build-all.sh"