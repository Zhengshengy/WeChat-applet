//index.js
//获取应用实例
import * as event from '../../utils/event.js'
const app = getApp()
const windowHeight = wx.getSystemInfoSync().windowHeight
// pages/carVideo/carVideo.js
var common = require("../../utils/common.js");  //调用公用配置项
var Utils = require('../../utils/util.js')
var serverip = app.globalData.serverdomain;
Page({
  data: {
    percent: 1,
    autoplay: true,
    controls: false,
    showFullscreenBtn: false,
    showPlayBtn: false,
    showFullscreenBtn: false,
    showCenterPlayBtn: false,
    enableProgressGesture: false,
    showProgress: false,
    playState: true,
    animationShow: false,
    currentTranslateY: 0,
    touchStartingY: 0,
    videoList:[],
    videos: [
      {
        videoUrl: "http://v.kandian.qq.com/shg_753067649_1047_04b4dd8dc4b646e6a88aaa66dad2vide.f20.mp4?dis_k=a613a086491dc11011c995dfed9800e1&dis_t=1544012470",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-43EA9FAEE70685E641983C69711ECD58_vsmcut/600"
      },
      {
        videoUrl: "https://www.heshenghaoche.com:/upload_files/wxuser/2/wall/video10/video/5c11dbbc5d9b1.mp4",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-C0227B64F7428B0EC9AA0FA26151179C_vsmcut/600"
      },
      {
        videoUrl: "http://v.kd1.qq.com/shg_321_1116_22X0000000jmAye1Rbhml5c029b4b972.f822.mp4?dis_k=d1cbe54b6ca65b3ec4e0b14f9d2d54f9&dis_t=1544240448",
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-61BD7E767F36BECB198B892ACBC1279F_vsmcut/600"
      },
      {
        videoUrl: 'http://v.kd1.qq.com/shg_321_1116_6X000000000000000000000000rvt8ZO.f822.mp4?dis_k=b82f176eba0768f359d3b3199ecd5746&dis_t=1544252570',
        durations: 10,
        poster: "http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-94F24F895093DE70E3621835536A1549_vsmcut/600"
      }
    ],
    videoIndex: 0,
    objectFit: "contain"
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
        title: that.data.title,
        sel: sel,
        id: that.data.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1) {
          var data = res.data.info;
          console.log(res.data)
          var videoList = {}
          res.data.info.video = JSON.parse(res.data.info.video);
          res.data.info.videourl = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/video/' + res.data.info.video.video
          res.data.info.imageurl = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/image/' + res.data.info.video.image
          if (sel == 'up') {
            var imgObject = "videoList[" + data.index + "]"
            videoList[imgObject] = res.data //我们构建一个对象
            that.setData(videoList);
            that.setData(videoList);
          } else {
            var imgObject = "videoList[" + data.index + "]"
            videoList[imgObject] = res.data //我们构建一个对象
            that.setData(videoList);
          }
          console.log(videoList)
          console.log(that.data.videoList);
          // var data = res.data.info;
          // var userId = wx.getStorageSync('userid');
          // var hiddenchat = false;
          // var phone = false;
          // var phonenumber = false;
          // var hiddenzixun = false;
          // if (data.info.userid != userId) {
          //   hiddenzixun = true;
          // }
          // if ((data.info.userid != userId) && !common.isBlank(data.info.userid)) {
          //   hiddenchat = true;
          // }
          // if (data.info.userid != userId && !common.isBlank(data.info.phone) && !common.isBlank(data.info.userid)) {
          //   phone = true;
          //   phonenumber = data.info.phone;
          // }
          // var video = JSON.parse(data.video);
          // var videopath = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + video.videoid + '/video/' + video.video;
          // that.login(data.userid, data.id)
          // that.setData({
          //   scrollTop: 1,
          //   username: data.username,
          //   logo: data.logo,
          //   distance: data.distance,
          //   video: videopath,
          //   id: data.id,
          //   userid: data.userid,
          //   index: data.index,
          //   title: data.title,
          //   ptitle: data.ptitle,
          //   chatobject: data.info,
          //   hiddenzixun: hiddenzixun,
          //   hiddenchat: hiddenchat,
          //   phone: phone,
          //   phonenumber: phonenumber,
          //   ajaxflag: 1
          // });
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
  initDate: function (options){
    var that = this;
  //  that.setWinh();
   // that.login(options.userid, options.id);
    var index = parseInt(options.index)
    console.log(index);
    that.setData({
      id: options.id,
      userid: options.userid,
      index: options.index,
      title: options.title,
      videoIndex: 0,
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
        if (!userId) {
          userId = app.globalData.userid
        }
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
        res.data.info.video = JSON.parse(res.data.info.video);
        res.data.info.videourl = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/video/' + res.data.info.video.video
        res.data.info.imageurl = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + res.data.info.video.videoid + '/image/' + res.data.info.video.image
        var videoList = {}
        var imgObject = "videoList[" + options.index + "]"
        videoList[imgObject] = res.data //我们构建一个对象
        console.log(videoList)
        //  videoList[options.index] = res.data
        that.setData(videoList);
        console.log(options);
        if (options.index == 1) {
          that.searchVideoDes('up')
        } else {
          that.searchVideoDes('up');
          that.searchVideoDes('down');

        }
        console.log(that.data.videoList);
        // var video = JSON.parse(data.video);
        // var videopath = serverip + '/upload_files/wxuser/' + data.info.wxuserid + '/wall/video' + video.videoid + '/video/' + video.video
        // that.setData({
        //   username: data.username,
        //   logo: data.logo,
        //   distance: data.distance,
        //   image: serverip + data.image,
        //   video: videopath,
        //   chatobject: data.info,
        //   hiddenzixun: hiddenzixun,
        //   hiddenchat: hiddenchat,
        //   ptitle: data.ptitle,
        //   phone: phone,
        //   phonenumber: phonenumber
        // });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  onLoad: function (options) {

    // 滑动
    this.videoChange = throttle(this.touchEndHandler, 200);
    // 绑定updateVideoIndex事件，更新当前播放视频index
    event.on('updateVideoIndex', this, function (index) {
      console.log('event updateVideoIndex:', index)
      setTimeout(() => {
        this.setData({
          animationShow: false,
          playState: true
        }, ()=> {
          // 切换src后，video不能立即播放，settimeout一下
          setTimeout(()=> {
            this.vvideo.play()
          },100)
        })
      }, 600)
    })
    this.initDate(options)
  },
  bindplay() {
    console.log('--- video play ---')
  },
  binderror(err) {
    console.log(err)
  },
  bindtimeupdate(e) {
    let percent = (e.detail.currentTime / e.detail.duration)*100
    this.setData({
      percent: percent.toFixed(2)
    })
  },
  onReady: function () {
    this.vvideo = wx.createVideoContext("kdvideo", this)
    this.animation = wx.createAnimation({
      duration: 500,
      transformOrigin: '0 0 0'
    })
  },
  changePlayStatus() {
    console.log('changePlayStatus')
    let playState = !this.data.playState
    if (playState) {
      this.vvideo.play()
    } else {
      this.vvideo.pause()
    }
    this.setData({
      playState: playState
    })
  },
  touchStart(e) {
    let touchStartingY = this.data.touchStartingY
    console.log('------touchStart------')
    touchStartingY = e.touches[0].clientY
    this.setData({
      touchStartingY: touchStartingY
    })
  },
  touchMove(e) {
    // this.videoChange(e)
  },
  touchEndHandler(e) {
    let touchStartingY = this.data.touchStartingY
    let deltaY = e.changedTouches[0].clientY - touchStartingY
    console.log('deltaY ',deltaY)

    let index = this.data.videoIndex
    if (deltaY > 100 && index !== 0) {
      // 更早地设置 animationShow
      this.setData({
        animationShow: true
      }, () => {
        console.log('-1 切换', index)
        this.createAnimation(-1, index).then((res) => {
          console.log(res)
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index)
          })
        })
      })
    } else if (deltaY < -100 && index !== (this.data.videos.length - 1)) {
      this.setData({
        animationShow: true
      }, () => {
        console.log('+1 切换')
        this.createAnimation(1, index).then((res) => {
          console.log(res)
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index)
          })
        })
      })   
    }
  },
  touchEnd(e) {
    console.log('------touchEnd------')
    this.videoChange(e)
  },
  touchCancel(e) {
    console.log('------touchCancel------')
    console.log(e)
  },
  createAnimation(direction, index) {
    // direction为-1，向上滑动，animationImage1为(index)的poster，animationImage2为(index+1)的poster
    // direction为1，向下滑动，animationImage1为(index-1)的poster，animationImage2为(index)的poster
    let videos = this.data.videos
    let currentTranslateY = this.data.currentTranslateY
    console.log('direction ', direction)
    console.log('index ', index)
    
    // 更新 videoIndex
    index += direction
    currentTranslateY += -direction*windowHeight
    console.log('currentTranslateY: ', currentTranslateY)
    this.animation.translateY(currentTranslateY).step()

    return Promise.resolve({
      index: index,
      currentTranslateY: currentTranslateY
    })
  }
})
function throttle (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}