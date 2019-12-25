// let col1H = 0;
// let col2H = 0;
// const app = getApp();
// var serverip = app.globalData.serverdomain;
// var oss = app.globalData.oss;
// var common = require("../../utils/common.js");  //调用公用配置项
// var title = '';      //用于标志已搜索的汽车品牌
// Page({

//   data: {
//     scrollH: 0,
//     imgWidth: 0,
//     loadingCount: 0,
//     images: [],
//     col1: [],
//     col2: [],
//     isFromSearch: true,
//     searchKeyword: '',
//     searchPageNum: 1,   // 设置加载的第几次，默认是第一次
//     callbackcount: 10,      //返回数据的个数
//     hiddenName: true,
//     index: 0,
//     merchantid: 0,
//     videoList: {},
//     serverip: serverip,
//     videosrc: '',
//     play: true,
//     touchstyle: '',
//     winH: 0,
//     searchLoading: false, //"上拉加载"的变量，默认false，隐藏
//     searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
//     alert: false,
//   },
//   //搜索视频列表
//   searchVideoList: function (type, userid) {
//     var that = this;
//     var title = that.data.searchKeyword;
//     var userId = userid;
//     wx.request({
//       method: 'POST',
//       url: serverip + '/oms/api.php/wxVideo/userVideoList',
//       data: {
//         pagenum: that.data.searchPageNum, //把第几次加载次数作为参数
//         num: that.data.callbackcount, //返回数据的个数
//         title: that.data.searchKeyword, //需要查询的汽车名称
//         userId: userId,
//         usertype: 2
//       },
//       header: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       success: function (res) {
//         var data = res.data;
//         var datas = {};
//         // if (type) {
//         //   var datas = {};
//         // } else {
//         //   var datas = that.data.videoList;
//         // }
//         if (data.status == 1) {
//           that.setWinh();
//           var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
//           for (var key in data.info) {
//             lenght = lenght + 1;
//             datas[lenght] = data.info[key];
//           }
//           if (type == 1) {
//             wx.getSystemInfo({
//               success: (res) => {
//                 let ww = res.windowWidth;
//                 let wh = res.windowHeight;
//                 let imgWidth = ww * 0.48;
//                 let scrollH = wh;

//                 that.setData({
//                   scrollH: scrollH,
//                   imgWidth: imgWidth
//                 });
//                 that.loadImages(datas);
//               }
//             })
//           } else {
//             that.loadImages(datas);
//           }
//           if (data.flag == 1) {
//             that.setData({
//               searchLoading: false,   //把"上拉加载"的变量设为false，显示
//               searchLoadingComplete: true, //把“没有数据”设为true，显示
//               alert: false
//             });
//           } else {
//             that.setData({
//               searchLoading: true,   //把"上拉加载"的变量设为false，显示
//             });
//           }
//         } else if (type) {
//           that.setData({
//             searchLoading: false,   //把"上拉加载"的变量设为false，显示
//             searchLoadingComplete: false, //把“没有数据”设为false，显示
//             winH: "100",
//             alert: true
//           });
//         } else {
//           that.setData({
//             searchLoadingComplete: true, //把“没有数据”设为true，显示
//             searchLoading: false  //把"上拉加载"的变量设为false，隐藏
//           });
//         }
//       },
//       fail: function (res) {
//         // fail
//       },
//       complete: function (res) {
//         // complete
//       }
//     })
//   },
//   //输入框事件，每输入一个字符，就会触发一次
//   bindKeywordInput: function (e) {
//     this.setData({
//       searchKeyword: e.detail.value
//     })
//   },
//   //滚动到底部触发事件
//   searchScrollLower: function () {
//     let that = this;
//     if (that.data.searchLoading && !that.data.searchLoadingComplete) {
//       that.setData({
//         searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
//         isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
//       });
//       that.searchVideoList(0, that.data.userid);
//     }
//   },
//   /**
//  * 生命周期函数--监听页面加载
//  */
//   setWinh: function () {
//     var that = this;
//     wx.getSystemInfo({
//       success: (res) => { // 用这种方法调用，this指向Page
//         this.setData({
//           winH: res.windowHeight
//         });
//       }
//     });
//   },
//   carvideo: function (e) {
//     var id = e.currentTarget.dataset.id;
//     var userid = e.currentTarget.dataset.userid;
//     var wxuserid = e.currentTarget.dataset.wxuserid;
//     var index = e.currentTarget.dataset.index;
//     var that = this;
//     var title = that.data.searchKeyword; //需要查询的标题名称
//     wx.navigateTo({
//       url: '/pages/outherVideo/video?id=' + id + '&userid=' + wxuserid + '&wxuserid=' + userid + '&index=' + index + '&title=' + title
//     });
//   },
//   addvideo: function () {
//     this.getAddress();
//     return false;
//   },
//   //查看用户是否进行了地理位置授权
//   getAddress: function () {
//     var that = this;
//     var url = '/pages/video/dovideo'
//     app.getPermission(that, url);    //传入that值可以在app.js页面直接设置内容    
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function (options) {
//   },
//   onLoad: function (options) {
//     var that = this;
//     that.setData({
//       userid: options.userid,
//     });
//     that.searchVideoList(1, options.userid);
//   },
//   onImageLoad: function (e) {
//     let imageId = e.currentTarget.dataset.index;
//     let oImgW = e.detail.width;         //图片原始宽度
//     let oImgH = e.detail.height;        //图片原始高度
//     let imgWidth = this.data.imgWidth;  //图片设置的宽度
//     let scale = imgWidth / oImgW;        //比例计算
//     let imgHeight = oImgH * scale;      //自适应高度

//     let images = this.data.images;
//     let imageObj = null;

//     for (let i = 0; i < images.length; i++) {
//       let img = images[i];
//       if (img.id == imageId) {
//         imageObj = img;
//         break;
//       }
//     }

//     imageObj.height = imgHeight;

//     let loadingCount = this.data.loadingCount - 1;
//     let col1 = this.data.col1;
//     let col2 = this.data.col2;

//     if (col1H <= col2H) {
//       col1H += imgHeight;
//       col1.push(imageObj);
//     } else {
//       col2H += imgHeight;
//       col2.push(imageObj);
//     }

//     let data = {
//       loadingCount: loadingCount,
//       col1: col1,
//       col2: col2
//     };

//     // if (!loadingCount) {
//     //   data.images = [];
//     // }

//     this.setData(data);
//   },
//   onImageLoadError: function (e) {
//     var errorImgIndex = e.target.dataset.index; //获取循环的下标
//     let images = this.data.images;
//     var length = images.length
//     let imageObj = null;
//     var errorImg = {}
//     for (let i = 0; i < length; i++) {
//       let img = images[i];
//       if (img.id == errorImgIndex) {
//         var imgObject = "images[" + i + "].pic"
//         errorImg[imgObject] = "../menu/default.jpg" //我们构建一个对象
//         break;
//       }
//     }
//     // var imgObject = "images[" + errorImgIndex + "].pic" //carlistData为数据源，对象数组
//     // var errorImg = {}
//     // errorImg[imgObject] = "../menu/default.jpg" //我们构建一个对象
//     this.setData(errorImg) //修改数据源对应的数据
//   },
//   loadImages: function (datas) {
//     var that = this;
//     var images = that.data.images;
//     var vediolength = images.length;
//     var index = vediolength;
//     var indexx = vediolength-1;
//     if (!common.isBlank(datas)) {
//       var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
//       for (var key in datas) {
//         var info = datas[key];
//         index = index + 1;
//         indexx = indexx + 1;
//         images[indexx] = { dataid: info.id, pic: oss + info.image, height: 0, title: info.title, username: info.nickname, praisenum: info.praisenum, userid: info.userid, wxuserid: info.session3rd, status: info.status, index: index, id: index}
//       }
//     }
//     // let baseId = "img-" + (+new Date());
//     // for (let i = 0; i < images.length; i++) {
//     //   images[i].id = baseId + "-" + i;
//     // }
//     this.setData({
//       loadingCount: images.length,
//       images: images
//     });
//   }
// })


// pages/index/indexone.js
const app = getApp();
var serverip = app.globalData.serverdomain;
var oss = app.globalData.oss;
var common = require("../../utils/common.js");  //调用公用配置项
var Utils = require('../../utils/util.js')
var title = '';      //用于标志已搜索的汽车品牌

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 6,      //返回数据的个数
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    alert: false,
    hiddesearch: true,
    videoList: [
    ]
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  setWinh: function () {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        let wh = res.windowHeight;
        let scrollH = wh;
        that.setData({
          scrollH: scrollH,
        });
      }
    })
  },
  /**
* 点击品牌并进行搜索视频列表
*/
  searchVideo: function (e) {
    var that = this;
    if (title == that.data.searchKeyword && that.data.searchKeyword != '') {     //当查询的视频与已经展示的视频相同时时进行阻止
      that.setData({
        hiddenName: true
      });
      if (that.data.hiddesearch) {
        that.setData({
          hiddesearch: false
        });
      } else {
        that.setData({
          hiddesearch: true
        });
      }
      return;
      return false;
    } else if (that.data.searchKeyword == '') {
      if (that.data.hiddesearch) {
        that.setData({
          hiddesearch: false
        });
      } else {
        that.setData({
          hiddesearch: true
        });
      }
      return;
    }
    that.setData({
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次
      callbackcount: 6,      //返回数据的个数
      isFromSearch: true,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      alert: false,
      hiddesearch: true,
      videoList: [
      ]
    });
    that.searchVideoList(1);
  },
  //搜索视频列表
  searchVideoList: function (type, userid) {
    var that = this;
    var title = that.data.searchKeyword;
    var userId = userid;
    wx.request({
      method: 'POST',
      url: serverip + '/oms/api.php/wxVideo/userVideoList',
      data: {
        pagenum: that.data.searchPageNum, //把第几次加载次数作为参数
        num: that.data.callbackcount, //返回数据的个数
        title: that.data.searchKeyword, //需要查询的汽车名称
        userId: userId,
        usertype: 2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        var datas = [];
        if (type) {
          var datas = [];
        } else {
          var datas = that.data.videoList;
        }
        var index = datas.length;
        if (data.status == 1) {
          that.setWinh();
          var lenght = Object.keys(datas).length ? Object.keys(datas).length : 0;
          for (var key in data.info) {
            datas[lenght] = data.info[key];
            datas[lenght].image = oss + datas[lenght].image;
            index = index + 1;
            datas[lenght].index = index;
            lenght = lenght + 1;
          }
          that.setData({
            videoList: datas
          })
          if (data.flag == 1) {
            that.setData({
              searchLoading: false,   //把"上拉加载"的变量设为false，显示
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              alert: false
            });
          } else {
            that.setData({
              searchLoading: true,   //把"上拉加载"的变量设为false，显示
            });
          }
        } else if (type) {
          that.setData({
            searchLoading: false,   //把"上拉加载"的变量设为false，显示
            searchLoadingComplete: false, //把“没有数据”设为false，显示
            scrollH: "100",
            alert: true
          });
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏
          });
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  carvideo: function (e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var wxuserid = e.currentTarget.dataset.wxuserid;
    var index = e.currentTarget.dataset.index;
    var that = this;
    var title = that.data.searchKeyword; //需要查询的标题名称
    wx.navigateTo({
      url: '/pages/carVideo/videoTest?id=' + id + '&userid=' + wxuserid + '&wxuserid=' + userid + '&index=' + index + '&usertype=2&title=' + title
    });
  },
  addvideo: function () {
    this.getAddress();
    return false;
  },
  //查看用户是否进行了地理位置授权
  getAddress: function () {
    var that = this;
    var url = '/pages/video/dovideo'
    app.getPermission(that, url);    //传入that值可以在app.js页面直接设置内容    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userid: options.userid,
    });
    that.searchVideoList(1, options.userid);
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
    that.setData({
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次
      callbackcount: 6,      //返回数据的个数
      isFromSearch: true,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      alert: false,
      hiddesearch: true,
      videoList: [
      ]
    })
    that.searchVideoList(1, that.data.userid);
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
      that.searchVideoList(0, that.data.userid);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})