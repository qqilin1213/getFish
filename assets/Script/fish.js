/*
 * @Author: qqilin1213
 * @Date: 2021-04-03 13:12:58
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-01 09:57:16
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// const fishGroup = require("./fishGroup");

cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: 0,
            type: cc.Integer,
            tooltip: '分数',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init()
    },

    normal(type) {

    },

    init() {
        this.isDie = false
        this.speed = 100 + Math.random() * 50
    },

    catch () {
        this.isDie = true
        // console.log('抓到了')
    },

    update(dt) {
        if (this.isDie)
            return
        if (game.gameType == 0) {
            this.node.x = this.node.x + this.speed * dt
        }
        if (this.node.x >= 372) {
            fishGroup.onFishKilled(this.node, 1)
        }
        if (this.node.x >= 368) {
            fishGroup.onFishKilled(this.node, 2)
        }
    },
});