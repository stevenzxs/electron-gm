#!/usr/bin/env node

/**
 * 准备发布脚本
 * 用于打包构建产物并准备上传
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const ELECTRON_BUILD_PATH = 'D:/electron-build/src/out/Release';
const OUTPUT_DIR = path.join(__dirname, '..', 'releases');
const VERSION = require('../package.json').version;

// 需要打包的文件列表
const FILES_TO_PACKAGE = [
  'electron.exe',
  'ffmpeg.dll',
  'libEGL.dll',
  'libGLESv2.dll',
  'vk_swiftshader.dll',
  'vulkan-1.dll',
  'd3dcompiler_47.dll',
  'chrome_100_percent.pak',
  'chrome_200_percent.pak',
  'resources.pak',
  'icudtl.dat',
  'snapshot_blob.bin',
  'v8_context_snapshot.bin',
  'vccorlib140.dll',
  'vcruntime140.dll',
  'vcruntime140_1.dll',
  'msvcp140.dll'
];

const DIRECTORIES_TO_PACKAGE = [
  'locales',
  'resources'
];

async function createZip(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高压缩级别
    });

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`✅ 压缩包已创建: ${outputPath}`);
      console.log(`   大小: ${sizeInMB} MB`);
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);

    // 添加文件
    console.log('正在添加文件到压缩包...');

    for (const file of FILES_TO_PACKAGE) {
      const filePath = path.join(sourceDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
        console.log(`  ✓ ${file}`);
      } else {
        console.warn(`  ⚠ 跳过缺失文件: ${file}`);
      }
    }

    // 添加目录
    for (const dir of DIRECTORIES_TO_PACKAGE) {
      const dirPath = path.join(sourceDir, dir);
      if (fs.existsSync(dirPath)) {
        archive.directory(dirPath, dir);
        console.log(`  ✓ ${dir}/`);
      } else {
        console.warn(`  ⚠ 跳过缺失目录: ${dir}`);
      }
    }

    archive.finalize();
  });
}

async function generateChecksums(filePath) {
  const crypto = require('crypto');
  const fileBuffer = fs.readFileSync(filePath);

  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

  const checksumFile = filePath + '.checksums.txt';
  const checksumContent = [
    `SHA256: ${sha256}`,
    `MD5: ${md5}`,
    ``,
    `Verify with:`,
    `  sha256sum -c <file>.checksums.txt`,
    `  md5sum -c <file>.checksums.txt`
  ].join('\n');

  fs.writeFileSync(checksumFile, checksumContent);
  console.log(`✅ 校验和已生成: ${checksumFile}`);

  return { sha256, md5 };
}

async function main() {
  try {
    console.log('🚀 开始准备发布...');
    console.log('');

    // 检查源目录
    if (!fs.existsSync(ELECTRON_BUILD_PATH)) {
      throw new Error(`构建目录不存在: ${ELECTRON_BUILD_PATH}`);
    }

    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 准备文件名
    const platform = 'win32';
    const arch = 'x64';
    const zipFileName = `electron-v${VERSION}-${platform}-${arch}.zip`;
    const zipFilePath = path.join(OUTPUT_DIR, zipFileName);

    console.log(`版本: ${VERSION}`);
    console.log(`平台: ${platform}-${arch}`);
    console.log(`输出: ${zipFilePath}`);
    console.log('');

    // 创建压缩包
    await createZip(ELECTRON_BUILD_PATH, zipFilePath);
    console.log('');

    // 生成校验和
    const checksums = await generateChecksums(zipFilePath);
    console.log('');

    // 生成发布说明
    const releaseNotes = path.join(OUTPUT_DIR, 'RELEASE_NOTES.md');
    const notes = `
# Electron GM v${VERSION} Release

## 下载

- **Windows x64**: [${zipFileName}](${zipFileName})

## 校验和

\`\`\`
SHA256: ${checksums.sha256}
MD5: ${checksums.md5}
\`\`\`

## 安装

### 自动安装（推荐）

\`\`\`bash
npm install @gm/electron
\`\`\`

### 手动安装

1. 下载压缩包
2. 解压到 \`node_modules/@gm/electron/dist/\`
3. 确保 \`electron.exe\` 可执行

## 变更日志

查看 [CHANGELOG.md](../CHANGELOG.md) 了解详细变更。

## 系统要求

- Windows 10/11 (x64)
- Node.js >= 18.0.0

---

Generated on: ${new Date().toISOString()}
    `.trim();

    fs.writeFileSync(releaseNotes, notes);
    console.log(`✅ 发布说明已生成: ${releaseNotes}`);
    console.log('');

    // 显示后续步骤
    console.log('📋 后续步骤:');
    console.log('');
    console.log('1. 上传发布文件:');
    console.log(`   文件: ${zipFilePath}`);
    console.log('   目标: GitHub Releases / 自建服务器 / CDN');
    console.log('');
    console.log('2. 更新 install.js 中的 DOWNLOAD_URL:');
    console.log('   const DOWNLOAD_URL = "https://your-host.com/' + zipFileName + '"');
    console.log('');
    console.log('3. 测试安装:');
    console.log('   npm install');
    console.log('   npx electron --version');
    console.log('');
    console.log('4. 发布到 npm:');
    console.log('   npm publish --access public');
    console.log('');
    console.log('✅ 准备完成!');

  } catch (error) {
    console.error('❌ 发布准备失败:', error.message);
    process.exit(1);
  }
}

main();
