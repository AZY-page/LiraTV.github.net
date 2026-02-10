// 控制台增强脚本 - 显示自定义logo，支持翻译相关日志

// 保存原始console方法
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;
const originalDebug = console.debug;

// 自定义AZY logo
const customLogo = `
%s
  ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗  
  ██║   ██║██╔══██╗████╗  ██║██╔════╝ 
  ██║   ██║███████║██╔██╗ ██║██║  ███╗
  ╚██╗ ██╔╝██╔══██║██║╚██╗██║██║   ██║
   ╚████╔╝ ██║  ██║██║ ╚████║╚██████╔
    ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                                 
`;

// 初始化标志，用于跟踪logo是否已显示
let logoShown = false;

// 翻译相关日志标志
let showTranslationLogs = true;

// 重写console方法
console.log = function(...args) {
    if (!logoShown) {
        // 只显示logo一次
        originalLog.apply(console, args);
        logoShown = true;
    } else if (showTranslationLogs) {
        // 显示翻译相关日志
        const message = args[0];
        if (typeof message === 'string' && (message.includes('Translation') || message.includes('translation') || message.includes('Translating'))) {
            originalLog.apply(console, args);
        }
    }
    // 隐藏所有其他log
};

console.error = function(...args) {
    if (showTranslationLogs) {
        // 显示翻译相关错误
        const message = args[0];
        if (typeof message === 'string' && (message.includes('Translation') || message.includes('translation'))) {
            originalError.apply(console, args);
        }
    }
    // 隐藏所有其他error日志
};

console.warn = function(...args) {
    // 隐藏所有warn日志
};

console.info = function(...args) {
    // 隐藏所有info日志
};

console.debug = function(...args) {
    // 隐藏所有debug日志
};

// 重写console.clear方法，防止logo被清除
const originalClear = console.clear;
console.clear = function() {
    // 不执行clear操作，保留logo
};

// 启用翻译日志的方法
window.enableTranslationLogs = function() {
    showTranslationLogs = true;
    originalLog('%c翻译日志已启用', 'color: #34c759; font-weight: bold;');
};

// 禁用翻译日志的方法
window.disableTranslationLogs = function() {
    showTranslationLogs = false;
    originalLog('%c翻译日志已禁用', 'color: #ff3b30; font-weight: bold;');
};

// 在控制台输出自定义AZY logo
console.log(customLogo, '%cAZY版权', 'color: #007aff; font-weight: bold;');

// 确保logo始终显示
setTimeout(() => {
    if (!logoShown) {
        originalLog(customLogo, '%c由AZY开发', 'color: #007aff; font-weight: bold;');
        logoShown = true;
    }
}, 100);

// 提示如何启用翻译日志
setTimeout(() => {
    originalLog('%c提示: 输入 enableTranslationLogs() 启用翻译日志', 'color: #8e8e93; font-style: italic;');
}, 500);
