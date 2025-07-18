#!/bin/bash

set -e

echo "🚀 Building Steward AI Assistant for all platforms..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ This script is designed for Linux cross-compilation${NC}"
    echo "Please use the appropriate build commands for your platform"
    exit 1
fi

# Check dependencies
echo -e "${YELLOW}🔍 Checking dependencies...${NC}"

# Check Rust
if ! command -v rustc &> /dev/null; then
    echo -e "${RED}❌ Rust is not installed${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun is not installed${NC}"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed${NC}"
    exit 1
fi

# Check pyinstaller
if ! python3 -c "import PyInstaller" &> /dev/null; then
    echo -e "${YELLOW}⚠️  PyInstaller not found, installing...${NC}"
    pip3 install pyinstaller
fi

# Check cross-compilation targets
echo -e "${YELLOW}📦 Checking Rust targets...${NC}"

# Windows targets
if ! rustup target list --installed | grep -q "x86_64-pc-windows-msvc"; then
    echo -e "${YELLOW}⚠️  Adding Windows target...${NC}"
    rustup target add x86_64-pc-windows-msvc
fi

# Linux targets
if ! rustup target list --installed | grep -q "x86_64-unknown-linux-gnu"; then
    echo -e "${YELLOW}⚠️  Adding Linux target...${NC}"
    rustup target add x86_64-unknown-linux-gnu
fi

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
rm -rf dist/
rm -rf src-tauri/target/

# Install frontend dependencies
echo -e "${GREEN}📥 Installing frontend dependencies...${NC}"
bun install

# Build frontend
echo -e "${GREEN}🔨 Building frontend...${NC}"
bun run build

# Install Python dependencies
echo -e "${GREEN}🐍 Installing Python dependencies...${NC}"
cd python-backend
pip3 install -r requirements.txt
cd ..

# Build directory
mkdir -p build-output

# Build for Linux
echo -e "${GREEN}🐧 Building for Linux...${NC}"
bun run tauri build --target x86_64-unknown-linux-gnu
cp src-tauri/target/release/bundle/deb/*.deb build-output/steward-linux-x86_64.deb || true
cp src-tauri/target/release/bundle/appimage/*.AppImage build-output/steward-linux-x86_64.AppImage || true

# Build for Windows
echo -e "${GREEN}🪟 Building for Windows...${NC}"
bun run tauri build --target x86_64-pc-windows-msvc
cp src-tauri/target/release/bundle/msi/*.msi build-output/steward-windows-x86_64.msi || true
cp src-tauri/target/release/bundle/nsis/*.exe build-output/steward-windows-x86_64.exe || true

# Build for macOS (requires osxcross)
if [ -d "$HOME/osxcross" ]; then
    echo -e "${GREEN}🍎 Building for macOS...${NC}"
    export PATH="$HOME/osxcross/target/bin:$PATH"
    rustup target add x86_64-apple-darwin
    rustup target add aarch64-apple-darwin
    
    bun run tauri build --target x86_64-apple-darwin
    cp src-tauri/target/release/bundle/dmg/*.dmg build-output/steward-macos-x86_64.dmg || true
    
    bun run tauri build --target aarch64-apple-darwin
    cp src-tauri/target/release/bundle/dmg/*.dmg build-output/steward-macos-aarch64.dmg || true
else
    echo -e "${YELLOW}⚠️  macOS build skipped - osxcross not found${NC}"
    echo "Install osxcross for macOS cross-compilation:"
    echo "  git clone https://github.com/tpoechtrager/osxcross.git"
    echo "  cd osxcross && wget -nc https://s3.dockerproject.org/darwin/v2/MacOSX10.15.sdk.tar.xz"
    echo "  mv MacOSX10.15.sdk.tar.xz tarballs/ && UNATTENDED=yes OSX_VERSION_MIN=10.7 ./build.sh"
fi

# Display results
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""
echo "📁 Built artifacts:"
ls -la build-output/

echo ""
echo -e "${GREEN}🎉 All builds completed successfully!${NC}"
echo "Files are available in ./build-output/"