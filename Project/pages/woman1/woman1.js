// pages/woman1/woman1.js
Page({

  data: {
    gifts:[{"product_id":"0","num":"0","price":"88","name":"零食盘","img":"../../img/g1.webp"}
  ]
  },
  getGift:function(e){
    var that = this;
    var val=e.currentTarget.dataset.text; 
    var gift=that.data.gifts;
    var i;
    gift[val].num=1;
    this.setData({
      gifts:gift
    })
    wx.setStorageSync('gifts',JSON.stringify(that.data.gifts[val]))
    wx.switchTab({
      url:'../gift1/gift1'
    })
    }
})