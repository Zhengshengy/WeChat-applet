// pages/article/article.js
const app = getApp();
var serverip = app.globalData.serverdomain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    serverip: serverip,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次     文章列表加载设置
    callbackcount: 6,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    articleList: {},
    headurl: ''
  },
  //搜索文章列表
  searchArticleList: function (type, userid) {
    var that = this;
    var util = require("../../utils/util.js")  //调用公用配置项
    var userId = userid;
    var data = {
      typename: '热门咨询',
      userId: userId,
      usertype: 2,
      pagenum: that.data.searchPageNum,
      num: that.data.callbackcount//返回数据的个数
    };
    //查询文章列表
    util.commonAjax('/oms/api.php/Article/articleList', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (type) {
        var datas = {};
      } else {
        var datas = that.data.articleList;
      }
      if (data.status == 1) {
        that.setWinh();
        var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
        for (var key in data.info) {
          lenght = lenght + 1;
          datas[lenght] = data.info[key];
        }
        that.setData({
          articleList: datas,
        });
        if (data.flag == 1) {
          that.setData({
            articleList: datas,
            searchLoading: false,   //把"上拉加载"的变量设为false，显示
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            alert: false
          });
        } else {
          that.setData({
            articleList: datas,
            searchLoading: true,   //把"上拉加载"的变量设为false，显示
          });
        }
      } else if (type) {
        that.setData({
          articleList: datas,
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
  getuserinfo: function (userid) {
    console.log(userid);
    var userId = userid;
    var data = { 'userid': userId, 'usertype': 2 };
    if (!userId) {
      return false;
    }
    var util = require("../../utils/util.js")  //调用公用配置项
    var that = this;
    //查询用户信息
    util.commonAjax('/oms/api.php/wxUserInfo/searchUserInfo', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (data.status == 1) {
        that.setData({
          headurl: data.data.avatarurl,
        });
        return;
      } else {
        return;
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.userid == undefined) {
      options.userid = ''
    }
    that.setData({
      userid: options.userid,
    });
    this.searchArticleList(1, options.userid);
    this.getuserinfo(options.userid);
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
    var userid = that.data.userid;
    that.setData({
      show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
      serverip: serverip,
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次     文章列表加载设置
      callbackcount: 6,      //返回数据的个数
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      articleList: {},
      headurl: ''
    });
    that.searchArticleList(1, userid);
    that.getuserinfo(userid);
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
      that.searchArticleList(0, that.data.userid);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})