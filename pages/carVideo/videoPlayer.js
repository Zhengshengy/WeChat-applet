// pages/carVideo/videoplayer.js
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
    videosrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var video = JSON.parse(options.video);
    var videopath = serverip + '/upload_files/car/brand' + video.brandid + '/car' + video.carid + '/wall' + video.wallid + '/video' + video.videoid+'/video/'+video.video;
    that.setData({
      videosrc: videopath,
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