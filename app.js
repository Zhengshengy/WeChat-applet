//app.js
import AppIMDelegate from "./delegate/app-im-delegate";
const config = require("./utils/config.js");  //调用公用配置项
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.reLaunch({
      url: '/pages/login/wxLogin',
    })
    // var that = this
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       //检查sessionkey是否过期
    //       wx.checkSession({
    //         success: function (res) {
    //           // 登录并更新后台缓存
    //           wx.login({
    //             success: res => {
    //               // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //               var wxcode = res.code;
    //               var util = require("./utils/util.js");  //调用公用配置项
    //               var data = { JSCODE: wxcode, type: 2 };
    //               //缓存更新
    //               util.commonAjax('/oms/api.php/wxLogin/login', 2, data).then(function (resolve) {
    //                 if(resolve.data.status == 200){
    //                   var common = require('./utils/common.js');        
    //                   if (common.isBlank(resolve.data.info)){
    //                     wx.showModal({
    //                       title: '提示',
    //                       content: '登陆过期请重新授权',
    //                       confirmText: "确定",
    //                       confirmColor: "#ef8383",
    //                       showCancel: false,
    //                       success: function (res) {
    //                         if (res.confirm) {
    //                           // 进行登录操作
    //                           wx.reLaunch({
    //                             url: '/pages/authorize/authorize?status=1',
    //                           })
    //                         } else {
    //                         }
    //                       }
    //                     })
    //                   }else{
    //                     that.globalData.userid = resolve.data.info;
    //                     wx.setStorageSync('userid', resolve.data.info)
    //                     that.iniIMDelegate();  
    //                   }                 
    //                 }
    //               })
    //             }
    //           })
    //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //           wx.getUserInfo({
    //             lang: 'zh_CN',
    //             success: res => {
    //               // 可以将 res 发送给后台解码出 unionId
    //               that.globalData.userInfo = res.userInfo;
    //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //               // 所以此处加入 callback 以防止这种情况
    //               wx.setStorageSync('userInfo', res.userInfo)
    //               if (that.userInfoReadyCallback) {
    //                 that.userInfoReadyCallback(res);
    //               }
    //             }
    //           })
    //           //session_key未过期
    //         },
    //         fail: (res => {
    //           // session_key已过期
    //           // 进行登录操作
    //           wx.reLaunch({
    //             url: '/pages/authorize/authorize',
    //           })
    //         })
    //       })
    //     } else {
    //       wx.reLaunch({
    //         url: '/pages/authorize/authorize',
    //       })
    //     }
    //   }
    // })

  },
  iniIMDelegate:function(){
    this.appIMDelegate = new AppIMDelegate(this);
    this.appIMDelegate.onLaunch();
    this.appIMDelegate.onHide();
    this.appIMDelegate.onShow();
  }, 
  onLoad: function () {

  },
  onHide(optins) {
    
  },
  onShow(options) {
    
  },
  globalData:{
    userid:null,
    userInfo:null,
    serverdomain: config.server.site_url + ':'+config.server.port,
    oss: config.server.oss
  },
    getIMHandler() {
    if (!this.appIMDelegate) {
      this.iniIMDelegate();
    }
    return this.appIMDelegate.getIMHandlerDelegate();
  },
})