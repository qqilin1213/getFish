/*
 * @Author: qqilin1213
 * @Date: 2021-04-24 20:42:24
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-16 13:27:30
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

    start() {

    },

    onCollisionEnter: function (other, self) {
        if (other.tag == 1) {
            var js = other.node.getComponent('fish')
            // console.log(js)
            if (js && js.isDie == false && game.hookState == 1) {
                js.catch()
            }
        }
        cc.find("Canvas").getComponent("game").catchItem(other.node);
        // console.log(other.node)
    },

    // update (dt) {},
});