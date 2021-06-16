// pages/pay/pay.js
Page({
  data:{
  },
    paybut:function(){
      wx.showModal({
        content:'确认支付？',
        cancelColor: 'cancelColor',
        success:function(){
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function(){
              wx.switchTab({
            url: '../gift1/gift1',
          })
              },3000)      

        }
    })
    }
})