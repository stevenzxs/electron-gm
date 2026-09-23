# 创建 GitHub Release 步骤

## 📦 文件准备完成

✅ **压缩包**: `electron-v43.3.0-win32-x64.zip` (135.71 MB)
✅ **校验和**: `electron-v43.3.0-win32-x64.zip.checksums.txt`
✅ **发布说明**: `RELEASE_NOTES.md`

**文件位置**: `D:\electron-gm\releases\`

---

## 🚀 创建 Release 步骤

### 方法 1: 通过浏览器（推荐）

1. **打开 GitHub Release 页面**:
   https://github.com/stevenzxs/electron-gm/releases/new

2. **填写信息**:
   - **Tag**: `v43.3.0`
   - **Release title**: `v43.3.0 - Custom Electron with Enhanced Features`
   - **Description**: 复制下方的发布说明

3. **上传文件**:
   - 拖拽或点击上传以下文件:
     * `D:\electron-gm\releases\electron-v43.3.0-win32-x64.zip`
     * `D:\electron-gm\releases\electron-v43.3.0-win32-x64.zip.checksums.txt`

4. **发布**:
   - 点击 "Publish release"

---

## 📝 发布说明内容

```markdown
# Electron GM v43.3.0

自定义增强版 Electron，基于官方 v43.3.0，包含企业级定制功能。

## 📥 下载

**Windows x64**: [electron-v43.3.0-win32-x64.zip](https://github.com/stevenzxs/electron-gm/releases/download/v43.3.0/electron-v43.3.0-win32-x64.zip)

**大小**: 135.71 MB (压缩后)

## 🔐 校验和

```
SHA256: 0c8dc858db04085f3a3c09e68128bece32cee40e087720cb65b49b36cac7f94e
MD5: 84d5764f511e63ab38f137d9744dd069
```

## 📦 安装方式

### 自动安装（推荐）

```bash
npm install @stevenzxs/electron
```

安装后会自动下载对应平台的二进制文件。

### 手动安装

如果自动下载失败：

1. 下载上面的 zip 文件
2. 解压到 `node_modules/@stevenzxs/electron/dist/`
3. 确保 `electron.exe` 有执行权限

## ✨ 主要特性

- ✅ 基于官方 Electron 43.3.0
- ✅ Service Worker 预加载数据增强
- ✅ 窗口启动数据传递优化
- ✅ 文件访问安全控制增强
- ✅ 远程调试支持改进
- ✅ PGO 优化构建

## 🔄 自定义补丁

本版本包含 10 个自定义补丁，详见 [CHANGELOG.md](https://github.com/stevenzxs/electron-gm/blob/main/CHANGELOG.md)

## 📋 系统要求

- **操作系统**: Windows 10/11
- **架构**: x64
- **Node.js**: >= 18.0.0

## 🔗 相关链接

- [GitHub 仓库](https://github.com/stevenzxs/electron-gm)
- [使用文档](https://github.com/stevenzxs/electron-gm#readme)
- [问题反馈](https://github.com/stevenzxs/electron-gm/issues)

## 📊 版本对应

| @stevenzxs/electron | Electron | Chromium | Node.js | V8   |
|---------------------|----------|----------|---------|------|
| 43.3.0             | 43.3.0   | 133.x    | 20.x    | 13.3 |
```

---

## 🧪 发布后验证

Release 创建成功后，测试安装：

```bash
# 新建测试目录
mkdir test-electron-gm
cd test-electron-gm
npm init -y

# 安装
npm install @stevenzxs/electron

# 测试
npx electron --version
# 应输出: v43.3.0
```

---

## 📌 下一步

Release 创建后：

1. ✅ 更新 README.md 添加安装徽章
2. ✅ 发布到 npm: `npm publish --access public`
3. ✅ 在社区分享发布公告
