
Page({
  data: {
    headimg:''
  },
  // chooseImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       that.setData({
  //         headimg: res.tempFilePaths[0]
  //       });
  //     }
  //   })
  // },
  // onLoad: function () {
  //   var that = this;
  //   wx.getStorage({
  //     key: 'userinfo',
  //     success: function (res) {
  //       //console.log(res.data)
  //       var userinfo = res.data
  //       that.setData({
  //         username: userinfo['username'],
  //         sex: userinfo['sex'],
  //         phone: userinfo['phone'],
  //         id: userinfo['id'],
  //         headimg: userinfo['headimg'],
  //         bumen: userinfo['bumen'],
  //         position: userinfo['position'],
  //         password: userinfo['password'],
  //         loginbtn: false
  //       });
  //     },
  //     fail: function () {
  //       that.setData({
  //         loginbtn: true
  //       });
  //     }
  //   })
  // }, 
  // ohShitfadeOut() {
  //   var fadeOutTimeout = setTimeout(() => {
  //     this.setData({ popErrorMsg: '' });
  //     clearTimeout(fadeOutTimeout);
  //   }, 3000);
  // },
  // checkForm: function (e) {
  //   if (e.detail.value.username.length == 0 && e.detail.value.phone.length == 0 && e.detail.value.password.length == 0) {
  //     this.setData({
  //       popErrorMsg: "用户名,手机,密码不能为空"
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
  //   } else if (e.detail.value.phone.length == 0) {
  //     this.setData(
  //       {
  //         popErrorMsg: "电话不能为空"
  //       }
  //     );
  //     this.ohShitfadeOut();
  //     return;
  //   } else if (!(/^1[34578]\d{9}$/.test(e.detail.value.phone))) {
  //     this.setData(
  //       {
  //         popErrorMsg: "手机格式错误"
  //       }
  //     );
  //     this.ohShitfadeOut();
  //     return;
  //   } else if (e.detail.value.password.length == 0) {
  //     this.setData(
  //       {
  //         popErrorMsg: "密码不能为空"
  //       }
  //     );
  //     this.ohShitfadeOut();
  //     return;
  //   } 
  //   return true;
  // },
  //   formSubmit: function (e) {
  //   var that = this;
  //   var username = e.detail.value.username;
  //   var phone = e.detail.value.phone;
  //   var password = e.detail.value.password;
  //   var tempFilePaths = that.data.headimg;
  //   var id = e.detail.value.id;
  //   if (!that.checkForm(e)) {
  //     return;
  //   }
  //   wx.showLoading({ title: '图片上传中' });
  //   //console.log(tempFilePaths)
  //   wx.uploadFile({
  //     url: 'https://hcar.hswcs.com/index.php/Home/Index/setusers',
  //     method: 'POST',
  //     filePath: tempFilePaths,
  //     name: 'photo',
  //     header: { "Content-Type": "application/x-www-form-urlencoded" },
  //     formData: {
  //       'username': username,
  //       'phone': phone,
  //       'password':password,
  //       'id':id
  //     },
  //     success: function (res) {
  //       var result = res.data;
  //      // console.log(result)
  //      // console.log(id)
  //       if (result ==1) {
  //         that.setData(
  //           {
  //             popErrorMsg: "资料更改成功"
  //           }
  //         );
  //         wx.request({
  //           url: "https://hcar.hswcs.com/index.php/Home/Index/userslogin",
  //           method: 'POST',
  //           data: {
  //             id:id,
  //           },
  //           header: { "Content-Type": "application/x-www-form-urlencoded" },
  //           success: function (res) {
  //             var res = res.data;
  //             //console.log(res);
  //             if (res['id'] == id) {
  //               wx.setStorage({
  //                 key: "userinfo",
  //                 data: res
  //               })
  //               var fadeOutTimeout = setTimeout(() => {
  //                 that.setData({ popErrorMsg: '' });
  //                 clearTimeout(fadeOutTimeout);
  //                 wx.switchTab({
  //                   url: "/pages/myde/myde", success: function (e) {
  //                     var page = getCurrentPages().pop();
  //                     if (page == undefined || page == null) return;
  //                     page.onLoad();
  //                   }
  //                 });
  //               }, 1500);
  //               return;
  //             }
  //           }
  //         })
  //       }
  //       wx.hideLoading();
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
    
    
  // }
  
})
