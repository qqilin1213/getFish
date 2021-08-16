/*
 * @Author: qqilin1213
 * @Date: 2021-05-16 13:13:11
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-16 13:13:40
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 加载图片
        let icon = cc.find('Canvas/BackGround/user/user_icon').getComponent(cc.Sprite)
        cc.loader.load({
                url: G.userInfo.avatarUrl,
                type: 'png'
            },
            function (err, texture) {
                icon.spriteFrame = new cc.SpriteFrame(texture)
            })
        // 加载用户名
        let userName = cc.find('Canvas/BackGround/user/user_name').getComponent(cc.Label).string = G.userInfo.nickName;
    },

    start() {

    },

    // update (dt) {},
});