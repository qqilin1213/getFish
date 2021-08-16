/*
 * @Author: qqilin1213
 * @Date: 2021-04-30 15:31:36
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-01 11:10:28
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
        pre_fish_1: {
            default: null,
            type: cc.Prefab,
        },
        pre_fish_2: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.fishGroup = this
        this.fishPool_1 = new cc.NodePool()
        this.fishPool_2 = new cc.NodePool()
    },

    // 制造敌机
    creatFish: function (fishType) {
        let fish = null
        var str = ''
        var pos_fish = cc.v2(0, 0)
        if (fishType == 1) { //创建敌机1
            if (this.fishPool_1.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                fish = this.fishPool_1.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                fish = cc.instantiate(this.pre_fish_1)
            }
            str = 'fish-1'
            pos_fish.x = -372 - Math.random() * 10
            pos_fish.y = -72 - Math.random() * 477
        } else if (fishType == 2) {
            if (this.fishPool_2.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                fish = this.fishPool_2.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                fish = cc.instantiate(this.pre_fish_2)
            }
            str = 'fish-2'
            pos_fish.x = -372 - Math.random() * 10
            pos_fish.y = -100 - Math.random() * 450
        }
        fish.parent = this.node
        fish.setPosition(pos_fish)
    },

    onFishKilled: function (fish, fishType) {
        if (fishType == 1) {
            // console.log("kill1")
            this.fishPool_1.put(fish)
        }
        if (fishType == 2) {
            // console.log("kill2")
            this.fishPool_2.put(fish)
        }
    },

    start() {

    },

    // update (dt) {},
});