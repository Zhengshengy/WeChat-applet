Page({
  data: {
    activitydata:{},
    spaceimgs:[],
    currentIndex:1
  },
  onLoad: function (options) {
    //console.log(options);
    this.setData({
      activitydata:{
        "name": "西安市和盛汽车贸易有限公司",
        "date": "2015年11月",
        "address":'陕西省西安市三桥西部国际车城1号馆',
        "hoster": "和盛汽车贸易有限公司"
      },
      spaceimgs:["http://139.196.218.128/SjPark/UserFile/Files/Thumbnail/46932530-4bc8-48dc-bf10-1e5e39d254b8_750x470.png","http://139.196.218.128/SjPark/UserFile/Files/Thumbnail/73efa039-6c54-43c6-8ad9-70f831723e2e_750x470.png","http://139.196.218.128/SjPark/UserFile/Files/Thumbnail/eb8bbf4d-e236-4c92-900c-67d8b941b02a_750x470.png"]
    })
    // setTimeout(()=>{
      wx.setNavigationBarTitle({
        title: this.data.activitydata.name
      })
    // },1000)
  },
  setCurrent: function(e){
    this.setData({
      currentIndex:e.detail.current+1
    })
  },
  imgPreview: function(){ //图片预览
    const imgs = this.data.spaceimgs;
    wx.previewImage({
      current: imgs[this.data.currentIndex-1], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
})
