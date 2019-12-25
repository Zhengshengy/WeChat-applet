// pages/carVideo/carVideo.js
var common = require("../../utils/common.js");  //调用公用配置项
var Utils = require('../../utils/util.js')
const app = getApp();
var serverip = app.globalData.serverdomain;
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    flower: '关注',
    flowerLogo : '../menu/flower.png',
    praise:'',
    logo: '',
    distance: 0,
    image: '',
    hidden: true,
    video: '',
    id: 0,
    userid: 0,
    index: 0,
    title: '',
    winH: 0,
    winW: 0,
    scrollTop: 1,
    ptitle: '',
    hiddenzixun :false,
    hiddenchat: false,     //聊天框是否显示
    phone: false,
    phonenumber: '',
    chatobject: '',
    ajaxflag: 1,      //防止多次上滑下滑事件触发
    autoplay: true,     //默认自动播放
    isplay: 1,
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  //设置是否播放 1:播放 0：不播放
  setIsplay(status) {
    var that = this;
    that.setData({
      isplay: status
    });
  },
  pause() {
    var videoCtx = wx.createVideoContext('myVideo', this)
    this.setIsplay(0)
    videoCtx.pause()
  },
  play() {
    var videoCtx = wx.createVideoContext('myVideo', this)
    this.setIsplay(1)
    videoCtx.play()
  },
  isPlay() {
    if (this.data.isplay == 1) {
      this.pause()
    } else {
      this.play()
    }
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    if (touchMove - touchDot <= -40 && time < 10) {
      var that = this;
      setTimeout(function () {
        that.searchVideoDes('down');
      }, 50)
    }
    if (touchMove - touchDot >= 40 && time < 10) {
      var that = this;
      setTimeout(function () {
        that.searchVideoDes('up');
      }, 50)
    }
    clearInterval(interval);
    time = 0;
  },
  chatToUser: function (e) {
    app.iniIMDelegate(); 
    this.pause() 
    var that = this.data.chatobject; 
    if (!that.userid) {
      return false;
    }
    var params = { 'friendId': that.userid, 'friendName': that.nickname, 'friendHeadUrl': that.avatarurl }
    wx.navigateTo({
      url: `../chat/chat?friend=${JSON.stringify(params)}`
    });
  },
  /**
   * 人员地址
   */
  baidumap: function (e) {
    var video = e.target.dataset.video;
    wx.navigateTo({
      url: '/pages/BMap/index'
    });
  },
  userinfo:function(e){
    var that = this;
    that.pause()
    wx.navigateTo({
      url: '/pages/user/user?userid='+that.data.userid
    });
  },
  //查询上一个或一下个视频
  searchVideoDes: function (sel) {
    var that = this;
    if (that.data.ajaxflag == 0) {
      return false;
    }
    that.setData({
      ajaxflag: 0
    });
    var sel = sel;
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideoNext',
      data: {
        index: that.data.index,
        title: that.data.title,
        sel: sel,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.info;
          var userid = wx.getStorageSync('userid');
          if (!userid) {
            userid = app.globalData.userid
          }
          var hiddenchat = false;
          var phone = false;
          var phonenumber = false;
          var hiddenzixun = false;
          if (data.info.userid != userId){
            hiddenzixun = true;
          }
          if ((data.info.userid != userId) && !common.isBlank(data.info.userid)) {
            hiddenchat = true;
          }
          if (data.info.userid != userId && !common.isBlank(data.info.phone) && !common.isBlank(data.info.userid)) {
            phone = true;
            phonenumber = data.info.phone;
          }
          var video = JSON.parse(data.video);
          var videopath = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + video.videoid + '/video/' + video.video;
          that.login(data.userid, data.id)
          that.setData({
            scrollTop: 1,
            username: data.username,
            logo: data.logo,
            distance: data.distance,
            video: videopath,
            id: data.id,
            userid: data.userid,
            index: data.index,
            title: data.title,
            ptitle: data.ptitle,
            chatobject: data.info,
            hiddenzixun: hiddenzixun,
            hiddenchat: hiddenchat,
            phone: phone,
            phonenumber: phonenumber,
            ajaxflag: 1
          });
        }

      },
      fail: function (res) {

        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  addFlower: function () {
    var that = this;
    var touserid = that.data.userid;
    var userid = wx.getStorageSync('userid');
    if (!userid) {
      userid = app.globalData.userid
    }
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
      Utils.commonAjax('/oms/api.php/wxUserInfo/' + url, 2, data).then(function (resolve) {
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
                    flower     : '取消关注',
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
  addPraise: function () {
    var that = this;
    var wxApi = require('../../utils/wxApi.js');
    if(that.data.praise == '已赞'){
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
      var data = { 'userid': userid, id:that.data.id,type:4};
      //用户关注添加
      Utils.commonAjax('/oms/api.php/wxUserInfo/addPraise', 2, data).then(function (resolve) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setWinh();
    that.login(options.userid,options.id);
    that.setData({
      id: options.id,
      userid: options.userid,
      index: options.index,
      title: options.title
    });
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideo',
      data: {
        id: options.id,
        index: options.index,
        title: options.title,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.info;
        var userId = wx.getStorageSync('userid');
        var hiddenchat = false;
        var phone = false;
        var phonenumber = false;
        var hiddenzixun = false;
        if (data.info.userid != userId) {
          hiddenzixun = true;
        }
        if ((data.info.userid != userId) && !common.isBlank(data.info.userid)) {
          hiddenchat = true;
        }
        if (data.info.userid != userId && !common.isBlank(data.info.phone) && !common.isBlank(data.info.userid)) {
          phone = true;
          phonenumber = data.info.phone;
        }
        var video = JSON.parse(data.video);
        var videopath = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + video.videoid + '/video/' + video.video
        that.setData({
          username: data.username,
          logo: data.logo,
          distance: data.distance,
          image: serverip + data.image,
          video: videopath,
          chatobject: data.info,
          hiddenzixun: hiddenzixun,
          hiddenchat: hiddenchat,
          ptitle: data.ptitle,
          phone: phone,
          phonenumber: phonenumber
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
      that.changeSubject(0)
  },
  changeSubject: function (index) {
    console.log(index)
    // 当前位置
    var subject = this.data.subjectList[index];
    // 切换内容
    this.setData({
      subject: subject
    })

    // // 自动加载
    // var diff = this.data.subjectList.length - index;
    // if (diff < pageRows) {
    //   this.changeSubject();
    // }
  },
  calling: function (e) {
    this.pause()
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
  // 登录
  login: function (userid,id) {
    var that = this;
    var util = require("../../utils/util.js");  //调用公用配置项
    var userId = userid;
    var myuserid = wx.getStorageSync('userid');
    var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2 };
    if (!userId) {
      return false;
    }
    // //查询用户信息
    // util.commonAjax('/oms/api.php/wxUserInfo/searchUserInfo', 2, data).then(function (resolve) {
    //   var data = resolve.data;
    //   if (data.status == 1) {
    //     that.setData({
    //       headimg: data.data.avatarurl,
    //       username: data.data.nickname,
    //       phone: data.data.phone,
    //     });
    //     if (data.data.flower == 1) {
    //       that.setData({
    //         flower: '取消关注',
    //       })
    //     }
    //     return;
    //   } else {
    //     return;
    //   }
    // })
      var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2, id:id, type: 4 };
      //查询用户信息
      util.commonAjax('/oms/api.php/wxUserInfo/searchUserObjInfo', 2, data).then(function (resolve) {
        var data = resolve.data;
        if (data.status == 1) {
          if (data.data.flower == 1) {
            that.setData({
              flower: '取消关注',
              flowerLogo: '../menu/flower.png'
            })
          }else{
            that.setData({
              flower: '关注',
              flowerLogo: '../menu/delflower.png'
            })
          }
          if (data.data.praise == 1) {
            that.setData({
              praise: '已赞',
            })
          }else{
            that.setData({
              praise: '',
            })
          }
          return;
        } else {
          return;
        }
      })
      util.commonAjax('/oms/api.php/wxUserInfo/searchDes', 2, data).then(function (resolve) {
        var data = resolve.data;
        if (data.status == 1) {
          that.setData({
            acount: data.data.acount,
            vcount: data.data.vcount
          });
          return;
        } else {
          return;
        }
      })
    },
  setWinh: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: parseInt(res.windowHeight),
          winW: parseInt(res.windowWidth),
        });
      }
    });
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
    this.play()
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