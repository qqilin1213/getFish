/*
 * @Author: qqilin1213
 * @Date: 2021-05-05 15:15:39
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-15 19:15:32
 */

cc.Class({
    extends: cc.Component,

    properties: {
        label_num: {
            default: null,
            type: cc.Label
        }
    },

    onLoad() {

    },

    init: function (num) {
        this.i_num = num
        this.label_num.string = num
    },

    clickBtn: function () {
        // cc.log('选中的是第' + this.i_num + '关')
        game.nodeOver.active = false
        game.playLevel(this.i_num)
    },

    start() {

    },

    // update (dt) {},
});