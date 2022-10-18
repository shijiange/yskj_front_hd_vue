import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      member_avatar: "",
      member_nickname: "xxx",
      activity_title: "活动标题",
      activity_explain: "",
      activity_average: "0.00",
      integral: window.localStorage.integral,
    };
  },
  methods: {
    getData() {
      const that = this;
      $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.receive-page.index', {activity_id: that.id}, '正在加载').then(function (response) {
        if (response.result === 1) {
          const activityDate = response.data;
          that.member_avatar = activityDate.member_avatar;
          that.member_nickname = activityDate.member_nickname;
          that.activity_title = activityDate.activity_title;
          that.activity_explain = activityDate.activity_explain;
          that.activity_average = activityDate.activity_average;
          // that.initShare();
          that.fun.wxShare(
            "",
            { },
            {
              title: (that.fun.isTextEmpty(that.member_nickname)) ? that.activity_title : (that.member_nickname + that.activity_title),
              imgUrl: (that.fun.isTextEmpty(data.shop.icon)) ? that.member_avatar : '',
              description: (that.fun.isTextEmpty(that.activity_explain)) ? that.activity_title : that.activity_explain
            }
          );
        } else {
          that.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        // error callback
      });
    },
    receive() {
      const that = this;
      $http.post('plugin.point-activity.Frontend.Modules.Activity.Controllers.receive.index', {activity_id: that.id}, '正在加载').then(function (response) {
        if (response.result === 1) {
          that.$dialog.alert({message:'领取成功'});

        } else {
          that.$dialog.alert({message:response.msg});
        }
      }, function (response) {
        // error callback
      });
    },
    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = {url: _url};
      $http.post('member.member.wxJsSdkConfig', json).then(function (response) {
        if (response.result === 1) {
          that.share(response.data);
        }
      }, function (response) {
        console.log(response);
      });
    },

    //分享
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {

        let _title = (that.fun.isTextEmpty(that.member_nickname)) ? that.activity_title : (that.member_nickname + that.activity_title);

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = (that.fun.isTextEmpty(data.shop.icon)) ? that.member_avatar : data.shop.icon;
        let _desc = (that.fun.isTextEmpty(that.activity_explain)) ? that.activity_title : that.activity_explain;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
        // if(that.fun.getWechatVersion()){
        //   wx.updateTimelineShareData({
        //     title: _title, // 分享标题
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     success: function () {
        //       //Toast("分享成功");
        //     },
        //     // cancel: function () {
        //     //   Toast("取消分享");
        //     // }
        //   });
  
        //   wx.updateAppMessageShareData({
        //     title: _title, // 分享标题
        //     desc: _desc, // 分享描述
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     //type: 'link', // 分享类型,music、video或link，不填默认为link
        //     //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //     success: function () {
        //       //Toast("分享成功");
        //     },
        //     // cancel: function () {
        //     //   Toast("取消分享");
        //     // }
        //   });
        // }else{
        //   wx.onMenuShareTimeline({
        //     title: _title, // 分享标题
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     success: function () {
        //       Toast("分享成功");
        //     },
        //     cancel: function () {
        //       Toast("取消分享");
        //     }
        //   });
  
        //   wx.onMenuShareAppMessage({
        //     title: _title, // 分享标题
        //     desc: _desc, // 分享描述
        //     link: _link, // 分享链接
        //     imgUrl: _imgUrl, // 分享图标
        //     type: 'link', // 分享类型,music、video或link，不填默认为link
        //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //     success: function () {
        //       Toast("分享成功");
        //     },
        //     cancel: function () {
        //       Toast("取消分享");
        //     }
        //   });
        // }
       
      });
    },
    initData() {
      this.member_avatar = "";
      this.member_nickname = "xxx";
      this.activity_average = "0.00";
    },
  },
  activated() {
    this.id = this.$route.query.activity_id;
    if (!this.id) {
      this.$router.push(this.fun.getUrl('IntegralActivity'));
      return;
    }
    this.initData();
    this.getData();
    this.integral ? this.fun.setWXTitle(this.integral + '推广') : this.fun.setWXTitle('');
  },
  components: {cTitle}
};