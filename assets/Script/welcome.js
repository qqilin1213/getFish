/*
 * @Author: qqilin1213
 * @Date: 2021-05-05 15:46:46
 * @LastEditors: qqilin1213
 * @LastEditTime: 2021-05-16 18:48:16
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
        bg: {
            default: null,
            type: cc.Node
        },
        nodeSetting: {
            default: null,
            type: cc.Node
        },
        user: {
            default: null,
            type: cc.Node
        },
        audio_bgMusic: {
            default: null,
            type: cc.AudioClip
        },
        audio_btn: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.welcome = this;
        this.canplayEffect = true;
        this.canplayMusic = true;
        this.user.active = false;
        cc.director.preloadScene('game');
        this.bg.y = 0;
        this.nodeSetting.active = false

        if (this.canplayMusic) {
            this.audioBg = cc.audioEngine.play(this.audio_bgMusic, true, 1);
        }
    },

    clickBtn(sender, str) {
        if (this.canplayEffect) {
            cc.audioEngine.play(this.audio_btn, false, 1);
        }
        if (str == "playgame") {
            cc.director.loadScene("game");
        } else if (str == 'begin-setting') {
            this.nodeSetting.active = true
        } else if (str == 'btnClose_setting') {
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
    },

});