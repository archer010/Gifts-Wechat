// pages/woman2/woman2.js
Page({

  data: {
    gifts:[{"product_id":"0","num":"0","price":"88","name":"零食盘","img":"../../img/g1.webp"},
    {"product_id":"1","num":"0","price":"288"},
    {"product_id":"2","num":"0","price":"66"},
    {"product_id":"3","num":"0","price":"69"},
    {"product_id":"4","num":"0","price":"123"}]
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