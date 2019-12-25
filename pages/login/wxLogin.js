const config = require("../../utils/config.js");  //调用公用配置项
var app = getApp();
// pages/login/wxLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //检查sessionkey是否过期
          wx.checkSession({
            success: function (res) {
              // 登录并更新后台缓存
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  var wxcode = res.code;
                  var util = require("../../utils/util.js");  //调用公用配置项
                  var data = { JSCODE: wxcode, type: 2 };
                  //缓存更新
                  util.commonAjax('/oms/api.php/wxLogin/login', 2, data).then(function (resolve) {
                    if (resolve.data.status == 200) {
                      var common = require('../../utils/common.js');
                      if (common.isBlank(resolve.data.info)) {
                        wx.showModal({
                          title: '提示',
                          content: '登陆过期请重新授权',
                          confirmText: "确定",
                          confirmColor: "#ef8383",
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              // 进行登录操作
                              wx.reLaunch({
                                url: '/pages/authorize/authorize?status=1',
                              })
                            } else {
                            }
                          }
                        })
                      } else {
                        app.globalData.userid = resolve.data.info;
                        wx.setStorageSync('userid', resolve.data.info)
                        app.iniIMDelegate();
                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
                }
              })
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                lang: 'zh_CN',
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.globalData.userInfo = res.userInfo;
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  wx.setStorageSync('userInfo', res.userInfo)
                  if (app.userInfoReadyCallback) {
                    app.userInfoReadyCallback(res);
                  }
                }
              })
              //session_key未过期
            },
            fail: (res => {
              // session_key已过期
              // 进行登录操作
              wx.reLaunch({
                url: '/pages/authorize/authorize',
              })
            })
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})