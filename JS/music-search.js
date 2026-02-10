class MusicSearch {
    constructor() {
        this.apiBase = 'https://www.qqmp3.vip/api';
        this.currentAudio = null; // 存储当前正在播放的音频对象
    }

    /**
     * 搜索歌曲
     * @param {string} keyword - 歌曲关键词
     * @returns {Promise<Array>} 搜索结果数组
     */
    async search(keyword) {
        try {
            const url = `${this.apiBase}/songs.php?type=search&keyword=${encodeURIComponent(keyword)}`;
            console.log('搜索API请求:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            console.log('搜索API响应:', data);
            const results = this.parseSearchResults(data);
            console.log('解析后的搜索结果:', results);
            return results;
        } catch (error) {
            console.error('搜索歌曲失败:', error);
            throw error;
        }
    }

    /**
     * 获取歌曲详细信息
     * @param {string} rid - 歌曲rid
     * @returns {Promise<Object>} 歌曲详细信息
     */
    async getSongDetail(rid) {
        try {
            const url = `${this.apiBase}/kw.php?rid=${rid}&type=json&level=exhigh&lrc=true`;
            console.log('获取歌曲详细信息API请求:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            console.log('获取歌曲详细信息API响应:', data);
            return data;
        } catch (error) {
            console.error('获取歌曲详细信息失败:', error);
            throw error;
        }
    }

    /**
     * 解析搜索结果
     * @param {Object} data - API返回的数据
     * @returns {Array} 解析后的歌曲列表
     */
    parseSearchResults(data) {
        if (!data || !Array.isArray(data.data)) {
            return [];
        }

        return data.data.map(song => ({
            rid: song.rid,
            name: song.name,
            singer: song.artist || song.singer,
            album: song.album || '',
            duration: song.time || '',
            cover: song.pic || '',
            url: song.url || ''
        }));
    }

    /**
     * 播放歌曲
     * @param {string} url - 歌曲播放地址
     */
    playSong(url) {
        if (!url) {
            console.error('歌曲播放地址为空');
            return;
        }

        // 停止当前正在播放的音频
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        // 创建音频元素并播放
        const audio = new Audio(url);
        audio.play().catch(error => {
            console.error('播放歌曲失败:', error);
        });

        // 保存当前音频对象
        this.currentAudio = audio;

        return audio;
    }
}

// 导出音乐搜索实例
const musicSearch = new MusicSearch();
window.musicSearch = musicSearch;