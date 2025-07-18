#!/bin/bash

set -e

echo "🚀 Setting up Steward development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    OS="windows"
fi

echo -e "${GREEN}Detected OS: $OS${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" > /dev/null 2>&1
}

# Install system dependencies
echo -e "${YELLOW}📦 Installing system dependencies...${NC}"

case $OS in
    linux)
        if command_exists apt-get; then
            # Ubuntu/Debian
            sudo apt-get update
            sudo apt-get install -y \
                libwebkit2gtk-4.1-dev \
                build-essential \
                curl \
                wget \
                file \
                libxdo-dev \
                libssl-dev \
                libayatana-appindicator3-dev \
                librsvg2-dev \
                pkg-config \
                git
        elif command_exists pacman; then
            # Arch Linux
            sudo pacman -Syu --noconfirm
            sudo pacman -S --noconfirm \
                webkit2gtk-4.1 \
                base-devel \
                curl \
                wget \
                file \
                libxdo \
                openssl \
                libayatana-appindicator3 \
                librsvg2 \
                pkgconf \
                git
        elif command_exists dnf; then
            # Fedora
            sudo dnf update -y
            sudo dnf install -y \
                webkit2gtk4.1-devel \
                gcc \
                gcc-c++ \
                curl \
                wget \
                file \
                libxdo-devel \
                openssl-devel \
                libappindicator-gtk3-devel \
                librsvg2-devel \
                pkgconf-pkg-config \
                git
        fi
        ;;
    macos)
        if ! command_exists xcode-select; then
            echo -e "${RED}❌ Xcode Command Line Tools not found${NC}"
            echo "Please install with: xcode-select --install"
            exit 1
        fi
        ;;
esac

# Install Rust
if ! command_exists rustc; then
    echo -e "${YELLOW}🔧 Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh -s -- -y
    source ~/.cargo/env
else
    echo -e "${GREEN}✅ Rust already installed${NC}"
fi

# Install Node.js (using nvm if not present)
if ! command_exists node; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    if command_exists nvm; then
        nvm install --lts
        nvm use --lts
    else
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        source ~/.bashrc || source ~/.zshrc
        nvm install --lts
        nvm use --lts
    fi
else
    echo -e "${GREEN}✅ Node.js already installed${NC}"
fi

# Install Bun
if ! command_exists bun; then
    echo -e "${YELLOW}📦 Installing Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc || source ~/.zshrc
else
    echo -e "${GREEN}✅ Bun already installed${NC}"
fi

# Install Python 3.10+ if needed
if ! command_exists python3 || [[ "$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)" < "3.10" ]]; then
    echo -e "${YELLOW}🐍 Installing Python 3.10+...${NC}"
    case $OS in
        linux)
            if command_exists apt-get; then
                sudo apt-get install -y python3.10 python3.10-venv python3-pip
            elif command_exists pacman; then
                sudo pacman -S --noconfirm python python-pip
            fi
            ;;
        macos)
            if command_exists brew; then
                brew install python@3.10
            else
                echo -e "${RED}❌ Please install Python 3.10+ manually${NC}"
                exit 1
            fi
            ;;
    esac
else
    echo -e "${GREEN}✅ Python 3.10+ already installed${NC}"
fi

# Add Rust targets for cross-compilation
echo -e "${YELLOW}🎯 Adding Rust targets...${NC}"
rustup target add x86_64-pc-windows-msvc || echo "Windows target already added"
rustup target add x86_64-unknown-linux-gnu || echo "Linux target already added"

# Install project dependencies
echo -e "${YELLOW}📥 Installing project dependencies...${NC}"
bun install

# Setup Python virtual environment
echo -e "${YELLOW}🐍 Setting up Python virtual environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r python-backend/requirements.txt

# Create development scripts
echo -e "${YELLOW}📝 Creating development scripts...${NC}"
mkdir -p scripts

# Create .env file for development
cat > .env.local << EOF
TAURI_DEV_SERVER_PORT=1420
PYTHON_SERVER_PORT=8756
RUST_LOG=debug
EOF

# Create quick start script
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Steward development environment..."

# Start Python backend in background
echo "Starting Python backend..."
cd python-backend
source ../venv/bin/activate
python -m uvicorn main:app --reload --port 8756 &
BACKEND_PID=$!

# Start Tauri dev
echo "Starting Tauri frontend..."
cd ..
bun run tauri dev

# Cleanup on exit
trap 'kill $BACKEND_PID 2>/dev/null || true' EXIT
EOF

chmod +x scripts/dev.sh

# Create test script
cat > scripts/test.sh << 'EOF'
#!/bin/bash
echo "🧪 Running tests..."

# Test frontend
echo "Testing frontend..."
bun run build

# Test Rust
echo "Testing Rust backend..."
cd src-tauri
cargo check
cargo clippy -- -D warnings

# Test Python
echo "Testing Python backend..."
cd ../python-backend
source ../venv/bin/activate
python -m py_compile main.py

echo "✅ All tests passed!"
EOF

chmod +x scripts/test.sh

# Final verification
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📋 Installed tools:"
echo "  - Rust: $(rustc --version)"
echo "  - Node.js: $(node --version)"
echo "  - Bun: $(bun --version)"
echo "  - Python: $(python3 --version)"
echo ""
echo "🎉 Ready to develop!"
echo ""
echo "Quick start commands:"
echo "  ./scripts/dev.sh     # Start full development environment"
echo "  ./scripts/test.sh    # Run all tests"
echo "  bun run tauri dev    # Start Tauri development"
echo "  bun run tauri build  # Build production version"
echo ""
echo "Activate Python environment:"
echo "  source venv/bin/activate"