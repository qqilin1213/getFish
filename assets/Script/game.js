/*
 * @Author: qqilin1213
 * @Date: 2021-04-24 19:46:08
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-17 10:41:14
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
// const fishGroup = require("./fishGroup");
const config = require("./Config");
const utils = require("./utils");

const HOOK_ROTATE = 0;
const HOOK_EMIT = 1;
const HOOK_PULL = 2;

cc.Class({
    extends: cc.Component,
    properties: {
        //钩子速度
        speed: {
            default: 4,
            displayName: "钩子速度",
        },
        //钩子旋转速度
        rotateSpeed: {
            default: 1.5,
            displayName: "钩子旋转速度",
        },
        //钩子范围
        hookRange: {
            default: 40,
            displayName: "钩子旋转角度范围",
        },
        hook: cc.Node,
        nodeBtnPlaying: { //Playing界面的按钮节点
            default: null,
            type: cc.Node
        },
        fishGroup: {
            default: null,
            type: require('fishGroup')
        },
        nodeOver: {
            default: null,
            type: cc.Node
        },
        nodeLevels: {
            default: null,
            type: cc.Node
        },
        nodeSetting: {
            default: null,
            type: cc.Node
        },
        nodeBegin: {
            default: null,
            type: cc.Node
        },
        pre_btnLevel: {
            default: null,
            type: cc.Prefab
        },
        audio_bgMusic: {
            default: null,
            type: cc.AudioClip
        },
        audio_btn: {
            default: null,
            type: cc.AudioClip
        },
        audio_cat: {
            default: null,
            type: cc.AudioClip
        },
        audio_pullHook: {
            default: null,
            type: cc.AudioClip
        },
        hookItem: cc.Node,
        scoreLabel: cc.Label,
        targetLabel: cc.Label,
        levelLabel: cc.Label,
        timerLabel: cc.Label,
        itemPanel: cc.Node,
        user: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameType = 3;
        this.canplayEffect = true;
        this.canplayMusic = true;
        window.game = this;
        this.level = 1;
        // 开启碰撞检测系统，未开启时无法检
        cc.director.getCollisionManager().enabled = true
        this.nodeBegin.active = true;
        this.nodeOver.active = false
        this.nodeLevels.active = false
        this.nodeSetting.active = false
        this.user.active = false;
        if (this.canplayMusic) {
            this.audioBg = cc.audioEngine.play(this.audio_bgMusic, true, 1);
        }

        this.FBL = cc.director.getWinSizeInPixels()
        // cc.log('width:' + this.FBL.width + '_height:' + this.FBL.height)
        this.levelContent = cc.find('Canvas/nodeLevel/pageview/view').getChildByName('content')
        this.levelContent.parent.scale = (this.FBL.width / 720)

        this.addBtnLevel()

    },

    start() {
        this.time = 60;
        let countTime = cc.find('Canvas/level-time-banner/time').getComponent(cc.Label);
        countTime.string = this.time + 's';
        this.schedule(() => {
            // 游戏进行才倒计时
            if (this.gameType == 0) {
                this.time--
            }
            countTime.string = this.time + 'S'

            if (this.time == 0) {
                this.gameOver();
                // this.overGame.active = true
                // this.pauseGame.active = false
            }
        }, 1)
    },

    beginGame() {
        this.time = 60;
        this.score = 0;
        this.target = 0;
        this.hookHeight = this.hook.height;
        this.hookState = HOOK_ROTATE;
        this.gameType = 0 //(0:游戏中,1:暂停 2：结束)
        this.gameTime = 0; // 游戏时长
        this.fishTime = 0;
        this.itemPanel = cc.find("Canvas/itemPanel");
        this.itemPanel.getComponent(cc.Widget).updateAlignment();
        this.itemArr = [];
        let children = cc.find("Canvas/item-temp").children;
        for (let i = 0; i < children.length; i++) {
            children[i].active = false;
            this.itemArr.push(children[i]);
        }
        // 三类敌机产生的概率  小敌机：60% 中敌机：30% 大敌机：10%
        this.randomNUm = [60, 90, 100]
        this.setLevelInfo()
        this.setBtnLayout()
    },

    // 按钮的布局
    setBtnLayout() {
        var nodeMenu = this.nodeBtnPlaying.getChildByName('btn_menuOpen')
        var pos_btnMenu = cc.v2(nodeMenu.x, nodeMenu.y)
        this.nodeBtnPlaying.getChildByName('btn_home').setPosition(cc.v2(pos_btnMenu.x, pos_btnMenu.y))
        this.nodeBtnPlaying.getChildByName('btn_levels').setPosition(cc.v2(pos_btnMenu.x, pos_btnMenu.y))
        // this.nodeBtnPlaying.getChildByName('btn_shop').setPosition(cc.v2(pos_btnMenu.x, pos_btnMenu.y))
        this.nodeBtnPlaying.getChildByName('btn_setting').setPosition(cc.v2(pos_btnMenu.x, pos_btnMenu.y))
        this.nodeBtnPlaying.getChildByName('btn_menuClose').active = false
        this.nodeBtnPlaying.getChildByName('btn_restart').active = true
        this.nodeBtnPlaying.getChildByName('btn_menuOpen').active = true

        this.nodeBtnPlaying.getChildByName('btn_home').active = false
        this.nodeBtnPlaying.getChildByName('btn_levels').active = false
        // this.nodeBtnPlaying.getChildByName('btn_shop').active = false
        this.nodeBtnPlaying.getChildByName('btn_setting').active = false
    },

    // 展开和关闭菜单显示
    actMenu: function (str) {
        var nodeMenu = this.nodeBtnPlaying.getChildByName('btn_menuOpen')
        var pos_btnMenu = cc.v2(nodeMenu.x, nodeMenu.y)
        // interval
        var x_jianGe = Math.abs(nodeMenu.x) / 2 //相邻按钮直接的间隔

        if (str == 'openMenu') {
            this.nodeBtnPlaying.getChildByName('btn_home').active = true
            this.nodeBtnPlaying.getChildByName('btn_levels').active = true
            // this.nodeBtnPlaying.getChildByName('btn_shop').active = true
            this.nodeBtnPlaying.getChildByName('btn_setting').active = true

            this.nodeBtnPlaying.getChildByName('btn_home').runAction(cc.moveTo(0.1, cc.v2(pos_btnMenu.x + x_jianGe * 3, pos_btnMenu.y)))
            this.nodeBtnPlaying.getChildByName('btn_levels').runAction(cc.moveTo(0.14, cc.v2(pos_btnMenu.x + x_jianGe * 6, pos_btnMenu.y)))
            // this.nodeBtnPlaying.getChildByName('btn_shop').runAction(cc.moveTo(0.16, cc.v2(pos_btnMenu.x + x_jianGe * 8, pos_btnMenu.y)))
            this.nodeBtnPlaying.getChildByName('btn_setting').runAction(cc.moveTo(0.16, cc.v2(pos_btnMenu.x + x_jianGe * 9, pos_btnMenu.y)))
            this.nodeBtnPlaying.getChildByName('btn_menuClose').active = true

            this.nodeBtnPlaying.getChildByName('btn_restart').active = false
            nodeMenu.active = false
        } else if (str == 'closeMenu') {
            this.nodeBtnPlaying.getChildByName('btn_menuClose').active = false
            nodeMenu.active = true
            var act_1 = cc.moveTo(0.1, cc.v2(pos_btnMenu.x, pos_btnMenu.y))
            var act_2 = cc.callFunc(function () {
                this.nodeBtnPlaying.getChildByName('btn_home').active = false
            }.bind(this))

            var act_3 = cc.moveTo(0.14, cc.v2(pos_btnMenu.x, pos_btnMenu.y))
            var act_4 = cc.callFunc(function () {
                this.nodeBtnPlaying.getChildByName('btn_levels').active = false
            }.bind(this))

            var act_7 = cc.moveTo(0.16, cc.v2(pos_btnMenu.x, pos_btnMenu.y))
            var act_8 = cc.callFunc(function () {
                this.nodeBtnPlaying.getChildByName('btn_setting').active = false
                this.nodeBtnPlaying.getChildByName('btn_restart').active = true
            }.bind(this))

            this.nodeBtnPlaying.getChildByName('btn_home').runAction(cc.sequence(act_1, act_2))
            this.nodeBtnPlaying.getChildByName('btn_levels').runAction(cc.sequence(act_3, act_4))
            // this.nodeBtnPlaying.getChildByName('btn_shop').runAction(cc.sequence(act_5, act_6))
            this.nodeBtnPlaying.getChildByName('btn_setting').runAction(cc.sequence(act_7, act_8))
        }
    },

    update(dt) {
        var randomNumFish = 3
        if (this.gameType == 0) {
            switch (this.hookState) {
                case HOOK_ROTATE:
                    if (this.hook.angle >= this.hookRange) {
                        this.rotateSpeed = -this.rotateSpeed;
                    } else if (this.hook.angle <= -this.hookRange - 30) {
                        this.rotateSpeed = Math.abs(this.rotateSpeed);
                    }
                    this.hook.angle += this.rotateSpeed;
                    break;
                case HOOK_EMIT:
                    this.hook.height += this.speed;
                    break;
                case HOOK_PULL:
                    if (this.gainScore != 0) {
                        var anim = null;
                        var anim = cc.find('Canvas/cat/FishCat').getComponent(cc.Animation)
                        anim.play('emitHook');
                    }
                    if (this.hook.height <= this.hookHeight) {
                        this.hookState = HOOK_ROTATE;
                        this.resetState();
                        this.score += this.gainScore;
                        this.scoreLabel.string = this.score;
                        if (this.itemPanel.children.length == 0) {
                            this.gameOver();
                        }
                    } else {
                        this.hook.height -= this.speed;
                        if (this.canplayEffect) {
                            cc.audioEngine.play(this.audio_pullHook, false, 1);
                        }
                        // console.log(this.hookState)
                    }
                    break;
            }
            // 游戏中
            this.gameTime++
            if (this.gameTime % 300 == 0) {
                randomNumFish = randomNumFish + Math.round(this.gameTime / 600)
                if (randomNumFish > 5) {
                    randomNumFish = 5
                }
            }
            this.fishTime++
            if (this.fishTime == 180) {
                this.fishTime = 0
                // 产生的敌机总数
                var num_random = Math.floor(Math.random() * randomNumFish) + 1
                for (let i = 0; i < num_random; i++) {
                    if (this.gameType == 0) { //playing
                        var num = Math.random() * 100
                        if (num < this.randomNUm[0]) {
                            fishGroup.creatFish(1)
                        } else if (num < this.randomNUm[1]) {
                            fishGroup.creatFish(2)
                        }
                    }
                }

            }
        }
    },

    resetState() {
        this.hookState = HOOK_ROTATE;
        this.hook.height = this.hookHeight;
        this.speed = 4;
        this.hookItem.removeAllChildren();
    },

    clickBtn(sender, str) {
        // 开始钓鱼
        // 在拉回绳子时，无法再次点击
        if (this.gameType == 0 || this.gameType == 3) {
            if (str == 'HookEmit' && this.hookState == 0) {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_cat, false, 1);
                }
                // cc.log('钓鱼')
                this.playBtnChick()
                this.hookState = HOOK_EMIT;
            } else if (str == 'openMenu') {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_btn, false, 1);
                }
                // this.gameType = 1
                this.actMenu('openMenu')
            } else if (str == 'closeMenu') {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_btn, false, 1);
                }
                // this.gameType = 0
                this.actMenu('closeMenu')
            } else if (str == 'restart') {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_btn, false, 1);
                }
                this.playLevel(this.level);
            } else if (str == 'levels') {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_btn, false, 1);
                }
                this.gameType = 1
                this.nodeLevels.active = true
            } else if (str == 'setting') {
                if (this.canplayEffect) {
                    cc.audioEngine.play(this.audio_btn, false, 1);
                }
                console.log("kai")
                this.gameType = 1
                this.nodeSetting.active = true
            } else if (str == "playgame") {
                this.nodeBegin.active = false
                this.beginGame();
            } else if (str == 'begin-login') {
                this.user.active = true;
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            console.log("登入成功code", res.code)
                        }

                        let button = window.wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: 229.834,
                                height: 472.536,
                                lineHeight: 0,
                                backgroundColor: '#00000000',
                                color: '#ffffff',
                                lineHeight: 40,
                            }
                        })

                        button.onTap((res) => {
                            console.log('点击按钮:', res.userInfo)
                            G.userInfo = res.userInfo
                            if (res.errMsg = "getUserInfo:ok") {
                                console.log("已经授权")
                                // 登入
                                WeChat.onLogin(res.userInfo)
                                button.destroy()
                            } else {
                                console.log("无授权")
                            }
                        })
                    },
                })
            }
        }
        if (this.gameType == 1) {
            if (this.canplayEffect) {
                cc.audioEngine.play(this.audio_btn, false, 1);
            }
            if (str == 'btnClose_setting') {
                this.gameType = 0
                this.nodeSetting.active = false
            } else if (str == 'btnMusicOff_setting') {
                this.canplayMusic = true
                cc.audioEngine.resume(this.audioBg)
                this.nodeSetting.getChildByName('bg').getChildByName('btnMusicOn_setting').active = true
                this.nodeSetting.getChildByName('bg').getChildByName('btnMusicOff_setting').active = false
            } else if (str == 'btnMusicOn_setting') {
                this.canplayMusic = false
                cc.audioEngine.pause(this.audioBg)
                this.nodeSetting.getChildByName('bg').getChildByName('btnMusicOn_setting').active = false
                this.nodeSetting.getChildByName('bg').getChildByName('btnMusicOff_setting').active = true
            } else if (str == 'btnSoundOff_setting') {
                this.canplayEffect = true
                this.nodeSetting.getChildByName('bg').getChildByName('btnSoundOn_setting').active = true
                this.nodeSetting.getChildByName('bg').getChildByName('btnSoundOff_setting').active = false
            } else if (str == 'btnSoundOn_setting') {
                this.canplayEffect = false

                this.nodeSetting.getChildByName('bg').getChildByName('btnSoundOn_setting').active = false
                this.nodeSetting.getChildByName('bg').getChildByName('btnSoundOff_setting').active = true
            }
        }
        if (this.gameType == 2) {
            if (this.canplayEffect) {
                cc.audioEngine.play(this.audio_btn, false, 1);
            }
            if (str == 'over-levels') {
                this.nodeOver.active = false
                this.gameType = 1
                this.nodeLevels.active = true
            } else if (str == 'over-restart') {
                this.nodeOver.active = false
                this.playLevel(this.level);
            } else if (str == 'playnext') {
                this.nodeOver.active = false
                this.playLevel(this.level + 1);
            }
        }



    },

    //开始哪一个关卡
    playLevel: function (num) {
        this.resetState()
        this.nodeLevels.active = false
        this.level = num
        this.gameType = 0
        this.beginGame()
    },

    emitHook() {
        if (this.hookState) return;
        this.hookState = HOOK_EMIT;
    },

    catchItem(item) {
        if (this.hookState != HOOK_EMIT) return;
        // cc.log(item);
        this.gainScore = 0;
        this.hookState = HOOK_PULL;
        this.speed = 4;
        if (item.group === "Wall") {
            return;
        }
        item.parent = this.hookItem;
        item.group = "default";
        item.x = 0;
        item.y = 0;
        item.angle = -this.hook.angle;
        item.anchorY = 0.9;
        // console.log(item.name)
        this.speed = config[item.name].speed;
        this.gainScore = config[item.name].score;
    },

    playBtnChick() {
        var anim = null;
        var anim = cc.find('Canvas/nodeBtnPlaying/btn_pull').getComponent(cc.Animation)
        anim.play('btn_click');
    },

    // 游戏开始数值设置
    setLevelInfo() {
        this.itemPanel.removeAllChildren();
        this.hookState = HOOK_ROTATE;
        // this.setTimer();
        this.levelLabel.string = this.level;
        this.score = 0;
        this.scoreLabel.string = this.score;
        this.target = 100 + (this.level - 1) * 100;
        this.targetLabel.string = this.target;
        let itemsScore = this.target * 1.5;
        let tempScore = 0;
        while (tempScore < itemsScore) {
            const n = utils.randomRangeInt(0, this.itemArr.length);
            // console.log(n)
            const node = cc.instantiate(this.itemArr[n]);
            node.parent = this.itemPanel;
            node.position = this.randomPos();
            node.active = true;
            tempScore += config[node.name].score;
        }
    },
    randomPos() {
        let randX = ((this.itemPanel.width - 30) / 2) * utils.randomRange(-1, 1);
        let randY = ((this.itemPanel.height - 30) / 2) * utils.randomRange(-1, 1);
        return cc.v2(randX, randY);
    },

    gameOver() {
        cc.find('Canvas/gameOver/btn').getChildByName('btn-next').active = false
        this.nodeOver.active = true
        this.gameType = 2
        if (this.score >= this.target) {
            cc.find('Canvas/gameOver/title').getChildByName('success').active = true
            cc.find('Canvas/gameOver/title').getChildByName('failed').active = false
            cc.find('Canvas/gameOver/btn').getChildByName('btn-next').active = true
        } else {
            cc.find('Canvas/gameOver/title').getChildByName('failed').active = true
            cc.find('Canvas/gameOver/title').getChildByName('success').active = false
            cc.find('Canvas/gameOver/btn').getChildByName('btn-next').active = false
        }
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

});