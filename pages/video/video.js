// pages/carVideo/carVideo.js
var common = require("../../utils/common.js");  //调用公用配置项
var Utils = require('../../utils/util.js')
const app = getApp();
var serverip = app.globalData.serverdomain;
var oss = app.globalData.oss;
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 1000,
    current: 0,
    videoList: [],
    videoIndexs: [],
    currentVideo: {},
    hidden: true,
    isHiddenVideo: true,
    id: 0,
    userid: 0,
    index: 0,
    title: '',
    winH: 0,
    winW: 0,
    scrollTop: 1,
    ptitle: '',
    chatobject: '',
    ajaxflag: 1,      //防止多次上滑下滑事件触发
    autoplay: true,     //默认自动播放
    isplay: 1,
    flag: 0,
    page: 0    //当前页面
  },
  bindSwiperChange: function (e) {
    var that = this;
    that.setData({
      isplay: 1
    })
    var current = e.detail.current;
    var index = e.detail.currentItemId;
    this.changeSubject(current, index);
  },
  changeSubject: function (current, index) {
    var that = this;
    var vodieList = {};
    var imgObject = "videoList[" + current + "].info.isHiddenVideo"
    vodieList[imgObject] = false; //我们构建一个对象
    that.setData(vodieList)
    var currentVideo = that.data.videoList[current].info
    that.setData({
      index: index,
      currentVideo: currentVideo,
      page: current,
    })
    var length = that.data.videoList.length
    if (!that.data.videoList[current + 1]) {
      if (that.data.flag != 1) {
        that.searchVideoDes('down');
      }

    } else if (current == (length - 1)) {
      if (that.data.flag != 1) {
        that.searchVideoDes('down');
      }
    }
    //隐藏上一个或下一个视频并停止播放
    var vodieList = {};
    var pre = current - 1;
    var next = current + 1;
    if (current == 0 && length >= 1) {
      var imgObject = "videoList[" + next + "].info.isHiddenVideo"
      vodieList[imgObject] = true; //我们构建一个对象
      that.setData(vodieList)
      that.pause(next, 1)
    } else if (current == (length - 1)) {
      var imgObject = "videoList[" + pre + "].info.isHiddenVideo"
      vodieList[imgObject] = true; //我们构建一个对象
      that.setData(vodieList)
      that.pause(pre, 1)
    } else {
      var imgObject = "videoList[" + pre + "].info.isHiddenVideo"
      vodieList[imgObject] = true; //我们构建一个对象
      that.setData(vodieList)
      var imgObject = "videoList[" + pre + "].info.isHiddenVideo"
      vodieList[imgObject] = true; //我们构建一个对象
      that.setData(vodieList)
      that.pause(next, 1)
      that.pause(pre, 1)
    }
    setTimeout(() => {
      // 切换src后，video不能立即播放，settimeout一下
      that.play()
    }, 10)
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 150);
  },
  //设置是否播放 1:播放 0：不播放
  setIsplay: function (status) {
    var that = this;
    that.setData({
      isplay: status
    });
  },
  pause: function (index, type) {
    var that = this;
    var index = index ? index : that.data.page
    var videoCtx = wx.createVideoContext('myVideo' + index, this)
    that.setIsplay(0)
    if (type) {
      videoCtx.seek(0)
    }
    videoCtx.pause()
  },
  play: function (index) {
    var that = this;
    var index = index ? index : that.data.page
    var videoCtx = wx.createVideoContext('myVideo' + index, this)
    that.setIsplay(1)
    videoCtx.play()
  },
  isPlay: function () {
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
    var that = this.data.currentVideo.info;
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
  userinfo: function (e) {
    this.pause()
    var that = this.data.currentVideo.info;
    wx.navigateTo({
      url: '/pages/user/user?userid=' + that.userid
    });
  },
  //查询上一个或一下个视频
  searchVideoDes: function (sel) {
    var that = this;
    var sel = sel;
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideoNext',
      data: {
        index: that.data.index,
        userId: that.data.userid,
        title: that.data.title,
        usertype: 2,
        sel: sel,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.info;
          var videoList = {}
          res.data.info.video = JSON.parse(res.data.info.video);
          res.data.info.videourl = oss + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/video/' + res.data.info.video.video
          res.data.info.imageurl = oss + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/image/' + res.data.info.video.image
          var index = that.data.videoList.length;
          if (that.data.videoIndexs[data.index]) {
            that.setData({
              flag: 1
            })
            return false;
          }
          var userinfo = {};
          that.login(
            data.userid,
            data.id,
            function (datas) {
              userinfo.flower = '关注'
              userinfo.flowerLogo = '../menu/delflower.png'
              userinfo.praise = ''
              if (datas.status == 1) {
                if (datas.data.flower == 1) {
                  userinfo.flower = '取消关注'
                  userinfo.flowerLogo = '../menu/flower.png'
                }
                if (datas.data.praise == 1) {
                  userinfo.praise = '已赞'
                }
              } else {
              }
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
              //对data数据添加新元素
              res.data.info.hiddenzixun = hiddenzixun;
              res.data.info.hiddenchat = hiddenchat;
              res.data.info.phone = phone;
              res.data.info.phonenumber = phonenumber;
              res.data.info.hiddenchat = hiddenchat;
              res.data.info.userinfo = userinfo;
              res.data.info.isHiddenVideo = true;
              if (sel == 'up') {
                var imgObject = "videoList[" + index + "]"
                videoList[imgObject] = res.data //我们构建一个对象
                that.setData(videoList);
              } else {
                var imgObject = "videoList[" + index + "]"
                videoList[imgObject] = res.data //我们构建一个对象
                that.setData(videoList);
              }
              var indexs = {}
              var imgObject = "videoIndexs[" + data.index + "]"
              indexs[imgObject] = 1 //我们构建一个对象
              that.setData(indexs)
            }
          )
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
  onImageLoadError: function (e) {
    var index = e.currentTarget.dataset.key;
    var image = "videoList[" + index + "].info.imageurl"
    this.setData({
      [image]: "../menu/default.jpg",
    })
  },
  addFlower: function () {
    var that = this;
    var userinfo = that.data.currentVideo.info;
    var data = that.data.currentVideo.userinfo
    var touserid = userinfo.userid;
    var userid = wx.getStorageSync('userid');
    console.log(data); console.log(userinfo)
    console.log(that.data.vodieList)
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
      if (data.flower == '取消关注') {
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
                  var page = that.data.page
                  var flower = "videoList[" + page + "].info.userinfo.flower"
                  var flowerLogo = "videoList[" + page + "].info.userinfo.flowerLogo"
                  that.setData({
                    [flower]: '取消关注',
                    [flowerLogo]: '../menu/flower.png'
                  })
                  var flower = "currentVideo.userinfo.flower"
                  var flowerLogo = "currentVideo.userinfo.flowerLogo"
                  that.setData({
                    [flower]: '取消关注',
                    [flowerLogo]: '../menu/flower.png'
                  })
                } else {
                  var page = that.data.page
                  var flower = "videoList[" + page + "].info.userinfo.flower"
                  var flowerLogo = "videoList[" + page + "].info.userinfo.flowerLogo"
                  that.setData({
                    [flower]: '关注',
                    [flowerLogo]: '../menu/delflower.png'
                  })
                  var flower = "currentVideo.userinfo.flower"
                  var flowerLogo = "currentVideo.userinfo.flowerLogo"
                  that.setData({
                    [flower]: '关注',
                    [flowerLogo]: '../menu/delflower.png'
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
    var userinfo = that.data.currentVideo.info;
    var data = that.data.currentVideo.userinfo
    var wxApi = require('../../utils/wxApi.js');
    if (data.praise == '已赞') {
      wxApi.showModalPromisified({
        'title': '点赞成功',
        'content': '亲您点过赞了',
        'showCancel': false,
      })
      return false;
    }
    var touserid = userinfo.userid;
    var userid = wx.getStorageSync('userid');
    if (touserid == userid) {
      wxApi.showModalPromisified({
        'title': '点赞失败',
        'content': '自己无法点赞自己',
        'showCancel': false,
      })
      return false;
    } else {
      var data = { 'userid': userid, id: that.data.id, type: 4 };
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
                var page = that.data.page
                var vodieList = {}
                var imgObject = "videoList[" + page + "].info.userinfo.praise"
                vodieList[imgObject] = '点赞'; //我们构建一个对象
                that.setData(vodieList)
                var vodieList = {}
                var imgObject = "currentVideo.userinfo.praise"
                vodieList[imgObject] = '点赞'; //我们构建一个对象
                that.setData(vodieList)
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
    that.setData({
      id: options.id,
      userid: options.userid,
      index: options.index,
      title: options.title,
    });
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideo',
      data: {
        id: options.id,
        userid: options.userid,
        index: options.index,
        title: options.title,
        usertype: 2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.info;
        var userinfo = {};
        that.login(
          options.userid,
          options.id,
          function (datas) {
            userinfo.flower = '关注'
            userinfo.flowerLogo = '../menu/delflower.png'
            userinfo.praise = ''
            if (datas.status == 1) {
              if (datas.data.flower == 1) {
                userinfo.flower = '取消关注'
                userinfo.flowerLogo = '../menu/flower.png'
              }
              if (datas.data.praise == 1) {
                userinfo.praise = '已赞'
              }
            } else {
            }
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
            //对data数据添加新元素
            res.data.info.index = options.index
            res.data.info.hiddenzixun = hiddenzixun;
            res.data.info.hiddenchat = hiddenchat;
            res.data.info.phone = phone;
            res.data.info.phonenumber = phonenumber;
            res.data.info.hiddenchat = hiddenchat;
            res.data.info.userinfo = userinfo;
            res.data.info.isHiddenVideo = false;
            res.data.info.video = JSON.parse(res.data.info.video);
            res.data.info.videourl = oss + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/video/' + res.data.info.video.video
            res.data.info.imageurl = oss + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/image/' + res.data.info.video.image
            var videoList = {}
            var index = 0;
            var imgObject = "videoList[" + index + "]"
            videoList[imgObject] = res.data //我们构建一个对象
            that.setData(videoList);
            var indexs = {};
            var imgObject = "videoIndexs[" + options.index + "]"
            indexs[imgObject] = 1 //我们构建一个对象
            that.setData(indexs)
            that.searchVideoDes('down')
            that.setData({
              currentVideo: res.data.info
            })
            // 切换src后，video不能立即播放，settimeout一下
            setTimeout(() => {
              that.play()
            }, 100)
          }
        )
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
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
  login: function (userid, id, success) {
    var that = this;
    var util = require("../../utils/util.js");  //调用公用配置项
    var userId = userid;
    var myuserid = wx.getStorageSync('userid');
    var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2 };
    if (!userId) {
      return false;
    }
    var data = { 'userid': userId, 'myuserid': myuserid, 'usertype': 2, id: id, type: 4 };
    //查询用户信息
    util.commonAjax('/oms/api.php/wxUserInfo/searchUserObjInfo', 2, data).then(function (resolve) {
      typeof success == "function" && success(resolve.data)
    })
  },
  setWinh: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        that.setData({
          winH: parseInt(res.windowHeight),
          winW: parseInt(res.windowWidth),
        });
      }
    });
  },
  imgSet: function (e) {
    var that = this;
    var winW = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var winH = wx.getSystemInfoSync().windowHeight;
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var imagew = 0;
    var imageH = 0;
    if ((imgw / imgh) > (winW / winH)) {
      imagew = winW + "px"
      imageH = imgh * (winW / imgw) + "px"
    } else {
      imageH = winH + "px"
      imagew = imgw * (winH / imgh) + "px"
    }
    var index = e.currentTarget.dataset.key;
    var imgHeight = "videoList[" + index + "].info.imageH"
    var imgWidth = "videoList[" + index + "].info.imageW"
    this.setData({
      [imgHeight]: imageH,
      [imgWidth]: imagew
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