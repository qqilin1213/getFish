/*
 * @Author: qqilin1213
 * @Date: 2021-05-05 19:18:25
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-15 14:18:32
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
        pre_btnLevel: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene('game');
        window.selectLevel = this;
        this.FBL = cc.director.getWinSizeInPixels()
        cc.log('width:' + this.FBL.width + '_height:' + this.FBL.height)
        this.levelContent = cc.find('Canvas/pageview/view').getChildByName('content')
        this.levelContent.parent.scale = (this.FBL.width / 720)

        this.addBtnLevel()
    },


    addBtnLevel: function () {
        var i_level = 1
        var children = this.levelContent.children
        for (let i = 0; i < children.length; i++) {
            var jiange = 160
            for (let j = 0; j < 6; j++) { //有多少行
                for (let k = 0; k < 4; k++) { //有多少列
                    var btnLevel = cc.instantiate(this.pre_btnLevel)
                    btnLevel.parent = children[i]
                    //var pos_begin = cc.v2(-children[i].width/2+btnLevel.width/2+90,children[i].height/2-btnLevel.height/2)
                    var pos_begin = cc.v2(-jiange / 2 * 3, children[i].height / 2 - btnLevel.height / 2 - 20)
                    var pos_1 = cc.v2(pos_begin.x + k * jiange, pos_begin.y + j * (-140))
                    btnLevel.setPosition(pos_1)
                    var js_btnLevel = btnLevel.getComponent('btn_level')
                    if (js_btnLevel) {
                        js_btnLevel.init(i_level)
                        i_level++
                    }
                }
            }
        }
    },

    //开始哪一个关卡
    playLevel: function (num) {
        // console.log("开始第" + num + "关")
        cc.director.loadScene("game");
        game.level = num
        // game.gameType = 0
        game.beginGame()
    },



    // update (dt) {},
});