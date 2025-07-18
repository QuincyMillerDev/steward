# Cross-Platform Development Setup Guide

This guide will help you set up development on Linux and release for Windows, Linux, and macOS.

## Prerequisites Installation

### Linux Development Setup

#### Ubuntu/Debian
```bash
# System dependencies
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  pkg-config

# Install Rust
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source ~/.cargo/env

# Install Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Install bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### Windows Cross-Compilation Setup (from Linux)

#### Install cross-compilation tools
```bash
# Add Windows targets to Rust
rustup target add x86_64-pc-windows-msvc
rustup target add i686-pc-windows-msvc

# Install MinGW-w64 for cross-compilation
# Ubuntu/Debian
sudo apt install mingw-w64

# Install cargo-binstall for easy tool installation
cargo install cargo-binstall

# Install cargo-xwin for Windows SDK
cargo binstall cargo-xwin
```

### macOS Cross-Compilation Setup (from Linux)

#### Install macOS SDK
```bash
# Install osxcross
sudo apt install clang libxml2-dev libssl-dev libbz2-dev zlib1g-dev

# Clone and build osxcross
git clone https://github.com/tpoechtrager/osxcross.git
cd osxcross
wget -nc https://s3.dockerproject.org/darwin/v2/MacOSX10.15.sdk.tar.xz
mv MacOSX10.15.sdk.tar.xz tarballs/
UNATTENDED=yes OSX_VERSION_MIN=10.7 ./build.sh

# Add to PATH
echo 'export PATH="/home/$(whoami)/osxcross/target/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Add macOS targets to Rust
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin
```

## Project Setup

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd steward

# Install frontend dependencies
bun install

# Check Rust setup
cd src-tauri
cargo check
```

### 2. Python Backend Setup
```bash
# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
cd python-backend
pip install -r requirements.txt

# Test Python server
python -m uvicorn main:app --reload --port 8756
```

### 3. Development Commands

#### Local Development
```bash
# Start full development stack
bun run tauri dev

# Start frontend only
bun run dev

# Start Python backend (separate terminal)
cd python-backend && python -m uvicorn main:app --reload --port 8756
```

#### Cross-Platform Testing
```bash
# Test Windows build (from Linux)
cargo tauri build --target x86_64-pc-windows-msvc

# Test Linux build
cargo tauri build --target x86_64-unknown-linux-gnu

# Test macOS build (requires osxcross)
PATH="/home/$(whoami)/osxcross/target/bin:$PATH" cargo tauri build --target x86_64-apple-darwin
```

## Build Configuration

### Development Build
```bash
# Build frontend
bun run build

# Build Tauri app for current platform
bun run tauri build
```

### Production Build
```bash
# Bundle Python backend
cd python-backend
pyinstaller --onefile main.py

# Build Tauri with bundled Python
cd ..
bun run tauri build
```

## Platform-Specific Considerations

### Windows Build Notes
- WebView2 is included automatically in Windows 10/11
- MSI installer includes all dependencies
- No admin privileges required for installation

### macOS Build Notes
- Notarization required for distribution outside App Store
- Use `cargo-bundle` for .app bundle creation
- Code signing required for macOS 10.15+

### Linux Build Notes
- AppImage format for universal distribution
- .deb and .rpm packages for specific distributions
- Flatpak support for sandboxed installation

## Troubleshooting

### Common Issues

#### WebView2 not found on Windows
```bash
# Install WebView2 Runtime
curl -L https://go.microsoft.com/fwlink/p/?LinkId=2124703 -o MicrosoftEdgeWebView2RuntimeInstaller.exe
./MicrosoftEdgeWebView2RuntimeInstaller.exe /silent /install
```

#### Cross-compilation failures
```bash
# Check target support
rustup target list --installed

# Install missing targets
rustup target add x86_64-pc-windows-msvc
```

#### Python bundling issues
```bash
# Fix PyInstaller path issues
pyinstaller --onefile --paths python-backend main.py

# Check bundled Python
./dist/main --help
```

## Development Scripts

### Quick Setup
```bash
# One-command setup for new developers
./scripts/setup-dev.sh
```

### Development Workflow
```bash
# Start full development environment (frontend + Python backend)
./scripts/dev.sh

# Run all tests
./scripts/test.sh

# Build for all platforms
./scripts/build-all.sh

# Create and publish release
./scripts/release.sh
```

## Release Process

### 1. Automated Release (Recommended)
The project includes GitHub Actions for automated releases:

```bash
# Create release (triggers GitHub Actions)
./scripts/release.sh
```

This will:
- Update version numbers
- Create changelog entry
- Create git tag
- Trigger GitHub Actions builds for all platforms
- Upload artifacts to GitHub releases

### 2. GitHub Actions Workflows
- **Release workflow**: Builds for Windows, macOS, and Linux
- **Test workflow**: Runs tests on every push/PR
- **Manual trigger**: Available via GitHub Actions UI

### 3. Manual Version Management
```bash
# Update version in package.json
npm version patch|minor|major --no-git-tag-version

# Update version in Cargo.toml
sed -i "s/version = \".*\"/version = \"NEW_VERSION\"/" src-tauri/Cargo.toml

# Update changelog
# Edit CHANGELOG.md

# Commit and tag
git add .
git commit -m "chore: release version NEW_VERSION"
git tag -a "vNEW_VERSION" -m "Release version NEW_VERSION"
git push origin main && git push origin "vNEW_VERSION"
```

## Project Structure

```
steward/
├── .github/workflows/     # CI/CD automation
├── scripts/              # Development and build scripts
├── src/                  # React frontend
├── src-tauri/           # Rust backend
├── python-backend/      # FastAPI Python backend
├── dist/               # Built frontend
├── build-output/       # Cross-platform builds
└── venv/              # Python virtual environment
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `setup-dev.sh` | Complete development environment setup |
| `dev.sh` | Start development servers |
| `test.sh` | Run all tests |
| `build-all.sh` | Build for all platforms |
| `release.sh` | Create and publish releases |

## GitHub Actions

### Automatic Builds
- **Windows**: MSI installer + portable .exe
- **macOS**: DMG package (x86_64 + ARM64)
- **Linux**: .deb + AppImage packages

### Trigger Conditions
- **Release**: On tag push (`v*`) or manual trigger
- **Test**: On push to main/develop branches
- **Manual**: Available via Actions tab

## Quick Start Summary

### For New Developers
```bash
git clone <repo>
cd steward
./scripts/setup-dev.sh
./scripts/dev.sh
```

### For Release
```bash
./scripts/release.sh
# GitHub Actions handles the rest
```

## Environment Variables

### Development
```bash
# .env.local
TAURI_DEV_SERVER_PORT=1420
PYTHON_SERVER_PORT=8756
RUST_LOG=debug
```

### Production
```bash
# .env.production
TAURI_ENV=production
PYTHON_SERVER_PORT=8756
RUST_LOG=info
```