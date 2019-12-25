var Utils = require('../../utils/util.js')
var common = require("../../utils/common.js");  //调用公用配置项
var app = getApp();
var serverip = app.globalData.serverdomain;
var list = []
Page({
  data: {
    content: '',
    height: 500,
    width: 320,
    imgIndex: 0,
    imageLength: 0,
    firstCon: '',
    dataList: [],
    flag : 0    //防止重复提交
  },
  formSubmit: function (e) {
    var value = e.detail.value;
    var that = this;
    if (that.data.flag == 1){
      return false;
    }
    that.setData({
      flag:1
    })
    var datalist = that.data.dataList;
    var content = [];
    var alert = '';
    if (common.isBlank(value.title)){
      var alert = '标题不能为空！';
    } else if (common.isBlank(that.data.firstCon) && common.isBlank(datalist)) {
      var alert = '内容不能为空！'
    }
    if (!common.isBlank(alert)) {
      wx.showModal({
        title: "提交失败",
        content: alert,
        showCancel: false,
        cancelText: "取消111",
        cancelColor: "#000",
        confirmText: "确定",
        confirmColor: "#0f0",
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return false;
    }
    if (!common.isBlank(that.data.firstCon)) {
      content.push({ type: 'text', value: that.data.firstCon });
    }
    for (var x in datalist) {//x = index
      if (!common.isBlank(datalist[x].pic)){
        content.push({ type: 'image', value: datalist[x].image });
      }
      if (!common.isBlank(datalist[x].value)) {
        content.push({ type: 'text', value: datalist[x].value });
      }
  
    }
    content = JSON.stringify(content);
    var that = this;
    var userId = wx.getStorageSync('userid');
    if (!userId) {
      userId = app.globalData.userid
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      userInfo = app.globalData.userInfo
    }
    var wxApi = require('../../utils/wxApi.js');
    var address = wxApi.getLocationPromisified({
      type: 'wgs84'
    }).then(function (res) {
      if (res.errMsg == 'getLocation:ok'){
        var data = common.get_section(
            function (res) {
              var result = res.result.address_component;
              var city = result.city;
              var district = result.district;
              var data = { 'userId': userId, 'title': value.title, 'content': content, 'fid': 2, 'author': userInfo.nickName, city: city, district:district};
              //发表文章
              Utils.commonAjax('/oms/api.php/wxUploadFile/addArticle', 2, data).then(function (resolve) {
                var data = resolve.data;
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
                          url: './article',
                        })
                      }
                    }
                  })
                  that.setData({
                    flag: 0
                  })
                  return;
                } else {
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
              })
            },
           function (res) {
             wxApi.showModalPromisified({
               'title': '提交失败',
               'content': '无法获取您的位置信息',
               'showCancel': false,
             })
             that.setData({
               flag: 0
             })
           }
           );
        return false;
      }
    })
    return false;
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  onLoad: function (options) {
    let that = this
  },
  onShow: function (e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 输入监听
   */
  inputCon: function (e) {
    let that = this;
    if (0 === e.currentTarget.id - 0) {//第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
    }
  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function (e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function () {
    var that = this;
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 4) {//超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加四张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    } else {//添加图片
    var tempPath = '';
      wx.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        itemColor: '#ef8383',
        success: function (res) {
          var choseType = res.tapIndex == 0 ? "album" : res.tapIndex == 1 ? "camera" : "";
          if (choseType != "") {
            wx.chooseImage({
              sizeType: ['original'],//原图
              sourceType: [choseType],
              count: 1,//每次添加一张
              success: function (res) {        
                const tempFilePaths = res.tempFilePaths; console.log(tempFilePaths);
                var userid = wx.getStorageSync('userid');
                if (!userid) {
                  userid = app.globalData.userid
                }
                  wx.uploadFile({
                    url: serverip + '/oms/api.php/wxUploadFile/articleImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                      'userId': userId
                    },
                    success(res) {
                      const data = JSON.parse(res.data)
                      tempPath = data.address + data.info
                      //do something
                      var info = {
                        pic: tempFilePaths[0],//存储本地地址
                        image: data.roompath + data.info,
                        temp: true,//标记是否是临时图片
                        value: '',//存储图片下方相邻的输入框的内容
                      }
                      that.data.dataList.splice(that.data.imgIndex, 0, info);//方法自行百度
                      that.setData({
                        dataList: that.data.dataList,
                      })
                    }
                  })

              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 删除图片
   */
  deletedImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex === 0) {//点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) {//删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //失败警告
  do_fail: function (a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
})