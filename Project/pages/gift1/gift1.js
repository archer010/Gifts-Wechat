const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    gifttype:'直接送礼',//送礼方式
    hasUserInfo: false,//用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    totalPrice:"0.00",//总价值
    multiArray: ['', '', ''],
    gifts:[],//礼物数组
    personNum:3,
    objectMultiArray: [
        [], 
        [], 
        []
    ],//礼物列表
    multiIndex: [0, 0, 0],
    weekArr:['周日','周一','周二','周三','周四','周五','周六'],
    wish:''
  },
  bindwish:function(e){//祝福语保存到本地
      var _this = this;
      _this.data.wish = e.detail.value;
      wx.setStorageSync('wish', e.detail.value);
  },
  personChange:function(e){//开奖人数修改
      var _this = this;
      var p_num = e.detail.value;
      _this.data.personNum = p_num;
      wx.setStorageSync('p_num', e.detail.value);
  },
  getDate:function(){//获取日期
    var _this = this;
    var _now = new Date();//当前时间
    var multi0 ='multiArray['+0+']';
    var multi1 = 'multiArray[' + 1 + ']';
    var multi2 = 'multiArray[' + 2 + ']';
    var nowDayArr = [_this.getMd(0), _this.getMd(1), _this.getMd(2), _this.getMd(3), _this.getMd(4), _this.getMd(5), _this.getMd(6)];
    var nowhoursArr = _this.getHour(0);
    var nowminutesArr = _this.getMin(0);
    _this.setData({
      [multi0]: nowDayArr,
      [multi1]: nowhoursArr,
      [multi2]: nowminutesArr
    });
  },
  getMd:function(dayNum){//参数1当前时间后第几天int类型 获取月份日期和星期 多列选择第一列
      var _this = this;
      var _now = new Date();
      var targetday_milliseconds = _now.getTime() + 1000 * 60 * 60 * 24 * dayNum;//目标日期的时间戳
      _now.setTime(targetday_milliseconds);//时间设置
      var _str = (_now.getFullYear()) + '年' +((_now.getMonth() + 1) < 10 ? '0' + (_now.getMonth() + 1) : (_now.getMonth() + 1)) + '月' + (_now.getDate() < 10 ? '0' + _now.getDate() : _now.getDate()) + '日 ' + _this.data.weekArr[_now.getDay()];
      return _str;
  },
  getHour: function (dayNum) {//时间选择多列第二列小时
      var _this = this;
      var _now = new Date();
      var _hour = _now.getHours();
      var _minute = _now.getMinutes();
      if(dayNum<=0){
        var hoursArr = [];
        var idx = parseInt(_hour);
        if(_minute>55){//如果已经过了55分钟则从下一个整点开始
          for (var i = idx+1; i <= 23; i++) {
            var _stri = i < 10 ? ('0' + i) : i;
            hoursArr.push(_stri);
          }
        }else{
          for (var i = idx; i <= 23; i++) {
            var _stri = i < 10 ? ('0' + i) : i;
            hoursArr.push(_stri);
          }
        }
        return hoursArr;
      }else{
        var hoursArr = [];
        var idx = parseInt(_hour);
        for (var i = 0; i <= 23; i++) {
          var _stri = i < 10 ? ('0' + i) : i;
          hoursArr.push(_stri);
        }
        return hoursArr;
      }
  },
  getMin:function(key){
    var _this = this;
    var _now = new Date();
    var _minute = _now.getMinutes();
    if(key==0){
        var MinutsArr=[];
        var idx = Math.ceil(parseInt(_minute)/5);
        if(idx==12){
          for (var i = 0; i < 12; i++) {
            var _strM = 5 * i < 10 ? ('0' + 5 * i) : 5 * i;
            MinutsArr.push(_strM);
          }
          return MinutsArr;
        }else{
          for (var i = idx; i < 12; i++) {
            var _strM = 5 * i < 10 ? ('0' + 5 * i) : 5 * i;
            MinutsArr.push(_strM);
          };
        }
        return MinutsArr;
    }else{
      var MinutsArr = [];
      var idx = Math.ceil(parseInt(_minute) / 5);
      for (var i = 0; i < 12; i++) {
        var _strM = 5 * i < 10 ? ('0' + 5 * i) : 5 * i;
        MinutsArr.push(_strM);
      }
      return MinutsArr;
    }
  },
  bindMultiPickerChange: function (e) {//级联列表
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var _this = this;
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {//修改的列
      case 0://如果修改的是第一列
        switch (data.multiIndex[0]) {
          case 0://如果第一列的值是第一个
            data.multiArray[1] = _this.getHour(0);
            data.multiArray[2] = _this.getMin(0);
            break;
          default://第一列选择的值不是第一个的话后续值都是相同的
            data.multiArray[1] = _this.getHour(1);
            data.multiArray[2] = _this.getMin(1);
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1://如果修改的是第二列
        switch (data.multiIndex[0]) {
          case 0://如果第一列的值是第一个
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = _this.getMin(0);
                break;
              default:
                data.multiArray[2] = _this.getMin(1);
                break;
            }
            break;
          case 1://如果第一列的值是第二个
            data.multiArray[2] = _this.getMin(1);
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  //事件处理函数
  bindViewTap: function () {//选择商品跳转列表页
    wx.navigateTo({
      url: '../list/list'
    })
  },
  selectType:function(){//选择开奖方式
    var _this = this;
    wx.showActionSheet({
      itemList: ['直接送礼', '定时', '满人开奖'],
      success: function (res) {
        if(res.tapIndex=="0"){
          _this.setData({
            gifttype:"直接送礼"
          });
          wx.setStorageSync('gifttype', "直接送礼");
        }else if (res.tapIndex == "1") {
          _this.setData({
            gifttype: "定时开奖"
          });
          wx.setStorageSync('gifttype', "定时开奖");
        }else if (res.tapIndex == "2") {
          _this.setData({
            gifttype: "满人开奖"
          });
          wx.setStorageSync('gifttype', "满人开奖");
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function () {//主函数
    var _this = this;
    _this.getDate();
    var gif=JSON.parse(wx.getStorageSync('gifts'));
    console.log(gif);
    this.setData({
      gifts: wx.getStorageSync('gifts') || [],
      wish: wx.getStorageSync('wish') || '',
      gifttype: wx.getStorageSync('gifttype') || '直接送礼',
      personNum: wx.getStorageSync('p_num') || this.data.personNum,
    },() => {//获取商品总数并且赋值
        var _total = 1;
        var _price = 0;
        _price = parseFloat(gif.price);
        console.log(_total,_price);
        _this.setData({
          totalgiftsNum:_total,
          totalPrice: _price.toFixed(2)
        })
    });
  },
  minusAction:function(e){//商品减操作
    var _this = this;
    var pid = e.currentTarget.dataset.id;
    for (var i = 0; i < _this.data.gifts.length; i++) {
      if (_this.data.gifts[i].product_id == pid) {
        var num = 'gifts[' + i + '].num';
        var numData = parseInt(_this.data.gifts[i].num);
        numData--;
        if(numData<=0){
          //从数组中删除
          var arr = _this.data.gifts;
          arr.splice(i,1);
          this.setData({
            gifts: arr
          }, () => {//获取商品总数并且赋值
            var _total = 0;
            var _price = 0;
            for (var i = 0; i < _this.data.gifts.length; i++) {
              _total += parseInt(_this.data.gifts[i].num);
              _price += parseFloat(_this.data.gifts[i].price) * _this.data.gifts[i].num;
            };
            _this.setData({
              totalgiftsNum: _total,
              totalPrice: _price.toFixed(2)
            })
          })
        }else{
          _this.setData({
            [num]: numData
          }, () => {//获取商品总数并且赋值
            var _total = 0;
            var _price = 0;
            for (var i = 0; i < _this.data.gifts.length; i++) {
              _total += parseInt(_this.data.gifts[i].num);
              _price += parseFloat(_this.data.gifts[i].price) * _this.data.gifts[i].num;
            };
            _this.setData({
              totalgiftsNum: _total,
              totalPrice: _price.toFixed(2)
            })
          })
        };
        wx.setStorageSync('gifts', _this.data.gifts);
        return;
      }
    }
  },
  plusAction: function (e) {//商品加操作
    var _this = this;
    var pid = e.currentTarget.dataset.id;
    for (var i = 0; i < _this.data.gifts.length; i++) {
      if (_this.data.gifts[i].product_id == pid) {
        var num = 'gifts[' + i + '].num';
        var numData = parseInt(_this.data.gifts[i].num);
        numData++;
        _this.setData({
          [num]: numData
        }, () => {//获取商品总数并且赋值
          var _total = 0;
          var _price = 0;
          for (var i = 0; i < _this.data.gifts.length; i++) {
            _total += parseInt(_this.data.gifts[i].num);
            _price += parseFloat(_this.data.gifts[i].price) * _this.data.gifts[i].num;
          };
          _this.setData({
            totalgiftsNum: _total,
            totalPrice: _price.toFixed(2)
          })
        });
        wx.setStorageSync('gifts', _this.data.gifts);
      }
    }
  },
  onShareAppMessage: function () {
    return {
      title: '线上送礼，来一场意外的邂逅',
      path: '/page/user?id=123'
    }
  },
  // opencamera: function () {
  //   wx.scanCode({
  //     success: (res) => {
  //       if (res.result) {
  //         wx.navigateTo({ url: res.result });
  //       }
  //     }
  //   })
  // },
  checkForm: function () {//提交表单数据验证
    var _this = this;
    var _error_tip = '';
    if (_this.data.gifts.length < 1) {//礼物列表是否为空
      _error_tip = '请先选择礼物';
      wx.showToast({
        title: _error_tip,
        icon: 'none',
        duration: 2000
      });
      return false;
    };
    switch (_this.data.gifttype) {
      case "直接送礼":
        break;
      case "定时开奖":
        var tp = _this.getGiftsTimestamp();
        var now = Date.parse(new Date()) / 1000;
        if (now >= tp) {
          _error_tip = '开奖时间已过，请重选';
          wx.showToast({
            title: _error_tip,
            icon: 'none',
            duration: 2000
          });
          return false;
        }
        break;
      case "满人开奖":
        if (parseInt(_this.data.personNum) < _this.data.gifts.length) {
          _error_tip = '开奖人数少于礼物数';
          wx.showToast({
            title: _error_tip,
            icon: 'none',
            duration: 2000
          });
          return false;
        }
        break;
    }
    return true;
  },
  errorBox:function(tip){//错误提示
      wx.hideLoading();
      wx.showToast({
        title: tip,
        icon: 'none',
        duration: 2000
      });
  },
  relogin:function(auth){//重新登录，auth为布尔值，true为需要验证授权，false时只更新login_key
      var _this = this;
      wx.login({
          success: res => {
            wx.request({
              url: app.globalData.apiDomain+'/api/member/code?act=login',
              data: {
                code: res.code
              },
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                wx.setStorageSync('login_key', res.data.data.login_key);
                if(auth){
                    wx.getSetting({
                    success: res => {
                      if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                          success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            _this.globalData.userInfo = res.userInfo;
                            wx.request({
                              url: app.globalData.apiDomain+'/api/member/code?act=getUserInfo',
                              data: {
                                'iv': res.iv,
                                'encryptedData': res.encryptedData,
                                'login_key': wx.getStorageSync('login_key')
                              },
                              method: "POST",
                              header: {
                                'content-type': 'application/json' // 默认值
                              },
                              success: function (res) {

                              }
                            });

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (_this.userInfoReadyCallback) {
                              _this.userInfoReadyCallback(res)
                            }
                          }
                        })
                      } else {
                        //未授权跳到授权登录页
                        wx.hideLoading();
                        wx.navigateTo({
                          url: '../login/login?redirect=index',
                        })
                      }
                    }
                  })
                }
                _this.getRedPackage();
              }
            });
          }
        })
  },
  getGiftsTimestamp: function () {//定时开奖获取时间戳判断
    var _this = this;
    var ymd = _this.data.multiArray[0][_this.data.multiIndex[0]];
    var result = ymd.match(/\d+/g);
    var hour = _this.data.multiArray[1][_this.data.multiIndex[1]];
    var minutes = _this.data.multiArray[2][_this.data.multiIndex[2]];
    var _tspStr = result[0] + '/' + result[1] + '/' + result[2] + ' ' + hour + ':' + minutes;
    var date = new Date(_tspStr);
    var tsp = Date.parse(date);
    var utimeStamp = tsp / 1000;
    return String(utimeStamp);
  },
  getRedPackage:function(){//生成礼物红包操作
    //表单数据验证
    var _this = this;
    var result = _this.checkForm();
    if(!result){
        return;
    }
    //表单通过之后检测登录状态和授权状态
    wx.showLoading({
      title: '验证登录',
    });
    wx.checkSession({
        success:function(){//sessionKey未过期
            //判断授权状态
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    app.globalData.userInfo = res.userInfo;
                    wx.request({
                      url: app.globalData.apiDomain+'/api/member/code?act=getUserInfo',
                      data: {
                        'iv': res.iv,
                        'encryptedData': res.encryptedData,
                        'login_key': wx.getStorageSync('login_key')
                      },
                      method: "POST",
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function (res) {
                        wx.hideLoading();
                        wx.showLoading({
                          title: '创建订单',
                        });
                        wx.request({
                          url: app.globalData.apiDomain+'/api/order?act=creatOrder',//生成礼物红包接口
                          data:{
                            'productList': _this.data.gifts,
                            'login_key':wx.getStorageSync('login_key'),
                            'play': { 'method': _this.data.gifttype, 'openTime': _this.getGiftsTimestamp(), 'openPeople': _this.data.personNum},
                            'wish': _this.data.wish ? _this.data.wish:'大吉大利，送你好礼'
                          },
                          method: "POST",
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success:function(res){
                            if (res.data.code == 'error' && res.data.message) {
                              wx.showToast({
                                title: res.data.message,
                                icon:'none'
                              })
                            }else{
                              var _orderId = res.data.data.order_id;
                              wx.request({
                                url: app.globalData.apiDomain + '/api/payment?act=requestPayment',//订单创建成功后请求微信支付的参数
                                data: {
                                  'login_key': wx.getStorageSync('login_key'),
                                  'order_id': _orderId
                                },
                                method: "POST",
                                header: {
                                  'content-type': 'application/json' // 默认值
                                },
                                success: function (res) {
                                  wx.hideLoading();
                                  wx.showLoading({
                                    title: '等待支付',
                                  });
                                  //吊起微信支付
                                  if (res.data.data.nonceStr && res.data.data.package && res.data.data.timeStamp && res.data.data.paySign) {
                                    wx.requestPayment({
                                      'timeStamp': String(res.data.data.timeStamp),
                                      'nonceStr': res.data.data.nonceStr,
                                      'package': res.data.data.package,
                                      'signType': 'MD5',
                                      'paySign': res.data.data.paySign,
                                      'success': function (res) {//微信支付成功之后
                                        //TODO清除数据
                                        try {
                                          wx.removeStorageSync('gifts');
                                          wx.removeStorageSync('wish');
                                          wx.removeStorageSync('gifttype');
                                          wx.removeStorageSync('p_num');
                                        } catch (e) {
                                          // Do something when catch error
                                        }
                                        _this.setData({
                                          gifts: [],
                                          wish: '',
                                          gifttype: '直接送礼',
                                          personNum: _this.data.personNum,
                                        })
                                        wx.hideLoading();
                                        wx.navigateTo({
                                          url: '../payment/payresult/payresult?orderId=' + _orderId,
                                        })
                                      },
                                      'fail': function (res) {
                                        wx.hideLoading();
                                        _this.errorBox('支付失败');
                                      }
                                    })
                                  }
                                },
                                fail: function (res) {
                                  wx.hideLoading();
                                  if (res.data.message) {
                                    wx.showToast({
                                      title: res.data.message
                                    })
                                  }
                                }
                              })
                            }
                            
                          },
                          fail:function(){
                            //订单创建失败
                            _this.errorBox('网络异常，请稍后再试');
                          }
                        })
                      },
                      fail:function(){
                        //后台解密用户信息失败
                        _this.errorBox('网络异常，请稍后再试');
                      }
                    });

                    //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回所以此处加入 callback 以防止这种情况
                    if (_this.userInfoReadyCallback) {
                      _this.userInfoReadyCallback(res)
                    }
                  }
                })
              }else{
                //未授权跳到授权登录页
                wx.hideLoading();
                wx.navigateTo({
                  url: '../login/login?redirect=index',
                })
              }
            }
          })
        },
        fail:function(){//登录过期
          _this.relogin(true);
        }
    })
  }
})