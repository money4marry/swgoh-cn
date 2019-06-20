/**
 * LocalStorage 封装
 */
export default {
    // 存储单个数据
    setLs(key, value) {
        window.localStorage[key] = value;
    },

    // 读取单个数据
    getLs(key, defaultValue) {
        return window.localStorage[key] || defaultValue;
    },

    // 存储js对象，转为json字符串存储
    setObjectToLs(key, value) {
        window.localStorage[key] = JSON.stringify(value);
    },

    // 读取json字符串，返回js对象
    getObjectFromLs(key) {
        return JSON.parse(window.localStorage[key] || '{}');
    },

    // 删除某条数据
    removeLs(key) {
        window.localStorage.removeItem(key);
    }
}
