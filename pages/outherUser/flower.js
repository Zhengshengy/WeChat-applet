// pages/article/article.js
const app = getApp();
var serverip = app.globalData.serverdomain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    serverip: serverip,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次     文章列表加载设置
    callbackcount: 10,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    flowerList: {},
    headurl: ''
  },
  //搜索文章列表
  searchArticleList: function (type,userid) {
    var that = this;
    var util = require("../../utils/util.js")  //调用公用配置项
    var userId = userid;
    var data = {
      userid: userId,
      pagenum: that.data.searchPageNum,
      num: that.data.callbackcount//返回数据的个数
    };
    //查询文章列表
    util.commonAjax('/oms/api.php/wxUserInfo/getFlowerInfo', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (type) {
        var datas = {};
      } else {
        var datas = that.data.flowerList;
      }
      if (data.status == 1) {
        that.setWinh();
        var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
        for (var key in data.info) {
          lenght = lenght + 1;
          datas[lenght] = data.info[key];
        }
        that.setData({
          flowerList: datas,
        });
        if (data.flag == 1) {
          that.setData({
            flowerList: datas,
            searchLoading: false,   //把"上拉加载"的变量设为false，显示
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            alert: false
          });
        } else {
          that.setData({
            flowerList: datas,
            searchLoading: true,   //把"上拉加载"的变量设为false，显示
          });
        }
      } else if (type) {
        that.setData({
          flowerList: datas,
          searchLoading: false,   //把"上拉加载"的变量设为false，显示
          searchLoadingComplete: false, //把“没有数据”设为false，显示
          winH: "100",
          alert: true
        });
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏
        });
      }
    })
  },
  userinfo: function (e) {
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '/pages/user/user?userid=' + userid
    });
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.searchArticleList(0, that.data.userid);
    }
  },
  /**
* 生命周期函数--监听页面加载
*/
  setWinh: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: res.windowHeight
        });
      }
    });
  },
  addarticle: function () {
    this.getAddress();
    return false;
  },
  //查看用户是否进行了地理位置授权
  getAddress: function () {
    var that = this;
    var url = '/pages/article/doarticle'
    app.getPermission(that, url);    //传入that值可以在app.js页面直接设置内容    
    //  console.log(status);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = options.userid;
    this.searchArticleList(1, userId);
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