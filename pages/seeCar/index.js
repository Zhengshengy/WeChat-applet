// pages/index/indexone.js
const app = getApp();
var serverip = app.globalData.serverdomain;
var oss = app.globalData.oss;
var common = require("../../utils/common.js");  //调用公用配置项
var Utils = require('../../utils/util.js')
var title = '';      //用于标志已搜索的汽车品牌

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 6,      //返回数据的个数
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    alert: false,
    hiddesearch:true,
    videoList: [
    ]
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  setWinh: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        let wh = res.windowHeight;
        let scrollH = wh;
        that.setData({
          scrollH: scrollH,
        });
      }
    })
  },
  /**
* 点击品牌并进行搜索视频列表
*/
  searchVideo: function (e) {
    var that = this;
    if (title == that.data.searchKeyword && that.data.searchKeyword != '') {     //当查询的视频与已经展示的视频相同时时进行阻止
      that.setData({
        hiddenName: true
      });
      if (that.data.hiddesearch){
        that.setData({
          hiddesearch: false
        });
      }else{
        that.setData({
          hiddesearch: true
        });
      }
      return;
      return false;
    }else if (that.data.searchKeyword == ''){
      if (that.data.hiddesearch){
        that.setData({
          hiddesearch: false
        });
      }else{
        that.setData({
          hiddesearch: true
        });
      }
      return;
    }
    that.setData({
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次
      callbackcount: 6,      //返回数据的个数
      isFromSearch: true,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      alert: false,
      hiddesearch: true,
      videoList: [
      ]
    });
    that.searchVideoList(1);
  },
  //搜索视频列表
  searchVideoList: function (type) {
    var that = this;
    title = that.data.searchKeyword;
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideoList',
      data: {
        pagenum: that.data.searchPageNum, //把第几次加载次数作为参数
        num: that.data.callbackcount, //返回数据的个数
        title: that.data.searchKeyword, //需要查询的汽车名称
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        var datas = [];
        if (type) {
          var datas = [];
        } else {
           var datas = that.data.videoList;
        }
        var index = datas.length;
        if (data.status == 1) {
          that.setWinh();
          var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
          for (var key in data.info) {  
            datas[lenght] = data.info[key];
            datas[lenght].image = oss + datas[lenght].image;
            index = index + 1;
            datas[lenght].index = index;
            lenght = lenght + 1;
          }
          that.setData({
            videoList:datas
          })
          if (data.flag == 1) {
            that.setData({
              searchLoading: false,   //把"上拉加载"的变量设为false，显示
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              alert: false
            });
          } else {
            that.setData({
              searchLoading: true,   //把"上拉加载"的变量设为false，显示
            });
          }
        } else if (type) {
          that.setData({
            searchLoading: false,   //把"上拉加载"的变量设为false，显示
            searchLoadingComplete: false, //把“没有数据”设为false，显示
            scrollH: "100",
            alert: true
          });
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏
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
  carvideo: function (e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var wxuserid = e.currentTarget.dataset.wxuserid;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var title = that.data.searchKeyword; //需要查询的标题名称
    wx.navigateTo({
      url: '/pages/carVideo/videoTest?id=' + id + '&userid=' + wxuserid + '&wxuserid=' + userid + '&index=' + index + '&title=' + title
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setWinh();
    this.searchVideoList(1);
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
    wx.showNavigationBarLoading()
    var that = this;
    title = '';
    that.setData({
      searchKeyword: '',
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次
      callbackcount: 6,      //返回数据的个数
      isFromSearch: true,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      alert: false,
      hiddesearch: true,
      videoList: [
      ]
    });
    that.searchVideoList(1);
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.searchVideoList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})