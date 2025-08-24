#!/usr/bin/env sh
# 本脚本供本地使用。仅在非 CI 环境下启用镜像与 git 重写，随后执行 pnpm install。

set -e

echo "Running local setup for installation..."

if [ -z "$CI" ]; then
  echo "Detected non-CI environment — applying local git and electron mirror settings"
  git config --global url."https://github.com/".insteadOf "git@github.com:"
  git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"
  ELECTRON_MIRROR=${ELECTRON_MIRROR:-https://npmmirror.com/mirrors/electron/}
  export ELECTRON_MIRROR
  npm_config_electron_mirror=${npm_config_electron_mirror:-$ELECTRON_MIRROR}
  export npm_config_electron_mirror
else
  echo "CI environment detected — skipping local-only git/electron mirror changes"
fi

echo "Running pnpm install..."
pnpm install "$@"


