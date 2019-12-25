import xapi from "../../utils/xapi";
import util from "../../utils/util";
var url = "https://hcar.hswcs.com/index.php/Home/Index/addyuyue";
// pages/问促销价/index.js
Page({
  formSubmit: function(e) {
    var that = this;
    var username = e.detail.value.name;
    var phone = e.detail.value.number;
    var content = e.detail.value.content;
    //console.log(phone);
    if(!that.checkForm(e)){
      return;
    }
    //util.extend(data.options,{ name: e.detail.value.name,mobile: e.detail.value.number});
    wx.request({
      url: "https://hcar.hswcs.com/index.php/Home/Index/addyuyue",
      method: 'POST',
      data: {
        username: username,
        phone: phone,
        typee:'询促销价',
        status: '未处理',
        content:content,
        time:' '
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
       // console.log(res);
        var res = res.data;
        if (res==1){
          that.setData(
            {
              popErrorMsg: "获取成功，稍后会有销售顾问与您联系"
              } 
          );
          var fadeOutTimeout = setTimeout(() => {
            that.setData({ popErrorMsg: '' });
            clearTimeout(fadeOutTimeout);
            wx.switchTab({ url: "/pages/index/index" });
          }, 3000);
          return;
        }else{
          that.setData(
            {
              popErrorMsg: "网络错误，请稍后重试" }
          )
          that.ohShitfadeOut();
          return;
        }
      }
      })
  },
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },

  onLoad:function(options){   
    var data = options;
    var that = this
        that.setData({
          title: data.title,
          Price: data.Price,
          imageUrl: data.imageUrl
        });
  },
  checkForm: function (e) {
    if(e.detail.value.name.length == 0 && e.detail.value.number.length == 0) {
      this.setData({ 
        popErrorMsg: "用户名、手机不能为空"
         });
      this.ohShitfadeOut();
      return;
    } else if (e.detail.value.name.length == 0) {
      this.setData(
        {
          popErrorMsg: "用户名不能为空" }
      );
      this.ohShitfadeOut();
      return;
    } else if (e.detail.value.number.length == 0) {
      this.setData(
        {
          popErrorMsg: "手机不能为空" }
      );
      this.ohShitfadeOut();
      return;
    } else if (!(/^1[34578]\d{9}$/.test(e.detail.value.number))) {
  this.setData(
    {
      popErrorMsg: "手机格式错误" }
  );
  this.ohShitfadeOut();
  return;
}
return true;
}
})
