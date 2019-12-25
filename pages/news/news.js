//index.js
//获取应用实例

var url = "https://hcar.hswcs.com/index.php/Home/Index/indexNews";
Page({
  data: {
    gongsi: "和盛悦和文化传媒有限公司",
    list: [],
    page: 0,
    pagesize: 5,
    more: !0
  },
  // onLoad: function () {
  //    var that = this
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: { "Content-Type": "application/json" },
  //     success: function (res) {
  //       //console.info(that.data.list);
  //       var list = res.data;
        
  //       that.setData({
  //         list: list
  //       });
  //     }
  //   });
  // },
  // listRequest: function () {
  //   var that = this;
  //   wx.request({
  //     url: "https://hcar.hswcs.com/index.php/Home/Index/xgetNews",
  //     method: "POST",
  //     data: {
  //       page: that.data.page += 5,
  //       pagesize: that.data.pagesize
  //     },
  //     header: { "Content-Type": "application/x-www-form-urlencoded" },
  //     success: function (res) {
  //       var lists = res.data;
  //       var usercount = lists.length;
  //       0 == usercount ? (0 != that.data.list.length && wx.showToast({
  //         title: "已经到底了~",
  //         icon: "success",
  //         duration: 2e3
  //       }), that.setData({
  //         more: !1
  //       })) : that.setData({
  //         list: that.data.list.concat(lists)
  //       });
  //     }
  //   });

  // },
  // onReachBottom: function () {
  //   this.data.more && this.listRequest();
  // },
})

