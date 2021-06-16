//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力001bHJ281qo7rS1JR1481OQC281bHJ2B
    var _this = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
      wx.login({
        success: res => {
          console.log(res);
          wx.request({
            url: _this.globalData.apiDomain +'/api/member/code?act=login',
            data: {
              code: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              wx.setStorageSync('login_key', res.data.data.login_key);
            }
          })
        }
      });
  },
  globalData: {
    apiDomain:'https://wx.100bsh.com',
    userInfo: null,
    login_key:''
  }
})
