/*
 * @Author: qqilin1213
 * @Date: 2021-05-16 13:10:47
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-16 13:27:23
 */
window.WeChat = {};

// 登入
WeChat.onLogin = function (_userInfo) {
    wx.cloud.callFunction({
        name: 'login',
        data: {
            userinfo: _userInfo,
        },
        success(res) {
            console.log("登入成功回调")
        },
        fail: console.error()
    })
}

// 记录得分
WeChat.recordScore = function (_gameData) {
    wx.cloud.callFunction({
        name: 'recordScore',
        data: {
            gamedata: _gameData,
        },
        success(res) {
            console.log("记录成功回调")
        },
        fail: console.error()
    })
}
// 获取得分
WeChat.getScore = function () {
    wx.cloud.callFunction({
        name: 'getScore',
        success(res) {
            G.userData = res.result.data[0].gamedata;
            console.log(G.userData)
            console.log("查看记录成功回调")
        },
        fail: console.error()
    })
}