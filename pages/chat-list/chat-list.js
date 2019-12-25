// pages/chat-list/chat-list.js
const app = getApp()
var serverip = app.globalData.serverdomain;
var common = require("../../utils/common.js");  //调用公用配置项
/**
 * 会话列表页面
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
      conversations: [],
      handlehidden: 1,
      handleflag: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    toChat(e) {
      var that = this;
      if (that.data.handleflag == 1) {
        that.selectChat(e);
        return false;
      }
        let item = e.currentTarget.dataset.item;
      console.log(e.currentTarget.dataset.item)
        delete item.latestMsg;
        delete item.unread;
        delete item.content;
        wx.navigateTo({
            url: `../chat/chat?friend=${JSON.stringify(item)}`
        });
    },
  selectChat: function (e) {
    var that = this;
    var data = {};
    var index = e.currentTarget.dataset.index;
    var color = e.currentTarget.dataset.color;
    if (color == 'white') {
      color = '#FC4C91';
    } else {
      color = 'white';
    }
    var dataObject = "conversations[" + index + "].item.color"
    data[dataObject] = color //我们构建一个对象
    that.setData(data)
  },
  closeHandle: function () {
    var that = this;
    var datas = that.data.conversations;
    for (var key in datas) {
      datas[key].item.handlehidden = 1;
      datas[key].item.color = "white"
    }
    that.setData({
      handlehidden: 1,
      conversations: datas,
      handleflag: 0
    })
  },
  deleteHandle: function () {
    var that = this;
    var datas = that.data.conversations;
    var i = 0;
    var friendids = []
    for (var key in datas) {
      if (datas[key].item.color == '#FC4C91') {
        friendids[i] = datas[key].item.friendId;
        i = i + 1;
      }
    }
    if (common.isBlank(friendids)) {
      wx.showModal({
        title: "提示",
        content: '请选择需要删除的聊天！',
        showCancel: false,
        cancelText: "取消111",
        cancelColor: "#000",
        confirmText: "确定",
        confirmColor: "#0f0",
        success: function (res) {
          if (res.confirm) {
            return false;
          }
        }
      })
      return false;
    }
    var wxuserid = wxuserid;
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除该聊天吗？',
      confirmText: "确定",
      confirmColor: "#ef8383",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: 'POST',
            url: serverip + '/oms/api.php/wxUserInfo/deleteBatChat',
            data: {
              friendids: friendids, //把第几次加载次数作为参数
              userId: userId,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var data = res.data;
              if (data.status == 1) {
                wx.showModal({
                  title: "提交",
                  content: '删除成功',
                  showCancel: false,
                  cancelText: "取消111",
                  cancelColor: "#000",
                  confirmText: "确定",
                  confirmColor: "#0f0",
                  success: function (res) {
                    if (res.confirm) {
                      that.onShow();
                      return false;
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: "提交",
                  content: '删除失败',
                  showCancel: false,
                  cancelText: "取消111",
                  cancelColor: "#000",
                  confirmText: "确定",
                  confirmColor: "#0f0",
                  success: function (res) {
                    if (res.confirm) {
                      return false;
                    }
                  }
                })
              }
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        } else {
        }
      }
    })
  },
  longPress: function (e) {
      var that = this;
      var datas = that.data.conversations;
      var that = this;
      var datas = that.data.conversations;
      for (var key in datas) {
        datas[key].item.handlehidden = 2;
      }
      var index = e.currentTarget.dataset.index;
      var data = {}
      var dataObject = "conversations[" + index + "].item.color"
      data[dataObject] = "#FC4C91" //我们构建一个对象
      that.setData(data)
      that.setData({
        handlehidden: 2,
        conversations: datas,
        handleflag: 1
      })
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var that = this;
        that.setData({
          handlehidden: 1,
          handleflag: 0,
        })
        getApp().getIMHandler().setOnReceiveMessageListener({
            listener: (msg) => {
              console.log(msg.conversations)
              var arr = []
              for (let i in msg.conversations) {
                arr[i] = msg.conversations[i]; //属性
                arr[i].item.index = i;
                arr[i].item.color = 'white';
              }
              msg.conversations = arr;
             console.log(msg.conversations);
              msg.type === 'get-conversations' && this.setData({ conversations: msg.conversations })
              //msg.type === 'get-conversations' && this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
              //console.log(this.data.conversations)
            }
    
        });
      var userId = wx.getStorageSync('userid');
      if (!userId) {
        userId = app.globalData.userid
      }
        getApp().getIMHandler().sendMsg({
            content: {
                type: 'get-conversations',
                userId: userId
            }, success: () => {
//                console.log('获取会话列表消息发送成功');
            },
            fail: (res) => {
  //              console.log('获取会话列表失败', res);
            }
        });
      //console.log(this.data.conversations)
    },
    // getConversationsItem(item) {
    //   console.log(item); let { ceshi, ...msg } = item;
    //   console.log(ceshi); console.log(msg);
    //   return Object.assign(msg, JSON.parse(ceshi));;

    //  //   let {latestMsg, ...msg} = item;
    //  // console.log(latestMsg); console.log(...msg);
    //  // return Object.assign(msg, JSON.parse(latestMsg));
    // }
});