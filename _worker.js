// This is the complete script to deploy to Cloudflare Workers.
// It serves the provided HTML file for any GET request to the root path.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // We only want to serve the HTML for the root path.
    // This prevents the worker from trying to handle other assets like images from CDNs.
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // For any other path, return a simple 404 Not Found response.
    // This is good practice, though in reality the browser will likely request
    // assets from CDNs, which won't hit your worker anyway.
    return new Response('Not Found', { status: 404 });
  },
};

// The entire content of your index.html file is placed inside this template literal.
const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Manage - GitHub 仓库管理工具</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* 默认主题（日间模式）变量 */
        :root {
            --primary-color: #4f46e5; /* Indigo-600 */

            /* 背景渐变色 */
            --bg-start: #f3f4f6;
            --bg-end: #e5e7eb;

            /* 毛玻璃效果 */
            --glass-bg: rgba(255, 255, 255, 0.15);
            --glass-border: rgba(255, 255, 255, 0.2);
            --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            --glass-blur: blur(12px);

            /* 文本颜色 - 已修改为纯黑 */
            --text-primary: #000000; /* Pure Black */
            --text-secondary: #000000; /* Pure Black */

            /* 对话框背景和边框 */
            --dialog-bg: rgba(255, 255, 255, 0.98);
            --dialog-border: rgba(0, 0, 0, 0.08);
            --dialog-input-bg: rgba(255, 255, 255, 0.95);

            /* 滚动条 */
            --scrollbar-track: rgba(255, 255, 255, 0.2);
            --scrollbar-thumb: rgba(79, 70, 229, 0.5);
            --scrollbar-thumb-hover: rgba(79, 70, 229, 0.7);

            /* 背景图片相关 */
            --body-bg-image: none;
            --body-bg-size: cover;
            --body-bg-position: center;
            --body-bg-repeat: no-repeat;
        }

        /* 夜间模式 */
        body.dark-mode {
            --bg-start: #1a202c; /* Darker background */
            --bg-end: #2d3748;

            --glass-bg: rgba(0, 0, 0, 0.3); /* Darker glass effect */
            --glass-border: rgba(255, 255, 255, 0.1);
            --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);

            --text-primary: #e2e8f0; /* Light text */
            --text-secondary: var(--text-primary); /* Lighter secondary text - CHANGED TO MATCH PRIMARY */

            --dialog-bg: rgba(45, 55, 72, 0.98); /* Darker dialog */
            --dialog-border: rgba(255, 255, 255, 0.1);
            --dialog-input-bg: rgba(60, 70, 85, 0.95);

            --scrollbar-track: rgba(0, 0, 0, 0.3);
            --scrollbar-thumb: rgba(79, 70, 229, 0.7);
            --scrollbar-thumb-hover: rgba(79, 70, 229, 0.9);
        }

        /* 统一日间模式下的通用文本颜色 */
        body.light-mode .text-gray-800,
        body.light-mode .text-gray-700,
        body.light-mode .text-gray-600,
        body.light-mode .text-gray-500 {
            color: var(--text-primary) !important;
        }

        /* 统一夜间模式下的通用文本颜色 */
        body.dark-mode .text-gray-800,
        body.dark-mode .text-gray-700,
        body.dark-mode .text-gray-600,
        body.dark-mode .text-gray-500 {
            color: var(--text-primary) !important;
        }

        /* 统一夜间模式下的GitHub图标颜色 */
        body.dark-mode #auth-screen .fab.fa-github,
        body.dark-mode .file-icon.fab.fa-github,
        body.dark-mode .breadcrumb-item .fab.fa-github {
            color: var(--text-primary) !important;
        }

        .top-nav {
            position: relative;
            z-index: 1000;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--body-bg-image) var(--body-bg-repeat) var(--body-bg-position) / var(--body-bg-size), linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%);
            color: var(--text-primary);
            min-height: 100vh;
            padding-bottom: 100px;
            margin: 0;
            background-attachment: fixed;
            transition: background 0.3s ease, color 0.3s ease; /* Smooth transition for theme changes */
        }

        /* 毛玻璃效果 */
        .glass {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-panel {
            background: var(--glass-bg); /* Using the new variable */
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border); /* Using the new variable */
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 按钮样式 */
        .glass-btn {
            background: var(--glass-bg); /* Using the new variable */
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--glass-border); /* Using the new variable */
            box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
            cursor: pointer;
            color: var(--text-primary);
            font-weight: 500;
        }

        .glass-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
            background: color-mix(in srgb, var(--glass-bg) 80%, white); /* A bit lighter version of glass-bg */
        }

        .glass-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.1);
        }

        .glass-btn-primary {
            background: rgba(79, 70, 229, 0.8);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .glass-btn-primary:hover {
            background: rgba(79, 70, 229, 0.9);
        }

        /* 输入框样式 */
        .glass-input {
            background: var(--glass-bg); /* Using the new variable */
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--glass-border); /* Using the new variable */
            border-radius: 12px;
            padding: 12px 16px;
            color: var(--text-primary);
            transition: all 0.3s ease;
            width: 100%;
        }

        .glass-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
            background: color-mix(in srgb, var(--glass-bg) 80%, white); /* A bit lighter version of glass-bg */
        }

        .glass-input::placeholder {
            color: var(--text-secondary); /* Using the new variable */
        }

        /* 文件列表项 */
        .file-item {
            background: var(--glass-bg); /* Using the new variable */
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--glass-border); /* Using the new variable */
            border-radius: 12px;
            transition: all 0.3s ease;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
        }

        .file-item:hover {
            background: color-mix(in srgb, var(--glass-bg) 80%, white); /* A bit lighter version of glass-bg */
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.1);
        }

        .file-item.selected {
            background: rgba(79, 70, 229, 0.2);
            border-color: rgba(79, 70, 229, 0.3);
        }

        /* 文件类型图标 */
        .file-icon {
            margin-right: 12px;
            filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
        }

        .folder-icon {
            color: #f59e0b;
        }

        .archive-icon {
            color: #6366f1;
        }

        .image-icon {
            color: #ec4899;
        }

        .code-icon {
            color: #3b82f6;
        }

        .text-icon {
            color: #64748b;
        }

        /* 工具栏 */
        .toolbar {
            background: var(--glass-bg); /* Using the new variable */
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border); /* Using the new variable */
            box-shadow: var(--glass-shadow);
            border-radius: 24px;
            transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .toolbar.hidden {
            transform: translateY(100px);
            opacity: 0;
            pointer-events: none;
        }

        /* 对话框 */
        .dialog-overlay {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 999;
        }

        .dialog-content {
            background: var(--dialog-bg);
            border-radius: 10px;
            padding: 14px 16px;
            width: 85%;
            max-width: 340px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* 标题 */
        .dialog-content h3 {
            font-size: 1.1rem;
            margin-bottom: 0.6rem;
            color: var(--text-primary);
        }

        /* 输入框 */
        .dialog-input {
            background: var(--dialog-input-bg);
            border: 1px solid var(--dialog-border);
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 0.85rem;
            height: 36px;
            margin-bottom: 0.6rem;
            color: var(--text-primary);
            transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }

        .dialog-input::placeholder {
            color: var(--text-secondary);
        }

        /* 按钮容器 */
        .dialog-buttons {
            margin-top: 0.8rem;
            gap: 6px;
        }

        /* 按钮 */
        .dialog-btn {
            padding: 6px 12px;
            font-size: 0.85rem;
            border-radius: 5px;
        }

        /* 移动端适配 */
        @media (max-width: 480px) {
            .dialog-content {
                padding: 12px 14px;
                max-width: 300px;
            }
            
            .dialog-input {
                padding: 7px 10px;
                height: 34px;
            }
            
            .dialog-btn {
                padding: 5px 10px;
            }
         /* 全局强制换行 */
       * {
        word-wrap: break-word !important;
        word-break: break-all !important;
        white-space: normal !important;
        /* 禁止文本选择，防止长按复制 */
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important
        }
        }

        /* 加载动画 */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }

        /* 面包屑导航 */
        .breadcrumb {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        .breadcrumb-item {
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: color 0.2s;
            color: var(--text-primary);
        }

        .breadcrumb-item:hover {
            color: var(--primary-color);
        }

        .breadcrumb-separator {
            margin: 0 8px;
            color: var(--text-secondary);
        }

        /* 上下文菜单 */
        .context-menu {
            position: fixed; /* Changed from absolute to fixed for better positioning with clientX/Y */
            z-index: 1000;
            background: var(--dialog-bg); /* Using dialog background for consistency */
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            overflow: hidden;
            transform: scale(0.95);
            opacity: 0;
            transition: transform 0.2s ease, opacity 0.2s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            pointer-events: none;
            display: none; /* Hidden by default, shown by JS */
        }

        .context-menu.visible {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        .context-menu-item {
            padding: 10px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background 0.2s;
            color: var(--text-primary);
        }

        .context-menu-item:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .context-menu-divider {
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
            margin: 4px 0;
        }

        /* 批量操作工具栏 */
        .batch-toolbar {
            position: fixed;
            bottom: 107px; /* 距离底部工具栏间距越大间距越大 */
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 8px;
            background: rgba(79, 70, 229, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
            border-radius: 24px;
            padding: 8px 16px;
            color: white;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1000;
            margin: 0 auto;
            width: fit-content;
            max-width: 90%;
        }

        .batch-toolbar.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .batch-toolbar-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 12px;
            padding: 8px 12px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: all 0.2s;
        }

        .batch-toolbar-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .batch-count {
            margin-right: 12px;
            display: flex;
            align-items: center;
        }

        /* 用户菜单 */
        .user-menu {
            position: relative;
            display: inline-block;
        }

        /* 修改 user-menu-btn 样式，移除毛玻璃效果和边框 */
        #user-menu-btn {
            background: none;
            border: none;
            box-shadow: none;
            padding: 0; /* Remove default padding from glass-btn */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 32px; /* Explicitly set size */
            height: 32px; /* Explicitly set size */
            border-radius: 50%; /* Make it circular */
            overflow: hidden; /* Hide overflow for circular image */
            transition: transform 0.2s ease;
        }

        #user-menu-btn:hover {
            transform: scale(1.05);
        }

        #user-menu-btn img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Ensure image covers the area */
            border-radius: 50%; /* Ensure image itself is circular */
        }

        .user-menu-content {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 8px;
            background: var(--dialog-bg); /* Using dialog background for consistency */
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border); /* Using glass border for consistency */
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
            border-radius: 12px;
            min-width: 180px;
            z-index: 1100;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.2s ease;
            pointer-events: none;

        }

        .user-menu-content.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .user-menu-item {
            padding: 10px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: background 0.2s;
            color: var(--text-primary);
        }

        .user-menu-item:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .user-menu-item i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }

        .user-menu-item img { /* Style for avatar inside user-info */
            width: 24px; /* w-6 */
            height: 24px; /* h-6 */
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px; /* Changed from 8px to 10px for consistency with 'i' */
        }

        .user-menu-divider {
            height: 1px;
            background: rgba(0, 0, 0, 0.1);
            margin: 4px 0;
        }

        /* 响应式调整 */
        @media (max-width: 640px) {
            .glass {
                border-radius: 12px;
            }

            .file-item {
                padding: 12px;
            }

            .toolbar {
                padding: 8px;
                border-radius: 20px;
            }

            .breadcrumb {
                font-size: 14px;
            }

            .batch-toolbar {
                bottom: 70px;
                padding: 6px 12px;
            }

            .batch-toolbar-btn {
                padding: 6px 8px;
                font-size: 14px;
            }
        }

        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        /* 构建状态提示 */
        .build-status {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            max-width: 300px;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .build-status.hidden {
            transform: translateY(-20px);
            opacity: 0;
            pointer-events: none;
        }

        /* 构建APP菜单项样式 */
        .context-build-app {
            color: #3b82f6; /* 蓝色表示操作项 */
        }
        .workflow-icon {
            color: #8b5cf6; /* 紫色图标 */
        }

        /* 固定顶栏 */
        .top-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            margin-bottom: 0 !important;
            z-index: 1000;
        }

        /* 主界面顶部内边距 */
        #main-screen {
            padding-top: 5rem;
        }

        /* 新增的背景图片设置对话框预览 */
        #bg-image-preview {
            width: 100%;
            height: 120px;
            background-size: cover;
            background-position: center;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid var(--dialog-border);
            background-color: var(--dialog-input-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-size: 0.9rem;
            text-align: center;
            overflow: hidden; /* Ensure image doesn't overflow border-radius */
        }
    </style>
</head>
<body class="min-h-screen p-4 md:p-6 light-mode">
    <div id="auth-fixed-controls" class="fixed top-4 right-4 z-2000 flex items-center space-x-3">
        <button id="auth-day-night-toggle-btn" class="glass-btn p-2" title="切换日间/夜间模式">
            <i class="fas fa-sun text-yellow-500"></i>
        </button>
        <button id="auth-bg-image-settings-btn" class="glass-btn p-2" title="自定义背景图片">
            <i class="fas fa-image text-purple-500"></i>
        </button>
    </div>

    <div id="auth-screen" class="flex flex-col items-center justify-center min-h-screen">
        <div class="glass-panel p-8 w-full max-w-md mx-auto">
            <div class="text-center mb-8">
                <i class="fab fa-github text-5xl mb-4" style="color: var(--primary-color);"></i>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">GitHub Manage</h1>
                <p class="text-gray-600">GitHub 仓库管理工具</p>
            </div>

            <div class="mb-6">
                <label class="block text-gray-700 mb-2 font-medium">GitHub 个人访问令牌</label>
                <input type="text" id="github-token" placeholder="输入您的 GitHub Token"
                       class="glass-input mb-1">
                <p id="token-error" class="text-red-500 text-sm hidden"></p>
            </div>

            <button id="auth-btn" class="glass-btn glass-btn-primary w-full py-3 font-medium flex items-center justify-center">
                <span id="auth-btn-text">登录</span>
                <i id="auth-spinner" class="fas fa-spinner fa-spin ml-2 hidden"></i>
            </button>

            <div class="mt-8 text-sm text-gray-600">
                <p class="font-medium mb-2">GitHub令牌的获取方法：</p>
                <ol class="list-decimal pl-5 space-y-1">
                    <li>打开<a href="https://github.com/" target="_blank" class="text-blue-500 hover:underline">GitHub官网</a>，登录你的账号；</li>
                    <li>访问 <a href="https://github.com/settings/tokens" target="_blank" class="text-blue-500 hover:underline">开发者设置</a>；</li>
                    <li>创建新的个人访问令牌；</li>
                    <li>勾选 repo 权限；</li>
                    <li>复制生成的Token在上面粘贴。</li>
                </ol>
            </div>
        </div>
    </div>

    <div id="main-screen" class="hidden flex-col h-full max-w-6xl mx-auto w-full">
        <div class="top-nav glass-panel flex items-center p-4 mb-4">
            <div id="current-path" class="text-lg font-semibold truncate flex-1">
                <div class="breadcrumb">
                    <div class="breadcrumb-item" onclick="loadRepositories()">
                        <i class="fab fa-github mr-1"></i>
                        <span>我的仓库</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center space-x-3">
                <button id="day-night-toggle-btn" class="glass-btn p-2" title="切换日间/夜间模式">
                    <i class="fas fa-sun text-yellow-500"></i>
                </button>
                <button id="bg-image-settings-btn" class="glass-btn p-2" title="自定义背景图片">
                    <i class="fas fa-image text-purple-500"></i>
                </button>

                <div class="user-menu">
                    <div id="user-menu-btn" class="user-menu-btn">
                        <img id="user-avatar-btn" src="" alt="User Avatar">
                    </div>
                    <div id="user-menu-content" class="user-menu-content">
                        <div id="user-info" class="user-menu-item">
                            <img id="user-avatar-info" src="" alt="User Avatar">
                            <span id="username"></span>
                        </div>
                        <div class="user-menu-divider"></div>
                        <div id="logout-btn" class="user-menu-item">
                            <i class="fas fa-sign-out-alt text-red-500"></i>
                            <span class="text-red-500">退出登录</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-[86px]"> <div id="loading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>

            <div id="file-list" class="grid gap-3 hidden">
                </div>

            <div id="empty-state" class="hidden flex flex-col items-center justify-center h-64 text-gray-500">
                <i class="fas fa-folder-open text-5xl mb-4 opacity-50"></i>
                <p class="text-lg">当前目录为空</p>
            </div>
        </div>

        <div id="toolbar" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 p-3 toolbar">
            <button id="back-btn" class="glass-btn p-3 hidden" title="返回">
                <i class="fas fa-arrow-left text-indigo-600"></i>
            </button>
            <button id="refresh-btn" class="glass-btn p-3" title="刷新">
                <i class="fas fa-sync-alt text-emerald-500"></i>
            </button>
            <button id="new-repo-btn" class="glass-btn p-3" title="新建仓库">
                <i class="fas fa-plus text-blue-500"></i>
            </button>
            <button id="fork-repo-btn" class="glass-btn p-3 hidden" title="复刻仓库">
                <i class="fas fa-code-branch text-purple-500"></i>
            </button>
            <button id="new-folder-btn" class="glass-btn p-3 hidden" title="新建文件夹">
                <i class="fas fa-folder-plus text-amber-500"></i>
            </button>
            <button id="upload-btn" class="glass-btn p-3 hidden" title="上传文件">
                <i class="fas fa-upload text-violet-500"></i>
            </button>
            <button id="select-btn" class="glass-btn p-3 hidden" title="选择文件">
                <i class="fas fa-check-square text-blue-500"></i>
            </button>
            <button id="sync-branch-btn" class="glass-btn p-3 hidden" title="同步分支">
                <i class="fas fa-code-merge text-blue-500"></i>
            </button>
            <button id="static-site-btn" class="glass-btn p-3 hidden" title="托管静态网站">
                <i class="fas fa-globe text-green-500"></i>
            </button>
        </div>

        <div id="batch-toolbar" class="batch-toolbar">
            <div class="batch-count">
                <i class="fas fa-check-circle mr-2"></i>
                <span id="selected-count">0</span> 已选
            </div>
            <button id="batch-select-all-btn" class="batch-toolbar-btn" title="全选/取消全选">
                <i class="fas fa-check-double"></i>
                <span id="batch-select-all-text">全选</span>
            </button>
            <button id="batch-download-btn" class="batch-toolbar-btn" title="下载选中文件">
                <i class="fas fa-download"></i>
                <span>下载</span>
            </button>
            <button id="batch-delete-btn" class="batch-toolbar-btn" title="删除选中文件">
                <i class="fas fa-trash"></i>
                <span>删除</span>
            </button>
            <button id="batch-sync-btn" class="batch-toolbar-btn hidden" title="同步选中仓库">
                <i class="fas fa-sync-alt"></i>
                <span>同步</span>
            </button>
            <button id="batch-cancel-btn" class="batch-toolbar-btn" title="取消选择">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>

    <div id="toast" class="fixed bottom-[120px] left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 rounded-full opacity-0 transition-opacity duration-300 text-sm font-medium">
        </div>

    <div id="confirm-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="confirm-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="confirm-title" class="text-xl font-bold mb-2">确认删除</h3>
            <p id="confirm-message" class="text-gray-700 mb-6">您确定要删除这个文件吗？此操作不可撤销。</p>
            <div id="confirm-buttons" class="flex justify-end gap-3">
                <button id="confirm-no" class="glass-btn px-4 py-2">取消</button>
                <button id="confirm-yes" class="glass-btn glass-btn-primary px-4 py-2">确认删除</button>
            </div>
        </div>
    </div>

    <div id="new-folder-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="new-folder-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="new-folder-title" class="text-xl font-bold mb-2">新建文件夹</h3>
            <input type="text" id="new-folder-name" placeholder="文件夹名称" class="glass-input mb-4">
            <div id="new-folder-buttons" class="flex justify-end gap-3">
                <button id="new-folder-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="new-folder-create" class="glass-btn glass-btn-primary px-4 py-2">创建</button>
            </div>
        </div>
    </div>

    <div id="new-repo-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="new-repo-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="new-repo-title" class="text-xl font-bold mb-2">新建仓库</h3>
            <input type="text" id="new-repo-name" placeholder="仓库名称" class="glass-input mb-3">
            <input type="text" id="new-repo-desc" placeholder="仓库描述 (可选)" class="glass-input mb-3">
            <div class="flex items-center mb-4">
                <input type="checkbox" id="new-repo-private" class="mr-2">
                <label for="new-repo-private">私有仓库</label>
            </div>
            <div id="new-repo-buttons" class="flex justify-end gap-3">
                <button id="new-repo-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="new-repo-create" class="glass-btn glass-btn-primary px-4 py-2">创建</button>
            </div>
        </div>
    </div>

    <div id="fork-repo-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="fork-repo-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="fork-repo-title" class="text-xl font-bold mb-2">复刻仓库</h3>
            <input type="text" id="fork-repo-url" placeholder="输入GitHub仓库URL" class="glass-input mb-4">
            <div id="fork-repo-buttons" class="flex justify-end gap-3">
                <button id="fork-repo-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="fork-repo-confirm" class="glass-btn glass-btn-primary px-4 py-2">复刻</button>
            </div>
        </div>
    </div>

    <div id="upload-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="upload-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="upload-title" class="text-xl font-bold mb-2">上传文件</h3>
            <input type="file" id="file-input" class="glass-input mb-4" multiple>
            <div id="upload-buttons" class="flex justify-end gap-3">
                <button id="upload-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="upload-file" class="glass-btn glass-btn-primary px-4 py-2">上传</button>
            </div>
        </div>
    </div>

    <div id="context-menu" class="context-menu">
        <div id="context-open" class="context-menu-item">
            <i class="fas fa-folder-open"></i>
            <span>打开</span>
        </div>
        <div id="context-download" class="context-menu-item">
            <i class="fas fa-download"></i>
            <span>下载</span>
        </div>
        <div id="context-rename" class="context-menu-item">
            <i class="fas fa-edit"></i>
            <span>重命名</span>
        </div>
        <div id="context-copy-link" class="context-menu-item">
            <i class="fas fa-link"></i>
            <span>复制链接</span>
        </div>
        <div id="context-copy-proxy-link" class="context-menu-item">
            <i class="fas fa-share-alt"></i>
            <span>复制代理链接</span>
        </div>
        <div class="context-menu-divider"></div>
        <div id="context-enable-pages" class="context-menu-item">
            <i class="fas fa-globe text-green-500"></i>
            <span class="text-green-500">启用静态网站</span>
        </div>
        <div id="context-disable-pages" class="context-menu-item">
            <i class="fas fa-ban text-red-500"></i>
            <span class="text-red-500">禁用静态网站</span>
        </div>
        <div id="context-build-app" class="context-menu-item context-build-app">
            <i class="fas fa-hammer"></i>
            <span>运行工作流</span>
        </div>
        <div id="context-sync-branch" class="context-menu-item">
            <i class="fas fa-code-merge text-blue-500"></i>
            <span>同步分支</span>
        </div>
        <div class="context-menu-divider"></div>
        <div id="context-delete" class="context-menu-item">
            <i class="fas fa-trash text-red-500"></i>
            <span class="text-red-500">删除</span>
        </div>
    </div>

    <div id="static-site-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="static-site-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="static-site-title" class="text-xl font-bold mb-4">静态网站配置</h3>

            <div class="mb-4">
                <label class="block text-gray-700 mb-2 font-medium">分支</label>
                <select id="pages-branch" class="glass-input mb-1">
                    <option value="main">main</option>
                    <option value="master">master</option>
                    <option value="gh-pages">gh-pages</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 mb-2 font-medium">目录</label>
                <select id="pages-folder" class="glass-input mb-1">
                    <option value="/">根目录</option>
                    <option value="/docs">docs 文件夹</option>
                </select>
            </div>

            <div id="pages-status" class="mb-4 hidden">
                <div class="flex items-center">
                    <i class="fas fa-circle text-green-500 mr-2"></i>
                    <span class="font-medium">网站已启用</span>
                </div>
                <div class="mt-2">
                    <span class="sm">访问地址: </span>
                    <a id="pages-url" href="#" target="_blank" class="text-blue-500 text-sm hover:underline"></a>
                </div>
            </div>

            <div id="static-site-buttons" class="flex justify-end gap-3">
                <button id="static-site-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="static-site-enable" class="glass-btn glass-btn-primary px-4 py-2">启用</button>
                <button id="static-site-disable" class="glass-btn px-4 py-2 bg-red-500 text-white">禁用</button>
            </div>
        </div>
    </div>

    <div id="build-status" class="build-status glass-panel p-4 hidden">
        <div class="flex items-center mb-2">
            <i id="build-icon" class="fas fa-cog animate-spin text-blue-500 mr-2"></i>
            <h3 class="font-semibold">构建状态</h3>
            <button id="close-build-status" class="ml-auto text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div id="build-message" class="text-sm"></div>
        <div id="build-progress" class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div id="progress-bar" class="bg-blue-500 h-2 rounded-full" style="width: 0%"></div>
            </div>
            <div id="progress-text" class="text-xs text-right mt-1">0%</div>
        </div>
    </div>

    <div id="bg-settings-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="bg-settings-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 class="text-xl font-bold mb-4">背景图片设置</h3>

            <div id="bg-image-preview" class="mb-4">
                <span id="bg-preview-text">图片预览</span>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 mb-2 font-medium">图片 URL</label>
                <input type="url" id="bg-image-url" placeholder="输入图片链接" class="glass-input">
            </div>

            <div class="flex justify-end gap-3">
                <button id="bg-image-reset" class="glass-btn px-4 py-2">重置为默认</button>
                <button id="bg-image-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="bg-image-apply" class="glass-btn glass-btn-primary px-4 py-2">应用</button>
            </div>
        </div>
    </div>

    <div id="sync-branch-dialog" class="fixed inset-0 z-50 dialog-overlay flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
        <div id="sync-branch-content" class="dialog-content p-6 rounded-xl w-full max-w-md transform scale-90 transition-transform duration-300">
            <h3 id="sync-branch-title" class="text-xl font-bold mb-2">同步分支</h3>
            <p id="sync-branch-message" class="text-gray-700 mb-6">您确定要将上游仓库的默认分支同步到当前仓库的 <span id="sync-target-branch" class="font-semibold"></span> 分支吗？</p>
            <div id="sync-branch-buttons" class="flex justify-end gap-3">
                <button id="sync-branch-cancel" class="glass-btn px-4 py-2">取消</button>
                <button id="sync-branch-confirm" class="glass-btn glass-btn-primary px-4 py-2">确认同步</button>
            </div>
        </div>
    </div>

    <script>
        // 全局状态
        let currentRepo = '';
        let currentPath = '';
        let currentFiles = []; // This will hold the items currently displayed (repos or files)
        let githubToken = '';
        let fileToDelete = null; // Used for single/batch delete and batch sync confirmation
        let selectedFiles = new Set();
        let contextMenuTarget = null;
        let currentUser = null;
        let buildTimer = null;
        let buildStatus = null;
        let activeRepoForPages = ''; // 新增：用于 Pages 操作的目标仓库
        let defaultBranchOfCurrentRepo = ''; // 新增：用于存储当前仓库的默认分支

        // 新增：用于存储同步分支对话框的目标仓库信息
        let repoToSync = null;

        // 滚动相关变量
        let scrollTimeout;
        let lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        let isScrolling = false;
        const SCROLL_THRESHOLD = 5; // 滚动阈值，避免微小滚动触发
        const SCROLL_DELAY = 100; // 滚动停止后显示工具栏的延迟

        // 新增：默认背景图片和本地存储键
        const DEFAULT_BG_IMAGE = 'https://bing.img.run/uhd.php';
        const LOCAL_STORAGE_BG_KEY = 'github_mgr_bg_image';
        const LOCAL_STORAGE_THEME_KEY = 'github_mgr_theme';

        // DOM 元素
        const forkRepoBtn = document.getElementById('fork-repo-btn');
        const forkRepoDialog = document.getElementById('fork-repo-dialog');
        const forkRepoUrl = document.getElementById('fork-repo-url');
        const forkRepoConfirm = document.getElementById('fork-repo-confirm');
        const forkRepoCancel = document.getElementById('fork-repo-cancel');
        const authScreen = document.getElementById('auth-screen');
        const mainScreen = document.getElementById('main-screen');
        const authBtn = document.getElementById('auth-btn');
        const authBtnText = document.getElementById('auth-btn-text');
        const authSpinner = document.getElementById('auth-spinner');
        const githubTokenInput = document.getElementById('github-token');
        const tokenError = document.getElementById('token-error');
        const backBtn = document.getElementById('back-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const currentPathElement = document.getElementById('current-path');
        const fileListElement = document.getElementById('file-list');
        const loadingElement = document.getElementById('loading');
        const emptyStateElement = document.getElementById('empty-state');
        const toolbar = document.getElementById('toolbar');
        const uploadBtn = document.getElementById('upload-btn');
        const newFolderBtn = document.getElementById('new-folder-btn');
        const newRepoBtn = document.getElementById('new-repo-btn');
        const selectBtn = document.getElementById('select-btn');
        const toastElement = document.getElementById('toast');
        const confirmDialog = document.getElementById('confirm-dialog');
        const confirmTitle = document.getElementById('confirm-title');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmYes = document.getElementById('confirm-yes');
        const confirmNo = document.getElementById('confirm-no');
        const newFolderDialog = document.getElementById('new-folder-dialog');
        const newFolderName = document.getElementById('new-folder-name');
        const newFolderCreate = document.getElementById('new-folder-create');
        const newFolderCancel = document.getElementById('new-folder-cancel');
        const newRepoDialog = document.getElementById('new-repo-dialog');
        const newRepoName = document.getElementById('new-repo-name');
        const newRepoDesc = document.getElementById('new-repo-desc');
        const newRepoPrivate = document.getElementById('new-repo-private');
        const newRepoCreate = document.getElementById('new-repo-create');
        const newRepoCancel = document.getElementById('new-repo-cancel');
        const uploadDialog = document.getElementById('upload-dialog');
        const fileInput = document.getElementById('file-input');
        const uploadFile = document.getElementById('upload-file');
        const uploadCancel = document.getElementById('upload-cancel');
        const contextMenu = document.getElementById('context-menu');
        const contextOpen = document.getElementById('context-open');
        const contextDownload = document.getElementById('context-download');
        const contextRename = document.getElementById('context-rename');
        const contextCopyLink = document.getElementById('context-copy-link');
        const contextCopyProxyLink = document.getElementById('context-copy-proxy-link');
        const contextDelete = document.getElementById('context-delete');
        const contextEnablePages = document.getElementById('context-enable-pages');
        const contextDisablePages = document.getElementById('context-disable-pages'); // New DOM element
        const contextBuildApp = document.getElementById('context-build-app');
        const batchToolbar = document.getElementById('batch-toolbar');
        const selectedCount = document.getElementById('selected-count');
        const batchDownloadBtn = document.getElementById('batch-download-btn');
        const batchDeleteBtn = document.getElementById('batch-delete-btn');
        const batchCancelBtn = document.getElementById('batch-cancel-btn');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userMenuContent = document.getElementById('user-menu-content');
        const usernameElement = document.getElementById('username');
        const logoutBtn = document.getElementById('logout-btn');
        const staticSiteBtn = document.getElementById('static-site-btn');
        const staticSiteDialog = document.getElementById('static-site-dialog');
        const pagesBranch = document.getElementById('pages-branch');
        const pagesFolder = document.getElementById('pages-folder');
        const pagesStatus = document.getElementById('pages-status');
        const pagesUrl = document.getElementById('pages-url');
        const staticSiteEnable = document.getElementById('static-site-enable');
        const staticSiteDisable = document.getElementById('static-site-disable'); // New: Disable button
        const staticSiteCancel = document.getElementById('static-site-cancel');
        const buildStatusEl = document.getElementById('build-status');
        const buildIcon = document.getElementById('build-icon');
        const buildMessage = document.getElementById('build-message');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const closeBuildStatus = document.getElementById('close-build-status');

        // 新增DOM元素 (主界面)
        const dayNightToggleBtn = document.getElementById('day-night-toggle-btn');
        const bgImageSettingsBtn = document.getElementById('bg-image-settings-btn');
        const bgSettingsDialog = document.getElementById('bg-settings-dialog');
        const bgImageUrlInput = document.getElementById('bg-image-url');
        const bgImagePreview = document.getElementById('bg-image-preview');
        const bgPreviewText = document.getElementById('bg-preview-text');
        const bgImageApplyBtn = document.getElementById('bg-image-apply');
        const bgImageResetBtn = document.getElementById('bg-image-reset');
        const bgImageCancelBtn = document.getElementById('bg-image-cancel');

        // 新增DOM元素 (未登录界面)
        const authFixedControls = document.getElementById('auth-fixed-controls');
        const authDayNightToggleBtn = document.getElementById('auth-day-night-toggle-btn');
        const authBgImageSettingsBtn = document.getElementById('auth-bg-image-settings-btn');

        // 新增DOM元素 (用户头像)
        const userAvatarBtn = document.getElementById('user-avatar-btn');
        const userAvatarInfo = document.getElementById('user-avatar-info');

        // 新增同步分支相关DOM元素
        const syncBranchBtn = document.getElementById('sync-branch-btn');
        const contextSyncBranch = document.getElementById('context-sync-branch');
        const syncBranchDialog = document.getElementById('sync-branch-dialog');
        const syncBranchConfirm = document.getElementById('sync-branch-confirm');
        const syncBranchCancel = document.getElementById('sync-branch-cancel');
        const syncTargetBranchSpan = document.getElementById('sync-target-branch');
        const batchSyncBtn = document.getElementById('batch-sync-btn'); // 新增批量同步按钮DOM

        // 新增全选按钮DOM元素
        const batchSelectAllBtn = document.getElementById('batch-select-all-btn');
        const batchSelectAllText = document.getElementById('batch-select-all-text');

        // 文件类型图标映射
        const fileTypeIcons = {

            // 工作流文件
            yml: 'fas fa-gears workflow-icon',
            yaml: 'fas fa-gears workflow-icon',
            // 压缩文件
            zip: 'fas fa-file-archive archive-icon',
            rar: 'fas fa-file-archive archive-icon',
            '7z': 'fas fa-file-archive archive-icon',
            tar: 'fas fa-file-archive archive-icon',
            gz: 'fas fa-file-archive archive-icon',
            bz2: 'fas fa-file-archive archive-icon',
            xz: 'fas fa-file-archive archive-icon',
            lz: 'fas fa-file-archive archive-icon',
            dmg: 'fas fa-file-archive archive-icon',
            iso: 'fas fa-file-archive archive-icon',

            // 可执行文件
            exe: 'fas fa-file-code exe-icon',
            msi: 'fas fa-file-code exe-icon',
            app: 'fas fa-file-code exe-icon',
            apk: 'fas fa-file-code exe-icon',
            deb: 'fas fa-file-code exe-icon',
            rpm: 'fas fa-file-code exe-icon',
            bat: 'fas fa-file-code exe-icon',
            cmd: 'fas fa-file-code exe-icon',

            // 图片
            png: 'fas fa-file-image image-icon',
            jpg: 'fas fa-file-image image-icon',
            jpeg: 'fas fa-file-image image-icon',
            gif: 'fas fa-file-image image-icon',
            svg: 'fas fa-file-image image-icon',
            webp: 'fas fa-file-image image-icon',
            ico: 'fas fa-file-image image-icon',
            bmp: 'fas fa-file-image image-icon',
            tiff: 'fas fa-file-image image-icon',
            psd: 'fas fa-file-image image-icon',
            ai: 'fas fa-file-image image-icon',

            // 代码文件
            css: 'fas fa-file-code code-icon',
            scss: 'fas fa-file-code code-icon',
            less: 'fas fa-file-code code-icon',
            js: 'fas fa-file-code code-icon',
            jsx: 'fas fa-file-code code-icon',
            ts: 'fas fa-file-code code-icon',
            tsx: 'fas fa-file-code code-icon',
            json: 'fas fa-file-code code-icon',
            html: 'fas fa-file-code code-icon',
            htm: 'fas fa-file-code code-icon',
            xml: 'fas fa-file-code code-icon',
            php: 'fas fa-file-code code-icon',
            py: 'fas fa-file-code code-icon',
            java: 'fas fa-file-code code-icon',
            c: 'fas fa-file-code code-icon',
            cpp: 'fas fa-file-code code-icon',
            h: 'fas fa-file-code code-icon',
            hpp: 'fas fa-file-code code-icon',
            cs: 'fas fa-file-code code-icon',
            go: 'fas fa-file-code code-icon',
            rs: 'fas fa-file-code code-icon',
            sh: 'fas fa-file-code code-icon',
            bash: 'fas fa-file-code code-icon',
            zsh: 'fas fa-file-code code-icon',
            swift: 'fas fa-file-code code-icon',
            kt: 'fas fa-file-code code-icon',
            dart: 'fas fa-file-code code-icon',
            lua: 'fas fa-file-code code-icon',
            rb: 'fas fa-file-code code-icon',
            pl: 'fas fa-file-code code-icon',
            r: 'fas fa-file-code code-icon',
            m: 'fas fa-file-code code-icon',

            // 文本文件
            txt: 'fas fa-file-alt text-icon',
            md: 'fas fa-file-alt text-icon',
            markdown: 'fas fa-file-alt text-icon',
            log: 'fas fa-file-alt text-icon',
            rtf: 'fas fa-file-alt text-icon',

            // 文档
            pdf: 'fas fa-file-pdf text-red-500',
            doc: 'fas fa-file-word text-blue-600',
            docx: 'fas fa-file-word text-blue-600',
            xls: 'fas fa-file-excel text-green-600',
            xlsx: 'fas fa-file-excel text-green-600',
            ppt: 'fas fa-file-powerpoint text-orange-600',
            pptx: 'fas fa-file-powerpoint text-orange-600',
            csv: 'fas fa-file-csv text-green-600',
            odt: 'fas fa-file-word text-blue-600',
            ods: 'fas fa-file-excel text-green-600',
            odp: 'fas fa-file-powerpoint text-orange-600',

            // 数据库
            sql: 'fas fa-database text-blue-500',
            db: 'fas fa-database text-blue-500',
            sqlite: 'fas fa-database text-blue-500',
            mdb: 'fas fa-database text-blue-500',

            // 配置
            ini: 'fas fa-cog text-gray-500',
            cfg: 'fas fa-cog text-gray-500',
            conf: 'fas fa-cog text-gray-500',
            gitignore: 'fas fa-code-branch text-gray-500',
            env: 'fas fa-key text-yellow-500',

            // 字体
            ttf: 'fas fa-font text-purple-500',
            otf: 'fas fa-font text-purple-500',
            woff: 'fas fa-font text-purple-500',
            woff2: 'fas fa-font text-purple-500',

            // 视频
            mp4: 'fas fa-file-video text-red-400',
            mov: 'fas fa-file-video text-red-400',
            avi: 'fas fa-file-video text-red-400',
            mkv: 'fas fa-file-video text-red-400',
            flv: 'fas fa-file-video text-red-400',
            wmv: 'fas fa-file-video text-red-400',

            // 音频
            mp3: 'fas fa-file-audio text-blue-400',
            wav: 'fas fa-file-audio text-blue-400',
            ogg: 'fas fa-file-audio text-blue-400',
            flac: 'fas fa-file-audio text-blue-400',
            aac: 'fas fa-file-audio text-blue-400',

            // 其他
            lock: 'fas fa-lock text-gray-500',
            license: 'fas fa-file-signature text-gray-500',
            dockerfile: 'fab fa-docker text-blue-400',
            makefile: 'fas fa-file-code code-icon',
            procfile: 'fas fa-file-code code-icon',
        };

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 检查本地存储中是否有 token
            const savedToken = localStorage.getItem('github_token');
            if (savedToken) {
                githubToken = savedToken;
                githubTokenInput.value = '********';
                verifyToken();
            } else {
                // 未登录状态，显示固定右上角按钮
                authFixedControls.classList.remove('hidden');
            }

            // 加载用户设置（主题和背景图片）
            loadUserSettings();

            // 用户菜单事件
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenuContent.classList.toggle('show');
            });

            // 点击其他地方隐藏用户菜单
            document.addEventListener('click', () => {
                userMenuContent.classList.remove('show');
            });

            // 退出登录
            logoutBtn.addEventListener('click', () => {
                logout();
            });

            // 确认对话框事件监听
            confirmYes.addEventListener('click', async () => {
                // Store fileToDelete locally before potentially clearing it in hideConfirmDialog
                const currentFileToDelete = fileToDelete;
                hideConfirmDialog(); // Close the dialog immediately upon confirmation
                exitSelectMode(); // Close batch toolbar when confirming any action

                if (currentFileToDelete && Array.isArray(currentFileToDelete) && currentFileToDelete.every(item => item.type === 'repo')) {
                    // 这是批量同步操作
                    await performBatchSync(currentFileToDelete);
                } else if (currentFileToDelete) {
                    // 现有删除逻辑
                    if (Array.isArray(currentFileToDelete)) {
                        // 批量删除文件或仓库
                        const isRepos = currentFileToDelete.every(item => item.type === 'repo');
                        if (isRepos) {
                            // 批量删除仓库
                            await Promise.all(currentFileToDelete.map(repo => deleteRepository(repo)));
                            showToast(\`成功删除 \${currentFileToDelete.length} 个仓库\`);
                            loadRepositories(); // Refresh repo list
                        } else {
                            // 批量删除文件
                            await deleteFiles(currentFileToDelete);
                        }
                    } else if (currentFileToDelete.type === 'repo') {
                        deleteRepository(currentFileToDelete);
                    } else {
                        deleteFile(currentFileToDelete);
                    }
                }
            });

            confirmNo.addEventListener('click', () => {
                hideConfirmDialog();
            });

            confirmDialog.addEventListener('click', (e) => {
                if (e.target === confirmDialog) {
                    hideConfirmDialog();
                }
            });

            // 新建文件夹对话框事件监听
            newFolderBtn.addEventListener('click', () => {
                showNewFolderDialog();
            });

            newFolderCreate.addEventListener('click', () => {
                const folderName = newFolderName.value.trim();
                if (folderName) {
                    createFolder(folderName);
                    hideNewFolderDialog();
                } else {
                    showToast('请输入文件夹名称');
                }
            });

            newFolderCancel.addEventListener('click', () => {
                hideNewFolderDialog();
            });

            newFolderDialog.addEventListener('click', (e) => {
                if (e.target === newFolderDialog) {
                    hideNewFolderDialog();
                }
            });

            // 新建仓库对话框事件监听
            newRepoBtn.addEventListener('click', () => {
                showNewRepoDialog();
            });

            newRepoCreate.addEventListener('click', () => {
                const repoName = newRepoName.value.trim();
                if (repoName) {
                    createRepository(repoName, newRepoDesc.value.trim(), newRepoPrivate.checked);
                    hideNewRepoDialog();
                } else {
                    showToast('请输入仓库名称');
                }
            });

            newRepoCancel.addEventListener('click', () => {
                hideNewRepoDialog();
            });

            newRepoDialog.addEventListener('click', (e) => {
                if (e.target === newRepoDialog) {
                    hideNewRepoDialog();
                }
            });

            // 上传文件对话框事件监听
            uploadBtn.addEventListener('click', () => {
                showUploadDialog();
            });

            uploadFile.addEventListener('click', () => {
                if (fileInput.files.length > 0) {
                    uploadSelectedFile();
                    hideUploadDialog();
                } else {
                    showToast('请选择要上传的文件');
                }
            });

            uploadCancel.addEventListener('click', () => {
                hideUploadDialog();
            });

            uploadDialog.addEventListener('click', (e) => {
                if (e.target === uploadDialog) {
                    hideUploadDialog();
                }
            });

            // 选择模式按钮
            selectBtn.addEventListener('click', () => {
                toggleSelectMode();
            });

            // 批量操作按钮
            batchDownloadBtn.addEventListener('click', () => {
                downloadSelectedFiles();
            });

            batchDeleteBtn.addEventListener('click', () => {
                if (selectedFiles.size > 0) {
                    const selectedItems = Array.from(selectedFiles);
                    const isRepos = selectedItems.every(item => item.type === 'repo');
                    const message = isRepos
                        ? \`您确定要删除选中的 \${selectedItems.length} 个仓库吗？此操作不可撤销且会删除所有仓库内容。\`
                        : \`您确定要删除选中的 \${selectedItems.length} 个文件吗？此操作不可撤销。\`;
                    showConfirmDialog(
                        isRepos ? '确认删除仓库' : '确认删除',
                        message,
                        selectedItems,
                        isRepos ? '确认删除仓库' : '确认删除'
                    );
                }
            });

            // 新增批量同步按钮事件
            batchSyncBtn.addEventListener('click', () => {
                if (selectedFiles.size === 0) {
                    showToast('请选择要同步的仓库');
                    return;
                }

                const reposToSync = Array.from(selectedFiles).filter(item => item.type === 'repo');
                if (reposToSync.length === 0) {
                    showToast('没有选中任何仓库进行同步');
                    return;
                }

                showConfirmDialog(
                    '确认批量同步',
                    \`您确定要同步选中的 \${reposToSync.length} 个仓库吗？此操作将尝试将上游更改合并到您的分支。\`,
                    reposToSync, // Pass the array of repos to sync
                    '确认同步' // Pass the button text
                );
            });

            batchCancelBtn.addEventListener('click', () => {
                exitSelectMode();
            });

            // 新增全选按钮事件监听
            batchSelectAllBtn.addEventListener('click', () => {
                toggleSelectAll();
            });

            // 上下文菜单事件
            contextOpen.addEventListener('click', () => {
                if (contextMenuTarget) {
                    openContextItem(contextMenuTarget);
                }
                hideContextMenu();
            });

            contextDownload.addEventListener('click', () => {
                if (contextMenuTarget) {
                    downloadFile(contextMenuTarget);
                }
                hideContextMenu();
            });

            contextRename.addEventListener('click', () => {
                if (contextMenuTarget) {
                    renameFile(contextMenuTarget);
                }
                hideContextMenu();
            });

            contextCopyLink.addEventListener('click', () => {
                if (contextMenuTarget && contextMenuTarget.type === 'file') {
                    copyToClipboard(contextMenuTarget.download_url, 'Raw 链接已复制');
                }
                hideContextMenu();
            });

            contextCopyProxyLink.addEventListener('click', (e) => {
                e.stopPropagation();
                if (contextMenuTarget && contextMenuTarget.type === 'file') {
                    const [owner, repoName] = currentRepo.split('/');
                    const filePath = currentPath ? \`\${currentPath}/\${contextMenuTarget.name}\` : contextMenuTarget.name;
                    const jsdelivrLink = \`https://cdn.jsdelivr.net/gh/\${owner}/\${repoName}@\${defaultBranchOfCurrentRepo}/\${filePath}\`;
                    copyToClipboard(jsdelivrLink, 'jsDelivr CDN 链接已复制');
                }
                hideContextMenu();
            });

            contextDelete.addEventListener('click', () => {
                if (contextMenuTarget) {
                    if (contextMenuTarget.type === 'repo') {
                        showConfirmDialog(
                            '确认删除仓库',
                            \`您确定要删除仓库 "\${contextMenuTarget.name}" 吗？此操作不可撤销且会删除所有仓库内容。\`,
                            contextMenuTarget,
                            '确认删除仓库'
                        );
                    } else {
                        showConfirmDialog(
                            '确认删除',
                            \`您确定要删除 "\${contextMenuTarget.name}" 吗？此操作不可撤销。\`,
                            contextMenuTarget,
                            '确认删除'
                        );
                    }
                }
                hideContextMenu();
            });

            // 静态网站菜单项点击
            contextEnablePages.addEventListener('click', () => {
                if (contextMenuTarget) {
                    showStaticSiteDialog(contextMenuTarget);
                }
                hideContextMenu();
            });

            // 禁用静态网站菜单项点击 (New)
            contextDisablePages.addEventListener('click', () => {
                if (contextMenuTarget) {
                    disableGitHubPages({ path: contextMenuTarget.path }); // Pass path for consistency
                }
                hideContextMenu();
            });

            // 构建APP菜单项点击
            contextBuildApp.addEventListener('click', () => {
                if (contextMenuTarget) {
                    buildApp(contextMenuTarget);
                }
                hideContextMenu();
            });

            // 新增同步分支菜单项点击
            contextSyncBranch.addEventListener('click', () => {
                if (contextMenuTarget) {
                    showSyncBranchDialog(contextMenuTarget); // Pass the repoInfo directly
                }
                hideContextMenu();
            });

            // 点击其他地方隐藏上下文菜单
            document.addEventListener('click', (e) => {
                if (!contextMenu.contains(e.target)) {
                    hideContextMenu();
                }
            });

            // 静态网站按钮事件
            staticSiteBtn.addEventListener('click', () => {
                showStaticSiteDialog();
            });

            // 静态网站对话框事件
            staticSiteEnable.addEventListener('click', () => {
                enableGitHubPages();
            });

            // New: Disable button in dialog
            staticSiteDisable.addEventListener('click', () => {
                if (activeRepoForPages) {
                    disableGitHubPages({ path: activeRepoForPages }); // Pass a similar object structure as contextMenuTarget
                } else {
                    showToast('无法确定要禁用静态网站的仓库。');
                }
                hideStaticSiteDialog();
            });

            staticSiteCancel.addEventListener('click', () => {
                hideStaticSiteDialog();
            });

            staticSiteDialog.addEventListener('click', (e) => {
                if (e.target === staticSiteDialog) {
                    hideStaticSiteDialog();
                }
            });

            // 关闭构建状态提示
            closeBuildStatus.addEventListener('click', () => {
                buildStatusEl.classList.add('hidden');
                clearInterval(buildTimer);
                buildStatus = null;
            });

            // 复刻仓库按钮事件
            forkRepoBtn.addEventListener('click', () => {
                showForkRepoDialog();
            });

            // 复刻仓库对话框事件
            forkRepoConfirm.addEventListener('click', () => {
                const repoUrl = forkRepoUrl.value.trim();
                if (repoUrl) {
                    forkRepository(repoUrl);
                } else {
                    showToast('请输入GitHub仓库URL');
                }
            });

            forkRepoCancel.addEventListener('click', () => {
                hideForkRepoDialog();
            });

            forkRepoDialog.addEventListener('click', (e) => {
                if (e.target === forkRepoDialog) {
                    hideForkRepoDialog();
                }
            });

            // 同步分支按钮事件 (单个仓库同步)
            syncBranchBtn.addEventListener('click', () => {
                if (currentRepo && defaultBranchOfCurrentRepo) {
                    showSyncBranchDialog({ path: currentRepo, defaultBranch: defaultBranchOfCurrentRepo });
                } else {
                    showToast('请先进入一个仓库');
                }
            });

            // 同步分支对话框事件
            syncBranchConfirm.addEventListener('click', () => {
                if (repoToSync && repoToSync.type === 'repo') { // Use repoToSync for context menu initiated sync
                    syncBranch(repoToSync.path, repoToSync.defaultBranch);
                } else if (currentRepo && defaultBranchOfCurrentRepo) { // Fallback for main toolbar button (if it existed and used this logic)
                    syncBranch(currentRepo, defaultBranchOfCurrentRepo);
                } else {
                    showToast('无法确定要同步的仓库或分支');
                }
                hideSyncBranchDialog();
            });

            syncBranchCancel.addEventListener('click', () => {
                hideSyncBranchDialog();
            });

            syncBranchDialog.addEventListener('click', (e) => {
                if (e.target === syncBranchDialog) {
                    hideSyncBranchDialog();
                }
            });

            // 主界面：主题切换按钮事件
            dayNightToggleBtn.addEventListener('click', toggleTheme);

            // 主界面：背景图片设置按钮事件
            bgImageSettingsBtn.addEventListener('click', showBgSettingsDialog);

            // 未登录界面：主题切换按钮事件
            authDayNightToggleBtn.addEventListener('click', toggleTheme);

            // 未登录界面：背景图片设置按钮事件
            authBgImageSettingsBtn.addEventListener('click', showBgSettingsDialog);

            // 背景图片设置对话框内的事件
            bgImageUrlInput.addEventListener('input', updateBgPreview);
            bgImageApplyBtn.addEventListener('click', applyBgImage);
            bgImageResetBtn.addEventListener('click', resetBgImage);
            bgImageCancelBtn.addEventListener('click', hideBgSettingsDialog);
            bgSettingsDialog.addEventListener('click', (e) => {
                if (e.target === bgSettingsDialog) {
                    hideBgSettingsDialog();
                }
            });

            // 优化后的滚动事件监听
            let isTicking = false;
            window.addEventListener('scroll', () => {
                if (!isTicking) {
                    window.requestAnimationFrame(() => {
                        handleScroll();
                        isTicking = false;
                    });
                    isTicking = true;
                }
            });

            // 初始显示工具栏
            showToolbar();
        });

        // 新增：加载用户设置
        function loadUserSettings() {
            // 加载主题
            const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                // 默认设置为日间模式
                setTheme('light-mode');
            }

            // 加载背景图片
            const savedBgImage = localStorage.getItem(LOCAL_STORAGE_BG_KEY);
            if (savedBgImage) {
                setBackgroundImage(savedBgImage);
            } else {
                // 默认启用预设背景图片
                setBackgroundImage(DEFAULT_BG_IMAGE);
            }
        }

        // 新增：设置主题
        function setTheme(theme) {
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(theme);
            localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);

            // 更新主题切换按钮图标
            // 更新主界面的按钮
            if (dayNightToggleBtn) {
                if (theme === 'dark-mode') {
                    dayNightToggleBtn.innerHTML = '<i class="fas fa-moon text-blue-300"></i>';
                    dayNightToggleBtn.title = '切换日间模式';
                } else {
                    dayNightToggleBtn.innerHTML = '<i class="fas fa-sun text-yellow-500"></i>';
                    dayNightToggleBtn.title = '切换夜间模式';
                }
            }
            // 更新未登录界面的按钮
            if (authDayNightToggleBtn) {
                if (theme === 'dark-mode') {
                    authDayNightToggleBtn.innerHTML = '<i class="fas fa-moon text-blue-300"></i>';
                    authDayNightToggleBtn.title = '切换日间模式';
                } else {
                    authDayNightToggleBtn.innerHTML = '<i class="fas fa-sun text-yellow-500"></i>';
                    authDayNightToggleBtn.title = '切换夜间模式';
                }
            }
        }

        // 新增：切换主题
        function toggleTheme() {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
            setTheme(currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode');
        }

        // 新增：设置背景图片
        function setBackgroundImage(url) {
            if (url) {
                document.body.style.setProperty('--body-bg-image', \`url('\${url}')\`);
                document.body.style.setProperty('--body-bg-size', 'cover');
                document.body.style.setProperty('--body-bg-position', 'center');
                document.body.style.setProperty('--body-bg-repeat', 'no-repeat');
                localStorage.setItem(LOCAL_STORAGE_BG_KEY, url);
            } else {
                // 如果URL为空，则移除背景图片，只保留渐变背景
                document.body.style.setProperty('--body-bg-image', 'none');
                localStorage.removeItem(LOCAL_STORAGE_BG_KEY);
            }
        }

        // 新增：显示背景图片设置对话框
        function showBgSettingsDialog() {
            const currentBgUrl = localStorage.getItem(LOCAL_STORAGE_BG_KEY) || DEFAULT_BG_IMAGE;
            bgImageUrlInput.value = currentBgUrl;
            updateBgPreview(currentBgUrl); // 初始预览

            bgSettingsDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('bg-settings-content').classList.add('scale-100');
            document.getElementById('bg-settings-content').classList.remove('scale-90');
        }

        // 新增：隐藏背景图片设置对话框
        function hideBgSettingsDialog() {
            bgSettingsDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('bg-settings-content').classList.add('scale-90');
            document.getElementById('bg-settings-content').classList.remove('scale-100');
        }

        // 新增：更新背景图片预览
        function updateBgPreview(urlOrEvent) {
            const url = typeof urlOrEvent === 'string' ? urlOrEvent : bgImageUrlInput.value.trim();
            if (url) {
                bgImagePreview.style.backgroundImage = \`url('\${url}')\`;
                bgPreviewText.classList.add('hidden');
            } else {
                bgImagePreview.style.backgroundImage = 'none';
                bgPreviewText.classList.remove('hidden');
            }
        }

        // 新增：应用背景图片
        function applyBgImage() {
            const url = bgImageUrlInput.value.trim();
            setBackgroundImage(url);
            showToast('背景图片已应用');
            hideBgSettingsDialog();
        }

        // 新增：重置背景图片
        function resetBgImage() {
            setBackgroundImage(DEFAULT_BG_IMAGE);
            bgImageUrlInput.value = DEFAULT_BG_IMAGE;
            updateBgPreview(DEFAULT_BG_IMAGE);
            showToast('背景图片已重置为默认');
        }

        // 优化后的滚动事件处理
        function handleScroll() {
            const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = currentScrollPosition - lastScrollPosition;

            // 如果滚动距离小于阈值，忽略微小滚动
            if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) {
                return;
            }

            // 判断滚动方向
            const scrollingDown = scrollDelta > 0;

            // 清除之前的定时器
            clearTimeout(scrollTimeout);

            // 设置新的定时器
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                showToolbar();
            }, SCROLL_DELAY);

            // 只有在状态改变或初次滚动时才处理
            if (!isScrolling || (lastScrollDirection !== undefined && lastScrollDirection !== scrollingDown)) {
                isScrolling = true;
                lastScrollDirection = scrollingDown;
                updateToolbarVisibility(scrollingDown);
            }
            lastScrollPosition = currentScrollPosition; // Update last position after processing
        }

        // 更新工具栏可见性
        function updateToolbarVisibility(scrollingDown) {
            if (scrollingDown) {
                hideToolbar();
            } else {
                showToolbar();
            }
        }

        // 显示工具栏
        function showToolbar() {
            toolbar.classList.remove('hidden');
        }

        // 隐藏工具栏
        function hideToolbar() {
            toolbar.classList.add('hidden');
        }

        // 显示复刻仓库对话框
        function showForkRepoDialog() {
            forkRepoUrl.value = ''; // 清空输入框
            forkRepoDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('fork-repo-content').classList.add('scale-100');
            document.getElementById('fork-repo-content').classList.remove('scale-90');
        }

        // 隐藏复刻仓库对话框
        function hideForkRepoDialog() {
            forkRepoDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('fork-repo-content').classList.add('scale-90');
            document.getElementById('fork-repo-content').classList.remove('scale-100');
        }

        // 显示同步分支对话框
        function showSyncBranchDialog(repoInfo) {
            repoToSync = repoInfo; // 存储目标仓库信息
            const branchToDisplay = repoInfo.defaultBranch || defaultBranchOfCurrentRepo || '默认'; // 优先使用传入的defaultBranch
            syncTargetBranchSpan.textContent = branchToDisplay;
            syncBranchDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('sync-branch-content').classList.add('scale-100');
            document.getElementById('sync-branch-content').classList.remove('scale-90');
        }

        // 隐藏同步分支对话框
        function hideSyncBranchDialog() {
            syncBranchDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('sync-branch-content').classList.add('scale-90');
            document.getElementById('sync-branch-content').classList.remove('scale-100');
            repoToSync = null; // 清空存储的仓库信息
        }

        // 显示确认对话框 (已修改，增加 confirmButtonText 参数)
        function showConfirmDialog(title, message, fileInfo, confirmButtonText = '确认') {
            confirmTitle.textContent = title;
            confirmMessage.textContent = message;
            confirmYes.textContent = confirmButtonText; // 更新确认按钮文本
            fileToDelete = fileInfo;
            confirmDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('confirm-content').classList.add('scale-100');
            document.getElementById('confirm-content').classList.remove('scale-90');
        }

        // 隐藏确认对话框
        function hideConfirmDialog() {
            confirmDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('confirm-content').classList.add('scale-90');
            document.getElementById('confirm-content').classList.remove('scale-100');
            fileToDelete = null;
        }

        // 显示新建文件夹对话框
        function showNewFolderDialog() {
            newFolderName.value = '';
            newFolderDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('new-folder-content').classList.add('scale-100');
            document.getElementById('new-folder-content').classList.remove('scale-90');
            newFolderName.focus();
        }

        // 隐藏新建文件夹对话框
        function hideNewFolderDialog() {
            newFolderDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('new-folder-content').classList.add('scale-90');
            document.getElementById('new-folder-content').classList.remove('scale-100');
        }

        // 显示新建仓库对话框
        function showNewRepoDialog() {
            newRepoName.value = '';
            newRepoDesc.value = '';
            newRepoPrivate.checked = false;
            newRepoDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('new-repo-content').classList.add('scale-100');
            document.getElementById('new-repo-content').classList.remove('scale-90');
            newRepoName.focus();
        }

        // 隐藏新建仓库对话框
        function hideNewRepoDialog() {
            newRepoDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('new-repo-content').classList.add('scale-90');
            document.getElementById('new-repo-content').classList.remove('scale-100');
        }

        // 显示上传文件对话框
        function showUploadDialog() {
            fileInput.value = '';
            uploadDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('upload-content').classList.add('scale-100');
            document.getElementById('upload-content').classList.remove('scale-90');
        }

        // 隐藏上传文件对话框
        function hideUploadDialog() {
            uploadDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('upload-content').classList.add('scale-90');
            document.getElementById('upload-content').classList.remove('scale-100');
        }

        // 显示上下文菜单 (修复定位问题)
        function showContextMenu(e, fileInfo) {
            e.preventDefault();
            contextMenuTarget = fileInfo;

            // First, make it visible (but not yet transitioned) to get its dimensions
            contextMenu.style.display = 'block';
            contextMenu.classList.remove('visible'); // Ensure it's not visible before positioning

            // Get menu dimensions
            const menuWidth = contextMenu.offsetWidth;
            const menuHeight = contextMenu.offsetHeight;

            let x = e.clientX;
            let y = e.clientY;

            // Adjust X position if it goes off screen
            if (x + menuWidth > window.innerWidth - 10) { // 10px buffer from right edge
                x = window.innerWidth - menuWidth - 10;
            }
            if (x < 10) { // 10px buffer from left edge
                x = 10;
            }

            // Adjust Y position if it goes off screen
            if (y + menuHeight > window.innerHeight - 10) { // 10px buffer from bottom edge
                y = window.innerHeight - menuHeight - 10;
            }
            if (y < 10) { // 10px buffer from top edge
                y = 10;
            }

            contextMenu.style.left = \`\${x}px\`;
            contextMenu.style.top = \`\${y}px\`;

            // 根据文件类型显示/隐藏菜单项
            contextOpen.style.display = fileInfo.type === 'dir' || fileInfo.type === 'repo' ? 'flex' : 'none';
            contextDownload.style.display = fileInfo.type === 'file' ? 'flex' : 'none';
            contextRename.style.display = fileInfo.type === 'file' || fileInfo.type === 'dir' ? 'flex' : 'none';
            contextCopyLink.style.display = fileInfo.type === 'file' ? 'flex' : 'none';
            contextCopyProxyLink.style.display = fileInfo.type === 'file' ? 'flex' : 'none';

            // 静态网站选项：仅对仓库或特定文件夹显示
            const isRepoOrDocsFolder = fileInfo.type === 'repo' || (fileInfo.type === 'dir' && fileInfo.name.toLowerCase() === 'docs');
            contextEnablePages.style.display = isRepoOrDocsFolder ? 'flex' : 'none';
            contextDisablePages.style.display = isRepoOrDocsFolder ? 'flex' : 'none'; // Always show disable option if enable is shown

            // 构建APP选项：仅在仓库上显示
            contextBuildApp.style.display = fileInfo.type === 'repo' ? 'flex' : 'none';

            // 同步分支选项：仅在仓库上显示
            contextSyncBranch.style.display = fileInfo.type === 'repo' ? 'flex' : 'none';

            // Now add the visible class to trigger transition
            contextMenu.classList.add('visible');
        }

        // 隐藏上下文菜单
        function hideContextMenu() {
            contextMenu.classList.remove('visible');
            // Delay setting display: none to allow transition to complete
            setTimeout(() => {
                if (!contextMenu.classList.contains('visible')) { // Only hide if it's still not visible
                    contextMenu.style.display = 'none';
                }
            }, 200); // Match this with the transition duration for opacity/transform
            contextMenuTarget = null;
        }

        // 显示批量操作工具栏
        function showBatchToolbar() {
            batchToolbar.classList.add('visible');
        }

        // 隐藏批量操作工具栏
        function hideBatchToolbar() {
            batchToolbar.classList.remove('visible');
        }

        // 更新选中文件计数
        function updateSelectedCount() {
            selectedCount.textContent = selectedFiles.size;
        }

        // 切换选择模式
        function toggleSelectMode() {
            if (selectedFiles.size > 0) {
                exitSelectMode();
            } else {
                enterSelectMode();
            }
        }

        // 进入选择模式
        function enterSelectMode() {
            selectBtn.innerHTML = '<i class="fas fa-times text-red-500"></i>';
            selectBtn.title = '取消选择';
            showBatchToolbar();

            if (!currentRepo) { // 在仓库列表视图
                batchDownloadBtn.classList.add('hidden');
                batchSyncBtn.classList.remove('hidden');
                batchDeleteBtn.classList.remove('hidden'); // 可以删除仓库
            } else { // 在仓库内部文件视图
                batchDownloadBtn.classList.remove('hidden');
                batchSyncBtn.classList.add('hidden');
                batchDeleteBtn.classList.remove('hidden'); // 可以删除文件
            }
            updateSelectAllButtonState(); // Update select all button state on entering select mode
        }

        // 退出选择模式
        function exitSelectMode() {
            selectedFiles.clear();
            updateSelectedCount();
            hideBatchToolbar();

            // 移除所有选中状态
            document.querySelectorAll('.file-item.selected').forEach(item => {
                item.classList.remove('selected');
            });

            selectBtn.innerHTML = '<i class="fas fa-check-square text-blue-500"></i>';
            selectBtn.title = '选择文件';

            // Reset "Select All" button text
            batchSelectAllText.textContent = '全选';

            // 退出选择模式后，刷新工具栏按钮的可见性
            updateToolbarButtonsVisibility();
        }

        // 全选/取消全选逻辑
        function toggleSelectAll() {
            const displayedItems = currentFiles; // currentFiles holds the list of items currently displayed

            const isAllSelected = selectedFiles.size === displayedItems.length && displayedItems.length > 0;

            // Clear existing selections first to handle toggle correctly
            selectedFiles.clear();
            document.querySelectorAll('.file-item.selected').forEach(itemEl => {
                itemEl.classList.remove('selected');
            });

            if (!isAllSelected) {
                // Select All
                displayedItems.forEach(item => {
                    selectedFiles.add(item);
                    // Find the corresponding DOM element and add 'selected' class
                    const itemEl = document.querySelector(\`.file-item[data-name="\${item.name}"][data-type="\${item.type}"]\`);
                    if (itemEl) {
                        itemEl.classList.add('selected'); // Corrected: Use itemEl directly
                    }
                });
                batchSelectAllText.textContent = '取消全选';
            } else {
                // Deselect All (already cleared above)
                batchSelectAllText.textContent = '全选';
            }
            updateSelectedCount();
        }

        // 更新全选按钮的文字状态
        function updateSelectAllButtonState() {
            const displayedItems = currentFiles;
            const isAllSelected = selectedFiles.size === displayedItems.length && displayedItems.length > 0;

            if (isAllSelected) {
                batchSelectAllText.textContent = '取消全选';
            } else {
                batchSelectAllText.textContent = '全选';
            }
        }

        // 认证按钮点击事件
        authBtn.addEventListener('click', () => {
            const token = githubTokenInput.value.trim();

            // Token 格式验证
            if (!token) {
                showTokenError('请输入 GitHub Token');
                return;
            }

            if (token.length !== 40) {
                showTokenError('Token 应为 40 位字符');
                return;
            }

            verifyToken(token);
        });

        // 验证 Token
        async function verifyToken(token = githubToken) {
            try {
                // 显示加载状态
                authBtnText.textContent = '认证中...';
                authSpinner.classList.remove('hidden');
                authBtn.disabled = true;

                // 设置超时
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                // 发送验证请求
                const response = await fetch('https://api.github.com/user', {
                    signal: controller.signal,
                    headers: {
                        'Authorization': \`token \${token}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('GitHub API 错误:', errorData);

                    let errorMessage = '认证失败';
                    if (response.status === 401) {
                        errorMessage = 'Token 无效或已过期';
                    } else if (response.status === 403) {
                        errorMessage = '权限不足，请检查 Token 权限';
                    } else {
                        errorMessage = \`服务器错误: \${response.status}\`;
                    }

                    throw new Error(errorMessage);
                }

                // 认证成功
                const userData = await response.json();
                console.log('认证成功:', userData);

                githubToken = token;
                currentUser = userData;
                localStorage.setItem('github_token', token);
                showToast(\`欢迎: \${userData.login || '用户'}！\`);
                showMainScreen();
                loadRepositories();

                // 更新用户信息和头像
                usernameElement.textContent = userData.login;
                if (userData.avatar_url) {
                    userAvatarBtn.src = userData.avatar_url;
                    userAvatarInfo.src = userData.avatar_url;
                } else {
                    // Fallback to a default avatar if none is provided
                    userAvatarBtn.src = 'https://avatars.githubusercontent.com/u/0?v=4'; // A generic GitHub avatar
                    userAvatarInfo.src = 'https://avatars.githubusercontent.com/u/0?v=4';
                }

                // 登录成功后隐藏未登录状态的按钮
                authFixedControls.classList.add('hidden');

            } catch (error) {
                console.error('认证错误:', error);

                let errorMessage = error.message;
                if (error.name === 'AbortError') {
                    errorMessage = '请求超时，请检查网络连接';
                }

                showTokenError(errorMessage);
                showToast(errorMessage);

            } finally {
                // 重置按钮状态
                authBtnText.textContent = '认证并继续';
                authSpinner.classList.add('hidden');
                authBtn.disabled = false;
            }
        }

        // 显示 Token 错误
        function showTokenError(message) {
            tokenError.textContent = message;
            tokenError.classList.remove('hidden');
        }

        // 退出登录
        function logout() {
            githubToken = '';
            currentUser = null;
            localStorage.removeItem('github_token');
            mainScreen.classList.add('hidden');
            authScreen.classList.remove('hidden');
            githubTokenInput.value = '';
            tokenError.classList.add('hidden');
            showToast('已退出登录');

            // 退出登录后显示未登录状态的按钮
            authFixedControls.classList.remove('hidden');
        }

        // 显示主界面
        function showMainScreen() {
            authScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            toolbar.classList.remove('hidden');
            // 初始加载时，由 loadRepositories 或 loadRepositoryContents 调用 updateToolbarButtonsVisibility
        }

        // 显示提示
        function showToast(message) {
            toastElement.textContent = message;
            toastElement.classList.remove('opacity-0');
            toastElement.classList.add('opacity-100');

            setTimeout(() => {
                toastElement.classList.remove('opacity-100');
                toastElement.classList.add('opacity-0');
            }, 3000);
        }

        // 更新工具栏按钮可见性
        function updateToolbarButtonsVisibility() {
            // 默认隐藏所有特定按钮
            backBtn.classList.add('hidden');
            uploadBtn.classList.add('hidden');
            newFolderBtn.classList.add('hidden');
            staticSiteBtn.classList.add('hidden');
            syncBranchBtn.classList.add('hidden');
            newRepoBtn.classList.add('hidden');
            forkRepoBtn.classList.add('hidden');
            selectBtn.classList.add('hidden');

            if (currentRepo) { // 在仓库内部
                backBtn.classList.remove('hidden');
                uploadBtn.classList.remove('hidden');
                newFolderBtn.classList.remove('hidden');
                selectBtn.classList.remove('hidden');
                syncBranchBtn.classList.remove('hidden'); // 显示单个同步分支按钮

                // 检查是否有 index.html 文件，决定是否显示静态网站按钮
                const hasIndexHtml = currentFiles.some(file =>
                    file.type === 'file' && file.name.toLowerCase() === 'index.html'
                );
                if (hasIndexHtml) {
                    staticSiteBtn.classList.remove('hidden');
                }
            } else { // 在仓库列表视图
                newRepoBtn.classList.remove('hidden');
                forkRepoBtn.classList.remove('hidden');
                selectBtn.classList.remove('hidden'); // 在仓库列表页显示选择按钮
            }
        }

        // 加载仓库列表
        async function loadRepositories() {
            showLoading();
            currentPath = '';
            currentRepo = '';
            defaultBranchOfCurrentRepo = ''; // Reset default branch
            updateBreadcrumb([]);
            exitSelectMode(); // 退出选择模式

            try {
                // 使用GraphQL API获取仓库列表
                const response = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`bearer \${githubToken}\`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        query: \`
                            query {
                                viewer {
                                    repositories(first: 100, ownerAffiliations: [OWNER], orderBy: {field: NAME, direction: ASC}) {
                                        nodes {
                                            name
                                            owner {
                                                login
                                            }
                                            isPrivate
                                            description
                                            updatedAt
                                            defaultBranchRef {
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        \`
                    })
                });

                if (!response.ok) {
                    throw new Error('获取仓库列表失败');
                }

                const data = await response.json();
                const repos = data.data.viewer.repositories.nodes;

                currentFiles = repos.map(repo => ({ // Store the full list of repositories
                    name: repo.name,
                    type: 'repo',
                    path: \`\${repo.owner.login}/\${repo.name}\`,
                    private: repo.isPrivate,
                    description: repo.description,
                    updatedAt: repo.updatedAt,
                    defaultBranch: repo.defaultBranchRef ? repo.defaultBranchRef.name : 'main' // Store default branch
                }));

                renderFileList(currentFiles); // Render using currentFiles
                updateSelectAllButtonState(); // Update select all button state after rendering
            } catch (error) {
                console.error('加载仓库列表错误:', error);
                showToast('加载失败: ' + error.message);
                showEmptyState();
            } finally {
                updateToolbarButtonsVisibility(); // 确保按钮状态正确
            }
        }

        // 加载仓库内容
        async function loadRepositoryContents(repo, path = '') {
            showLoading();
            currentRepo = repo;
            currentPath = path;
            exitSelectMode(); // 退出选择模式

            // 更新面包屑导航
            // parts 将是 [owner, repoName, pathSegment1, pathSegment2, ...]
            const pathParts = repo.split('/');
            if (path) {
                pathParts.push(...path.split('/'));
            }
            updateBreadcrumb(pathParts);

            try {
                const [owner, repoName] = repo.split('/');

                // Fetch repository details to get the default branch
                const repoDetailsResponse = await fetch(\`https://api.github.com/repos/\${owner}/\${repoName}\`, {
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!repoDetailsResponse.ok) {
                    throw new Error('获取仓库详情失败');
                }
                const repoDetails = await repoDetailsResponse.json();
                defaultBranchOfCurrentRepo = repoDetails.default_branch || 'main'; // Store default branch

                // 使用GraphQL API获取仓库内容
                const response = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`bearer \${githubToken}\`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        query: \`
                            query {
                                repository(owner: "\${owner}", name: "\${repoName}") {
                                    object(expression: "HEAD:\${path}") {
                                        ... on Tree {
                                            entries {
                                                name
                                                type
                                                object {
                                                    ... on Blob {
                                                        byteSize
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        \`
                    })
                });

                if (!response.ok) {
                    throw new Error('获取仓库内容失败');
                }

                const data = await response.json();

                if (!data.data.repository.object) {
                    showEmptyState();
                    currentFiles = []; // Ensure currentFiles is empty if directory is empty
                    updateSelectAllButtonState(); // Update select all button state
                    return;
                }

                const contents = data.data.repository.object.entries.map(entry => ({
                    name: entry.name,
                    type: entry.type === 'tree' ? 'dir' : 'file',
                    size: entry.object?.byteSize || 0,
                    path: path ? \`\${path}/\${entry.name}\` : entry.name,
                    download_url: entry.type === 'blob' ?
                        \`https://raw.githubusercontent.com/\${owner}/\${repoName}/\${defaultBranchOfCurrentRepo}/\${path ? path + '/' : ''}\${entry.name}\` : null
                }));

                currentFiles = contents; // Store the full list of files

                const sortedContents = [...contents].sort((a, b) => {
                    if (a.type === b.type) {
                        return a.name.localeCompare(b.name);
                    }
                    return a.type === 'dir' ? -1 : 1;
                });

                renderFileList(sortedContents);
                updateSelectAllButtonState(); // Update select all button state after rendering

            } catch (error) {
                console.error('加载仓库内容错误:', error);
                showToast('加载失败: ' + error.message);
                showEmptyState();
            } finally {
                updateToolbarButtonsVisibility(); // 确保按钮状态正确
            }
        }

        // 更新面包屑导航
        function updateBreadcrumb(parts) {
            const breadcrumbContainer = document.getElementById('current-path').querySelector('.breadcrumb');
            breadcrumbContainer.innerHTML = '';

            // 添加"我的仓库"根路径
            const rootItem = document.createElement('div');
            rootItem.className = 'breadcrumb-item';
            rootItem.innerHTML = '<i class="fab fa-github mr-1"></i><span>我的仓库</span>';
            rootItem.onclick = () => loadRepositories();
            breadcrumbContainer.appendChild(rootItem);

            // 如果没有特定仓库被加载（只是“我的仓库”视图）
            if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
                 return;
            }

            // 添加分隔符
            let separator = document.createElement('div');
            separator.className = 'breadcrumb-separator';
            separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
            breadcrumbContainer.appendChild(separator);

            // 添加仓库部分 (owner/repoName)
            // parts 数组的第一个元素是 owner，第二个元素是 repoName
            const owner = parts[0];
            const repoName = parts[1];
            const repoFullName = \`\${owner}/\${repoName}\`;

            const repoItem = document.createElement('div');
            repoItem.className = 'breadcrumb-item';
            // 修复：显示所有者/仓库名
            repoItem.textContent = repoFullName;
            repoItem.onclick = () => loadRepositoryContents(repoFullName); // 导航到仓库根目录
            breadcrumbContainer.appendChild(repoItem);

            // 添加子路径部分
            // 从索引 2 开始，因为 parts[0] 是所有者，parts[1] 是仓库名称
            let currentPathSegments = [owner, repoName]; // 用于构建子路径的累积路径
            for (let i = 2; i < parts.length; i++) {
                // 添加分隔符
                separator = document.createElement('div');
                separator.className = 'breadcrumb-separator';
                separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                breadcrumbContainer.appendChild(separator);

                // 添加路径项
                const pathItem = document.createElement('div');
                pathItem.className = 'breadcrumb-item';
                pathItem.textContent = parts[i]; // 显示当前路径段的名称

                // 构建仓库内的完整路径，不包含 owner/repoName 部分
                currentPathSegments.push(parts[i]);
                const pathInRepo = currentPathSegments.slice(2).join('/'); // 从第三个元素开始（即第一个路径段）
                
                pathItem.onclick = () => {
                    loadRepositoryContents(repoFullName, pathInRepo);
                };
                breadcrumbContainer.appendChild(pathItem);
            }
        }

        // 获取文件图标
        function getFileIcon(fileName) {
            const extension = fileName.split('.').pop().toLowerCase();
            return fileTypeIcons[extension] || 'fas fa-file text-gray-400';
        }

        // 渲染文件列表（修改部分）
        function renderFileList(items) {
            fileListElement.innerHTML = '';
            loadingElement.classList.add('hidden');
            emptyStateElement.classList.add('hidden');

            if (items.length === 0) {
                showEmptyState();
                return;
            }

            fileListElement.classList.remove('hidden');

            items.forEach(item => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item p-4 flex items-center';
                fileItem.dataset.name = item.name;
                fileItem.dataset.type = item.type;

                // If this item is already selected, apply the 'selected' class
                if (selectedFiles.has(item)) {
                    fileItem.classList.add('selected');
                }

                // 添加右键菜单
                fileItem.addEventListener('contextmenu', (e) => {
                    showContextMenu(e, item);
                });

                // 添加选择模式点击处理
                fileItem.addEventListener('click', (e) => {
                    if (batchToolbar.classList.contains('visible')) {
                        e.stopPropagation();
                        toggleFileSelection(fileItem, item);
                        return;
                    }

                    if (item.type === 'dir') {
                        loadRepositoryContents(currentRepo, \`\${currentPath ? currentPath + '/' : ''}\${item.name}\`);
                    } else if (item.type === 'repo') {
                        loadRepositoryContents(item.path);
                    } else if (item.type === 'file' && item.download_url) {
                        window.open(item.download_url, '_blank');
                    }
                });

                const icon = document.createElement('i');
                icon.className = \`file-icon \${item.type === 'dir' ? 'fas fa-folder folder-icon' :
                                     item.type === 'repo' ? 'fab fa-github text-gray-700' :
                                     getFileIcon(item.name)}\`;

                const infoContainer = document.createElement('div');
                infoContainer.className = 'flex-1 min-w-0';

                const name = document.createElement('div');
                name.className = 'font-medium truncate';
                name.textContent = item.name;

                const meta = document.createElement('div');
                meta.className = 'text-xs text-gray-500 truncate';

                if (item.type === 'repo') {
                    meta.textContent = item.private ? '私有仓库' : '公开仓库';
                    if (item.description) {
                        meta.textContent += ' • ' + item.description;
                    }
                    if (item.updatedAt) {
                        meta.textContent += ' • 更新: ' + formatDate(item.updatedAt);
                    }
                } else if (item.type === 'file') {
                    meta.textContent = formatFileSize(item.size) + (item.download_url ? ' • 点击查看' : '');
                } else {
                    meta.textContent = '文件夹 • 点击进入';
                }

                infoContainer.appendChild(name);
                infoContainer.appendChild(meta);
                fileItem.appendChild(icon);
                fileItem.appendChild(infoContainer);
                fileListElement.appendChild(fileItem);
            });
            updateSelectAllButtonState(); // Ensure button state is correct after rendering
        }

        // 切换文件选择状态
        function toggleFileSelection(fileItem, fileInfo) {
            if (fileItem.classList.contains('selected')) {
                fileItem.classList.remove('selected');
                selectedFiles.delete(fileInfo);
            } else {
                fileItem.classList.add('selected');
                selectedFiles.add(fileInfo);
            }
            updateSelectedCount();
            updateSelectAllButtonState(); // Update select all button state

            // 如果没有选中文件，退出选择模式
            if (selectedFiles.size === 0) {
                exitSelectMode();
            }
        }

        // 下载选中的文件（保留原始文件名）
        async function downloadSelectedFiles() {
            if (selectedFiles.size === 0) return;

            // 单个文件直接下载
            if (selectedFiles.size === 1) {
                const file = selectedFiles.values().next().value;
                await downloadFile(file);
                return;
            }

            // 多个文件打包下载
            try {
                showToast(\`开始打包 \${selectedFiles.size} 个文件...\`);
                const zip = new JSZip();
                let count = 0;
                let errors = 0;

                // 创建并显示进度提示
                const progressToast = document.createElement('div');
                progressToast.id = 'zip-progress';
                progressToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 rounded-full text-sm font-medium';
                document.body.appendChild(progressToast);

                // 更新进度提示
                const updateProgress = () => {
                    progressToast.textContent = \`打包中: \${count}/\${selectedFiles.size} 个文件 (\${errors} 失败)\`;
                };

                updateProgress();

                // 使用原始下载URL获取文件内容
                const downloadPromises = Array.from(selectedFiles).map(async file => {
                    if (file.type !== 'file' || !file.download_url) return;

                    try {
                        // 使用原始下载URL获取文件内容
                        const response = await fetch(file.download_url);

                        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);

                        // 获取原始文件名
                        const originalFilename = file.name;

                        // 添加到ZIP（保持原始文件名）
                        const blob = await response.blob();
                        zip.file(originalFilename, blob);
                        count++;
                        updateProgress();
                    } catch (error) {
                        console.error(\`下载 \${file.name} 失败:\`, error);
                        errors++;
                        updateProgress();
                    }
                });

                // 等待所有下载完成
                await Promise.all(downloadPromises);

                // 生成ZIP文件（使用仓库名+日期作为文件名）
                const repoName = currentRepo.split('/')[1] || 'download';
                const dateString = new Date().toISOString().slice(0, 10);
                const zipFilename = \`\${repoName}-\${dateString}.zip\`;

                const content = await zip.generateAsync({ type: 'blob' });

                // 创建下载链接
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = zipFilename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, 100);

                document.body.removeChild(progressToast);

                if (errors === 0) {
                    showToast(\`已成功打包下载 \${count} 个文件\`);
                } else {
                    showToast(\`打包完成: \${count} 成功, \${failCount} 失败\`);
                }
            } catch (error) {
                console.error('打包下载失败:', error);
                showToast('打包下载失败: ' + error.message);
            } finally {
                exitSelectMode();
            }
        }

        // 下载单个文件（保留原始文件名）
        async function downloadFile(file) {
            if (file.type !== 'file' || !file.download_url) return;

            try {
                showToast(\`正在下载 \${file.name}...\`);

                // 使用原始下载URL获取文件内容
                const response = await fetch(file.download_url);

                if (!response.ok) throw new Error(\`HTTP \${response.status}\`);

                // 获取原始文件名
                const originalFilename = file.name;

                // 创建Blob并下载（使用原始文件名）
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = originalFilename; // 确保使用原始文件名
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, 100);

                showToast(\`已下载 \${originalFilename}\`);
            } catch (error) {
                console.error('下载失败:', error);
                showToast(\`下载失败: \${error.message}\`);
            }
        }

        // 使用GitHub API获取文件内容
        async function getFileContentViaAPI(file) {
            const [owner, repo] = currentRepo.split('/');
            const path = currentPath ? \`\${currentPath}/\${file.name}\` : file.name;

            // 使用API获取文件内容
            const response = await fetch(
                \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${path}\`,
                {
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3.raw'
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(\`API错误 (\${response.status}): \${errorText}\`);
            }

            return await response.blob();
        }

        // 复制到剪贴板
        function copyToClipboard(text, successMessage) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMessage);
            }).catch((error) => {
                console.error('复制错误:', error);
                showToast('复制失败: ' + error.message);
            });
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // 格式化日期
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        // 删除文件
        async function deleteFile(fileInfo) {
            try {
                // 如果是批量删除
                if (Array.isArray(fileInfo)) {
                    return deleteFiles(fileInfo);
                }

                const [owner, repo] = currentRepo.split('/');

                // 获取文件SHA
                const shaResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${fileInfo.name}\`,
                    {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!shaResponse.ok) {
                    throw new Error('获取文件信息失败');
                }

                const shaData = await shaResponse.json();
                const sha = shaData.sha;

                // 删除文件
                const deleteResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${fileInfo.name}\`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        },
                        body: JSON.stringify({
                            message: \`Delete \${fileInfo.name}\`,
                            sha: sha
                        })
                    }
                );

                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    throw new Error(errorData.message || '删除文件失败');
                }

                showToast('文件删除成功');
                loadRepositoryContents(currentRepo, currentPath);

            } catch (error) {
                console.error('删除文件错误:', error);
                showToast('删除文件失败: ' + error.message);
            }
        }

        // 批量删除文件
        async function deleteFiles(files) {
            try {
                let successCount = 0;
                let failCount = 0;
                const [owner, repo] = currentRepo.split('/');

                for (const file of files) {
                    try {
                        // 获取文件SHA
                        const shaResponse = await fetch(
                            \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${file.name}\`,
                            {
                                headers: {
                                    'Authorization': \`token \${githubToken}\`,
                                    'Accept': 'application/vnd.github.v3+json'
                                }
                            }
                        );

                        if (!shaResponse.ok) {
                            throw new Error('获取文件信息失败');
                        }

                        const shaData = await shaResponse.json();
                        const sha = shaData.sha;

                        // 删除文件
                        const deleteResponse = await fetch(
                            \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${file.name}\`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': \`token \${githubToken}\`,
                                    'Accept': 'application/vnd.github.v3+json'
                                },
                                body: JSON.stringify({
                                    message: \`Delete \${file.name}\`,
                                    sha: sha
                                })
                            }
                        );

                        if (!deleteResponse.ok) {
                            throw new Error('删除文件失败');
                        }

                        successCount++;
                    } catch (error) {
                        console.error(\`删除文件 \${file.name} 失败:\`, error);
                        failCount++;
                    }
                }

                if (failCount === 0) {
                    showToast(\`成功删除 \${successCount} 个文件\`);
                } else {
                    showToast(\`删除完成: \${successCount} 成功, \${failCount} 失败\`);
                }

                exitSelectMode();
                loadRepositoryContents(currentRepo, currentPath);

            } catch (error) {
                console.error('批量删除文件错误:', error);
                showToast('批量删除文件失败: ' + error.message);
            }
        }

        // 删除仓库
        async function deleteRepository(repoInfo) {
            try {
                const [owner, repoName] = repoInfo.path.split('/');

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repoName}\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '删除仓库失败');
                }

                // showToast('仓库删除成功'); // Handled by batch delete success message
                // loadRepositories(); // Handled by batch delete success message

            } catch (error) {
                console.error('删除仓库错误:', error);
                showToast('删除仓库失败: ' + error.message);
                throw error; // Re-throw to indicate failure in batch operation
            }
        }

        // 创建文件夹
        async function createFolder(folderName) {
            try {
                const [owner, repo] = currentRepo.split('/');
                const filePath = currentPath ? \`\${currentPath}/\${folderName}/.gitkeep\` : \`\${folderName}/.gitkeep\`;
                const content = btoa(''); // 空内容

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/contents/\${filePath}\`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message: \`Create folder \${folderName}\`,
                        content: content
                    })
                });

                if (response.ok) {
                    showToast('文件夹创建成功');
                    loadRepositoryContents(currentRepo, currentPath);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '创建文件夹失败');
                }
            } catch (error) {
                console.error('创建文件夹错误:', error);
                showToast('创建文件夹失败: ' + error.message);
            }
        }

        // 创建仓库
        async function createRepository(name, description, isPrivate) {
            try {
                const response = await fetch('https://api.github.com/user/repos', {
                    method: 'POST',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        private: isPrivate,
                        auto_init: true
                    })
                });

                if (response.ok) {
                    showToast('仓库创建成功');
                    loadRepositories();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '创建仓库失败');
                }
            } catch (error) {
                console.error('创建仓库错误:', error);
                showToast('创建仓库失败: ' + error.message);
            }
        }

        // 重命名文件
        async function renameFile(fileInfo) {
            try {
                const [owner, repo] = currentRepo.split('/');

                // 提示用户输入新文件名
                const newName = prompt('请输入新的文件名:', fileInfo.name);
                if (!newName || newName.trim() === '' || newName === fileInfo.name) {
                    showToast('重命名已取消或文件名未改变');
                    return;
                }

                // 获取文件内容和SHA
                const contentResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${fileInfo.name}\`,
                    {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!contentResponse.ok) {
                    throw new Error('获取文件内容失败');
                }

                const contentData = await contentResponse.json();
                const sha = contentData.sha;
                const content = contentData.content;
                const encoding = contentData.encoding;

                // 删除原文件
                const deleteResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${fileInfo.name}\`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        },
                        body: JSON.stringify({
                            message: \`Rename \${fileInfo.name} to \${newName}\`,
                            sha: sha
                        })
                    }
                );

                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    throw new Error(errorData.message || '删除原文件失败');
                }

                // 创建新文件
                const createResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${currentPath ? currentPath + '/' : ''}\${newName}\`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        },
                        body: JSON.stringify({
                            message: \`Rename \${fileInfo.name} to \${newName}\`,
                            content: content,
                            encoding: encoding
                        })
                    }
                );

                if (createResponse.ok) {
                    showToast('文件重命名成功');
                    loadRepositoryContents(currentRepo, currentPath);
                } else {
                    const errorData = await createResponse.json();
                    throw new Error(errorData.message || '创建新文件失败');
                }
            } catch (error) {
                console.error('重命名文件错误:', error);
                showToast('重命名文件失败: ' + error.message);
            }
        }

        // 上传选中的文件（修改后的版本）
        async function uploadSelectedFile() {
            if (!fileInput.files || fileInput.files.length === 0) {
                showToast('请先选择文件');
                return;
            }

            try {
                const files = Array.from(fileInput.files);
                let successfulUploads = 0;
                let failedUploads = 0;

                // 显示上传进度
                const progressToast = document.createElement('div');
                progressToast.id = 'upload-progress';
                progressToast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 rounded-full text-sm font-medium';
                progressToast.innerHTML = \`准备上传 \${files.length} 个文件...\`;
                document.body.appendChild(progressToast);

                // 顺序上传每个文件
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    try {
                        progressToast.innerHTML = \`正在上传 \${i + 1}/\${files.length}: \${file.name}...\`;

                        // 上传文件并等待完成
                        await uploadSingleFile(file);
                        successfulUploads++;

                        // 小延迟避免速率限制
                        if (i < files.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    } catch (error) {
                        console.error(\`文件 \${file.name} 上传失败:\`, error);
                        failedUploads++;

                        // 如果是速率限制错误，等待一段时间再继续
                        if (error.message.includes('API rate limit')) {
                            progressToast.innerHTML = \`遇到速率限制，等待60秒后继续...\`;
                            await new Promise(resolve => setTimeout(resolve, 60000));
                            i--; // 重试当前文件
                            continue;
                        }

                        // 其他错误继续下一个文件
                        continue;
                    }
                }

                // 移除进度提示
                document.body.removeChild(progressToast);

                // 显示最终结果
                if (failedUploads === 0) {
                    showToast(\`成功上传 \${successfulUploads} 个文件\`);
                } else {
                    showToast(\`上传完成: \${successfulUploads} 成功, \${failedUploads} 失败\`);
                }

                // 刷新文件列表
                loadRepositoryContents(currentRepo, currentPath);
            } catch (error) {
                console.error('上传过程中发生错误:', error);
                showToast('上传过程中发生错误: ' + error.message);
            } finally {
                fileInput.value = '';
            }
        }

        // 上传单个文件（优化版）
        async function uploadSingleFile(file) {
            try {
                const [owner, repo] = currentRepo.split('/');
                // 1. 读取文件内容为Base64
                const base64Content = await readFileAsBase64(file);

                // 2. 构建文件路径
                const filePath = currentPath ? \`\${currentPath}/\${file.name}\` : file.name;
                const encodedPath = encodeGitHubPath(filePath);

                // 3. 检查文件是否存在并获取SHA
                const sha = await getFileShaIfExists(encodedPath);

                // 4. 构建上传数据
                const uploadData = {
                    message: \`Upload \${file.name}\`,
                    content: base64Content,
                    ...(sha && { sha }) // 只有sha存在时才包含
                };

                // 5. 执行上传
                const response = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${encodedPath}\`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(uploadData)
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();

                    // 处理速率限制
                    if (response.status === 403 && errorData.message.includes('API rate limit')) {
                        const resetTime = new Date(response.headers.get('x-ratelimit-reset') * 1000);
                        throw new Error(\`API速率限制，请等待到 \${resetTime.toLocaleTimeString()}\`);
                    }

                    throw new Error(errorData.message || '上传失败');
                }

                return { file: file.name, status: 'success' };
            } catch (error) {
                console.error(\`文件 \${file.name} 上传失败:\`, error);
                throw error;
            }
        }

        // 辅助函数：检查文件是否存在并返回SHA
        async function getFileShaIfExists(filePath) {
            try {
                const [owner, repo] = currentRepo.split('/');
                const response = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/\${filePath}\`,
                    {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Cache-Control': 'no-cache'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    return data.sha;
                } else if (response.status === 404) {
                    return null; // 文件不存在
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '检查文件状态失败');
                }
            } catch (error) {
                console.error('获取SHA错误:', error);
                throw error;
            }
        }

        // 辅助函数：编码GitHub路径
        function encodeGitHubPath(path) {
            return path.split('/').map(encodeURIComponent).join('/');
        }

        // 辅助函数：将文件读取为Base64
        function readFileAsBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const arrayBuffer = reader.result;
                    const binaryString = Array.from(new Uint8Array(arrayBuffer))
                        .map(b => String.fromCharCode(b))
                        .join('');
                    resolve(btoa(binaryString));
                };
                reader.onerror = () => reject(new Error('文件读取失败'));
                reader.readAsArrayBuffer(file);
            });
        }

        // 显示加载状态
        function showLoading() {
            fileListElement.classList.add('hidden');
            emptyStateElement.classList.add('hidden');
            loadingElement.classList.remove('hidden');
        }

        // 显示空状态
        function showEmptyState() {
            fileListElement.classList.add('hidden');
            loadingElement.classList.add('hidden');
            emptyStateElement.classList.remove('hidden');
        }

        // 返回按钮点击事件
        backBtn.addEventListener('click', () => {
            if (!currentPath) {
                loadRepositories();
                return;
            }

            const pathParts = currentPath.split('/');
            pathParts.pop();
            const newPath = pathParts.join('/');

            if (pathParts.length === 0) {
                loadRepositoryContents(currentRepo);
            } else {
                loadRepositoryContents(currentRepo, newPath);
            }
        });

        // 刷新按钮点击事件
        refreshBtn.addEventListener('click', () => {
            if (currentRepo) {
                loadRepositoryContents(currentRepo, currentPath);
            } else {
                loadRepositories();
            }
        });

        // 静态网站功能
        function showStaticSiteDialog(repoInfo = null) {
            // Determine the target repository for Pages operations
            // If repoInfo is provided (e.g., from context menu), use it.
            // Otherwise, use currentRepo (if Browse inside a repo).
            // The repoInfo.path should be in "owner/repo" format.
            activeRepoForPages = repoInfo ? repoInfo.path : currentRepo;

            // Check if Pages is already enabled for this repository
            checkPagesStatus(activeRepoForPages);

            staticSiteDialog.classList.add('opacity-100', 'pointer-events-auto');
            document.getElementById('static-site-content').classList.add('scale-100');
            document.getElementById('static-site-content').classList.remove('scale-90');
        }

        function hideStaticSiteDialog() {
            staticSiteDialog.classList.remove('opacity-100', 'pointer-events-auto');
            document.getElementById('static-site-content').classList.add('scale-90');
            document.getElementById('static-site-content').classList.remove('scale-100');
        }

        async function checkPagesStatus(repo) {
            try {
                const [owner, repoName] = repo.split('/');
                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repoName}/pages\`, {
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Only update the status display, not the buttons themselves
                    if (data.status === 'built' || data.status === 'building') {
                        pagesStatus.classList.remove('hidden');
                        pagesUrl.href = data.html_url;
                        pagesUrl.textContent = data.html_url;

                        // Set current config if available
                        if (data.source) {
                            pagesBranch.value = data.source.branch;
                            pagesFolder.value = data.source.path === '/docs' ? '/docs' : '/';
                        }
                    } else {
                        pagesStatus.classList.add('hidden');
                    }
                } else {
                    // If API call fails (e.g., 404 if Pages not set up)
                    pagesStatus.classList.add('hidden');
                }
            } catch (error) {
                console.error('检查Pages状态错误:', error);
                pagesStatus.classList.add('hidden');
            }
        }

        async function enableGitHubPages() {
            try {
                if (!activeRepoForPages) {
                    showToast('无法确定要启用静态网站的仓库。');
                    return;
                }
                const [owner, repoName] = activeRepoForPages.split('/');
                const branch = pagesBranch.value;
                const path = pagesFolder.value === '/docs' ? '/docs' : '/';

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repoName}/pages\`, {
                    method: 'POST',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        source: {
                            branch: branch,
                            path: path
                        }
                    })
                });

                if (response.ok) {
                    showToast('静态网站已启用，构建可能需要几分钟');
                    hideStaticSiteDialog();

                    // Check build status after a delay
                    setTimeout(() => {
                        checkPagesStatus(activeRepoForPages); // Use activeRepoForPages here
                    }, 5000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '启用静态网站失败');
                }
            } catch (error) {
                console.error('启用静态网站错误:', error);
                showToast('启用静态网站失败: ' + error.message);
            }
        }

        // 新增：禁用 GitHub Pages 功能
        async function disableGitHubPages(repoInfo) {
            try {
                const [owner, repoName] = repoInfo.path.split('/');
                showToast('正在禁用静态网站...');

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repoName}/pages\`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (response.status === 204) { // 204 No Content is a successful DELETE
                    showToast('静态网站已禁用');
                    // Optionally refresh the current view or just the pages status in the dialog
                    if (currentRepo === repoInfo.path) { // If currently viewing this repo
                        // If the dialog is open, update its status
                        if (!staticSiteDialog.classList.contains('opacity-0')) {
                            checkPagesStatus(currentRepo);
                        }
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '禁用静态网站失败');
                }
            } catch (error) {
                console.error('禁用静态网站错误:', error);
                showToast('禁用静态网站失败: ' + error.message);
            }
        }

        // 构建APP功能
        async function buildApp(repoInfo) {
            try {
                const [owner, repo] = repoInfo.path.split('/');

                // 显示构建状态
                buildStatusEl.classList.remove('hidden');
                buildIcon.className = 'fas fa-cog animate-spin text-blue-500 mr-2';
                buildMessage.textContent = '正在扫描工作流文件...';

                // 1. 获取工作流文件列表
                const workflowsResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/contents/.github/workflows\`,
                    {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!workflowsResponse.ok) {
                    const errorData = await workflowsResponse.json();
                    throw new Error(errorData.message || '获取工作流文件失败');
                }

                const workflowFiles = await workflowsResponse.json();
                const validWorkflows = workflowFiles.filter(file =>
                    file.name.endsWith('.yml') || file.name.endsWith('.yaml')
                );

                if (validWorkflows.length === 0) {
                    throw new Error('未找到工作流文件');
                }

                // 2. 自动选择工作流（优先选择包含build的）
                let selectedWorkflow = validWorkflows.find(file =>
                    file.name.toLowerCase().includes('build')
                ) || validWorkflows[0];

                const workflowFileName = selectedWorkflow.name;
                buildMessage.textContent = \`找到工作流: \${workflowFileName}\`;

                // 3. 获取仓库默认分支
                const repoInfoResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}\`,
                    {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!repoInfoResponse.ok) {
                    throw new Error('获取仓库信息失败');
                }

                const repoData = await repoInfoResponse.json();
                const defaultBranch = repoData.default_branch;

                // 4. 触发工作流（不发送任何输入参数）
                const dispatchResponse = await fetch(
                    \`https://api.github.com/repos/\${owner}/\${repo}/actions/workflows/\${workflowFileName}/dispatches\`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ref: defaultBranch
                        })
                    }
                );

                if (dispatchResponse.status === 204) {
                    buildMessage.textContent = \`工作流 \${workflowFileName} 已触发！监控进度中...\`;
                    monitorBuildProgress(owner, repo, defaultBranch); // Pass defaultBranch
                } else {
                    const errorData = await dispatchResponse.json();
                    throw new Error(errorData.message || '触发工作流失败');
                }
            } catch (error) {
                console.error('构建APP错误:', error);
                buildIcon.className = 'fas fa-times-circle text-red-500 mr-2';
                buildMessage.textContent = '构建失败: ' + error.message;
            }
        }

        // 修改监控函数
        async function monitorBuildProgress(owner, repo, defaultBranch) { // Receive defaultBranch
            // 清除之前的定时器
            clearInterval(buildTimer);

            // 设置进度条动画
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 95) {
                    progress += 5;
                    progressBar.style.width = \`\${progress}%\`;
                    progressText.textContent = \`\${progress}%\`;
                }
            }, 2000);

            // 每10秒检查一次构建状态
            buildTimer = setInterval(async () => {
                try {
                    const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/actions/runs\`, {
                        headers: {
                            'Authorization': \`token \${githubToken}\`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('获取构建状态失败');
                    }

                    const data = await response.json();
                    const latestRun = data.workflow_runs[0];

                    if (!latestRun) {
                        return;
                    }

                    // Update build status
                    buildStatus = latestRun.status;

                    switch (latestRun.status) {
                        case 'completed':
                            clearInterval(progressInterval);
                            clearInterval(buildTimer);

                            if (latestRun.conclusion === 'success') {
                                progressBar.style.width = '100%';
                                progressText.textContent = '100%';
                                buildIcon.className = 'fas fa-check-circle text-green-500 mr-2';

                                // Get artifact information
                                const artifactsResponse = await fetch(latestRun.artifacts_url, {
                                    headers: {
                                        'Authorization': \`token \${githubToken}\`,
                                        'Accept': 'application/vnd.github.v3+json'
                                    }
                                });

                                if (artifactsResponse.ok) {
                                    const artifactsData = await artifactsResponse.json();
                                    if (artifactsData.artifacts.length > 0) {
                                        const artifactLinks = artifactsData.artifacts.map(a =>
                                            \`<a href="\${a.archive_download_url}" target="_blank" class="text-blue-500">\${a.name}</a>\`
                                        ).join('<br>');

                                        buildMessage.innerHTML = \`构建成功！下载制品:<br>\${artifactLinks}\`;
                                    } else {
                                        buildMessage.innerHTML = '构建成功！<br>可在仓库的Actions页面查看详情';
                                    }
                                } else {
                                    buildMessage.innerHTML = '构建成功！<br>可在仓库的Actions页面查看详情';
                                }
                            } else {
                                buildIcon.className = 'fas fa-times-circle text-red-500 mr-2';
                                buildMessage.textContent = \`构建失败: \${latestRun.conclusion}\`;
                            }
                            break;

                        case 'in_progress':
                            buildMessage.textContent = '构建正在进行中...';
                            break;

                        case 'queued':
                            buildMessage.textContent = '构建任务排队中...';
                            break;
                    }
                } catch (error) {
                    console.error('监控构建进度错误:', error);
                    clearInterval(progressInterval);
                    clearInterval(buildTimer);
                    buildIcon.className = 'fas fa-times-circle text-red-500 mr-2';
                    buildMessage.textContent = '监控失败: ' + error.message;
                }
            }, 10000);
        }

        // 复刻仓库函数
        async function forkRepository(repoUrl) {
            try {
                // 从URL中提取owner和repo名称
                const urlPattern = /https:\\/\\/github\\.com\\/([^\\/]+)\\/([^\\/]+)/i;
                const match = repoUrl.match(urlPattern);

                if (!match || match.length < 3) {
                    throw new Error('无效的GitHub仓库URL');
                }

                const owner = match[1];
                const repo = match[2];

                showToast('正在复刻仓库...');
                hideForkRepoDialog();

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/forks\`, {
                    method: 'POST',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '复刻仓库失败');
                }

                // 复刻操作是异步的，需要等待一段时间
                showToast('仓库复刻中，请稍后刷新查看...');

                // 30秒后自动刷新
                setTimeout(() => {
                    loadRepositories();
                }, 30000);

            } catch (error) {
                console.error('复刻仓库错误:', error);
                showToast('复刻仓库失败: ' + error.message);
            }
        }

        // 同步分支函数
        async function syncBranch(repoFullName, branchName) {
            try {
                const [owner, repo] = repoFullName.split('/');
                showToast(\`正在同步分支 \${branchName} for \${repoFullName}...\`);

                const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/merge-upstream\`, {
                    method: 'POST',
                    headers: {
                        'Authorization': \`token \${githubToken}\`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        branch: branchName
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    showToast(\`分支 \${branchName} for \${repoFullName} 同步成功！\`);
                    console.log('Sync successful:', data);
                    // Optionally refresh the view if it's the current repo
                    if (currentRepo === repoFullName) {
                        loadRepositoryContents(repoFullName, currentPath);
                    }
                } else {
                    const errorData = await response.json();
                    let errorMessage = errorData.message || '同步分支失败';

                    if (response.status === 409) { // Conflict
                        errorMessage = \`同步失败：\${errorMessage}。可能存在冲突，请手动解决。\`;
                    } else if (response.status === 404) { // Not Found (e.g., not a fork or upstream not found)
                        errorMessage = \`同步失败：\${errorMessage}。请确认这是一个复刻仓库且上游分支存在。\`;
                    }

                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error(\`同步分支 \${repoFullName} 错误:\`, error);
                showToast(\`同步分支 \${repoFullName} 失败: \` + error.message);
                throw error; // Re-throw to propagate failure for batch operations
            }
        }

        // 批量同步仓库函数
        async function performBatchSync(repos) {
            let successCount = 0;
            let failCount = 0;
            showToast(\`开始批量同步 \${repos.length} 个仓库...\`);

            for (const repo of repos) {
                try {
                    await syncBranch(repo.path, repo.defaultBranch);
                    successCount++;
                } catch (error) {
                    // Error already logged and toasted by syncBranch
                    failCount++;
                }
            }

            if (failCount === 0) {
                showToast(\`成功同步 \${successCount} 个仓库\`);
            } else {
                showToast(\`批量同步完成: \${successCount} 成功, \${failCount} 失败\`);
            }
            exitSelectMode();
            loadRepositories(); // Refresh the repo list after batch sync
        }

    </script>
</body>
</html>
`;
