class IslandMusicIntegration {
    constructor() {
        this.island = window.dynamicIsland;
        this.musicSearch = window.musicSearch;
        this.currentAudio = null;
        this.currentSong = null;
        this.parsedLyrics = [];
        this.isShowingWelcomeMessage = false;
        this.welcomeMessageTimer = null;
    }

    /**
     * 初始化集成
     */
    init() {
        if (!this.island || !this.musicSearch) {
            console.error('灵动岛或音乐搜索功能未初始化');
            return;
        }

        // 初始化灵动岛
        this.island.init();

        // 创建歌词窗口
        this.createLyricsWindow();

        // 创建可拖动的音乐图标
        this.createMusicIcon();

        // 设置灵动岛展开内容
        this.setupIslandContent();

        // 显示欢迎语
        this.showWelcomeMessage();
    }

    /**
     * 显示欢迎语
     */
    showWelcomeMessage() {
        // 设置欢迎语显示标志
        this.isShowingWelcomeMessage = true;
        
        // 直接使用迷你状态显示欢迎语
        this.updateMiniStatus();
        
        // 3秒后隐藏欢迎语，恢复到原来的状态
        this.welcomeMessageTimer = setTimeout(() => {
            this.hideWelcomeMessage();
        }, 3000);
    }

    /**
     * 更新迷你状态显示
     */
    updateMiniStatus() {
        // 添加律动条动画样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes pulse-up {
                0%, 100% {
                    transform: scaleY(0.5);
                }
                50% {
                    transform: scaleY(1);
                }
            }
            .animate-pulse-up {
                animation: pulse-up 1s infinite ease-in-out;
            }
        `;
        document.head.appendChild(styleElement);

        // 设置迷你状态的默认内容，使其显示欢迎语和律动条
        const miniContent = `
            <div class="flex items-center justify-center h-full text-white space-x-3">
                <i class="fa fa-home text-sm"></i>
                <p class="text-xs">Lira TV</p>
                <div class="flex items-end space-x-0.5">
                    <div class="w-1.5 h-3 bg-primary rounded-full animate-pulse-up" style="animation-delay: 0ms;"></div>
                    <div class="w-1.5 h-4 bg-primary rounded-full animate-pulse-up" style="animation-delay: 100ms;"></div>
                    <div class="w-1.5 h-5 bg-primary rounded-full animate-pulse-up" style="animation-delay: 200ms;"></div>
                    <div class="w-1.5 h-4 bg-primary rounded-full animate-pulse-up" style="animation-delay: 300ms;"></div>
                    <div class="w-1.5 h-3 bg-primary rounded-full animate-pulse-up" style="animation-delay: 400ms;"></div>
                </div>
            </div>
        `;
        
        // 添加过渡动画
        this.island.island.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.island.island.style.width = '180px';
        
        // 更新内容
        this.island.updateDefaultContent(miniContent);
    }

    /**
     * 隐藏欢迎语，恢复到原来的状态
     */
    hideWelcomeMessage() {
        // 清除定时器
        if (this.welcomeMessageTimer) {
            clearTimeout(this.welcomeMessageTimer);
            this.welcomeMessageTimer = null;
        }
        
        // 立即清空内容，不等待动画完成
        this.island.updateDefaultContent('<div class="w-full h-full"></div>');
        
        // 添加更快的过渡动画
        this.island.island.style.transition = 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        this.island.island.style.width = '110px';
        
        // 立即设置欢迎语隐藏标志
        this.isShowingWelcomeMessage = false;
    }

    /**
     * 创建可拖动的音乐图标
     */
    createMusicIcon() {
        // 检查是否已存在
        if (document.getElementById('music-icon')) {
            this.musicIcon = document.getElementById('music-icon');
            return;
        }

        // 创建音乐图标
        this.musicIcon = document.createElement('div');
        this.musicIcon.id = 'music-icon';
        this.musicIcon.className = 'fixed bottom-10 right-10 z-40';
        this.musicIcon.style.width = '40px';
        this.musicIcon.style.height = '40px';
        this.musicIcon.style.borderRadius = '50%';
        this.musicIcon.style.backgroundColor = 'transparent';
        this.musicIcon.style.display = 'none';
        this.musicIcon.style.alignItems = 'center';
        this.musicIcon.style.justifyContent = 'center';
        this.musicIcon.style.cursor = 'move';
        this.musicIcon.style.transition = 'all 0.2s ease';

        // 图标内容
        this.musicIcon.innerHTML = '<i class="fa fa-music text-primary text-xl"></i>';
        
        // 添加样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #music-icon i {
                color: #007aff;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(styleElement);

        // 添加到页面
        document.body.appendChild(this.musicIcon);

        // 绑定点击事件
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        
        // 鼠标按下事件
        this.musicIcon.addEventListener('mousedown', (e) => {
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
        });
        
        // 鼠标移动事件
        this.musicIcon.addEventListener('mousemove', (e) => {
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isDragging = true;
            }
        });
        
        // 鼠标点击事件
        this.musicIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isDragging) {
                this.showLyricsWindow();
                this.hideMusicIcon();
            }
        });

        // 添加拖动功能
        this.makeIconDraggable();
    }

    /**
     * 使图标可拖动
     */
    makeIconDraggable() {
        if (!this.musicIcon) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let lastX = 0;
        let lastY = 0;

        // 开始拖动的处理函数
        const startDrag = (clientX, clientY) => {
            isDragging = true;
            const rect = this.musicIcon.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            this.musicIcon.style.cursor = 'grabbing';
        };

        // 拖动中的处理函数
        const drag = (clientX, clientY) => {
            if (!isDragging) return;

            // 使用requestAnimationFrame优化拖动流畅度
            requestAnimationFrame(() => {
                const x = clientX - offsetX;
                const y = clientY - offsetY;

                // 限制图标在视口内
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const iconWidth = 40;
                const iconHeight = 40;

                const clampedX = Math.max(10, Math.min(x, viewportWidth - iconWidth - 10));
                const clampedY = Math.max(10, Math.min(y, viewportHeight - iconHeight - 10));

                // 只有当位置发生变化时才更新
                if (clampedX !== lastX || clampedY !== lastY) {
                    this.musicIcon.style.left = `${clampedX}px`;
                    this.musicIcon.style.top = `${clampedY}px`;
                    this.musicIcon.style.bottom = 'auto';
                    this.musicIcon.style.right = 'auto';
                    lastX = clampedX;
                    lastY = clampedY;
                }
            });
        };

        // 结束拖动的处理函数
        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                this.musicIcon.style.cursor = 'move';
            }
        };

        // 鼠标按下事件
        this.musicIcon.addEventListener('mousedown', (e) => {
            startDrag(e.clientX, e.clientY);
            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            drag(e.clientX, e.clientY);
            // 阻止默认行为
            e.preventDefault();
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', endDrag);

        // 鼠标离开窗口事件
        document.addEventListener('mouseleave', endDrag);

        // 触摸开始事件（支持手机端）
        this.musicIcon.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        // 触摸移动事件（支持手机端）
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
            // 阻止默认行为
            e.preventDefault();
        });

        // 触摸结束事件（支持手机端）
        document.addEventListener('touchend', endDrag);
    }

    /**
     * 显示音乐图标
     */
    showMusicIcon() {
        if (this.musicIcon) {
            this.musicIcon.style.display = 'flex';
        }
    }

    /**
     * 隐藏音乐图标
     */
    hideMusicIcon() {
        if (this.musicIcon) {
            this.musicIcon.style.display = 'none';
        }
    }

    /**
     * 创建歌词窗口
     */
    createLyricsWindow() {
        // 检查是否已存在
        if (document.getElementById('lyrics-window')) {
            this.lyricsWindow = document.getElementById('lyrics-window');
            return;
        }

        // 创建歌词窗口容器
        this.lyricsWindow = document.createElement('div');
        this.lyricsWindow.id = 'lyrics-window';
        this.lyricsWindow.className = 'fixed z-40 rounded-2xl shadow-lg p-4';
        this.lyricsWindow.style.backdropFilter = 'blur(20px)';
        this.lyricsWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.lyricsWindow.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        this.lyricsWindow.style.userSelect = 'none';
        this.lyricsWindow.style.transition = 'none';
        this.lyricsWindow.style.display = 'none';
        this.lyricsWindow.style.width = '200px';
        this.lyricsWindow.style.maxWidth = '200px';
        this.lyricsWindow.style.minWidth = '200px';
        this.lyricsWindow.style.height = '150px';
        this.lyricsWindow.style.maxHeight = '150px';
        this.lyricsWindow.style.minHeight = '150px';

        // 歌词窗口内容
        this.lyricsWindow.innerHTML = `
            <!-- 窗口标题 -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-medium text-sm">歌词</h3>
                <button id="close-lyrics-window" class="text-white opacity-70 hover:opacity-100 transition-opacity">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            
            <!-- 歌词显示区域 -->
            <div id="lyrics-display" class="text-center py-4">
                <div id="current-lyric" class="text-white text-sm leading-relaxed">
                    歌词加载中...
                </div>
            </div>
            
            <!-- 歌曲信息 -->
            <div id="lyrics-song-info" class="text-center mt-4 pt-4 border-t border-white border-opacity-10">
                <p id="lyrics-song-name" class="text-xs font-medium text-white truncate">--</p>
                <p id="lyrics-song-artist" class="text-xs text-gray-400 truncate">--</p>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(this.lyricsWindow);

        // 绑定关闭按钮事件
        const closeButton = document.getElementById('close-lyrics-window');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideLyricsWindow();
            });
        }

        // 添加拖动功能
        this.makeWindowDraggable();
    }

    /**
     * 使窗口可拖动
     */
    makeWindowDraggable() {
        if (!this.lyricsWindow) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // 检查是否点击了可拖动区域
        const isDraggableArea = (target) => {
            return !target.closest('#close-lyrics-window') && !target.closest('#lyrics-display') && !target.closest('#lyrics-song-info');
        };

        // 开始拖动的处理函数
        const startDrag = (clientX, clientY, target) => {
            // 只在点击窗口标题区域时允许拖动
            if (!isDraggableArea(target)) {
                return;
            }

            isDragging = true;
            offsetX = clientX - this.lyricsWindow.getBoundingClientRect().left;
            offsetY = clientY - this.lyricsWindow.getBoundingClientRect().top;
            this.lyricsWindow.style.cursor = 'grabbing';
        };

        // 拖动中的处理函数
        const drag = (clientX, clientY) => {
            if (!isDragging) return;

            const x = clientX - offsetX;
            const y = clientY - offsetY;

            // 限制窗口在视口内
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = this.lyricsWindow.offsetWidth;
            const windowHeight = this.lyricsWindow.offsetHeight;

            const clampedX = Math.max(10, Math.min(x, viewportWidth - windowWidth - 10));
            const clampedY = Math.max(10, Math.min(y, viewportHeight - windowHeight - 10));

            this.lyricsWindow.style.left = `${clampedX}px`;
            this.lyricsWindow.style.top = `${clampedY}px`;
            this.lyricsWindow.style.transform = 'none';
        };

        // 结束拖动的处理函数
        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                this.lyricsWindow.style.cursor = 'move';
            }
        };

        // 鼠标按下事件
        this.lyricsWindow.addEventListener('mousedown', (e) => {
            startDrag(e.clientX, e.clientY, e.target);
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            drag(e.clientX, e.clientY);
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', endDrag);

        // 触摸开始事件（支持手机端）
        this.lyricsWindow.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY, touch.target);
            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        // 触摸移动事件（支持手机端）
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
            // 阻止默认行为
            e.preventDefault();
        });

        // 触摸结束事件（支持手机端）
        document.addEventListener('touchend', endDrag);
    }

    /**
     * 设置灵动岛内容
     */
    setupIslandContent() {
        // 创建搜索界面
        const searchContent = this.createSearchInterface();
        this.island.setContent(searchContent);
        
        // 重写灵动岛的expand和collapse方法，添加欢迎语处理逻辑
        const originalExpand = this.island.expand;
        const originalCollapse = this.island.collapse;
        
        // 重写expand方法
        this.island.expand = function() {
            // 在展开前检查欢迎语是否正在显示
            if (window.islandMusicIntegration && window.islandMusicIntegration.isShowingWelcomeMessage) {
                // 如果欢迎语正在显示，立即隐藏并恢复到原来的状态
                window.islandMusicIntegration.hideWelcomeMessage();
            }
            // 调用原始的expand方法
            originalExpand.call(this);
        };
        
        // 重写collapse方法
        this.island.collapse = function() {
            // 在收起前检查欢迎语是否正在显示
            if (window.islandMusicIntegration && window.islandMusicIntegration.isShowingWelcomeMessage) {
                // 如果欢迎语正在显示，立即隐藏并恢复到原来的状态
                window.islandMusicIntegration.hideWelcomeMessage();
            }
            // 调用原始的collapse方法
            originalCollapse.call(this);
        };
        
        // 保存实例到全局变量，以便在重写的方法中访问
        window.islandMusicIntegration = this;
        
        // 延迟绑定事件，确保元素已经被添加到DOM中
        setTimeout(() => {
            this.bindSearchEvents();
            this.bindPlayerEvents();
        }, 100);
    }

    /**
     * 创建搜索界面
     * @returns {HTMLElement} 搜索界面元素
     */
    createSearchInterface() {
        const container = document.createElement('div');
        container.className = 'flex flex-col h-full';

        // 完全照搬music.js的布局结构
        container.innerHTML = `
            <!-- 搜索功能 -->
            <div class="search-section" style="width: 90%; margin-top: 6px; align-self: center;">
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                    <input 
                        type="text" 
                        id="island-search-input" 
                        placeholder="搜索歌曲..." 
                        style="flex: 1; padding: 6px 10px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; color: white; font-size: 11px; outline: none;"
                    >
                    <button 
                        id="island-search-button" 
                        style="width: 32px; height: 32px; background: transparent; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; font-size: 14px;"
                    >
                        <i class="fa fa-search"></i>
                    </button>
                    <button 
                        id="island-favorites-button" 
                        style="width: 32px; height: 32px; background: transparent; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; font-size: 14px;"
                    >
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
                <div id="island-favorites-list" style="margin-top: 10px; max-height: 200px; overflow-y: auto; font-size: 12px; color: white; display: none;">
                    <!-- 收藏歌曲列表将在这里显示 -->
                </div>
                <div id="island-search-results" style="margin-top: 8px; max-height: 100px; overflow-x: auto; overflow-y: hidden; white-space: nowrap; font-size: 11px; display: none; align-items: flex-start; gap: 6px; padding: 4px 0;">
                        <!-- 搜索结果将在这里显示 -->
                    </div>
            </div>
            
            <!-- 歌曲信息和控制部分（默认隐藏） -->
            <div id="music-info-section" class="w-full hidden" style="flex: 1; flex-direction: column; justify-content: center; align-items: center;">
                <!-- 顶部信息 -->
                <div class="top-info-container" style="display: flex; align-items: center; gap: 10px; width: 90%; margin-bottom: 0;">
                    <div class="album-cover" style="width: 45px; height: 45px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3); font-size: 16px; color: rgba(255, 255, 255, 0.3); overflow: hidden;">
                        <img id="playing-song-image" src="" alt="" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                        <i class="fa fa-music text-white"></i>
                    </div>
                    <div class="song-info" style="display: flex; flex-direction: column; justify-content: center; text-align: left; margin-bottom: 0; flex: 1; padding-right: 8px; min-width: 0;">
                        <p id="playing-song-name" style="font-size: 13px; font-weight: 600; color: #ffffff; margin: 0; padding: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.3;"></p>
                        <p id="playing-song-artist" style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin: 0; padding: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.2; margin-top: 2px;"></p>
                    </div>
                </div>
                
                <!-- 进度条 -->
                <div class="progress-section" style="width: 90%; display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 10px 0;">
                    <span id="music-current-time" style="font-size: 10px; color: rgba(255, 255, 255, 0.7); white-space: nowrap;">0:00</span>
                    <div class="progress-container" style="flex: 1; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; position: relative; cursor: pointer;">
                        <div id="music-progress-bar" class="progress-bar" style="height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px; width: 0%; transition: width 0.1s linear;"></div>
                        <div id="music-progress-handle" class="progress-handle" style="position: absolute; top: 50%; transform: translateY(-50%) scale(0); width: 10px; height: 10px; background: #ffffff; border-radius: 50%; transition: transform 0.2s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); left: 0%"></div>
                    </div>
                    <span id="music-total-time" style="font-size: 10px; color: rgba(255, 255, 255, 0.7); white-space: nowrap;">0:00</span>
                </div>
                
                <!-- 控制按钮 -->
                <div class="control-buttons" style="display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 4px; width: 100%;">
                    <!-- 返回搜索按钮 -->
                    <button id="backToSearchBtn" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: #ffffff; font-size: 18px;">
                        <i class="fa fa-arrow-left"></i>
                    </button>
                    
                    <!-- 播放/暂停按钮 -->
                    <button id="playPauseBtn" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: #ffffff; font-size: 18px;">
                        <i class="fa fa-play"></i>
                    </button>
                    
                    <!-- 收藏按钮 -->
                    <button id="favoriteBtn" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; color: #ffffff; font-size: 18px;">
                        <i class="far fa-star"></i>
                    </button>
                    

                </div>
            </div>
        `;

        // 添加滚动条样式和鼠标滚轮功能
        const resultsContainer = container.querySelector('#island-search-results');
        if (resultsContainer) {
            resultsContainer.style.scrollbarWidth = 'thin';
            resultsContainer.style.scrollbarColor = 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)';
            
            // 添加鼠标滚轮功能
            resultsContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                resultsContainer.scrollLeft += e.deltaY * 0.5;
            });
        }

        // 添加搜索结果项的CSS样式（完全照搬music.js实现）
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* 搜索结果和收藏列表项样式（完全照搬music.js实现） */
            #island-search-results .search-result-item,
            #island-favorites-list .search-result-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding: 6px 4px;
                min-width: 85px;
                max-width: 85px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: normal;
                text-align: center;
                border: none;
                box-shadow: none;
            }
            #island-search-results .search-result-item:hover,
            #island-favorites-list .search-result-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }
            
            /* 搜索结果和收藏列表封面样式（完全照搬music.js实现） */
            #island-search-results .result-cover,
            #island-favorites-list .result-cover {
                width: 50px;
                height: 50px;
                border-radius: 6px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            #island-search-results .result-cover img,
            #island-favorites-list .result-cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            /* 搜索结果和收藏列表信息样式（完全照搬music.js实现） */
            #island-search-results .result-info,
            #island-favorites-list .result-info {
                width: 100%;
                padding: 0 2px;
            }
            #island-search-results .result-song-name,
            #island-favorites-list .result-song-name {
                font-size: 10px;
                font-weight: 500;
                color: #ffffff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1.3;
                margin-bottom: 2px;
            }
            #island-search-results .result-singer-name,
            #island-favorites-list .result-singer-name {
                font-size: 9px;
                color: rgba(255, 255, 255, 0.6);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1.2;
            }
            
            /* 隐藏滚动条 */
            #island-search-results::-webkit-scrollbar {
                display: none;
            }
            #island-search-results {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            #island-favorites-list::-webkit-scrollbar {
                display: none;
            }
            #island-favorites-list {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            /* 进度条样式（照搬music.js实现） */
            .progress-container:hover .progress-handle {
                transform: translateY(-50%) scale(1);
            }
        `;
        document.head.appendChild(styleElement);

        return container;
    }

    /**
     * 绑定搜索事件
     */
    bindSearchEvents() {
        const searchButton = document.getElementById('island-search-button');
        const searchInput = document.getElementById('island-search-input');
        const favoritesButton = document.getElementById('island-favorites-button');

        console.log('绑定搜索事件:', { searchButton, searchInput, favoritesButton });

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                console.log('搜索按钮点击，关键词:', searchInput.value);
                this.performSearch(searchInput.value);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('回车键点击，关键词:', searchInput.value);
                    this.performSearch(searchInput.value);
                }
            });
        }

        if (favoritesButton) {
            favoritesButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('收藏按钮点击');
                this.toggleFavoritesList();
            });
        }
    }

    /**
     * 切换收藏列表显示/隐藏
     */
    toggleFavoritesList() {
        const favoritesList = document.getElementById('island-favorites-list');
        const searchResults = document.getElementById('island-search-results');
        const searchInput = document.getElementById('island-search-input');
        const searchButton = document.getElementById('island-search-button');
        const favoritesButton = document.getElementById('island-favorites-button');

        if (favoritesList) {
            if (favoritesList.style.display === 'none' || favoritesList.style.display === '') {
                // 显示收藏列表
                favoritesList.style.display = 'block';
                // 隐藏搜索结果
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
                // 隐藏搜索框和搜索按钮
                if (searchInput) {
                    searchInput.style.display = 'none';
                }
                if (searchButton) {
                    searchButton.style.display = 'none';
                }
                // 隐藏收藏按钮
                if (favoritesButton) {
                    favoritesButton.style.display = 'none';
                }
                // 加载收藏歌曲
                this.loadFavorites();
            } else {
                // 隐藏收藏列表
                favoritesList.style.display = 'none';
                // 显示搜索框和搜索按钮
                if (searchInput) {
                    searchInput.style.display = 'block';
                }
                if (searchButton) {
                    searchButton.style.display = 'flex';
                }
                // 显示收藏按钮
                if (favoritesButton) {
                    favoritesButton.style.display = 'flex';
                }
            }
        }
    }

    /**
     * 加载收藏歌曲
     */
    loadFavorites() {
        const favoritesList = document.getElementById('island-favorites-list');
        if (!favoritesList) return;

        // 从localStorage加载收藏歌曲
        let favorites = [];
        try {
            const storedFavorites = localStorage.getItem('musicFavorites');
            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }
        } catch (error) {
            console.error('加载收藏歌曲失败:', error);
        }

        // 清空列表
        favoritesList.innerHTML = '';

        // 添加返回按钮
        const backButton = document.createElement('div');
        backButton.className = 'search-result-item flex-shrink-0';
        backButton.innerHTML = `
            <div class="result-cover flex items-center justify-center">
                <i class="fa fa-arrow-left text-white text-xl"></i>
            </div>
            <div class="result-info">
                <div class="result-song-name">返回</div>
                <div class="result-singer-name">搜索</div>
            </div>
        `;

        // 添加点击事件
        backButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavoritesList();
        });

        favoritesList.appendChild(backButton);

        if (favorites.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-center text-gray-400 text-sm py-8 flex-shrink-0';
            emptyMessage.textContent = '暂无收藏歌曲';
            favoritesList.appendChild(emptyMessage);
            return;
        }

        // 添加水平滚动样式
        favoritesList.style.display = 'flex';
        favoritesList.style.overflowX = 'auto';
        favoritesList.style.overflowY = 'hidden';
        favoritesList.style.whiteSpace = 'nowrap';
        favoritesList.style.gap = '8px';
        favoritesList.style.padding = '8px 0';

        // 隐藏滚动条
        favoritesList.style.scrollbarWidth = 'none';
        favoritesList.style.msOverflowStyle = 'none';
        favoritesList.style.webkitOverflowScrollbar = 'none';

        // 添加鼠标滚轮功能
        favoritesList.addEventListener('wheel', (e) => {
            e.preventDefault();
            favoritesList.scrollLeft += e.deltaY * 0.5;
        });

        // 添加收藏歌曲（水平布局）
        favorites.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'search-result-item flex-shrink-0';
            songItem.innerHTML = `
                <div class="result-cover">
                    <img src="${song.cover || song.pic || 'https://via.placeholder.com/60'}" alt="封面" class="w-full h-full object-cover">
                </div>
                <div class="result-info">
                    <div class="result-song-name">${song.name}</div>
                    <div class="result-singer-name">${song.singer}</div>
                </div>
            `;

            // 添加点击事件
            songItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(song);
            });

            favoritesList.appendChild(songItem);
        });
    }

    /**
     * 保存收藏歌曲
     * @param {Object} song - 歌曲信息
     */
    saveFavorite(song) {
        // 从localStorage加载收藏歌曲
        let favorites = [];
        try {
            const storedFavorites = localStorage.getItem('musicFavorites');
            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }
        } catch (error) {
            console.error('加载收藏歌曲失败:', error);
        }

        // 检查歌曲是否已收藏
        const isAlreadyFavorite = favorites.some(item => item.rid === song.rid);
        if (!isAlreadyFavorite) {
            // 添加到收藏
            favorites.push(song);
            // 保存到localStorage
            try {
                localStorage.setItem('musicFavorites', JSON.stringify(favorites));
            } catch (error) {
                console.error('保存收藏歌曲失败:', error);
            }
        }
    }

    /**
     * 移除收藏歌曲
     * @param {string} rid - 歌曲rid
     */
    removeFavorite(rid) {
        // 从localStorage加载收藏歌曲
        let favorites = [];
        try {
            const storedFavorites = localStorage.getItem('musicFavorites');
            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }
        } catch (error) {
            console.error('加载收藏歌曲失败:', error);
        }

        // 过滤掉要移除的歌曲
        favorites = favorites.filter(item => item.rid !== rid);

        // 保存到localStorage
        try {
            localStorage.setItem('musicFavorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('保存收藏歌曲失败:', error);
        }
    }

    /**
     * 绑定播放器事件
     */
    bindPlayerEvents() {
        const playPauseButton = document.getElementById('playPauseBtn');
        const favoriteButton = document.getElementById('favoriteBtn');
        const backToSearchButton = document.getElementById('backToSearchBtn');

        if (playPauseButton) {
            playPauseButton.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        if (favoriteButton) {
            favoriteButton.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }

        if (backToSearchButton) {
            backToSearchButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSearchElements();
                const musicInfoSection = document.getElementById('music-info-section');
                if (musicInfoSection) {
                    musicInfoSection.classList.add('hidden');
                }
            });
        }
    }

    /**
     * 绑定音频事件
     */
    bindAudioEvents() {
        if (!this.currentAudio) return;

        this.currentAudio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.currentAudio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.currentAudio.addEventListener('ended', () => {
            this.showPlayEndedMessage();
            this.updatePlayButtonIcon(false);
            // 音乐播放完后隐藏歌词窗和音乐图标
            this.hideLyricsWindow();
            this.hideMusicIcon();
        });

        // 绑定进度条点击事件
        this.bindProgressBarEvents();
    }

    /**
     * 绑定进度条事件
     */
    bindProgressBarEvents() {
        const progressContainer = document.querySelector('.progress-section div');
        if (!progressContainer) return;

        let isDragging = false;

        // 鼠标按下事件
        progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSeek(e);
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSeek(e);
            }
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 点击事件
        progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                updateSeek(e);
            }
        });

        // 更新播放位置的函数
        const updateSeek = (e) => {
            if (!this.currentAudio) return;

            const rect = progressContainer.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;
            
            // 限制在容器范围内
            offsetX = Math.max(0, Math.min(offsetX, rect.width));

            const duration = this.currentAudio.duration;
            const seekTime = (offsetX / rect.width) * duration;

            if (!isNaN(seekTime)) {
                this.currentAudio.currentTime = seekTime;
                this.updateProgress();
            }
        };
    }

    /**
     * 显示播放结束提示
     */
    showPlayEndedMessage() {
        // 创建提示元素
        const messageElement = document.createElement('div');
        messageElement.className = 'fixed inset-0 z-50 flex items-center justify-center pointer-events-none';
        messageElement.style.backdropFilter = 'blur(10px)';
        messageElement.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 200px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="fa fa-info-circle text-white text-xl"></i>
                </div>
                <p style="color: white; font-size: 14px; text-align: center; margin: 0;">播放结束</p>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(messageElement);

        // 2秒后自动移除
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 2000);
    }

    /**
     * 更新进度条
     */
    updateProgress() {
        if (!this.currentAudio) return;

        const currentTime = this.currentAudio.currentTime;
        const duration = this.currentAudio.duration;
        const progress = (currentTime / duration) * 100;

        const progressBar = document.getElementById('music-progress-bar');
        const progressHandle = document.getElementById('music-progress-handle');
        const currentTimeElement = document.getElementById('music-current-time');
        const totalTimeElement = document.getElementById('music-total-time');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (progressHandle) {
            progressHandle.style.left = `${progress}%`;
        }

        if (currentTimeElement) {
            currentTimeElement.textContent = this.formatTime(currentTime);
        }

        if (totalTimeElement) {
            totalTimeElement.textContent = this.formatTime(duration);
        }

        // 更新歌词显示
        this.updateLyricsDisplay();
    }

    /**
     * 更新时间显示
     */
    updateTimeDisplay() {
        if (!this.currentAudio) return;

        const duration = this.currentAudio.duration;
        const totalTimeElement = document.getElementById('music-total-time');

        if (totalTimeElement) {
            totalTimeElement.textContent = this.formatTime(duration);
        }
    }

    /**
     * 格式化时间
     * @param {number} seconds - 秒数
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 切换收藏状态
     */
    toggleFavorite() {
        const favoriteButton = document.getElementById('favoriteBtn');
        if (favoriteButton && this.currentAudio) {
            const icon = favoriteButton.querySelector('i');
            // 确保始终有 fa-star 类
            if (!icon.classList.contains('fa-star')) {
                icon.classList.add('fa-star');
            }
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#facc15'; // 将星星图标变为黄色
                this.showMessage('已添加到收藏');
                // 保存到收藏
                this.saveFavorite(this.currentSong);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = 'hsla(0, 0%, 97%, 1.00)'; // 恢复默认颜色
                this.showMessage('已从收藏中移除');
                // 从收藏中移除
                this.removeFavorite(this.currentSong.rid);
            }
        }
    }

    /**
     * 执行搜索
     * @param {string} keyword - 搜索关键词
     */
    async performSearch(keyword) {
        if (!keyword || keyword.trim() === '') {
            this.showMessage('请输入搜索关键词');
            return;
        }

        console.log('开始搜索，关键词:', keyword);

        // 隐藏收藏列表
        const favoritesList = document.getElementById('island-favorites-list');
        if (favoritesList) {
            favoritesList.style.display = 'none';
        }

        // 不显示加载状态，直接执行搜索
        try {
            // 执行搜索
            const results = await this.musicSearch.search(keyword);
            console.log('搜索完成，结果数量:', results.length);

            // 直接显示结果
            this.displayResults(results);
        } catch (error) {
            console.error('搜索失败:', error);
            this.showMessage('搜索失败，请重试');
        }
    }

    /**
     * 显示搜索结果
     * @param {Array} results - 搜索结果数组
     */
    displayResults(results) {
        console.log('显示搜索结果开始:', { results, length: results.length });
        
        const resultsContainer = document.getElementById('island-search-results');
        const searchInput = document.getElementById('island-search-input');
        const searchButton = document.getElementById('island-search-button');
        const favoritesButton = document.getElementById('island-favorites-button');
        
        console.log('搜索结果容器:', resultsContainer);
        
        if (!resultsContainer) {
            console.error('搜索结果容器不存在');
            return;
        }

        // 隐藏搜索框、搜索按钮和收藏按钮
        if (searchInput) {
            searchInput.style.display = 'none';
        }
        if (searchButton) {
            searchButton.style.display = 'none';
        }
        if (favoritesButton) {
            favoritesButton.style.display = 'none';
        }

        if (results.length === 0) {
            console.log('搜索结果为空');
            // 清空容器
            resultsContainer.innerHTML = '';
            
            // 添加返回按钮
            const backButton = document.createElement('div');
            backButton.className = 'search-result-item';
            backButton.innerHTML = `
                <div class="result-cover flex items-center justify-center">
                    <i class="fa fa-arrow-left text-white text-xl"></i>
                </div>
                <div class="result-info">
                    <div class="result-song-name">返回</div>
                    <div class="result-singer-name">搜索</div>
                </div>
            `;
            
            // 添加点击事件
            backButton.addEventListener('click', (e) => {
                e.stopPropagation();
                // 显示搜索框、搜索按钮和收藏按钮
                if (searchInput) {
                    searchInput.style.display = 'block';
                }
                if (searchButton) {
                    searchButton.style.display = 'flex';
                }
                if (favoritesButton) {
                    favoritesButton.style.display = 'flex';
                }
                // 隐藏搜索结果
                resultsContainer.style.display = 'none';
            });
            
            resultsContainer.appendChild(backButton);
            
            // 添加空结果消息
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-center text-gray-400 text-sm py-8 flex-shrink-0';
            emptyMessage.textContent = '未找到相关歌曲';
            resultsContainer.appendChild(emptyMessage);
            
            resultsContainer.style.display = 'flex';
            return;
        }

        console.log('搜索结果数量:', results.length);

        // 清空容器
        resultsContainer.innerHTML = '';

        // 添加返回按钮
        const backButton = document.createElement('div');
        backButton.className = 'search-result-item';
        backButton.innerHTML = `
            <div class="result-cover flex items-center justify-center">
                <i class="fa fa-arrow-left text-white text-xl"></i>
            </div>
            <div class="result-info">
                <div class="result-song-name">返回</div>
                <div class="result-singer-name">搜索</div>
            </div>
        `;
        
        // 添加点击事件
        backButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // 显示搜索框、搜索按钮和收藏按钮
            if (searchInput) {
                searchInput.style.display = 'block';
            }
            if (searchButton) {
                searchButton.style.display = 'flex';
            }
            if (favoritesButton) {
                favoritesButton.style.display = 'flex';
            }
            // 隐藏搜索结果
            resultsContainer.style.display = 'none';
        });
        
        resultsContainer.appendChild(backButton);

        // 创建结果列表（水平滚动显示，参考music.js实现）
        results.forEach((song, index) => {
            console.log('创建歌曲项:', index, song);
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="result-cover">
                    <img src="${song.cover || song.pic || 'https://via.placeholder.com/60'}" alt="封面" class="w-full h-full object-cover">
                </div>
                <div class="result-info">
                    <div class="result-song-name">${song.name}</div>
                    <div class="result-singer-name">${song.singer}</div>
                </div>
            `;
            
            // 添加点击事件
            resultItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(song);
            });
            
            resultsContainer.appendChild(resultItem);
        });

        // 显示搜索结果
        resultsContainer.style.display = 'flex';
        
        // 隐藏滚动条和滑动样式
        resultsContainer.style.scrollbarWidth = 'none';
        resultsContainer.style.msOverflowStyle = 'none';
        resultsContainer.style.webkitOverflowScrollbar = 'none';
        
        // 移除鼠标滚轮事件监听器（如果存在）
        const originalWheel = resultsContainer.onwheel;
        if (originalWheel) {
            resultsContainer.removeEventListener('wheel', originalWheel);
        }

        console.log('显示搜索结果完成');

    }

    /**
     * 创建水平滚动的歌曲项（参考music.js实现）
     * @param {Object} song - 歌曲信息
     * @returns {HTMLElement} 歌曲项元素
     */
    createHorizontalSongItem(song) {
        console.log('创建水平滚动歌曲项，歌曲信息:', song);
        
        const item = document.createElement('div');
        item.className = 'search-result-item flex flex-col items-center gap-4 p-6 min-w-[80px] max-w-[80px] bg-white bg-opacity-5 rounded-lg cursor-pointer transition-all hover:bg-opacity-10 hover:-translate-y-2';

        // 歌曲封面
        const imageUrl = song.cover || song.pic;
        const hasImage = imageUrl && imageUrl !== '';
        console.log('歌曲图片信息:', { hasImage, cover: song.cover, pic: song.pic, imageUrl });
        
        const coverContainer = document.createElement('div');
        coverContainer.className = 'result-cover w-[60px] h-[60px] rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500';
        
        if (hasImage) {
            // 创建图片元素
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = song.name;
            img.className = 'w-full h-full object-cover';
            
            // 添加错误处理
            img.onerror = function() {
                console.error('图片加载失败:', this.src);
                // 清空容器并显示音乐图标
                coverContainer.innerHTML = '<i class="fa fa-music text-white text-lg"></i>';
            };
            
            // 添加加载成功处理
            img.onload = function() {
                console.log('图片加载成功:', this.src);
            };
            
            // 添加到容器
            coverContainer.appendChild(img);
        } else {
            // 显示默认音乐图标
            coverContainer.innerHTML = '<i class="fa fa-music text-white text-lg"></i>';
        }
        
        // 创建歌曲信息容器
        const infoContainer = document.createElement('div');
        infoContainer.className = 'result-info w-full text-center';
        
        // 创建歌曲名称
        const nameElement = document.createElement('div');
        nameElement.className = 'result-song-name text-sm font-medium text-white truncate';
        nameElement.textContent = song.name;
        infoContainer.appendChild(nameElement);
        
        // 创建歌曲艺术家
        const artistElement = document.createElement('div');
        artistElement.className = 'result-singer-name text-xs text-gray-400 truncate';
        artistElement.textContent = song.singer;
        infoContainer.appendChild(artistElement);
        
        // 添加到主容器
        item.appendChild(coverContainer);
        item.appendChild(infoContainer);

        // 绑定点击事件
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止触发灵动岛展开/收起
            this.playSong(song);
        });

        return item;
    }

    /**
     * 创建歌曲项（垂直显示，保留备用）
     * @param {Object} song - 歌曲信息
     * @returns {HTMLElement} 歌曲项元素
     */
    createSongItem(song) {
        console.log('创建歌曲项，歌曲信息:', song);
        
        const item = document.createElement('div');
        item.className = 'flex items-center p-3 hover:bg-white hover:bg-opacity-5 rounded-lg cursor-pointer transition-colors';

        // 歌曲信息
        const imageUrl = song.cover || song.pic;
        const hasImage = imageUrl && imageUrl !== '';
        console.log('歌曲图片信息:', { hasImage, cover: song.cover, pic: song.pic, imageUrl });
        
        // 创建图片容器
        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-10 h-10 rounded bg-gray-700 flex items-center justify-center overflow-hidden';
        
        if (hasImage) {
            // 创建图片元素
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = song.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            
            // 添加错误处理
            img.onerror = function() {
                console.error('图片加载失败:', this.src);
                // 清空容器并显示音乐图标
                imageContainer.innerHTML = '<i class="fa fa-music text-white"></i>';
            };
            
            // 添加加载成功处理
            img.onload = function() {
                console.log('图片加载成功:', this.src);
            };
            
            // 添加到容器
            imageContainer.appendChild(img);
        } else {
            // 显示默认音乐图标
            imageContainer.innerHTML = '<i class="fa fa-music text-white"></i>';
        }
        
        // 创建歌曲信息容器
        const infoContainer = document.createElement('div');
        infoContainer.className = 'ml-3 flex-1';
        
        // 创建歌曲名称
        const nameElement = document.createElement('p');
        nameElement.className = 'text-sm font-medium text-white truncate';
        nameElement.textContent = song.name;
        infoContainer.appendChild(nameElement);
        
        // 创建歌曲艺术家和专辑
        const artistElement = document.createElement('p');
        artistElement.className = 'text-xs text-gray-400 truncate';
        artistElement.textContent = `${song.singer} - ${song.album}`;
        infoContainer.appendChild(artistElement);
        
        // 创建歌曲时长
        const durationElement = document.createElement('div');
        durationElement.className = 'text-xs text-gray-400';
        durationElement.textContent = song.duration;
        
        // 添加到主容器
        item.appendChild(imageContainer);
        item.appendChild(infoContainer);
        item.appendChild(durationElement);

        // 绑定点击事件
        item.addEventListener('click', () => {
            this.playSong(song);
        });

        return item;
    }

    /**
     * 播放歌曲
     * @param {Object} song - 歌曲信息
     */
    async playSong(song) {
        try {
            // 停止当前播放
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }

            // 保存当前歌曲信息
            this.currentSong = song;

            // 获取歌曲详细信息
            const songDetail = await this.musicSearch.getSongDetail(song.rid);
            console.log('歌曲详细信息:', songDetail);
            
            // 提取歌词数据并在控制台显示
            const lyrics = songDetail.data?.lrc || songDetail.lrc;
            console.log('提取的歌词数据:', lyrics);
            
            // 提取歌曲直链
            const songUrl = songDetail.data?.url || songDetail.url;
            console.log('提取的歌曲直链:', songUrl);
            
            // 解析歌词
            this.parsedLyrics = this.parseLyrics(lyrics);
            console.log('解析后的歌词:', this.parsedLyrics);
            
            if (!songUrl) {
                this.showMessage('歌曲链接获取失败');
                return;
            }

            // 播放歌曲
            this.currentAudio = this.musicSearch.playSong(songUrl);

            // 确保currentAudio不为null
            if (!this.currentAudio) {
                this.showMessage('播放失败，请重试');
                return;
            }

            // 显示歌词窗口
            this.showLyricsWindow();

            // 手动触发loadedmetadata事件，确保时长被正确设置
            setTimeout(() => {
                if (this.currentAudio) {
                    this.updateTimeDisplay();
                }
            }, 1000);

            // 更新播放器界面
            this.updatePlayerInterface(song);

            // 更新播放按钮图标为暂停图标，因为歌曲正在播放
            const playPauseButton = document.getElementById('playPauseBtn');
            if (playPauseButton) {
                playPauseButton.innerHTML = '<i class="fa fa-pause"></i>';
            }

            // 绑定音频事件
            this.bindAudioEvents();

            // 隐藏搜索相关元素，只显示播放控制
            this.hideSearchElements();

            // 显示播放状态 - 迷你状态完全隐藏内容，只显示空白灵动岛
            this.island.updateDefaultContent('<div class="w-full h-full"></div>');


        } catch (error) {
            console.error('播放歌曲失败:', error);
            this.showMessage('播放歌曲失败');
        }
    }

    /**
     * 隐藏搜索相关元素
     */
    hideSearchElements() {
        const searchSection = document.querySelector('.search-section');
        const musicInfoSection = document.getElementById('music-info-section');

        if (searchSection) {
            searchSection.style.display = 'none';
        }

        if (musicInfoSection) {
            musicInfoSection.classList.remove('hidden');
        }
    }

    /**
     * 显示搜索相关元素
     */
    showSearchElements() {
        const searchSection = document.querySelector('.search-section');

        if (searchSection) {
            searchSection.style.display = 'block';
        }
    }

    /**
     * 检查歌曲是否已收藏
     * @param {string} songRid - 歌曲rid
     * @returns {boolean} 是否已收藏
     */
    isSongFavorited(songRid) {
        try {
            const storedFavorites = localStorage.getItem('musicFavorites');
            if (storedFavorites) {
                const favorites = JSON.parse(storedFavorites);
                return favorites.some(item => item.rid === songRid);
            }
        } catch (error) {
            console.error('检查收藏状态失败:', error);
        }
        return false;
    }

    /**
     * 更新播放器界面
     * @param {Object} song - 歌曲信息
     */
    updatePlayerInterface(song) {
        const musicInfoSection = document.getElementById('music-info-section');
        const songName = document.getElementById('playing-song-name');
        const songArtist = document.getElementById('playing-song-artist');
        const songImage = document.getElementById('playing-song-image');
        const imageContainer = songImage ? songImage.parentElement : null;
        const musicIcon = imageContainer ? imageContainer.querySelector('.fa-music') : null;
        const favoriteButton = document.getElementById('favoriteBtn');

        if (musicInfoSection && songName && songArtist) {
            songName.textContent = song.name;
            songArtist.textContent = `${song.singer} - ${song.album}`;
            musicInfoSection.classList.remove('hidden');
        }

        // 更新歌曲封面图片
        if (songImage && imageContainer && musicIcon) {
            const imageUrl = song.cover || song.pic;
            const hasImage = imageUrl && imageUrl !== '';
            
            if (hasImage) {
                songImage.src = imageUrl;
                songImage.alt = song.name;
                songImage.style.display = 'block';
                if (musicIcon) {
                    musicIcon.style.display = 'none';
                }
            } else {
                songImage.style.display = 'none';
                if (musicIcon) {
                    musicIcon.style.display = 'block';
                }
            }
        }

        // 更新收藏按钮状态
        if (favoriteButton) {
            const icon = favoriteButton.querySelector('i');
            if (icon) {
                const isFavorited = this.isSongFavorited(song.rid);
                if (isFavorited) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.classList.add('fa-star');
                    icon.style.color = '#facc15'; // 收藏状态为黄色
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.classList.add('fa-star');
                    icon.style.color = '#ffffff'; // 未收藏状态为白色
                }
            }
        }
    }

    /**
     * 切换播放/暂停
     */
    togglePlayPause() {
        if (!this.currentAudio) return;

        const playPauseButton = document.getElementById('playPauseBtn');
        if (!playPauseButton) return;

        if (this.currentAudio.paused) {
            this.currentAudio.play().catch(error => {
                console.error('播放失败:', error);
                this.showMessage('播放失败');
            });
            this.updatePlayButtonIcon(true);
            // 播放时显示歌词窗
            this.showLyricsWindow();
        } else {
            this.currentAudio.pause();
            this.updatePlayButtonIcon(false);
            // 暂停时隐藏歌词窗和音乐图标
            this.hideLyricsWindow();
            // 确保音乐图标也被隐藏
            if (this.musicIcon) {
                this.musicIcon.style.display = 'none';
            }
        }
    }

    /**
     * 更新播放按钮图标
     * @param {boolean} isPlaying - 是否正在播放
     */
    updatePlayButtonIcon(isPlaying) {
        const playPauseButton = document.getElementById('playPauseBtn');
        if (playPauseButton) {
            playPauseButton.innerHTML = isPlaying ? '<i class="fa fa-pause"></i>' : '<i class="fa fa-play"></i>';
        }
    }

    /**
     * 停止播放
     */
    stopPlayback() {
        if (!this.currentAudio) return;

        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;

        // 重置播放器界面
        const musicInfoSection = document.getElementById('music-info-section');
        const playPauseButton = document.getElementById('playPauseBtn');

        if (playPauseButton) {
            playPauseButton.innerHTML = '<i class="fa fa-play"></i>';
        }

        if (musicInfoSection) {
            musicInfoSection.classList.add('hidden');
        }

        // 隐藏歌词窗口
        this.hideLyricsWindow();

        // 隐藏音乐图标
        this.hideMusicIcon();

        // 重新显示搜索相关元素
        this.showSearchElements();

        // 重置灵动岛默认内容 - 迷你状态完全隐藏内容
        this.island.updateDefaultContent('<div class="w-full h-full"></div>');

    }

    /**
     * 显示歌词窗口
     */
    showLyricsWindow() {
        if (this.lyricsWindow && this.musicIcon) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = 200;
            const windowHeight = 150;
            
            // 获取音乐图标的位置
            const iconRect = this.musicIcon.getBoundingClientRect();
            
            // 计算歌词窗口的位置，在音乐图标左侧
            let left = iconRect.left - windowWidth - 10;
            let top = iconRect.top + (iconRect.height - windowHeight) / 2;
            
            // 确保位置在屏幕内
            left = Math.max(10, Math.min(left, viewportWidth - windowWidth - 10));
            top = Math.max(10, Math.min(top, viewportHeight - windowHeight - 10));
            
            // 设置歌词窗口的大小和位置
            this.lyricsWindow.style.width = `${windowWidth}px`;
            this.lyricsWindow.style.height = `${windowHeight}px`;
            this.lyricsWindow.style.maxWidth = `${windowWidth}px`;
            this.lyricsWindow.style.minWidth = `${windowWidth}px`;
            this.lyricsWindow.style.maxHeight = `${windowHeight}px`;
            this.lyricsWindow.style.minHeight = `${windowHeight}px`;
            this.lyricsWindow.style.left = `${left}px`;
            this.lyricsWindow.style.top = `${top}px`;
            this.lyricsWindow.style.bottom = 'auto';
            this.lyricsWindow.style.right = 'auto';
            
            // 使用requestAnimationFrame优化动画
            requestAnimationFrame(() => {
                // 添加过渡动画
                this.lyricsWindow.style.opacity = '0';
                this.lyricsWindow.style.transform = 'scale(0.8)';
                this.lyricsWindow.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                this.lyricsWindow.style.display = 'block';
                
                // 触发重排
                this.lyricsWindow.offsetWidth;
                
                // 显示歌词窗口
                this.lyricsWindow.style.opacity = '1';
                this.lyricsWindow.style.transform = 'scale(1)';
                
                // 隐藏音乐图标
                this.musicIcon.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                this.musicIcon.style.opacity = '0';
                setTimeout(() => {
                    this.hideMusicIcon();
                }, 200);
            });
        }
    }

    /**
     * 隐藏歌词窗口
     */
    hideLyricsWindow() {
        if (this.lyricsWindow) {
            // 获取歌词窗口的位置
            const rect = this.lyricsWindow.getBoundingClientRect();
            
            // 使用requestAnimationFrame优化动画
            requestAnimationFrame(() => {
                // 添加淡出动画
                this.lyricsWindow.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                this.lyricsWindow.style.opacity = '0';
                this.lyricsWindow.style.transform = 'scale(0.8)';
                
                // 动画结束后隐藏歌词窗口
                setTimeout(() => {
                    this.lyricsWindow.style.display = 'none';
                    
                    // 如果音乐还在播放，显示音乐图标
                    if (this.musicIcon && this.currentAudio && !this.currentAudio.paused) {
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        const iconWidth = 40;
                        const iconHeight = 40;
                        
                        // 计算音乐图标的位置，在歌词窗右侧
                        let iconLeft = rect.left + rect.width + 10;
                        let iconTop = rect.top + (rect.height - iconHeight) / 2;
                        
                        // 确保音乐图标在屏幕内
                        iconLeft = Math.max(10, Math.min(iconLeft, viewportWidth - iconWidth - 10));
                        iconTop = Math.max(10, Math.min(iconTop, viewportHeight - iconHeight - 10));
                        
                        // 设置音乐图标的位置
                        this.musicIcon.style.left = `${iconLeft}px`;
                        this.musicIcon.style.top = `${iconTop}px`;
                        this.musicIcon.style.bottom = 'auto';
                        this.musicIcon.style.right = 'auto';
                        
                        // 显示音乐图标并添加淡入动画
                        this.musicIcon.style.display = 'flex';
                        this.musicIcon.style.opacity = '0';
                        this.musicIcon.style.transform = 'scale(0.8)';
                        this.musicIcon.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                        
                        // 触发重排
                        this.musicIcon.offsetWidth;
                        
                        // 显示音乐图标
                        this.musicIcon.style.opacity = '1';
                        this.musicIcon.style.transform = 'scale(1)';
                    }
                }, 200);
            });
        }
    }

    /**
     * 更新歌词窗口显示
     */
    updateLyricsWindowDisplay() {
        if (!this.lyricsWindow) return;

        const currentLyricElement = document.getElementById('current-lyric');
        const songNameElement = document.getElementById('lyrics-song-name');
        const songArtistElement = document.getElementById('lyrics-song-artist');

        if (currentLyricElement) {
            this.updateLyricsDisplay();
        }

        if (songNameElement && songArtistElement && this.currentSong) {
            songNameElement.textContent = this.currentSong.name;
            songArtistElement.textContent = this.currentSong.singer;
        }
    }

    /**
     * 解析歌词
     * @param {string} lyrics - 歌词字符串
     * @returns {Array} 解析后的歌词数组
     */
    parseLyrics(lyrics) {
        if (!lyrics) return [];

        const lines = lyrics.split('\n');
        const parsed = [];

        lines.forEach(line => {
            // 匹配时间标签 [mm:ss.xx]
            const timeMatch = line.match(/\[(\d{2}):(\d{2}\.\d{2})\]/);
            if (timeMatch) {
                const minutes = parseInt(timeMatch[1]);
                const seconds = parseFloat(timeMatch[2]);
                const totalSeconds = minutes * 60 + seconds;
                
                // 提取歌词文本
                const text = line.replace(/\[(\d{2}):(\d{2}\.\d{2})\]/, '').trim();
                
                if (text) {
                    parsed.push({
                        time: totalSeconds,
                        text: text
                    });
                }
            }
        });

        // 按时间排序
        return parsed.sort((a, b) => a.time - b.time);
    }

    /**
     * 更新歌词显示
     */
    updateLyricsDisplay() {
        if (!this.currentAudio || this.parsedLyrics.length === 0) return;

        const currentTime = this.currentAudio.currentTime;
        const lyricsElement = document.getElementById('current-lyric');
        if (!lyricsElement) return;

        // 查找当前时间对应的歌词
        let currentLyric = '';
        for (let i = this.parsedLyrics.length - 1; i >= 0; i--) {
            if (this.parsedLyrics[i].time <= currentTime) {
                currentLyric = this.parsedLyrics[i].text;
                break;
            }
        }

        if (currentLyric) {
            lyricsElement.textContent = currentLyric;
        } else {
            lyricsElement.textContent = '歌词加载中...';
        }
    }

    /**
     * 显示消息
     * @param {string} message - 消息内容
     */
    showMessage(message) {
        // 创建提示元素
        const messageElement = document.createElement('div');
        messageElement.className = 'fixed inset-0 z-50 flex items-center justify-center pointer-events-none';
        messageElement.style.backdropFilter = 'blur(10px)';
        messageElement.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.8); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 200px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="fa fa-info-circle text-white text-xl"></i>
                </div>
                <p style="color: white; font-size: 14px; text-align: center; margin: 0;">${message}</p>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(messageElement);

        // 2秒后自动移除
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 2000);
    }
}

// 导出集成实例
const islandMusicIntegration = new IslandMusicIntegration();
window.islandMusicIntegration = islandMusicIntegration;

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        islandMusicIntegration.init();
    });
} else {
    islandMusicIntegration.init();
}