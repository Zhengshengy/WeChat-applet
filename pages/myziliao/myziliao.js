var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    sex: '',
    phone: '',
    headimg: '',
    bumen: '',
    position: '',
    password: '',
    loginbtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  respassword: function () {
    wx.navigateTo({ url: "/pages/setpassword/index" })
  },
  clearlogin: function () {
    var that = this;
    wx.switchTab({ url: "/pages/myde/myde" });
    wx.removeStorage({
      key: 'userInfo',
      success: function (res) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
        that.setData({
          loginbtn: true
        });
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