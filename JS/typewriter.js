/**
 * 打字机效果插件
 * 用于在页面上创建文字逐个显示的打字机效果
 */
class Typewriter {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {string} options.containerId - 容器元素ID
     * @param {string} options.cursorId - 光标元素ID
     * @param {Array} options.texts - 要显示的文本数组
     * @param {number} options.typingSpeed - 打字速度，单位毫秒
     * @param {number} options.displayTime - 每段文字显示时间，单位毫秒
     * @param {boolean} options.pinyinMode - 是否启用拼音模式，先显示拼音再显示文字
     */
    constructor(options = {}) {
        this.containerId = options.containerId || 'typewriter-container';
        this.cursorId = options.cursorId || 'cursor';
        this.texts = options.texts || [
            "一个天天想退休的前端小卡拉米。",
            "没有记录就没有发生，进而没有活过。"
        ];
        this.typingSpeed = options.typingSpeed || 100;
        this.displayTime = options.displayTime || 2000;
        this.pinyinMode = options.pinyinMode || false;
        
        this.currentIndex = 0;
        this.typingInterval = null;
        
        // 初始化
        this.init();
    }

    /**
     * 初始化打字机效果
     */
    init() {
        this.typeText();
    }

    /**
     * 获取文字的拼音
     * @param {string} text - 要转换为拼音的文字
     * @returns {string} - 文字的拼音
     */
    getPinyin(text) {
        // 简单的拼音映射表，仅用于演示
        const pinyinMap = {
            '鱼': 'yu',
            '的': 'de',
            '影': 'ying',
            '视': 'shi',
            '站': 'zhan'
        };
        
        let pinyin = '';
        for (let char of text) {
            pinyin += pinyinMap[char] || char;
        }
        
        return pinyin;
    }

    /**
     * 开始打字
     */
    typeText() {
        if (this.currentIndex === this.texts.length) {
            this.currentIndex = 0;
        }
        
        const container = document.getElementById(this.containerId);
        const text = this.texts[this.currentIndex];
        
        // 当前正在处理的字的索引
        this.currentWordIndex = 0;
        // 当前字的拼音索引
        this.currentPinyinIndex = 0;
        // 存储已经显示的文字
        this.displayedText = '';

        const typeNextWord = () => {
            if (this.currentWordIndex < text.length) {
                const currentWord = text[this.currentWordIndex];
                const currentPinyin = this.getPinyin(currentWord);
                
                // 先显示当前字的拼音
                const typePinyin = () => {
                    if (this.currentPinyinIndex < currentPinyin.length) {
                        container.textContent = this.displayedText + currentPinyin.substring(0, this.currentPinyinIndex + 1);
                        this.currentPinyinIndex++;
                        setTimeout(typePinyin, this.typingSpeed);
                    } else {
                        // 拼音打完后，显示文字
                        setTimeout(() => {
                            this.displayedText += currentWord;
                            container.textContent = this.displayedText;
                            this.currentWordIndex++;
                            this.currentPinyinIndex = 0;
                            setTimeout(typeNextWord, this.typingSpeed);
                        }, this.typingSpeed * 2);
                    }
                };
                
                typePinyin();
            } else {
                // 所有字都处理完后，切换到下一段文本
                setTimeout(() => this.switchText(), this.displayTime);
            }
        };

        typeNextWord();
    }

    /**
     * 切换到下一段文本
     */
    switchText() {
        const container = document.getElementById(this.containerId);
        this.currentIndex += 1; // 切换到下一段文字
        container.textContent = ''; // 清空容器内容
        setTimeout(() => this.typeText(), 500); // 稍作延迟后开始显示新文字
    }

    /**
     * 停止打字机效果
     */
    stop() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
    }

    /**
     * 重置打字机效果
     */
    reset() {
        this.stop();
        this.currentIndex = 0;
        const container = document.getElementById(this.containerId);
        if (container) {
            container.textContent = '';
        }
        this.typeText();
    }

    /**
     * 更新文本数组
     * @param {Array} texts - 新的文本数组
     */
    updateTexts(texts) {
        this.texts = texts;
        this.reset();
    }

    /**
     * 更新打字速度
     * @param {number} speed - 新的打字速度，单位毫秒
     */
    updateTypingSpeed(speed) {
        this.typingSpeed = speed;
    }

    /**
     * 更新显示时间
     * @param {number} time - 新的显示时间，单位毫秒
     */
    updateDisplayTime(time) {
        this.displayTime = time;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Typewriter;
} else if (typeof window !== 'undefined') {
    window.Typewriter = Typewriter;
}
