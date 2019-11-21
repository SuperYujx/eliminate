
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab,
    },

    start() {
        let self = this;
        if (typeof wx === 'undefined') {
            return;
        }

        wx.onMessage(data => {
            if (data.message == 'updateGrade') {
                console.log(data.message);
                self.initFriendRank();
            }
        });

        this.initFriendRank();
    },

    initFriendRank() {
        this.content.removeAllChildren();
        let self = this;
        wx.getFriendCloudStorage({
            keyList: ['yujx_MaxScore'],
            success: res => {
                var objectArraySort = function (keyName) {
                    return function (objectN, objectM) {
                        var valueN = objectN[keyName][0].value;
                        var valueM = objectM[keyName][0].value;
                        if (valueN < valueM) return 1
                        else if (valueN > valueM) return -1
                        else return 0
                    }
                }

                res.data.sort(objectArraySort('KVDataList'))    // 对数组进行排序

                for (let i = 0; i < res.data.length; ++i) {
                    console.log('玩家' + i + '的信息：' + JSON.stringify(res.data[i]));

                    self.createUserBlock(res.data[i]);
                }
            },
            fail: res => {
                console.error(res);
            }
        });

    },

    createUserBlock(user) {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        node.x = 0;

        // set nickName
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        userName.string = user.nickName || user.nickname;

        // set avatar
        cc.loader.load({ url: user.avatarUrl, type: 'png' }, (err, texture) => {
            if (err) console.error(err);
            let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });

        // set userGrade
        let userGrade = node.getChildByName('userGrade').getComponent(cc.Label);
        if (user.KVDataList) {
            var dList = user.KVDataList;
            for (var i = 0; i < dList.length; i++) {
                if (dList[i].key == "yujx_MaxScore") {
                    console.log("自己的托管数据:" + dList[i].value);
                    userGrade.string = dList[i].value;
                }
            }
        }

    },
});
