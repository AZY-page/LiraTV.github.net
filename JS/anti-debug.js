// 防F12调试功能
var ds_cms = {
    f12: '2' // 设置为2启用防F12功能
};

if(ds_cms.f12 === '2'){
    // 检测view-source:协议
    if (window.location.href.indexOf('view-source:') === 0) {
        window.location.href = 'https://www.baidu.com/';
    }

    // 检测开发者工具打开
    ((function () {
        let callbacks = [],
            timeLimit = 50,
            open = false;
        setInterval(loop, 1);
        return {
            addListener: function (fn) {
                callbacks.push(fn)
            }, 
            cancelListener: function (fn) {
                callbacks = callbacks.filter(function (v) { return v !== fn})
            }
        };
        function loop() {
            var startTime = new Date();
            debugger;
            if (new Date() - startTime > timeLimit) {
                if (!open){
                    callbacks.forEach(function (fn) {
                        fn.call(null)
                    })
                }
                open = true;
                window.stop();
                $(location).attr('href', 'https://www.baidu.com/')
            } else {
                open = false
            }
        }
    })()).addListener(function (){
        window.location.reload()
    });

    // 禁用所有常见开发者工具快捷键
    $(document).keydown(function (event) {
        // F12
        if (event.keyCode == 123) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Ctrl+Shift+I
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Ctrl+Shift+J
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 74) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Ctrl+Shift+C
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 67) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Ctrl+U (查看源代码)
        else if (event.ctrlKey && event.keyCode == 85) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Ctrl+Shift+K (Firefox)
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 75) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
        // Alt+Shift+I (Edge)
        else if (event.altKey && event.shiftKey && event.keyCode == 73) {
            event.preventDefault();
            $(location).attr('href', 'https://www.baidu.com/');
        }
    });

    // 完全禁用右键菜单 - 使用事件委托确保对动态元素也有效
    $(document).on('contextmenu', '*', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // 禁用鼠标右键点击 - 使用事件委托确保对动态元素也有效
    $(document).on('mousedown', '*', function (e) {
        if (e.which == 3) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // 禁用鼠标右键释放 - 防止任何右键相关操作
    $(document).on('mouseup', '*', function (e) {
        if (e.which == 3) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // 禁用触摸设备上的长按菜单（类似右键菜单）
    $(document).on('touchstart', '*', function (e) {
        $(this).on('touchend', function (event) {
            if (event.timeStamp - e.timeStamp > 500) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });
    });

    // 禁止复制功能
    // 禁用复制事件
    $(document).on('copy', function (e) {
        e.preventDefault();
        return false;
    });

    // 禁用剪切事件
    $(document).on('cut', function (e) {
        e.preventDefault();
        return false;
    });

    // 禁用选中文本
    $(document).on('selectstart', function (e) {
        e.preventDefault();
        return false;
    });

    // 禁用Ctrl+C
    $(document).keydown(function (event) {
        if (event.ctrlKey && event.keyCode == 67) {
            event.preventDefault();
            return false;
        }
    });
} 
