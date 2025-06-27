// ==UserScript==
// @name         PTT GitHub 偽裝模式 tampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  將 PTT 頁面偽裝成 類似 GitHub 風格介面，支持首頁顯示看板列表，並保留「上頁」按鈕
// @author       AI by eva
// @match        https://www.ptt.cc/bbs/*
// @match        https://www.ptt.cc/bbs/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // GitHub 風格的 CSS 樣式
    const githubCSS = `
        /* GitHub 風格主題 - 精確匹配 */
        body {
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji" !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: #1f2328 !important;
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;

        }

        /* 隱藏原本的 PTT 樣式 */
        #topbar, #navigation, .banner, .ad, .footer {
            display: none !important;
        }

        /* GitHub Header - 精確配色 */
        .github-header {
            background-color: #24292f !important;
            border-bottom: 1px solid #d1d9e0 !important;
            padding: 0 !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
        }

        .github-nav {
            display: flex !important;
            align-items: center !important;
            max-width: 1280px !important;
            margin: 0 auto !important;
            padding: 16px 32px !important;
        }

        .github-logo {
            color: #ffffff !important;
            margin-right: 16px !important;
            text-decoration: none !important;
            display: flex !important;
            align-items: center !important;
        }

        .github-search {
            flex: 1 !important;
            max-width: 272px !important;
            margin: 0 16px !important;
        }

        .github-search input {
            width: 100% !important;
            padding: 5px 12px !important;
            background-color: #21262d !important;
            border: 1px solid #30363d !important;
            border-radius: 6px !important;
            color: #f0f6fc !important;
            font-size: 14px !important;
            font-family: inherit !important;
        }

        .github-search input:focus {
            background-color: #0d1117 !important;
            border-color: #1f6feb !important;
            outline: none !important;
        }

        .nav-actions {
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            margin-left: auto !important;
        }

        .nav-button {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 6px 16px !important;
            background-color: transparent !important;
            border: 1px solid #30363d !important;
            border-radius: 6px !important;
            color: #f0f6fc !important;
            font-size: 14px !important;
            cursor: pointer !important;
            text-decoration: none !important;
        }

        .nav-button:hover {
            background-color: #30363d !important;
        }

        /* 主要內容區域 */
        .main-container {
            display: flex !important;
            max-width: 1280px !important;
            margin: 0 auto !important;
            padding: 24px 32px !important;
        }

        /* 內容區域 */
        .content-area {
            flex: 1 !important;
            margin-right: 32px !important;
        }

        /* Sidebar */
        .sidebar {
            width: 280px !important;
            flex-shrink: 0 !important;
        }

        .sidebar-section {
            margin-bottom: 24px !important;
        }

        .sidebar-title {
            font-size: 12px !important;
            font-weight: 600 !important;
            color: #656d76 !important;
            text-transform: uppercase !important;
            margin-bottom: 8px !important;
        }

        .sidebar-content {
            font-size: 14px !important;
            color: #1f2328 !important;
        }

        .sidebar-link {
            color: #0969da !important;
            text-decoration: none !important;
            display: block !important;
            margin-bottom: 8px !important;
        }

        .sidebar-link:hover {
            text-decoration: underline !important;
        }

        .sidebar-icon {
            margin-right: 8px !important;
            vertical-align: middle !important;
        }

        /* 專案標題區域 */
        .repo-header {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 16px !important;
            padding-bottom: 16px !important;
            border-bottom: 1px solid #d1d9e0 !important;
        }

        .repo-title {
            font-size: 20px !important;
            font-weight: 600 !important;
            color: #0969da !important;
            text-decoration: none !important;
            margin-right: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .repo-separator {
            color: #656d76 !important;
            margin: 0 8px !important;
            font-size: 20px !important;
        }

        /* 檔案瀏覽器風格 */
        .file-browser {
            border: 1px solid #d1d9e0 !important;
            border-radius: 6px !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
        }

        .file-header {
            background-color: #f6f8fa !important;
            border-bottom: 1px solid #d1d9e0 !important;
            padding: 16px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #1f2328 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .file-list {
            padding: 0 !important;
            margin: 0 !important;
            list-style: none !important;
        }

        .file-item {
            display: flex !important;
            align-items: center !important;
            padding: 12px 16px !important;
            border-bottom: 1px solid #d1d9e0 !important;
            transition: background-color 0.1s ease-in-out !important;
            font-size: 14px !important;
        }

        .file-item:hover {
            background-color: #f6f8fa !important;
        }

        .file-item:last-child {
            border-bottom: none !important;
        }

        .file-icon {
            margin-right: 12px !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
        }

        .file-name {
            flex: 1 !important;
            color: #0969da !important;
            text-decoration: none !important;
            font-size: 14px !important;
            font-weight: 600 !important;
        }

        .file-name:hover {
            text-decoration: underline !important;
        }

        .file-meta {
            color: #656d76 !important;
            font-size: 12px !important;
            margin-left: auto !important;
            white-space: nowrap !important;
        }

        /* 文章內容風格 */
        .article-content {
            background-color: #f6f8fa !important;
            border: none !important;
            border-radius: 0 0 6px 6px !important;
            padding: 16px !important;
            font-family: ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace !important;
            font-size: 12px !important;
            line-height: 1.45 !important;
            white-space: pre-wrap !important;
            color: #1f2328 !important;
            overflow-x: auto !important;
        }

        /* 隱藏原本元素 */
        #main-container > * {
            display: none !important;
        }

        /* 顯示我們的內容 */
        .github-disguise {
            display: block !important;
        }

        /* Tab 樣式 */
        .repo-tabs {
            display: flex !important;
            border-bottom: 1px solid #d1d9e0 !important;
            margin-bottom: 16px !important;
            gap: 0 !important;
        }

        .repo-tab {
            padding: 8px 16px !important;
            border: none !important;
            background: none !important;
            color: #656d76 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            border-bottom: 2px solid transparent !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .repo-tab.active {
            color: #1f2328 !important;
            border-bottom-color: #fd7e14 !important;
            font-weight: 600 !important;
        }

        .repo-tab:hover:not(.active) {
            color: #1f2328 !important;
            border-bottom-color: #d1d9e0 !important;
        }

        /* 麵包屑導航 */
        .breadcrumb {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 16px !important;
            font-size: spiegare14px !important;
            color: #656d76 !important;
        }

        .breadcrumb a {
            color: #0969da !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        .breadcrumb a:hover {
            text-decoration: underline !important;
        }

        .breadcrumb-separator {
            margin: 0 8px !important;
            color: #656d76 !important;
        }

        .breadcrumb-current {
            color: #1f2328 !important;
            font-weight: 600 !important;
        }

        /* 上頁按鈕 */
        .prev-page {
            margin-bottom: 16px !important;
        }

        .prev-page a {
            display: inline-block !important;
            padding: 6px 16px !important;
            background-color: #f6f8fa !important;
            border: 1px solid #d1d9e0 !important;
            border-radius: 6px !important;
            color: #0969da !important;
            text-decoration: none !important;
            font-size: 14px !important;
            font-weight: 600 !important;
        }

        .prev-page a:hover {
            background-color: #e6ebf1 !important;
        }
        .text-blue-500 { color: #3b82f6; }
        .text-orange-500 { color: #f97316; }
        .text-red-500 { color: #ef4444; }
    `;

    // GitHub SVG 圖標
    const icons = {
        github: `<svg height="32" width="32" viewBox="0 0 16 16" fill="white" style="vertical-align: middle;">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>`,
        folder: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#54aeff">
            <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
        </svg>`,
        file: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#656d76">
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75zm6.75.062V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.246.246 0 00-.013-.011z"/>
        </svg>`,
        code: `<svg width="16" height="16" viewBox="0 0 16 16" fill="#656d76">
            <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>
        </svg>`,
        star: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
        </svg>`,
        fork: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
        </svg>`,
        watch: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 010 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 010-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2zM1.679 7.932a.12.12 0 000 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 000-.136C13.91 7.310 13.08 6.183 11.955 5.215 10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715C2.92 6.182 2.09 7.31 1.679 7.932zM8 10a2 2 0 100-4 2 2 0 000 4z"/>
        </svg>`,
        license: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S4.42 1.5 8 1.5 14.5 4.42 14.5 8 11.58 14.5 8 14.5zm-.5-9.5h1v1h-1v-1zm0 2h1v4h-1v-4z"/>
        </svg>`,
        activity: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM5 12V9l3-3 3 3v3H5z"/>
        </svg>`,
        language: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 14.5c-3.58 0-6.5-2.92-6.5-6.5S4.42 1.5 8 1.5 14.5 4.42 14.5 8 11.58 14.5 8 14.5zM4 5h8v1H4V5zm0 2h8v1H4V7zm0 2h8v1H4V9z"/>
        </svg>`
    };

    function createGitHubHeader() {
        return `
            <div class="github-header">
                <div class="github-nav">
                    <a href="#" class="github-logo">${icons.github}</a>
                    <div class="github-search">
                        <input type="text" placeholder="Search or jump to...">
                    </div>
                    <div class="nav-actions">
                        <a href="#" class="nav-button">${icons.star}<span>Star</span></a>
                        <a href="#" class="nav-button">${icons.fork}<span>Fork</span></a>
                        <a href="#" class="nav-button">${icons.watch}<span>Watch</span></a>
                    </div>
                </div>
            </div>
        `;
    }

    function createRepoHeader(boardName, articleTitle = '') {
        const title = articleTitle || `${boardName}-board`;
        return `
            <div class="repo-header">
                <span class="repo-title">${icons.code} GITHUB</span>
                <span class="repo-separator">/</span>
                <span class="repo-title">${title}</span>
            </div>
        `;
    }

    function createBreadcrumb(boardName, articleTitle = '') {
        let breadcrumb = `
            <div class="breadcrumb">
                <a href="#">GITHUB</a>
                <span class="breadcrumb-separator">/</span>
                <a href="#">boards</a>
                <span class="breadcrumb-separator">/</span>
                <a href="#">${boardName}</a>`;
        if (articleTitle) {
            breadcrumb += `
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">${articleTitle}</span>`;
        }
        breadcrumb += `</div>`;
        return breadcrumb;
    }

    function createSidebar(boardName, articleTitle = '') {
        const aboutText = articleTitle ? 'Article content from PTT' : `Let's make ${boardName} discussion practical!`;
        return `
            <div class="sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">About</div>
                    <div class="sidebar-content">${aboutText}</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Resources</div>
                    <div class="sidebar-content">
                        <a href="#" class="sidebar-link">Readme</a>
                    </div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">License</div>
                    <div class="sidebar-content">${icons.license} Apache-2.0 license</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Activity</div>
                    <div class="sidebar-content">${icons.activity} Recent posts</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Stars</div>
                    <div class="sidebar-content">${icons.star} 14.5k stars</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Watchers</div>
                    <div class="sidebar-content">${icons.watch} 120 watching</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Forks</div>
                    <div class="sidebar-content">${icons.fork} 1.3k forks</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Releases</div>
                    <div class="sidebar-content">
                        <span>1 Release</span><br>
                        <a href="#" class="sidebar-link">Windows<br>Latest<br>on Apr 18</a>
                    </div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Languages</div>
                    <div class="sidebar-content">${icons.language} Python 100.0%</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-content">
                        <a href="#" class="sidebar-link">Report repository</a>
                    </div>
                </div>
            </div>
        `;
    }

    function transformBoardList() {
        const entries = document.querySelectorAll('.r-ent');
        let fileListHTML = '';
        entries.forEach(entry => {
            const titleLink = entry.querySelector('.title a');
            const author = entry.querySelector('.author');
            const date = entry.querySelector('.date');
            const push = entry.querySelector('.nrec');
            if (titleLink) {
                const title = titleLink.textContent.trim();
                const href = titleLink.href;
                const authorText = author ? author.textContent.trim() : 'unknown';
                const dateText = date ? date.textContent.trim() : '';
                const pushText = push ? push.textContent.trim() : '';
                let pushColor = '';
                if (pushText) {
                    const pushValue = parseInt(pushText);
                    if (pushValue > 100) {
                        pushColor = 'text-red-500';
                    } else if (pushValue > 50) {
                        pushColor = 'text-orange-500';
                    } else if (pushValue > 20) {
                        pushColor = 'text-blue-500';
                    }
                }
                fileListHTML += `
                <li class="file-item">
                    <span class="file-icon">${icons.file}</span>
                    <a href="${href}" class="file-name">${title}</a>
                    <span class="file-meta">${pushText ? `<span class="${pushColor}">${pushText}</span> commits • ` : ''}${authorText} • ${dateText}</span>
                </li>
               `;
            }
        });

        const prevPageLink = document.querySelector('.btn-group-paging a.btn.wide:nth-child(2)');
        const prevPageHTML = prevPageLink ? `<div class="prev-page"><a href="${prevPageLink.href}">‹ 上頁</a></div>` : '';

        return `
            ${prevPageHTML}
            <div class="file-browser">
                <div class="file-header">${icons.folder} Latest commits in this board</div>
                <ul class="file-list">${fileListHTML}</ul>
            </div>
        `;
    }

    function transformArticle() {
        const article = document.querySelector('#main-content');
        if (!article) return '';
        const titleMeta = document.querySelector('.article-metaline .article-meta-value');
        const title = titleMeta ? titleMeta.textContent.trim() : 'README.md';
        const content = article.textContent || article.innerText || '';

        // Function to convert URLs to clickable links
        const makeLinksClickable = (text) => {
            // Regular expression to match URLs
            const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
            return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
        };

        const processedContent = makeLinksClickable(content);

        return `
        <div class="repo-tabs">
            <button class="repo-tab active">${icons.code} Code</button>
            <button class="repo-tab">Issues</button>
            <button class="repo-tab">Pull requests</button>
            <button class="repo-tab">Actions</button>
        </div>
        <div class="file-browser">
            <div class="file-header">${icons.file} ${title}</div>
            <div class="article-content">${processedContent}</div>
        </div>
    `;
    }

    function transformHomePage() {
        const boards = document.querySelectorAll('.b-ent');
        let boardListHTML = '';
        boards.forEach(board => {
            const boardLink = board.querySelector('.board');
            const boardNameElement = board.querySelector('.board-name');
            if (boardLink && boardNameElement) {
                const boardName = boardNameElement.textContent.trim();
                const href = boardLink.href;
                boardListHTML += `
                    <li class="file-item">
                        <span class="file-icon">${icons.folder}</span>
                        <a href="${href}" class="file-name">${boardName}</a>
                        <span class="file-meta">Board</span>
                    </li>
                `;
            }
        });
        return `
            <div class="file-browser">
                <div class="file-header">${icons.folder} PTT Boards</div>
                <ul class="file-list">${boardListHTML}</ul>
            </div>
        `;
    }

    function init() {
        const style = document.createElement('style');
        style.textContent = githubCSS;
        document.head.appendChild(style);

        const url = window.location.href;
        const isHomePage = url.endsWith('/bbs/index.html') || url === 'https://www.ptt.cc/bbs/';
        const boardMatch = url.match(/\/bbs\/(\w+)\//);
        const boardName = boardMatch ? boardMatch[1] : 'Unknown';
        const isArticle = (url.includes('.html') || url.includes('.html#')) && !url.includes('index') && !isHomePage;

        const body = document.body;
        const mainContainer = document.querySelector('#main-container');
        if (mainContainer) mainContainer.style.display = 'none';

        const githubContainer = document.createElement('div');
        githubContainer.className = 'github-disguise';

        let articleTitle = '';
        if (isArticle) {
            const titleElement = document.querySelector('.article-metaline .article-meta-value');
            articleTitle = titleElement ? titleElement.textContent.trim() : 'article';
        }

        let contentHTML = '';
        if (isHomePage) {
            contentHTML = transformHomePage();
            document.title = 'git-hub: PTT Boards';
        } else if (isArticle) {
            contentHTML = transformArticle();
            document.title = `${articleTitle} - git-hub/${boardName}`;
        } else {
            contentHTML = transformBoardList();
            document.title = `git-hub/${boardName}: Board archive`;
        }

        githubContainer.innerHTML = `
            ${createGitHubHeader()}
            <div class="main-container">
                <div class="content-area">
                    ${isHomePage ? '' : createRepoHeader(boardName, articleTitle)}
                    ${isHomePage ? '' : createBreadcrumb(boardName, articleTitle)}
                    ${contentHTML}
                </div>
                ${createSidebar(boardName, articleTitle)}
            </div>
        `;
        body.appendChild(githubContainer);

        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = 'https://github.com/favicon.ico';
    }

    function handleLinks() {
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href*="ptt.cc"]');
            if (link) return true;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    handleLinks();
})();