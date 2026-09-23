#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

try {
  // 获取 Electron 路径
  const electronPath = require('./index.js');

  // 传递所有参数
  const args = process.argv.slice(2);

  // 启动 Electron
  const child = spawn(electronPath, args, {
    stdio: 'inherit',
    windowsHide: false
  });

  child.on('close', (code) => {
    process.exit(code);
  });

  child.on('error', (error) => {
    console.error('启动 Electron 失败:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('错误:', error.message);
  process.exit(1);
}
