# Changelog

所有重要的变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [43.3.0] - 2026-09-23

### 新增

- 🚀 基于 Electron 43.3.0 官方版本
- ✨ Service Worker 预加载数据通过 EmbeddedWorkerStartParams 传递
- ✨ 在 CreateNewWindowReply 中携带嵌入器启动数据
- ✨ 为远程调试添加 ShouldUseBundledFrontendResources 委托
- 🔧 支持 Windows 链接器包装脚本的 GN 参数

### 修复

- 🐛 改进 Mac 遮挡检测器，忽略非遮挡窗口
- 🐛 修复 PGO 插桩构建的配置文件运行时解析
- 🐛 将 AllowUniversalAccessFromFileURLs 限制到 file: 源的代理分配
- 🐛 为 StoragePartitionImpl 添加 ReinitializeGeneratedCodeCacheContext
- 🐛 允许 DownloadManagerImpl 观察者列表的重入

### 变更

- ⚡ 在 Apple 目标上禁用 LLVM unroll-add-parallel-reductions 优化
- 📦 优化构建配置，提升编译性能

### 技术细节

**Chromium 版本**: 133.x  
**Node.js 版本**: 20.x  
**V8 版本**: 13.3

---

## 版本说明

### 自定义补丁列表

本版本包含以下来自上游的自定义提交：

1. `e4925b1d82` - fix: ignore non-occluding windows in the mac occlusion checker
2. `f8b50400c3` - build: disable LLVM unroll-add-parallel-reductions on Apple targets
3. `d0fba7bff6` - build: fix profile runtime resolution for PGO instrumented builds
4. `049c8f196f` - feat: deliver service worker preload data via EmbeddedWorkerStartParams
5. `f43f83e2b7` - feat: carry embedder startup data in CreateNewWindowReply
6. `be9498780a` - fix: add ReinitializeGeneratedCodeCacheContext to StoragePartitionImpl
7. `de3ba9ff01` - fix: constrain AllowUniversalAccessFromFileURLs to file: origins
8. `275224aeff` - fix: add ShouldUseBundledFrontendResources delegate for remote debugging
9. `162427cf0f` - build: gn arg to support linker wrapper script on windows
10. `1fd9aa0cd1` - fix: allow reentrancy on DownloadManagerImpl observer list

### 与官方版本的区别

| 功能 | 官方 Electron | @stevenzxs/electron |
|------|---------------|------------------|
| 基础 API | ✅ | ✅ |
| Service Worker 增强 | ❌ | ✅ |
| 窗口数据传递优化 | ❌ | ✅ |
| 文件访问安全增强 | ❌ | ✅ |
| 远程调试优化 | ❌ | ✅ |
| PGO 构建支持 | 部分 | ✅ 完整 |

---

## 升级指南

### 从官方 Electron 43.x 迁移

本版本完全兼容官方 Electron 43.x API，无需修改代码：

```bash
# 卸载官方版本
npm uninstall electron

# 安装自定义版本
npm install @stevenzxs/electron
```

### 破坏性变更

本版本无破坏性变更，可以无缝替换官方版本。

---

## 已知问题

- 目前仅支持 Windows x64 平台
- macOS 和 Linux 版本计划在后续版本发布

---

## 路线图

### v43.4.0 (计划中)
- [ ] 添加 macOS 支持
- [ ] 添加 Linux 支持
- [ ] 性能优化和内存使用改进

### v44.0.0 (计划中)
- [ ] 跟进 Electron 44.x 官方版本
- [ ] 更多企业级功能

---

[43.3.0]: https://github.com/stevenzxs/electron-gm/releases/tag/v43.3.0
