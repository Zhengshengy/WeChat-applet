var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    showadd: true,
    dateTimeArray1: null,
    dateTime1: null,
    files: [],
    photoss: [],
    startYear: 2000,
    endYear: 2050
  },
  // chooseImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 3,
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       that.setData({
  //         files: that.data.files.concat(res.tempFilePaths)
  //       });
  //       var fie=that.data.files.length;
  //       if (fie==3){
  //         that.setData({
  //           showadd: false
  //         });
  //       }
  //     }
  //   })
  // },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  // onLoad: function () {
  //   // 获取完整的年月日 时分秒，以及默认显示的数组
  //   var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
  //   var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
  //   // 精确到分的处理，将数组的秒去掉
  //   var lastArray = obj1.dateTimeArray.pop();
  //   var lastTime = obj1.dateTime.pop();
  //   this.setData({
  //     dateTime: obj.dateTime,
  //     dateTimeArray: obj.dateTimeArray,
  //     dateTimeArray1: obj1.dateTimeArray,
  //     dateTime1: obj1.dateTime
  //   });
  // }, 
  // ohShitfadeOut() {
  //   var fadeOutTimeout = setTimeout(() => {
  //     this.setData({ popErrorMsg: '' });
  //     clearTimeout(fadeOutTimeout);
  //   }, 3000);
  // },
  // checkForm: function (e) {
  //   if (e.detail.value.username.length == 0 && e.detail.value.content.length == 0) {
  //     this.setData({
  //       popErrorMsg: "用户名、图片描述不能为空"
  //     });
  //     this.ohShitfadeOut();
  //     return;
  //   } else if (e.detail.value.username.length == 0) {
  //     this.setData(
  //       {
  //         popErrorMsg: "用户名不能为空"
  //       }
  //     );
  //     this.ohShitfadeOut();
  //     return;
  //   } else if (e.detail.value.content.length == 0) {
  //     this.setData(
  //       {
  //         popErrorMsg: "图片描述不能为空"
  //       }
  //     );
  //     this.ohShitfadeOut();
  //     return;
  //   } 
  //   return true;
  // },
  // changeDateTime1(e) {
  //   this.setData({ dateTime1: e.detail.value });
  // },
  // changeDateTimeColumn1(e) {
  //   var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
  //   arr[e.detail.column] = e.detail.value;
  //   dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  //   this.setData({
  //     dateTimeArray1: dateArr
  //   });
  // },
  //   formSubmit: function (e) {
  //   var that = this;
  //   var username = e.detail.value.username;
  //   var content = e.detail.value.content;
  //   var time = e.detail.value.time;
  //   var tempFilePaths = that.data.files;
  //   //console.log(time);
  //   if (!that.checkForm(e)) {
  //     return;
  //   }
  //   wx.showLoading({ title: '图片上传中' });
  //   for (var j in tempFilePaths) {
  //   wx.uploadFile({
  //     url: 'https://hcar.hswcs.com/index.php/Home/Index/addphotos',
  //     method: 'POST',
  //     filePath: tempFilePaths[j],
  //     name: 'photos',
  //     header: { "Content-Type": "application/x-www-form-urlencoded" },
  //     formData: {
  //       'author': username,
  //       'title': content,
  //       'time':time
  //     },
  //     success: function (res) {
  //       var result = res.data;
  //       //console.log(result);
  //       that.setData(
  //         {
  //           photoss: that.data.photoss.concat(result)
  //         }
  //       );
  //       //console.log(that.data.photoss);
  //       wx.hideLoading();
  //       if (that.data.photoss.length == tempFilePaths.length) {
  //         wx.request({
  //           url: "https://hcar.hswcs.com/index.php/Home/Index/addphotoss",
  //           method: "POST",
  //           data: {
  //             author: username,
  //             title: content,
  //             time: time,
  //             arr: that.data.photoss,
  //           },
  //           header: { "Content-Type": "application/x-www-form-urlencoded" },
  //           success: function (res) {
  //             var lists = res.data;
  //            // console.log(lists);
  //             if (lists==1){
  //               that.setData(
  //                 {
  //                   popErrorMsg: "财源滚滚，上传成功"
  //                 }
  //               );
  //             }
  //           }
  //         });
  //        // console.log(that.data.photoss);
  //         var fadeOutTimeout = setTimeout(() => {
  //           that.setData({ popErrorMsg: '' });
  //           clearTimeout(fadeOutTimeout);
  //           wx.switchTab({ url: "/pages/index/index" });
  //         }, 3000);
  //       } else if (result == 2) {
  //         that.setData(
  //           {
  //             popErrorMsg: "上传失败"
  //           }
  //         );
  //         that.ohShitfadeOut();
  //       } else if (result == 3) {
  //         that.setData(
  //           {
  //             popErrorMsg: "上传错误联系管理员"
  //           }
  //         );
  //         that.ohShitfadeOut();
  //       }

  //     },
  //     fail: function (res) {
  //       wx.hideLoading();
  //       that.setData(
  //         {
  //           popErrorMsg: "网络错误"
  //         }
  //       );
  //       that.ohShitfadeOut();
  //     }
  //   })
  //   }
    
  // }
  
})
