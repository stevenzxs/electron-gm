#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { pipeline } = require('stream');
const { promisify } = require('util');
const zlib = require('zlib');
const tar = require('tar');

const streamPipeline = promisify(pipeline);

// 配置项
const ELECTRON_VERSION = '43.3.0';
const PLATFORM = process.platform;
const ARCH = process.arch;

// 下载地址配置
const DOWNLOAD_URL = process.env.ELECTRON_CUSTOM_MIRROR ||
  `https://github.com/stevenzxs/electron-gm/releases/download/v${ELECTRON_VERSION}/electron-v${ELECTRON_VERSION}-win32-x64.zip`;

const installPath = path.join(__dirname, 'dist');
const electronPath = path.join(installPath, 'electron.exe');

async function downloadFile(url, destPath) {
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    console.log(`正在从 ${url} 下载...`);

    protocol.get(url, {
      headers: {
        'User-Agent': 'electron-gm-installer'
      }
    }, (response) => {
      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: HTTP ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      let lastPercent = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const percent = Math.floor((downloadedSize / totalSize) * 100);

        if (percent !== lastPercent && percent % 10 === 0) {
          console.log(`下载进度: ${percent}% (${(downloadedSize / 1024 / 1024).toFixed(2)}MB / ${(totalSize / 1024 / 1024).toFixed(2)}MB)`);
          lastPercent = percent;
        }
      });

      const fileStream = fs.createWriteStream(destPath);
      streamPipeline(response, fileStream)
        .then(resolve)
        .catch(reject);
    }).on('error', reject);
  });
}

async function extractZip(zipPath, extractPath) {
  const AdmZip = require('adm-zip');

  console.log('正在解压文件...');
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractPath, true);
  console.log('解压完成');
}

async function install() {
  try {
    // 检查是否已安装
    if (fs.existsSync(electronPath)) {
      console.log('Electron 已安装，跳过下载');
      return;
    }

    // 平台检查
    if (PLATFORM !== 'win32') {
      console.warn(`警告: 当前平台 ${PLATFORM} 可能不受支持，本版本仅编译了 Windows 版本`);
      return;
    }

    if (ARCH !== 'x64') {
      console.warn(`警告: 当前架构 ${ARCH} 可能不受支持，本版本仅编译了 x64 版本`);
      return;
    }

    // 创建目录
    if (!fs.existsSync(installPath)) {
      fs.mkdirSync(installPath, { recursive: true });
    }

    const tempZip = path.join(installPath, 'electron.zip');

    console.log('开始下载自定义 Electron 二进制文件...');
    console.log(`版本: ${ELECTRON_VERSION}`);
    console.log(`平台: ${PLATFORM}-${ARCH}`);
    console.log('');

    // 下载文件
    await downloadFile(DOWNLOAD_URL, tempZip);

    // 解压文件
    console.log('');
    await extractZip(tempZip, installPath);

    // 清理临时文件
    fs.unlinkSync(tempZip);

    // 写入路径信息
    fs.writeFileSync(
      path.join(__dirname, 'path.txt'),
      electronPath,
      'utf8'
    );

    console.log('');
    console.log('✅ 安装完成!');
    console.log(`Electron 路径: ${electronPath}`);

  } catch (error) {
    console.error('❌ 安装失败:', error.message);
    console.error('');
    console.error('故障排除:');
    console.error('1. 检查网络连接');
    console.error('2. 检查下载地址是否正确');
    console.error('3. 设置镜像: export ELECTRON_CUSTOM_MIRROR=<your-mirror-url>');
    console.error('4. 手动下载并解压到:', installPath);
    process.exit(1);
  }
}

// 执行安装
install();
