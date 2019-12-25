// pages/list/list.js
import * as chatInput from "../../modules/chat-input/chat-input";
import IMOperator from "./im-operator";
import UI from "./ui";
import MsgManager from "./msg-manager";
var flagTime = 0;
const app = getApp();
/**
 * 聊天页面
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textMessage: '',
        chatItems: [],
        latestPlayVoicePath: '',
        isAndroid: true,
        chatStatue: 'open',
        status:0,  //监听用户是否已经读了消息
        friendId: '' ,
        ajaxflag: 1,      //防止多次下滑事件触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app.iniIMDelegate();
        const friend = JSON.parse(options.friend);
     //   console.log(friend);
        this.initData();
        wx.setNavigationBarTitle({
            title: friend.friendName || ''
        });
        friend.index = 1; 
        this.imOperator = new IMOperator(this, friend);
        this.UI = new UI(this);
        this.msgManager = new MsgManager(this);
        this.imOperator.onSimulateReceiveMsg((msg) => {
           // console.log(msg);
            this.msgManager.showMsg({msg})
        });
        //将用户消息设置为已读
      var userId = wx.getStorageSync('userid');
      if (!userId) {
        userId = app.globalData.userid
      }
        this.data.status = 1;
        this.setData({
          friendId: friend.friendId
        });
       
       // var datas = {friendId: friend.friendId,userId: userId,type:'updatastatus'}
       // this.sendUpdataMsgStatus({content:datas});
        this.UI.updateChatStatus('正在聊天中...');
    },
    initData() {
        let that = this;
        let systemInfo = wx.getSystemInfoSync();
        chatInput.init(this, {
            systemInfo: systemInfo,
            minVoiceTime: 1,
            maxVoiceTime: 60,
            startTimeDown: 56,
            format: 'mp3',//aac/mp3
            sendButtonBgColor: 'mediumseagreen',
            sendButtonTextColor: 'white',
            extraArr: [{
                picName: 'choose_picture',
                description: '照片'
            }],
            // tabbarHeigth: 48
        });

        that.setData({
          pageHeight: systemInfo.windowHeight,
            isAndroid: systemInfo.system.indexOf("Android") !== -1,
        });
        wx.setNavigationBarTitle({
            title: '好友'
        });
        that.textButton();
        that.extraButton();
        that.voiceButton();
    },
    textButton() {
        chatInput.setTextMessageListener((e) => {
            let content = e.detail.value;
            this.msgManager.sendMsg({type: IMOperator.TextType, content});
        });
    },
    voiceButton() {
        chatInput.recordVoiceListener((res, duration) => {
            let tempFilePath = res.tempFilePath;
            this.msgManager.sendMsg({type: IMOperator.VoiceType, content: tempFilePath, duration});
        });
        chatInput.setVoiceRecordStatusListener((status) => {
            this.msgManager.stopAllVoice();
        })
    },
    //上拉加载历史数据
    updataHistoryList(){
      var time = Date.parse(new Date()) / 1000;
      var that = this;
      var tha  = that.UI._page;
      if (that.data.ajaxflag == 0) {
        tha.setData({
          scrollTopVal: 50,
        }); 
        return false;
      }else{
        if (time - flagTime < 2){
          tha.setData({
            scrollTopVal: 50,
          }); 
          return false;
        }
      }
      that.setData({
        ajaxflag: 0
      });
      setTimeout(function () {
        const friend = JSON.parse(that.options.friend);
        friend.index = that.data.chatItems.length;
        that.imOperator = new IMOperator(that, friend);
        that.imOperator.onSimulateReceiveMsg((msg) => {
          that.msgManager.showMsg({ msg })
          that.setData({
            ajaxflag: 1
          });
          flagTime = Date.parse(new Date()) / 1000;  
        });
      }, 200)  

    },
    //对于数据不足的无法进行下拉刷新的数据进行下滑刷新
    onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      const friend = JSON.parse(that.options.friend);
      friend.index = that.data.chatItems.length;
      // console.log(friend);
      that.imOperator = new IMOperator(that, friend);
      that.imOperator.onSimulateReceiveMsg((msg) => {
        that.msgManager.showMsg({ msg })
      });
    }, 200)
  },


    //模拟上传文件，注意这里的cbOk回调函数传入的参数应该是上传文件成功时返回的文件url，这里因为模拟，我直接用的savedFilePath
    simulateUploadFile({savedFilePath, duration, itemIndex, success, fail}) {
        setTimeout(() => {
            let urlFromServerWhenUploadSuccess = savedFilePath;
            success && success(urlFromServerWhenUploadSuccess);
        }, 1000);
    },
    extraButton() {
        let that = this;
        chatInput.clickExtraListener((e) => {
            let chooseIndex = parseInt(e.currentTarget.dataset.index);
            if (chooseIndex === 2) {
                that.myFun();
                return;
            }
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'],
                sourceType: chooseIndex === 0 ? ['album'] : ['camera'],
                success: (res) => {
                    this.msgManager.sendMsg({type: IMOperator.ImageType, content: res.tempFilePaths[0]})
                }
            });

        });
    },
    /**
     * 自定义事件
     */
    myFun() {
        wx.showModal({
            title: '小贴士',
            content: '演示更新会话状态',
            confirmText: '确认',
            showCancel: true,
            success: (res) => {
                if (res.confirm) {
                    this.msgManager.sendMsg({type: IMOperator.CustomType})
                }
            }
        })
    },
    onUnload: function () {
      var friendId = this.data.friendId
      // console.log(friendId);
      var userId = wx.getStorageSync('userid');
      if (!userId) {
        userId = app.globalData.userid
      }
      var datas = { friendId: friendId, userId: userId, type: 'updatastatus' }
      this.sendUpdataMsgStatus({ content: datas });
      console.log('App onUnload');
    },
    resetInputStatus() {
        chatInput.closeExtraView();
    },
    sendUpdataMsgStatus({ content, success }) {
      getApp().getIMHandler().setOnReceiveMessageListener({
        listener: (msg) => {
          msg.type === 'updatastatus'
        }
      });
        getApp().getIMHandler().sendMsg({
          content: content, success: () => {
            // console.log(content)
            console.log('获取会话列表消息发送成功');
          },
          fail: (res) => {
            console.log('获取会话列表失败', res);
          }
        });
    },
    sendMsg({content, itemIndex, success}) {
        this.imOperator.onSimulateSendMsg({
            content,
            success: (msg) => {
//              console.log(content);
                this.UI.updateViewWhenSendSuccess(msg, itemIndex);
                success && success(msg);
            },
            fail: () => {
                this.UI.updateViewWhenSendFailed(itemIndex);
            }
        })
    },
    /**
     * 重发消息
     * @param e
     */
    resendMsgEvent(e) {
        const itemIndex = parseInt(e.currentTarget.dataset.resendIndex);
        const item = this.data.chatItems[itemIndex];
        this.UI.updateDataWhenStartSending(item, false, false);
        this.msgManager.resend({...item, itemIndex});
    },
    /**
     * 查看用户信息
     */
     toUserInfo:function(e){
       var status = e.currentTarget.dataset.ismy;
       if (!status){
         var that = this;
         wx.navigateTo({
           url: '/pages/user/user?userid=' + that.data.friendId
         });
       }
     }
});