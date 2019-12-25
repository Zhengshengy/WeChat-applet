const app = getApp();
var wxcode = '';
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wxcode = res.code;
      }
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //用户已经授权过
              console.log(options)
              if(options.status){
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      //调用登录接口
      var util = require("../../utils/util.js");  //调用公用配置项
      var that = this;
      var data = { JSCODE: wxcode, rawData: e.detail.rawData, signature: e.detail.signature, encryptedData:e.detail.encryptedData,iv:e.detail.iv};
      app.globalData.userInfo = e.detail.userInfo;
      //验证并插入或更新数据库信息
      util.commonAjax('/oms/api.php/wxLogin/login', 2, data).then(function (resolve) {
        if (resolve.data.status === '200') {
          // 成功
          app.globalData.userid = resolve.data.info;
          wx.setStorageSync('userInfo', e.detail.userInfo)
          wx.setStorageSync('userid', resolve.data.info)
          // 新手们注意一下，记得把下面这个写到这里，有好处。
          // that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          getApp().iniIMDelegate();  
          //授权成功后，跳转进入小程序首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '授权失败请重新授权',
            confirmText: "确定",
            confirmColor: "#ef8383",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 进行登录操作
                wx.reLaunch({
                  url: '/pages/authorize/authorize',
                })
              } else {
              }
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }
  },

})
