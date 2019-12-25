function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//函数节流
function throttle(method,delay,duration){
    var timer=null, begin=new Date();
        
    return function(){
        var context=this, args=arguments, current=new Date();
        clearTimeout(timer);
        
        if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}
/**
 * request请求封装
 * url   传递方法名
 * types 传递方式(1,GET,2,POST)
 * data  传递数据对象
 */
function commonAjax(url, types, data) {
  // 获取公共配置
  var app = getApp();
  var datas = data;
  var serverip = app.globalData.serverdomain;
  // 这是es6的promise版本库大概在1.1.0开始支持的，大家可以去历史细节点去看一下，一些es6的机制已经可以使用了
  var promise = new Promise(function (resolve, reject, defaults) {
    // 封装reuqest
    wx.request({     
      url: serverip + url,
      data: datas,
      method: (types === 1) ? 'GET' : 'POST',
      header: (types === 1) ? { 'content-type':'application/json' } : {'content-type':'application/x-www-form-urlencoded'},
        success: resolve,
        fail: reject,
        complete: defaults,
      })
  });
  return promise;
}
function getdata(key) {
  var data = null //wx.getStorageSync(key);
  if (!data || data == 'undefined') {
    var app = getApp();
    var data = app.globalData+'\.' + key;
  }
  return data;
}
module.exports = {
  formatTime: formatTime,
  throttle:throttle,
  commonAjax: commonAjax,
  getdata: getdata
}
