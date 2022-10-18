import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      id: '',
      activity: {},
      now: '',
      status: false,
      num: [], //活动报名前五位
      Num: [], //活动报名人数
      count: '',
      mobile: '',
      real_name: ''
    };
  },
  activated() {
    if (this.id === '' && !this.$route.params.id) {
      this.$router.go(-1);
    } else {
      this.initData();
      this.now = String(Date.parse(new Date())).substr(0, 10);
      if (this.$route.params.id) {
        this.id = this.$route.params.id;
      }
      this.getData();
      this.getAttention();
      this.getNum();
    }
  },
  mounted() {},
  methods: {
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === 'android' ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message:'请点击右上角微信分享'});
    },
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      var _title = that.fun.isTextEmpty(that.activity.has_one_share.share_title)
        ?that.activity.title
        :that.activity.has_one_share.share_title;
      var _link = document.location.href + '&share_tag=2';
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(that.activity.has_one_share.share_thumb)
        ?that.activity.thumb
        :that.activity.has_one_share.share_thumb.trim();
      var _desc = that.fun.isTextEmpty(that.activity.has_one_share.share_desc)
        ?data.shop.shop.name
        :that.activity.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, 'Sharesback');
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = '';
        let _imgUrl = '';
        let _desc = '';
        if (that.fun.isTextEmpty(that.activity.has_one_share)) {
          //返回的goodsInfo.has_one_share数据中没有相应对象
          _title = that.activity.title;
          _imgUrl = that.activity.thumb;
          _desc = data.shop.shop.name;
        } else {
          _title = that.fun.isTextEmpty(
            that.activity.has_one_share.share_title
          )
            ?that.activity.title
            :that.activity.has_one_share.share_title;
          _imgUrl = that.fun.isTextEmpty(
            that.activity.has_one_share.share_thumb
          )
            ?that.activity.thumb
            :that.activity.has_one_share.share_thumb.trim();
          _desc = that.fun.isTextEmpty(that.activity.has_one_share.share_desc)
            ?data.shop.shop.name
            :that.activity.has_one_share.share_desc;
        }

        //let _link = document.location.href + "&mid=" + data.info.uid + "&share_tag=2";
        //let _link = location.protocol+'//'+location.host+location.pathname +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep()+ "&mid=" + data.info.uid + "&share_tag=2";

        let _link = document.location.href + '&share_tag=2';
        _link = that.fun.isMid(_link, data.info.uid);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });
      });
    },
    goToAdress() {
      let point = this.fun.bd_decrypt(this.activity.longitude, this.activity.latitude);
      //window.location.href="http://api.map.baidu.com/marker?location="+this.mainInfo.lat+","+this.mainInfo.lng+"&title=商家位置&content="+this.mainInfo.store_name+"&output=html";
      this.fun.goToWXAdress(point, this.activity.title, '活动地址');
    },
    initData() {
      this.activity = {};
      this.now = '';
      this.status = false;
      this.num = [];
      this.Num = [];
      this.count = '';
      this.mobile = '';
      this.real_name = '';
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = this.change(date.getDate()) + ' ';
      let h = this.change(date.getHours()) + ':';
      let m = this.change(date.getMinutes()) + ':';
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    change(t) {
      if (t < 10) {
        return '0' + t;
      } else {
        return t;
      }
    },
    getAttention() {
      let json = {
        activity_id: this.id
      };
      $http
        .get('plugin.activity-apply.api.activity.isAttention', json, '加载中')
        .then(response => {
          if (response.result === 1) {
            if (response.data) {
              this.status = response.data.is_attention;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getData() {
      let json = {
        activity_id: this.id
      };
      $http
        .get('plugin.activity-apply.api.Activity.getActivity', json, '加载中')
        .then(response => {
          if (response.result === 1) {
            this.activity = response.data;
            this.count = this.activity.has_many_pay_order.length > 0 ? this.activity.has_many_pay_order[0].count : 0;
            this.mobile = this.activity.has_one_lecturer ? this.activity.has_one_lecturer.mobile : '';
            this.real_name = this.activity.has_one_lecturer ? this.activity.has_one_lecturer.real_name : '';
            this.fun.setWXTitle(this.activity.title);
            // this.initShare();
            let {share_title:title1,share_thumb:thumb1,share_desc:desc1} = response.data.has_one_share;
            let {share_title:title2,share_thumb:thumb2,share_desc:desc2} = response.data.set;
            this.fun.wxShare(
              "",
              {},
              {
                title: title1||title2,
                imgUrl: thumb1||thumb2,
                description: desc1||desc2
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toEnroll() {
      if(this.count>=this.activity.limit){
        Toast('报名人数已满');
      }
      this.$router.push(
        this.fun.getUrl('enroll', {
          id: this.id
        })
      );
    },
    toHome() {
      this.$router.push(this.fun.getUrl('activityHome'));
    },
    toMe() {
      this.$router.push(this.fun.getUrl('MyActivity'));
    },
    toSituation() {
      this.$router.push(
        this.fun.getUrl('Registration', {
          id: this.id
        })
      );
    },
    toLecturer(item) {
      this.$router.push(
        this.fun.getUrl('lecturerDetail', {
          member_id: item.has_one_lecturer.member_id,
          id: item.has_one_lecturer.id
        })
      );
    },
    addPeention() {
      this.status = !this.status;
      let json = {
        activity_id: this.id
      };
      $http
        .get('plugin.activity-apply.api.activity.attention', json, '加载中')
        .then(response => {
          if (response.result === 1) {
            Toast('关注成功');
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cancel() {
      this.status = !this.status;
      let json = {
        activity_id: this.id
      };
      $http
        .get('plugin.activity-apply.api.activity.attention', json, '加载中')
        .then(response => {
          if (response.result === 1) {
            Toast('取消关注成功');
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getNum() {
      let json = {
        activity_id: this.id
      };
      $http
        .get('plugin.activity-apply.api.activity.getDetails', json, '加载中')
        .then(response => {
          if (response.result === 1) {
            this.num = response.data.data.slice(0, 5);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    cTitle
  }
};
