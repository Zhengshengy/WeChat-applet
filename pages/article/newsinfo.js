const app = getApp();
var serverip = app.globalData.serverdomain;
Page({
    data: {
        // text:"这是一个页面"
        data: [],
        articleInfo: null,
        content:'',
        winHeight: 0,   // 设备高度
        title:'',
        // 弹窗
        modalHidden: true,
        modalValue: null,
        gongsi:"和盛悦和文化传媒有限公司",

        /**
         * 分享配置
         */
        shareShow: 'none',
        shareOpacity: {},
        shareBottom: {},

    },
    onLoad: function( options ) {
        // 页面初始化 options 为页面跳转所带来的参数
        var that = this
        var id = options.id;
        var title = options.title;
        that.setData({
          title: title,
        });
        var data = {aid:options.id};
        var that = this;
        var util = require("../../utils/util.js")  //调用公用配置项
        //查询文章列表
        util.commonAjax('/oms/api.php/Article/articleInfo', 2, data).then(function (resolve) {
          var data = resolve.data;
          if (data.status == 1) {
            //将富文本转化为小程序可读文件
            var WxParse = require('../../wxParse/wxParse.js');
            WxParse.wxParse('content', 'html', data.info.content, that, 5);
            that.setData({
              articleInfo: data.info,
            });
          }else {
          }
        })
        }
})