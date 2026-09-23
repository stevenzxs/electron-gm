# @gm/electron 发布工程

这是用于发布自定义 Electron 版本的 npm 包工程。

## 目录结构

```
electron-gm/
├── index.js              # 主入口，导出 Electron 路径
├── cli.js                # 命令行启动器
├── install.js            # 安装脚本（postinstall）
├── package.json          # npm 包配置
├── README.md             # 用户文档
├── CHANGELOG.md          # 变更日志
├── LICENSE               # 许可证
├── .gitignore           # Git 忽略文件
├── .npmignore           # npm 忽略文件
├── scripts/
│   └── prepare-release.js  # 发布准备脚本
├── test/
│   └── test.js          # 测试脚本
└── releases/            # 发布产物（不提交到 git）
    └── electron-v43.3.0-win32-x64.zip
```

## 发布流程

### 步骤 1: 准备发布包

```bash
# 安装依赖（首次）
cd D:\electron-gm
npm install archiver --save-dev

# 运行发布准备脚本
npm run prepare-release
```

这会在 `releases/` 目录生成：
- `electron-v43.3.0-win32-x64.zip` - 压缩的二进制文件
- `electron-v43.3.0-win32-x64.zip.checksums.txt` - 校验和
- `RELEASE_NOTES.md` - 发布说明

### 步骤 2: 上传二进制文件

选择以下任一方式托管二进制文件：

#### 方案 A: GitHub Releases（推荐）

```bash
# 创建 GitHub Release
gh release create v43.3.0 \
  releases/electron-v43.3.0-win32-x64.zip \
  releases/electron-v43.3.0-win32-x64.zip.checksums.txt \
  --title "v43.3.0" \
  --notes-file releases/RELEASE_NOTES.md
```

#### 方案 B: 自建服务器

上传到您的文件服务器或 CDN：
```bash
scp releases/electron-v43.3.0-win32-x64.zip user@yourserver.com:/var/www/downloads/
```

### 步骤 3: 更新下载地址

编辑 `install.js`，更新 `DOWNLOAD_URL`：

```javascript
const DOWNLOAD_URL = process.env.ELECTRON_CUSTOM_MIRROR ||
  `https://github.com/yourorg/electron-gm/releases/download/v${ELECTRON_VERSION}/electron-v${ELECTRON_VERSION}-win32-x64.zip`;
```

### 步骤 4: 测试安装

```bash
# 本地测试
npm install
npm test

# 测试 Electron 是否可运行
npx electron --version
```

### 步骤 5: 发布到 npm

```bash
# 登录 npm（首次）
npm login

# 发布（如果使用 scoped package 需要 --access public）
npm publish --access public

# 或发布到私有 registry
npm publish --registry https://your-registry.com
```

## 配置说明

### package.json 关键字段

```json
{
  "name": "@gm/electron",           // 包名（需要修改为你的组织/用户名）
  "version": "43.3.0",              // 版本号
  "bin": {
    "electron": "cli.js"            // 提供 electron 命令
  },
  "scripts": {
    "postinstall": "node install.js" // 安装时自动下载二进制
  }
}
```

### 环境变量

用户可以通过环境变量自定义下载源：

```bash
export ELECTRON_CUSTOM_MIRROR=https://your-mirror.com/electron-v43.3.0-win32-x64.zip
npm install @gm/electron
```

## 更新版本

当有新的 Electron 构建时：

1. 更新版本号：
   ```bash
   npm version 43.3.1
   ```

2. 更新 CHANGELOG.md

3. 重新运行发布流程

## 多平台支持

当前仅支持 Windows x64。要添加其他平台：

1. 构建对应平台的 Electron
2. 修改 `install.js` 添加平台检测逻辑
3. 修改 `prepare-release.js` 支持多平台打包
4. 更新 `package.json` 的 `os` 和 `cpu` 字段

示例：
```json
{
  "os": ["win32", "darwin", "linux"],
  "cpu": ["x64", "arm64"]
}
```

## 常见问题

### Q: npm 包大小限制？
A: npm 对包大小没有硬性限制，但超过 100MB 会很慢。因此我们将二进制文件外部托管，npm 包只包含下载脚本。

### Q: 如何处理网络问题？
A: 支持镜像源配置，用户可以设置 `ELECTRON_CUSTOM_MIRROR` 环境变量。

### Q: 如何支持离线安装？
A: 用户可以手动下载 zip 文件，解压到 `node_modules/@gm/electron/dist/` 目录。

## 维护清单

- [ ] 定期更新到最新的 Electron 版本
- [ ] 监控下载服务器的可用性
- [ ] 回应用户 Issues
- [ ] 更新文档
- [ ] 保持与官方 Electron API 的兼容性

## 相关链接

- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Electron 官方文档](https://www.electronjs.org/)
- [Semantic Versioning](https://semver.org/)
