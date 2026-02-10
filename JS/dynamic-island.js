class DynamicIsland {
    constructor() {
        this.island = null;
        this.content = null;
        this.isExpanded = false;
        this.isAnimating = false;
        this.initialWidth = 110;
        this.initialHeight = 34;
        this.expandedWidth = 250;
        this.expandedHeight = 170;
        this.animationDuration = 250;
    }

    /**
     * 初始化灵动岛
     */
    init() {
        this.createIsland();
        this.createContent();
        this.bindEvents();
    }

    /**
     * 创建灵动岛元素（参考music.js实现）
     */
    createIsland() {
        // 检查是否已存在
        if (document.getElementById('dynamic-island')) {
            this.island = document.getElementById('dynamic-island');
            return;
        }

        // 创建主容器
        this.island = document.createElement('div');
        this.island.id = 'dynamic-island';
        this.island.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer';
        this.island.style.width = `${this.initialWidth}px`;
        this.island.style.height = `${this.initialHeight}px`;
        this.island.style.borderRadius = '17px';
        this.island.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.island.style.backdropFilter = 'blur(20px)';
        this.island.style.webkitBackdropFilter = 'blur(20px)';
        this.island.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        // 使用更平滑的easing函数和更高效的动画属性
        this.island.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), width ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), height ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        this.island.style.transformOrigin = 'center';
        this.island.style.overflow = 'hidden';
        this.island.style.display = 'flex';
        this.island.style.flexDirection = 'column';
        this.island.style.alignItems = 'center';
        this.island.style.justifyContent = 'center';
        this.island.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        this.island.style.padding = '4px';
        this.island.style.userSelect = 'none';
        this.island.style.webkitUserSelect = 'none';
        // 优化硬件加速
        this.island.style.willChange = 'transform, width, height, border-radius, background-color';
        this.island.style.transform = 'translateX(-50%) translateZ(0)';
        this.island.style.perspective = '1000px';
        this.island.style.backfaceVisibility = 'hidden';

        // 添加到页面
        document.body.appendChild(this.island);
    }

    /**
     * 创建内容容器
     */
    createContent() {
        // 创建默认内容
        const defaultContent = document.createElement('div');
        defaultContent.id = 'island-default-content';
        defaultContent.className = 'flex items-center justify-center';
        defaultContent.style.width = '100%';
        defaultContent.style.height = '100%';
        defaultContent.innerHTML = '<div class="w-full h-full"></div>';


        // 创建展开内容
        this.content = document.createElement('div');
        this.content.id = 'island-expanded-content';
        this.content.className = 'w-full h-full p-4 text-white opacity-0';
        this.content.style.transition = `opacity ${this.animationDuration}ms ease`;
        this.content.style.display = 'none';

        // 添加到灵动岛
        this.island.appendChild(defaultContent);
        this.island.appendChild(this.content);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        this.island.addEventListener('click', (e) => {
            // 当灵动岛展开时，检查点击的是否是内部控件
            if (this.isExpanded) {
                // 防止点击搜索框、按钮等内部控件时触发收起
                if (e.target.closest('input') || e.target.closest('button') || e.target.closest('#island-search-results') || e.target.closest('#music-info-section')) {
                    return;
                }
            }

            if (!this.isAnimating) {
                if (this.isExpanded) {
                    this.collapse();
                } else {
                    this.expand();
                }
            }
        });
    }

    /**
     * 展开灵动岛（参考music.js实现）
     */
    expand() {
        if (this.isExpanded || this.isAnimating) return;

        this.isAnimating = true;

        // 显示展开内容
        const defaultContent = document.getElementById('island-default-content');
        defaultContent.style.opacity = '0';
        defaultContent.style.position = 'absolute';
        defaultContent.style.pointerEvents = 'none';
        this.content.style.display = 'block';
        this.content.style.opacity = '0';

        // 执行展开动画 - 使用更自然、流畅的缓动函数
        this.island.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        this.island.style.width = `${this.expandedWidth}px`;
        this.island.style.height = `${this.expandedHeight}px`;
        this.island.style.borderRadius = '20px';
        this.island.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        this.island.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';

        // 延迟显示内容
        setTimeout(() => {
            this.content.style.transition = `opacity ${this.animationDuration * 0.5}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            this.content.style.opacity = '1';
            this.isExpanded = true;
            this.isAnimating = false;
        }, this.animationDuration * 0.3);
    }

    /**
     * 收起灵动岛（参考music.js实现）
     */
    collapse() {
        if (!this.isExpanded || this.isAnimating) return;

        this.isAnimating = true;

        // 隐藏展开内容
        this.content.style.opacity = '0';

        // 执行收起动画 - 使用更自然、流畅的缓动函数
        this.island.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        this.island.style.width = `${this.initialWidth}px`;
        this.island.style.height = `${this.initialHeight}px`;
        this.island.style.borderRadius = '17px';
        this.island.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.island.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';

        // 延迟设置最终状态
        setTimeout(() => {
            const defaultContent = document.getElementById('island-default-content');
            defaultContent.style.transition = `opacity ${this.animationDuration * 0.5}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            defaultContent.style.opacity = '1';
            defaultContent.style.position = 'static';
            defaultContent.style.pointerEvents = 'auto';
            this.content.style.display = 'none';
            this.isExpanded = false;
            this.isAnimating = false;
        }, this.animationDuration);
    }

    /**
     * 设置展开内容
     * @param {string|HTMLElement} content - 内容
     */
    setContent(content) {
        if (typeof content === 'string') {
            this.content.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
    }

    /**
     * 更新默认内容
     * @param {string|HTMLElement} content - 内容
     */
    updateDefaultContent(content) {
        const defaultContent = document.getElementById('island-default-content');
        if (typeof content === 'string') {
            defaultContent.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            defaultContent.innerHTML = '';
            defaultContent.appendChild(content);
        }
    }

    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {number} duration - 显示时长（毫秒）
     */
    showNotification(message, duration = 2000) {
        // 展开灵动岛
        this.expand();

        // 设置通知内容
        this.setContent(`
            <div class="flex flex-col items-center justify-center h-full">
                <i class="fa fa-info-circle text-white text-2xl mb-2"></i>
                <p class="text-center text-sm">${message}</p>
            </div>
        `);

        // 定时收起
        setTimeout(() => {
            this.collapse();
        }, duration);
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        this.expand();
        this.setContent(`
            <div class="flex flex-col items-center justify-center h-full">
                <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <p class="text-center text-sm">加载中...</p>
            </div>
        `);
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        this.collapse();
    }
}

// 导出灵动岛实例
const dynamicIsland = new DynamicIsland();
window.dynamicIsland = dynamicIsland;