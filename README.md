# @stevenzxs/electron

自定义增强版 Electron 发行版，基于 Electron v43.3.0，包含企业级定制功能。

[![npm version](https://img.shields.io/npm/v/@stevenzxs/electron.svg)](https://www.npmjs.com/package/@stevenzxs/electron)
[![GitHub](https://img.shields.io/github/license/stevenzxs/electron-gm)](https://github.com/stevenzxs/electron-gm/blob/main/LICENSE)

## 特性

- ✅ 基于官方 Electron 43.3.0
- ✅ 包含自定义补丁和增强功能
- ✅ 完全兼容标准 Electron API
- ✅ 企业级稳定性优化

## 安装

```bash
npm install @stevenzxs/electron
# 或
yarn add @stevenzxs/electron
# 或
pnpm add @stevenzxs/electron
```

## 使用方法

### 在应用中使用

```javascript
const electron = require('@stevenzxs/electron');
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });
  
  win.loadFile('index.html');
});
```

### 命令行使用

```bash
# 启动应用
npx electron .

# 查看版本
npx electron --version
```

### 替换现有项目的 Electron

在 `package.json` 中：

```json
{
  "devDependencies": {
    "electron": "npm:@stevenzxs/electron@^43.3.0"
  }
}
```

或使用别名：

```bash
npm install electron@npm:@stevenzxs/electron@43.3.0
```

## 系统要求

- **操作系统**: Windows 10/11 (x64)
- **Node.js**: >= 18.0.0
- **架构**: x64

## 自定义功能

本版本包含以下官方版本没有的增强功能：

1. **窗口遮挡检测优化** - 改进 macOS 窗口遮挡检测器，忽略非遮挡窗口
2. **Service Worker 增强** - 通过 EmbeddedWorkerStartParams 传递预加载数据
3. **启动数据传递** - 在 CreateNewWindowReply 中携带嵌入器启动数据
4. **文件访问控制** - 将 AllowUniversalAccessFromFileURLs 限制到 file: 源
5. **远程调试支持** - 为远程调试添加 ShouldUseBundledFrontendResources 委托
6. **存储分区优化** - 为 StoragePartitionImpl 添加 ReinitializeGeneratedCodeCacheContext
7. **构建优化** - PGO 构建支持和 LLVM 优化改进

详细变更日志请查看 [CHANGELOG.md](./CHANGELOG.md)

## 环境变量配置

### 自定义下载镜像

如果默认下载地址不可用，可以设置自定义镜像：

```bash
# Linux/macOS
export ELECTRON_CUSTOM_MIRROR=https://your-mirror.com/electron-v43.3.0-win32-x64.zip

# Windows CMD
set ELECTRON_CUSTOM_MIRROR=https://your-mirror.com/electron-v43.3.0-win32-x64.zip

# Windows PowerShell
$env:ELECTRON_CUSTOM_MIRROR="https://your-mirror.com/electron-v43.3.0-win32-x64.zip"

# 然后重新安装
npm install
```

## 故障排除

### 安装失败

如果自动下载失败，可以手动下载并安装：

1. 从 [Releases](https://github.com/stevenzxs/electron-gm/releases) 下载对应版本的压缩包
2. 解压到 `node_modules/@stevenzxs/electron/dist/` 目录
3. 确保 `electron.exe` 可执行

### 权限问题

Windows 上可能需要管理员权限或关闭防病毒软件：

```bash
# 以管理员身份运行 PowerShell
npm install @stevenzxs/electron --force
```

### 网络问题

使用代理或镜像：

```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

## API 文档

完全兼容官方 Electron API，文档请参考：
- [Electron 官方文档](https://www.electronjs.org/docs/latest/)
- [API 参考](https://www.electronjs.org/docs/latest/api/app)

## 版本对应关系

| @stevenzxs/electron | Electron | Chromium | Node.js | V8 |
|--------------|----------|----------|---------|-----|
| 43.3.0       | 43.3.0   | 133.x    | 20.x    | 13.3 |

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新历史。

## 许可证

MIT License

## 支持

- **Issues**: [GitHub Issues](https://github.com/stevenzxs/electron-gm/issues)
- **讨论**: [GitHub Discussions](https://github.com/stevenzxs/electron-gm/discussions)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关链接

- [官方 Electron](https://www.electronjs.org/)
- [发布说明](https://github.com/stevenzxs/electron-gm/releases)
- [源码仓库](https://github.com/stevenzxs/electron-gm)
