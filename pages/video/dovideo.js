//uploadview.js
const app = getApp();
var Utils = require('../../utils/util.js')
var common = require("../../utils/common.js");  //调用公用配置项
var serverip = app.globalData.serverdomain;
Page({
  data: {
    condition: true, //视频的显示判断
    icosrc: "../../image/plus.png",
    mode: 'scaleToFill',
    uploadText: "添加视频",
    videoSrc: "", //视频地址
    describe: "", //描述信息
    btnloading: false, //loading 图标 
    btntext: "上传视频",
    againBtn: false,
    flag: 0    //防止重复提交
  },

  //事件处理函数
  // 描述信息
  describeInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  uploadfile: function () { //选择视频或者拍摄视频
    var _this = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res);
        //判断视频大小---小于10M
        if (res.duration > 10240) {
          wx.showToast({
            title: '请上传小于10M的视频',
            duration: 2000
          })
        } else {
          _this.setData({
            videoSrc: res.tempFilePath,
            condition: false,
            againBtn: true,

          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })

  },
  //重新选择视频
  againUploadBtn: function () {
    this.setData({
      videoSrc: "",
      condition: true,
      againBtn: false,
    })
  },

  //上传
  uploadBtn: function () {
    var that = this;
    if (that.data.flag == 1) {
      return false;
    }
    that.setData({
      flag: 1
    })
    var wxApi = require('../../utils/wxApi.js');
    var address = wxApi.getLocationPromisified({
      type: 'wgs84'
    }).then(function (res) {
      if (res.errMsg == 'getLocation:ok') {
        var data = common.get_section(
          function (res) {
            var result = res.result.address_component;
            var userId = wx.getStorageSync('userid');
            var city = result.city;
            var district = result.district;
            if (that.data.describe == "") {
              wxApi.showModalPromisified({
                'title': '上传失败',
                'content': '请为视频添加描述',
                'showCancel': false,
              })
              return false;
            } else if (that.data.videoSrc == "") {
              wxApi.showModalPromisified({
                'title': '上传失败',
                'content': '请上传视频',
                'showCancel': false,
              })
              return false;
            } else {
              const uploadTask = wx.uploadFile({
                url: serverip + '/oms/api.php/wxUploadFile/addVideoInfo',
                filePath: that.data.videoSrc,
                name: 'file',
                formData: {
                  'userId': userId,
                  'title': that.data.describe,
                  'city': city,
                  'district': district
                },
                success: function (res) { //上传成功
                  var data = JSON.parse(res.data);
                  if (data.status == '1111') {
                    wx.showModal({
                      title: '提示',
                      content: data.info,
                      confirmText: "确定",
                      confirmColor: "#ef8383",
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            url: './videolist',
                          })
                        }
                      }
                    })
                  that.setData({
                    flag: 0
                  })
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: data.info,
                      confirmText: "确定",
                      confirmColor: "#ef8383",
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {

                        } else if (res.cancel) {
                        }
                      }
                    })
                    that.setData({
                      flag: 0
                    })
                  }
                  //do something
                },
                fail: function (res) { //上传失败
                  var data = res.data
                  wxApi.showModalPromisified({
                    'title': '提示',
                    'content': '上传失败，请稍后重试！',
                    'showCancel': false,
                  })
                  that.setData({
                    flag: 0
                  })
                }
              });

              downloadTask.onProgressUpdate((res) => {
                console.log('下载进度', res.progress);
                console.log('已经下载的数据长度', res.totalBytesWritten);
                console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
              });
            }
          },
          function (res) {
            wxApi.showModalPromisified({
              'title': '上传失败',
              'content': '无法获取您的位置信息',
              'showCancel': false,
            })
            return false;
          })
          }
      })


  }

})