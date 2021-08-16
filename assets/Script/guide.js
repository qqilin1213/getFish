/*
 * @Author: qqilin1213
 * @Date: 2021-04-26 11:22:39
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-04-26 11:29:56
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
        // Guide
        frame: cc.Node,
        guideLabel: cc.Node,
        hand: cc.Node,
    },

    // Guide.js
    onLoad() {
        this.guideStep = 1;

        // 触摸监听
        this.node.on('touchstart', this.onTouchStart, this);
    },

    onDestroy() {
        // 取消监听
        this.node.off('touchstart', this.onTouchStart, this);
    },

    onTouchStart(event) {

    },

    guide() {
        if (this.guideStep == 1) {
            let btn1 = cc.find('Canvas/nodeBtnPlaying').getChildByName('btn_pull');
            // 将frame节点移到第一个按钮
            this.frame.setPosition(btn1.position);
            // 引导文本
            this.showInfo('请点击按钮~');
            // 手指动作
            this.setHand(btn1.position);
        }
    },
    // Guide.js
    showInfo(str) {
        // 显示引导文本
        this.unscheduleAllCallbacks();

        this.guideLabel.getComponent(cc.Label).string = ''
        let i = 0;

        this.schedule(() => {
            this.guideLabel.getComponent(cc.Label).string += str[i];
            i++;
        }, 0.2, str.length - 1);
    },

});