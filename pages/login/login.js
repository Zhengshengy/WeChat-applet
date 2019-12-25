var app = getApp();
Page({
  data: {
    phone: '',
    password: '',
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
  // 登录
  login: function () {
    var that = this;
    if (that.data.phone.length == 0 && that.data.password.length == 0) {
      this.setData({
        popErrorMsg: "用户名、密码不能为空"
      });
      this.ohShitfadeOut();
      return;
    } else if (that.data.phone.length == 0) {
      this.setData(
        {
          popErrorMsg: "用户名不能为空"
        }
      );
      this.ohShitfadeOut();
      return;
    } else if (!(/^1[34578]\d{9}$/.test(that.data.phone))) {
      this.setData(
        {
          popErrorMsg: "用户名格式错误"
        }
      );
      this.ohShitfadeOut();
      return;
    } else if (that.data.password.length == 0) {
      this.setData(
        {
          popErrorMsg: "密码不能为空"
        }
      );
      this.ohShitfadeOut();
      return;
    }
    var that = this;
    var util = require("../../utils/util.js");  //调用公用配置项
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    var data = {'userId': userId, password: that.data.password,phone: that.data.phone};
    //查询文章列表
    util.commonAjax('/oms/api.php/wxLogin/userlogin', 2, data).then(function (resolve) {
      var data = resolve.data;
      if (data.status == 1) {
          that.setData(
            {
              popErrorMsg: "登陆成功"
            }
          );
          wx.setStorage({
            key: 'webuserid',
            data: data.id,
            success: () => {
              that.setData({ popErrorMsg: '' });
              wx.switchTab({
                url: "/pages/myde/myde", success: function (e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                },
              })
            }
          })
          //app.globalData.loginusers = res;
          //console.log(app.globalData.loginusers);
          // var fadeOutTimeout = setTimeout(() => {
          //   that.setData({ popErrorMsg: '' });
          //   clearTimeout(fadeOutTimeout);
          //   wx.switchTab({
          //     url: "/pages/myde/myde", success: function (e) {
          //       var page = getCurrentPages().pop();
          //       if (page == undefined || page == null) return;
          //       page.onLoad();
          //     }
          //   });
          // }, 1500);
          return;
      } else {
        that.setData(
          {
            popErrorMsg: data.info
          }
        );
        that.ohShitfadeOut();
        return;
      }
    })
  }
})