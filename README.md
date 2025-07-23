# 🧰 GitHub 仓库管理工具

> 一个轻量级的 GitHub 仓库管理工具，支持登录、浏览、上传、下载、删除等操作，并提供 GitHub Pages 托管、GitHub Actions 触发等高级功能。
---
## 这位[作者](https://github.com/xyz66882/GitHub-repository)是原作者，由于原作者的代码不支持在CloudFlare搭建，所以做了二次修改。

---
  <p>
    <a href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/create">
      <img src="https://deploy.workers.cloudflare.com/button" alt="点这里部署到Cloudflare Workers"/>
    </a>
  </p>


## 📋 功能列表

### 🔐 1. 用户认证
- GitHub Token 登录
- Token 本地存储（自动登录）
- 用户菜单（显示用户名 / 退出）

### 🗂 2. 仓库管理
- 查看仓库列表
- 创建新仓库（名称 / 描述 / 私有设置）
- 复刻仓库（通过 URL）
- 删除仓库

### 📁 3. 文件操作
- 浏览仓库目录结构（面包屑导航）
- 创建文件夹
- 上传文件（支持多文件）
- 下载文件（支持单个 / 批量下载为 ZIP）
- 删除文件 / 文件夹（支持单个 / 批量）
- 重命名文件
- 文件类型图标识别

### ⚙️ 4. 高级功能
- 静态网站托管（GitHub Pages 配置）
- 运行工作流（触发 GitHub Actions 工作流）
- 工作流进度监控
- CDN 链接生成（使用 jsDelivr 代理）

### 🧭 5. 其他实用功能
- 返回上级目录
- 刷新当前目录
- 仓库根目录快捷访问
- 路径递归快捷访问

---

## 🖼️ 效果图预览

<div align="center">
  <p><strong>未登录界面（电脑端）</strong></p>
  <img style="max-width:100%; height:auto;" src="https://github.com/user-attachments/assets/005d5f4f-f985-49a2-9992-39298da73ed8" alt="电脑未登录" />

  <p><strong>已登录界面（电脑端）</strong></p>
  <img style="max-width:100%; height:auto;" src="https://github.com/user-attachments/assets/89f7d150-cd39-41e6-970e-a13d96986999" alt="电脑界面" />

  <p><strong>移动端界面</strong></p>
  <div style="display: flex; flex-direction: row; gap: 15px; overflow-x: auto; padding: 10px; -webkit-overflow-scrolling: touch; white-space: nowrap; width: 100%;">
    <img style="width: 500px; height: auto; flex-shrink: 0;" src="https://github.com/user-attachments/assets/a8e1ef93-bf20-465b-80c5-0c42a31de31c" alt="手机界面" />
    <img style="width: 450px; height: auto; flex-shrink: 0;" src="https://github.com/user-attachments/assets/6772d950-9e81-4602-93e5-ea5af5e59a58" alt="手机壁纸设置" />
  </div>
</div>

---

## 🛠 技术实现

本工具完全基于 **GitHub API** 实现所有功能，结合前端二改美化，提供简洁直观的操作界面，适合开发者进行 GitHub 仓库的快速管理。
