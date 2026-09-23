const path = require('path');
const fs = require('fs');

/**
 * 获取 Electron 可执行文件路径
 */
function getElectronPath() {
  const platform = process.platform;
  const installPath = path.join(__dirname, 'dist');

  let electronBinary;

  switch (platform) {
    case 'win32':
      electronBinary = 'electron.exe';
      break;
    case 'darwin':
      electronBinary = 'Electron.app/Contents/MacOS/Electron';
      break;
    case 'linux':
      electronBinary = 'electron';
      break;
    default:
      throw new Error(`不支持的平台: ${platform}`);
  }

  const electronPath = path.join(installPath, electronBinary);

  // 验证文件是否存在
  if (!fs.existsSync(electronPath)) {
    throw new Error(
      `Electron 可执行文件未找到: ${electronPath}\n` +
      `请运行 'npm install' 或 'npm rebuild @stevenzxs/electron' 重新安装`
    );
  }

  return electronPath;
}

// 导出路径
module.exports = getElectronPath();

// 同时导出一些有用的信息
module.exports.getElectronPath = getElectronPath;
module.exports.version = require('./package.json').version;
module.exports.dist = path.join(__dirname, 'dist');
