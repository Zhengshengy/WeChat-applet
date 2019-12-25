const app = getApp();
var serverip = app.globalData.serverdomain;
var common = require("../../utils/common.js");  //调用公用配置项
var util = require("../../utils/util.js")  //调用公用配置项
Page({
  data: {
    // text:"这是一个页面"
    data: [],
    articleInfo: null,
    content: '',
    winHeight: 0,   // 设备高度
    title: '',
    // 弹窗
    modalHidden: true,
    modalValue: null,
    gongsi: "和盛悦和文化传媒有限公司",

    /**
     * 分享配置
     */
    shareShow: 'none',
    shareOpacity: {},
    shareBottom: {},
    id:'',
    userid : '',
    flower: '关注',
    flowerLogo: '../menu/flower.png',
    praise: '',
    praisenum : 0,
    logo: '',
    username:'',
    image: '',
    chatobject:'',
    hidden: true,
    hiddenzixun: false,
    hiddenchat: false,     //聊天框是否显示
    phone: false,
    phonenumber: '',
  },
  onLoad: function (options) {
    // 页面初始化 options 为页面跳转所带来的参数
    var that = this
    var id = options.id;
    var title = options.title;
    that.setData({
      title: title,
      praisenum: options.praisenum
    });
    var data = { aid: options.id };
    var that = this;
    //查询文章列表
    util.commonAjax('/oms/api.php/Article/articleInfo', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (data.status == 1) {
        //将富文本转化为小程序可读文件
        var WxParse = require('../../wxParse/wxParse.js');
        WxParse.wxParse('content', 'html', data.info.content, that, 5);
        that.setData({
          articleInfo: data.info,
          userid: data.info.userid,
          id: id
        });
        that.login(data.info.userid,id)
      } else {
      }
    })
  },
  // 登录
  login: function (userid, id) {
    var that = this;
    var userId = userid;
    var myuserid = wx.getStorageSync('userid');
    var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2 };
    if (!userId) {
      return false;
    }
    var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2, id: id, type: 3 };
    //查询用户信息
    util.commonAjax('/oms/api.php/wxUserInfo/searchUserObjInfo', 2, data).then(function (resolve) {
      var data = resolve.data;
      var hiddenchat = false;
      var phone = false;
      var phonenumber = false;
      var hiddenzixun = false;
      if (userid != myuserid) {
        hiddenzixun = true;
      }
      if ((userid != myuserid) && !common.isBlank(userid)) {
        hiddenchat = true;
      }
      if (userid != myuserid && !common.isBlank(data.data.phone) && !common.isBlank(userid)) {
        phone = true;
        phonenumber = data.data.phone;
      }
      if (data.status == 1) {
        if (data.data.flower == 1) {
          that.setData({
            flower: '取消关注',
            flowerLogo: '../menu/flower.png',
          })
        } else {
          that.setData({
            flower: '关注',
            flowerLogo: '../menu/delflower.png'
          })
        }
        if (data.data.praise == 1) {
          that.setData({
            praise: '已赞',
          })
        } else {
          that.setData({
            praise: '',
          })
        }
        that.setData({
          chatobject: data.data,
          hiddenzixun: hiddenzixun,
          hiddenchat: hiddenchat,
          phone: phone,
          phonenumber: phonenumber,
          logo: data.data.avatarurl,
          username: data.data.nickname
        })
        return;
      } else {
        return;
      }
    })
  },
  addFlower: function () {
    var that = this;
    var touserid = that.data.userid;
    var userid = wx.getStorageSync('userid');
    if (touserid == userid) {
      var wxApi = require('../../utils/wxApi.js');
      wxApi.showModalPromisified({
        'title': '关注失败',
        'content': '自己无法关注自己',
        'showCancel': false,
      })
      return false;
    } else {
      var type = 1;
      var url = 'addFlower';
      if (that.data.flower == '取消关注') {
        var type = 2;
        var url = 'delFlower'
      }
      var data = { 'userid': userid, 'touserid': touserid };
      //用户关注添加
      util.commonAjax('/oms/api.php/wxUserInfo/' + url, 2, data).then(function (resolve) {
        var data = resolve.data;
        if (data.status == '1111') {
          wx.showModal({
            title: '提示',
            content: data.info,
            confirmText: "确定",
            confirmColor: "#ef8383",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (type == 1) {
                  that.setData({
                    flower: '取消关注',
                    flowerLogo: '../menu/flower.png'
                  })
                } else {
                  that.setData({
                    flower: '关注',
                    flowerLogo: '../menu/delflower.png'
                  })
                }
              }
            }
          })
          that.setData({
            flag: 0
          })
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: data.info,
            confirmText: "确定",
            confirmColor: "#ef8383",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
          that.setData({
            flag: 0
          })
        }
      })
    }
  },
  userinfo: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/user/user?userid=' + that.data.userid
    });
  },
  addPraise: function () {
    var that = this;
    var wxApi = require('../../utils/wxApi.js');
    if (that.data.praise == '已赞') {
      wxApi.showModalPromisified({
        'title': '点赞成功',
        'content': '亲您点过赞了',
        'showCancel': false,
      })
      return false;
    }
    var touserid = that.data.userid;
    var userid = wx.getStorageSync('userid');
    if (touserid == userid) {
      wxApi.showModalPromisified({
        'title': '点赞失败',
        'content': '自己无法点赞自己',
        'showCancel': false,
      })
      return false;
    } else {
      var data = { 'userid': userid, id: that.data.id, type: 3 };
      //用户关注添加
      util.commonAjax('/oms/api.php/wxUserInfo/addPraise', 2, data).then(function (resolve) {
        var data = resolve.data;
        if (data.status == '1111') {
          wx.showModal({
            title: '提示',
            content: data.info,
            confirmText: "确定",
            confirmColor: "#ef8383",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  praise: '已赞',
                })
              }
            }
          })
          that.setData({
            flag: 0
          })
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: data.info,
            confirmText: "确定",
            confirmColor: "#ef8383",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
          that.setData({
            flag: 0
          })
        }
      })
    }
  },
  chatToUser: function (e) {
    app.iniIMDelegate();
    var that = this.data.chatobject;
    if (!that.userid) {
      return false;
    }
    var params = { 'friendId': that.userid, 'friendName': that.nickname, 'friendHeadUrl': that.avatarurl }
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(params)}`
    })
  },
  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        //console.log("拨打电话成功！")
      },
      fail: function () {
        //console.log("拨打电话失败！")
      }
    })
  },

})