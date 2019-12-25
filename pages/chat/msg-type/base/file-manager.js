import FileSaveManager from "../../file-save-manager";
const config = require("../../../../utils/config.js");  //调用公用配置项
const app = getApp();
export default class FileManager {

    constructor(page) {
        this._page = page;
    }

    /**
     * 接收到消息时，通过UI类的管理进行渲染
     * @param msg 接收到的消息，这个对象应是由 im-operator.js 中的createNormalChatItem()方法生成的。
     */
    showMsg({msg}) {
        const url = msg.content;
        const localFilePath = FileSaveManager.get(msg);
      if (!localFilePath && !msg.chattype) {
          //console.log(res.tempFilePath);
            wx.downloadFile({
                url,
                success: res => {
                    // console.log('下载成功', res);
                    FileSaveManager.saveFileRule({
                            tempFilePath: res.tempFilePath,
                            success: (savedFilePath) => {
                                msg.content = savedFilePath;
                                this._page.UI && this._page.UI.updateViewWhenReceive(msg);
                                FileSaveManager.set(msg, savedFilePath);
                            },
                            fail: res => {
                                // console.log('存储失败', res);
                                this._page.UI && this._page.UI.updateViewWhenReceive(msg);
                            }
                        }
                    )
                }
            });
        } else {
            // msg.content = localFilePath;
            this._page.UI.updateViewWhenReceive(msg);
        }
    }

    /**
     * 发送文件类型消息
     * @param type 消息类型
     * @param content 由输入组件接收到的临时文件路径
     * @param duration 由输入组件接收到的录音时间
     */
    sendOneMsg({type, content, duration}) {
        FileSaveManager.saveFileRule({
          tempFilePath: content,
            success: (savedFilePath) => {
                this._sendFileMsg({content: savedFilePath, duration, type});
            }, fail: res => {
                this._sendFileMsg({content, type, duration});
            }
        });
    }

    _sendFileMsg({content, duration, type}) {
        const temp = this._page.imOperator.createNormalChatItem({
            type,
            content,
            duration
        });
        this._page.UI.showItemForMoment(temp, (itemIndex) => {
          var friend = JSON.parse(this._page.options.friend);
          var friendid = friend.friendId;
          var userId = wx.getStorageSync('userid');
          if (!userId) {
            userId = app.globalData.userid
          }
          const app = getApp();
          var serverip = app.globalData.serverdomain;
          var that = this;
          //上传文件到服务器
          wx.uploadFile({
            url: serverip + '/oms/api.php/wxUploadFile', //仅为示例，非真实的接口地址
            filePath: content,
            name: 'file',
            formData: {
              'type': type,
              'friendid': friendid,
              'userId': userId,
              'duration': duration,
              'content': content
            },
            success: function (res) {
              res.data = JSON.parse(res.data)
              if (res.data.status == '1111') {
                var fileName = '';
                fileName = serverip + '/upload_files/wxapplet/chatfile/singroom/' + res.data.roompath + '/'+type+'/'+res.data.info;
                that.uploadFileAndSend({ content, duration, type, itemIndex ,fileName})
              }
            },
            fail: function (res) {
              // fail
            }
          }) 
            //this.uploadFileAndSend({content, duration, itemIndex, type})
        });
    }

  uploadFileAndSend({ content, duration, type, itemIndex, fileName}) {
   // console.log(fileName);
    var content1 = content;
    content = fileName;

        this._page.simulateUploadFile({
            savedFilePath: content, duration, itemIndex,
            success: (content) => {
                this._page.sendMsg({
                  content: this._page.imOperator.createChatItemContent({ type, content, duration}),
                    itemIndex,
                    success: (msg) => {
                      //console.log(content);
                      FileSaveManager.set(msg, content1);
                    }
                });
            }, fail: () => {
            }
        });
    }

    resend({}) {
        //文件的重发在商业版中已经实现，开源版中需要你自行实现
    }
}