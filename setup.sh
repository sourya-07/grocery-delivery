#!/usr/bin/env bash
#  Grocery Delivery — Developer Utility Script
#  Usage: ./setup.sh [command]

set -e

SERVER_DIR="$(dirname "$0")/server"

# colour helpers
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Colour

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# helpers
check_node() {
  command -v node &>/dev/null || error "Node.js is not installed. Visit https://nodejs.org"
  command -v npm  &>/dev/null || error "npm is not installed."
  info "Node $(node -v) / npm $(npm -v)"
}

# commands
cmd_install() {
  info "Installing server dependencies..."
  check_node
  cd "$SERVER_DIR"
  npm install
  success "Dependencies installed."
}

cmd_dev() {
  info "Starting development server..."
  check_node
  cd "$SERVER_DIR"
  [ ! -d node_modules ] && warn "node_modules not found — running install first..." && npm install
  npm run dev
}

cmd_build() {
  info "Building TypeScript → dist/..."
  check_node
  cd "$SERVER_DIR"
  [ ! -d node_modules ] && warn "node_modules not found — running install first..." && npm install
  npm run build
  success "Build complete. Output: server/dist/"
}

cmd_start() {
  info "Starting production server..."
  check_node
  cd "$SERVER_DIR"
  [ ! -d dist ] && error "dist/ not found. Run './setup.sh build' first."
  npm start
}

cmd_clean() {
  warn "This will remove server/dist/ and server/node_modules/."
  read -rp "Are you sure? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }

  info "Cleaning server/dist/..."
  rm -rf "$SERVER_DIR/dist"
  info "Cleaning server/node_modules/..."
  rm -rf "$SERVER_DIR/node_modules"
  success "Cleaned."
}

cmd_typecheck() {
  info "Running TypeScript type-check (no emit)..."
  check_node
  cd "$SERVER_DIR"
  npx tsc --noEmit
  success "No type errors found."
}

usage() {
  echo ""
  echo -e "${CYAN}Grocery Delivery — Setup Script${NC}"
  echo ""
  echo "Usage:"
  echo -e "  ${GREEN}./setup.sh install${NC}     Install server dependencies"
  echo -e "  ${GREEN}./setup.sh dev${NC}         Start dev server (nodemon + ts-node)"
  echo -e "  ${GREEN}./setup.sh build${NC}       Compile TypeScript → dist/"
  echo -e "  ${GREEN}./setup.sh start${NC}       Run production server"
  echo -e "  ${GREEN}./setup.sh typecheck${NC}   Run TypeScript type-check"
  echo -e "  ${GREEN}./setup.sh clean${NC}       Remove dist/ and node_modules/"
  echo ""
}

# entry
case "${1:-}" in
  install)   cmd_install ;;
  dev)       cmd_dev ;;
  build)     cmd_build ;;
  start)     cmd_start ;;
  typecheck) cmd_typecheck ;;
  clean)     cmd_clean ;;
  *)         usage ;;
esac
