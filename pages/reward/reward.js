// pages/reward/reward.js

var httpClient = require('../../utils/httpClient.js');
var app = getApp()

var pay = require('../../utils/pay.js');
var config = require('../../utils/config.js');

var js_code;
var user_info={
      encryptedData: null,
      iv: null,
    };

Page({
  data:{
    hide_other_reward_page : true,
    js_code: null,
    user_info:{
      encryptedData: null,
      iv: null,
    },
    userInfo:{},
    payFee: false,
    payAnswerId:'',
  },
  onLoad:function(parameters){
    
    console.log(parameters);
    this.data.payFee = parameters.payFee;
    this.data.payAnswerId = parameters.answerId;

    var that = this;
    this.setData({
      hide_other_reward_page: true,
    });

    
  },

  
  selectReward1:function(e){
    console.log("￥ 1");
    wx.setStorageSync('rewardNum', 1);
  },
  selectReward5:function(e){
    console.log("￥ 5");
    wx.setStorageSync('rewardNum', 5);
  },
  selectReward10:function(e){
    console.log("￥ 10");
    wx.setStorageSync('rewardNum', 10);
  },
  rewardConfirm:function(e){
    console.log("reward confirm");
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  onReady:function(){
    
    

  },
  onShow:function(){
    // 页面显示
  },
  


  rewardOtherNum:function(e) {
    console.log("其他金额");
    this.setData({
      hide_other_reward_page: false,
    });

  },
  otherRewardNumInput:function(e){
    console.log(e.detail.value);
    var rewardNum = e.detail.value;
    wx.setStorageSync('rewardNum', rewardNum);
  },

  rewardConfirm:function(e){
    pay.orderPay(
      (pay_result)=>{
        if(this.data.payFee)
        {
          //更新打赏的数据库纪录
          wx.request({
            url: config.PytheRestfulServerURL + '/rewardnum',
            data: {
              answerId: this.data.payAnswerId,
              f: wx.getStorageSync('rewardNum'),
            },
            method: 'GET', 
            success: function(res){
              // success
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
      },
      (pay_result)=>{
        console.log("支付出错");
      },
    );
  },
  returnOperationPage:function(e){
    this.setData({
      hide_other_reward_page: true,
    });
  },  
    
    
    

})

module.exports = {
    js_code : js_code,
    user_info : user_info,
}

