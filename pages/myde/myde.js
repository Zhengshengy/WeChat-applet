//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    userid:'',
    username : '',
    sex      : '',
    phone    : '',
    headimg  : '',
    bumen    : '',
    position : '',
    password :'',
    loginbtn : true,
    unread   :0
    },
  // 登录
  login: function () {
    var that = this;
    var util = require("../../utils/util.js");  //调用公用配置项
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    var data = { 'session3rd': userId};
    //查询文章列表
    util.commonAjax('/oms/api.php/wxLogin/userlogin', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (data.status == 1) {
        that.setData({
          loginbtn: false
        });
        wx.setStorage({
          key: 'webuserid',
          data: data.id
        })
        return;
      } else {
        return;
      }
    })
  },
  onLoad: function () {
  },
  order: function () {
    wx.navigateTo({ url: "/pages/myziliao/myziliao" })
  },
  huodong: function () {
    wx.navigateTo({
      url: `../chat-list/chat-list`
    });
  },
  guanzhu: function () {
    wx.navigateTo({
      url: `/pages/user/guanzhu`
    });
  },
  guanyu: function () {
    wx.navigateTo({ url: "/pages/guanyu/guanyu" })
  },
  photoadd: function () {
    wx.navigateTo({ url: "/pages/photoadd/index" })
  },
  gologin: function () {
    wx.navigateTo({ url: "/pages/login/login" });
  },
  xitongxiaoxi: function () {
    wx.navigateTo({ url: "/pages/xitongxiaoxi/xitongxiaoxi" });
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow() {
    var that = this;
    app.iniIMDelegate(); 
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    if (userId) {
      that.setData({
        loginbtn: false,
        userid: userId
      });
    } else {
      that.login();
    }
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data
        that.setData({
          headimg: userinfo.avatarUrl,
        });
      },
      fail: function () {
      }
    })
    getApp().getIMHandler().setOnReceiveMessageListener({
      listener: (msg) => {
//        console.log(msg);
        msg.type === 'get-unreadnuws' && this.setData({ unread: msg.unread })
      }

    });
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    getApp().getIMHandler().sendMsg({
      content: {
        type: 'get-unreadnuws',
        userId: userId
      }, success: () => {
  //      console.log('获取会话列表消息发送成功');
      },
      fail: (res) => {
//        console.log('获取会话列表失败', res);
      }
    });
  },

})
