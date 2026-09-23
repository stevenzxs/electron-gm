#!/usr/bin/env node

/**
 * 简单的测试脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 开始测试 @gm/electron...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
    failed++;
  }
}

// 测试 1: package.json 存在
test('package.json 存在', () => {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(pkgPath)) {
    throw new Error('package.json 不存在');
  }
});

// 测试 2: 版本号格式正确
test('版本号格式正确', () => {
  const pkg = require('../package.json');
  if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) {
    throw new Error(`版本号格式错误: ${pkg.version}`);
  }
});

// 测试 3: 必需的文件存在
test('必需的文件存在', () => {
  const requiredFiles = [
    'index.js',
    'cli.js',
    'install.js',
    'README.md',
    'LICENSE'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`缺少必需文件: ${file}`);
    }
  }
});

// 测试 4: index.js 可以被 require
test('index.js 可以被 require', () => {
  try {
    require('../index.js');
  } catch (error) {
    // 如果 dist 不存在，这是正常的
    if (!error.message.includes('Electron 可执行文件未找到')) {
      throw error;
    }
  }
});

// 测试 5: CLI 脚本可执行
test('CLI 脚本可执行', () => {
  const cliPath = path.join(__dirname, '..', 'cli.js');
  const content = fs.readFileSync(cliPath, 'utf8');
  if (!content.startsWith('#!/usr/bin/env node')) {
    throw new Error('CLI 脚本缺少 shebang');
  }
});

// 测试 6: npm 配置正确
test('npm 配置正确', () => {
  const pkg = require('../package.json');

  if (!pkg.bin || !pkg.bin.electron) {
    throw new Error('缺少 bin 配置');
  }

  if (!pkg.scripts || !pkg.scripts.postinstall) {
    throw new Error('缺少 postinstall 脚本');
  }
});

// 测试 7: 依赖检查
test('依赖声明检查', () => {
  const pkg = require('../package.json');

  // 不应该有 dependencies（二进制发行版）
  if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
    console.warn('   警告: 检测到 dependencies，请确认是否必要');
  }
});

// 总结
console.log('\n' + '='.repeat(50));
console.log(`测试完成: ${passed} 通过, ${failed} 失败`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
