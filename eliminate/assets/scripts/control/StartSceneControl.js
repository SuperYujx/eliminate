/**
 * StartSceneControl.js
 * 功能：实现 startScene 页面控制逻辑
 */

cc.Class({
    extends: cc.Component,

    properties: {
        userAvatar: cc.Sprite,
        userName: cc.Label,

        rankButton: cc.Button,
        startPlay: cc.Button,
        wxSubContextView: cc.Node,
        closeRankButton: cc.Button


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.subLoadState = 0;
    },

    start() {
        let self = this;
        this.startPlay.node.on('touchstart', this.onStartPlayTouchStart, this);
        this.rankButton.node.on('touchstart', this.onRankTouchStart, this);
        this.closeRankButton.node.on('touchstart', this.onCloseRankTouchStart, this);

        this.initUserInfoButton();

        cc.loader.downloader.loadSubpackage('musics', function (err) {
            if (err) {
                return console.error(err);
            }

            self.subLoadState += 1;
            console.log('load musics successfully.');
        });

        cc.loader.downloader.loadSubpackage('mainGame', function (err) {
            if (err) {
                return console.error(err);
            }

            self.subLoadState += 1;
            console.log('load mainGame successfully.');
        });

        cc.loader.downloader.loadSubpackage('menu', function (err) {
            if (err) {
                return console.error(err);
            }

            self.subLoadState += 1;
            console.log('load menu successfully.');
        });
    },

    // update (dt) {},

    onStartPlayTouchStart() {
        console.log('startPlay onTouchStart.');

        if (this.subLoadState >= 3) {
            console.log('全部加载完毕！');
            cc.director.loadScene('gameScene')
        }


    },

    onRankTouchStart() {
        console.log('rank onTouchStart.');
        if (this.wxSubContextView.active == false) {
            this.wxSubContextView.active = true;
        }

    },

    onCloseRankTouchStart() {
        console.log('closeRank onTouchStart.');
        if (this.wxSubContextView.active == true) {
            this.wxSubContextView.active = false;
        }

    },

    // 获取微信头像和名字
    initUserInfoButton() {
        if (typeof wx === 'undefined') {
            console.log("非微信环境！");

            return;
        }

        wx.getUserInfo({
            success: res => {
                console.log('调用getUserInfo');
                let userInfo = res.userInfo;
                if (!userInfo) {
                    console.log('获取用户微信头像和昵称失败！')
                    return;
                }

                cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, texture) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    this.userAvatar.spriteFrame = new cc.SpriteFrame(texture);
                });

                this.userName.string = userInfo.nickName;

                wx.getOpenDataContext().postMessage({
                    message: "获取用户微信头像和昵称成功！"
                });

                return;
            },
            fail: () => {
                let systemInfo = wx.getSystemInfoSync();
                let width = systemInfo.windowWidth;
                let height = systemInfo.windowHeight;
                let button = wx.createUserInfoButton({
                    type: 'text',
                    text: '',
                    style: {
                        left: 0,
                        top: 0,
                        width: width,
                        height: height,
                        lineHeight: 40,
                        backgroundColor: '#00000000',
                        color: '#00000000',
                        textAlign: 'center',
                        fontSize: 10,
                        borderRadius: 4
                    }
                });

                button.onTap((res) => {
                    let userInfo = res.userInfo;
                    if (!userInfo) {
                        console.log('获取用户微信头像和昵称失败！')
                        return;
                    }

                    cc.loader.load({ url: userInfo.avatarUrl, type: 'png' }, (err, texture) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        this.userAvatar.spriteFrame = new cc.SpriteFrame(texture);
                    });

                    this.userName.string = userInfo.nickName;

                    wx.getOpenDataContext().postMessage({
                        message: "获取用户微信头像和昵称成功！"
                    });

                    button.hide();
                    button.destroy();
                });
            }
        })
    },
});
