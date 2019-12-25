var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    date: '请选择日期',
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    multiArray: [['奥迪', '大众', '丰田', '奔驰', '宝马', '本田', '日产', '福特', '别克', '众泰', '标致', '宝骏', '比速', '长安', '起亚', '广汽传祺', '哈弗', '吉利', 'JEEP', '马自达', '斯柯达', '三菱', '五菱', '雪佛兰', '现代', '雪铁龙', '一汽', '斯巴鲁', '开瑞'], ['奥迪A3两厢', '奥迪A3三厢', '奥迪A4L', '奥迪A6L', '奥迪Q3', '奥迪Q5', '奥迪Q5L', '奥迪A1']],
    objectMultiArray: [['奥迪', '大众', '丰田', '奔驰', '宝马', '本田', '日产', '福特', '别克', '众泰', '标致', '宝骏', '比速', '长安', '起亚', '广汽传祺', '哈弗', '吉利', 'JEEP', '马自达', '斯柯达', '三菱', '五菱', '雪佛兰', '现代', '雪铁龙', '一汽', '斯巴鲁', '开瑞'], ['奥迪A3两厢', '奥迪A3三厢', '奥迪A4L', '奥迪A6L', '奥迪Q3', '奥迪Q5', '奥迪Q5L', '奥迪A1']],
    multiIndex: [0, 0],
    endYear: 2050
  },
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
  //   if (e.detail.value.username.length == 0 && e.detail.value.phone.length == 0) {
  //     this.setData({
  //       popErrorMsg: "用户名、手机不能为空"
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
  //         popErrorMsg: "手机不能为空"
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
  //   }
  //   return true;
  // },
  // bindMultiPickerChange: function (e) {
  //   //console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     multiIndex: e.detail.value
  //   })
  // }, 
  // bindTimeChange: function (e) {
  //  // console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     time: e.detail.value
  //   })
  // },
  // bindMultiPickerColumnChange: function (e) {
  //  // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   var data = {
  //     multiArray: this.data.multiArray,
  //     multiIndex: this.data.multiIndex
  //   };
  //   data.multiIndex[e.detail.column] = e.detail.value;
  //   switch (e.detail.column) {
  //     case 0:
  //       switch (data.multiIndex[0]) {
  //         case 0:
  //           data.multiArray[1] = ['奥迪A3两厢', '奥迪A3三厢', '奥迪A4L', '奥迪A6L', '奥迪Q3', '奥迪Q5', '奥迪Q5L', '奥迪A1'];
  //           break;
  //         case 1:
  //           data.multiArray[1] = ['桑塔纳', 'Cross Polo', '辉昂', '朗境', '朗行', '朗逸', '凌渡', '帕萨特', '途昂', '途观', '途安L', '宝来', '大众CC', '高尔夫', '捷达', '迈腾', '速腾', '蔚领', '甲壳虫', '途锐', '夏朗'];
  //           break;
  //         case 2:
  //           data.multiArray[1] = ['荣放', '皇冠', '卡罗拉', '兰德酷路泽', '普拉多', '威驰', '奕泽', '汉兰达', '凯美瑞', '雷凌', '埃尔法'];
  //           break;
  //         case 3:
  //           data.multiArray[1] = ['奔驰C级', '奔驰E级', '奔驰GLA级', '奔驰V级', '威霆', '奔驰CLS级', '奔驰R级', '迈巴赫S级'];
  //           break;
  //         case 4:
  //           data.multiArray[1] = ['宝马1系', '宝马3系', '宝马5系', '宝马X1', '宝马X3', '宝马2系', '宝马6系', '宝马X2', '宝马i8'];
  //           break;
  //         case 5:
  //           data.multiArray[1] = ['奥德赛', '飞度', '锋范', '歌诗图', '凌派', '雅阁', '缤智', '艾力绅', '哥瑞', '杰德', '竞瑞', '思铂睿', '思域', '冠道'];
  //           break;
  //         case 6:
  //           data.multiArray[1] = ['蓝鸟', '楼兰', '玛驰', '奇骏', '天籁', '西玛', '轩逸', '逍客', '途达'];
  //           break;
  //         case 7:
  //           data.multiArray[1] = ['福克斯两厢', '福克斯三厢', '福睿斯', '金牛座', '锐界', '翼博', '翼虎', '撼路者', '探险者'];
  //           break;
  //         case 8:
  //           data.multiArray[1] = ['昂科拉', '君威', '君越', '凯越', '威朗', '英朗', '阅朗', '昂科雷'];
  //           break;
  //         case 9:
  //           data.multiArray[1] = ['大迈X7', '芝麻', '众泰E200', '众泰SR7', '众泰SR9', '众泰T300', '众泰T500', '众泰T600', '众泰T700'];
  //           break;
  //         case 10:
  //           data.multiArray[1] = ['标致2008', '标致3008', '标致301', '标致308', '标致4008', '标致5008'];
  //           break;
  //         case 11:
  //           data.multiArray[1] = ['宝骏310', '宝骏360', '宝骏510', '宝骏530', '宝骏560', '宝骏610', '宝骏630', '宝骏730', '宝骏E100'];
  //           break;
  //         case 12:
  //           data.multiArray[1] = ['比速M3', '比速T3', '比速T5'];
  //           break;
  //         case 13:
  //           data.multiArray[1] = ['奔奔EV', '长安CS15', '长安CS35', '长安CS55', '逸动', '凌轩'];
  //           break;
  //         case 14:
  //           data.multiArray[1] = ['福瑞迪', '焕驰', '凯绅', '起亚K3', '起亚K4', '霸锐', '佳乐', '凯尊', '索兰托'];
  //           break;
  //         case 15:
  //           data.multiArray[1] = ['传祺GS4', '传祺GS8', '传祺GS7', '传祺GS3', '传祺GM8', '传祺GA8', '传祺GA6', '传祺GA4'];
  //           break;
  //         case 16:
  //           data.multiArray[1] = ['哈弗H1', '哈弗H2', '哈弗H2S', '哈弗H4', '哈弗H5', '哈弗H6', '哈弗H7', '哈弗H8', '哈弗H9'];
  //           break;
  //         case 17:
  //           data.multiArray[1] = ['博瑞', '博越', '帝豪', '帝豪EV', '帝豪GL', '帝豪GS', '远景'];
  //           break;
  //         case 18:
  //           data.multiArray[1] = ['大指挥官', '指南者', '自由光', '自由侠', '牧马人'];
  //           break;
  //         case 19:
  //           data.multiArray[1] = ['阿特兹', '昂克赛拉', '马自达CX-3', '马自达MX-5'];
  //           break;
  //         case 20:
  //           data.multiArray[1] = ['Yeti', '晶锐', '柯迪亚克', '柯米克', '明锐', '速派', '昕锐'];
  //           break;
  //         case 21:
  //           data.multiArray[1] = ['劲炫ASX', '欧蓝德', '帕杰罗·劲畅', '翼神'];
  //           break;
  //         case 22:
  //           data.multiArray[1] = ['五菱宏光', '五菱宏光S3', '五菱荣光', '五菱荣光V', '五菱之光', '五菱之光小卡'];
  //           break;
  //         case 23:
  //           data.multiArray[1] = ['创酷', '科鲁兹', '科帕奇', '科沃兹', '迈锐宝', '探界者', '乐风RV'];
  //           break;
  //         case 24:
  //           data.multiArray[1] = ['ix25', 'ix35', '朗动', '领动', '名图', '瑞纳', '瑞奕'];
  //           break;
  //         case 25:
  //           data.multiArray[1] = ['C4世嘉', '雪铁龙C3-XR', '雪铁龙C4L', '雪铁龙C6'];
  //           break;
  //         case 26:
  //           data.multiArray[1] = ['骏派A50', '骏派A70', '骏派D60', '夏利N5'];
  //           break;
  //         case 27:
  //           data.multiArray[1] = ['傲虎', '力狮', '森林人', '斯巴鲁XV'];
  //           break;
  //         case 28:
  //           data.multiArray[1] = ['开瑞K50', '开瑞K50EV', '开瑞K50S', '开瑞K60'];
  //           break;
  //       }
  //       data.multiIndex[1] = 0;
  //       break;
  //   }
  //   this.setData(data);
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
  //   var phone = e.detail.value.phone;
  //   var time = e.detail.value.time;
  //   //console.log(time);
  //   if (!that.checkForm(e)) {
  //     return;
  //   }
  //   //util.extend(data.options,{ name: e.detail.value.name,mobile: e.detail.value.number});
  //   wx.request({
  //     url: "https://hcar.hswcs.com/index.php/Home/Index/addyuyue",
  //     method: 'POST',
  //     data: {
  //       username: username,
  //       phone: phone,
  //       typee: '体验试驾',
  //       status: '未处理',
  //       content: content,
  //       time:time
  //     },
      
  //     header: { "Content-Type": "application/x-www-form-urlencoded" },
  //     success: function (res) {
  //       // console.log(res);
  //       var res = res.data;
  //       if (res == 1) {
  //         that.setData(
  //           {
  //             popErrorMsg: "预约成功，稍后会有销售顾问与您联系"
  //           }
  //         );
  //         var fadeOutTimeout = setTimeout(() => {
  //           that.setData({ popErrorMsg: '' });
  //           clearTimeout(fadeOutTimeout);
  //           wx.switchTab({ url: "/pages/index/index" });
  //         }, 3000);
  //         return;
  //       } else {
  //         that.setData(
  //           {
  //             popErrorMsg: "网络错误，请稍后重试"
  //           }
  //         )
  //         that.ohShitfadeOut();
  //         return;
  //       }
  //     }
  //   })
  // }
})
