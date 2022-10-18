//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      goods: {},
      datas: {},
      name: '', //优惠券名称
      time_start: '',
      time_end: '',
      shop_logo: '',
      copy_value: '',
      icon: ''
    };
  },

  components: {
    cTitle
  },
  mounted() { },

  methods: {
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = this.change(date.getDate()) + ' ';
      let h = this.change(date.getHours()) + ':';
      let m = this.change(date.getMinutes());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return '0' + t;
      } else {
        return t;
      }
    },
    //获取链接上的某个参数的值
    getQueryString(name) {
      return (
        decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [,""])[1].replace(
            /\+/g,
            '%20'
          )
        ) || null
      );
    },
    toDetail(_id) {
      this.$router.push(this.fun.getUrl('goods', { id: _id }));
    },
    //获取数据
    getData() {
      let json = {
        coupon_id: this.$route.params.id
      };
      $http
        .get('coupon.member-coupon.getGoodsCouponByCouponId', json, '获取中')
        .then(response => {
          if (response.result == 1) {
            this.datas = response.data;
            this.goods = response.data.goods;
            this.icon = response.data.icon;
            this.time_start = this.datas.time_start.split(' ')[0];
            this.time_end = this.datas.time_end.split(' ')[0];
            let _link = window.location.href;
            _link = this.fun.isMid(_link, window.localStorage.uid);
            if (this.goods.length > 0) {
              this.copy_value =
                this.goods[0].title +
                '\r日常价：' +
                this.goods[0].price +
                '\r券后价：' +
                this.goods[0].deduct_price +
                '\r' +
                _link;
            }
            // if (this.coupon.coupon_status == 1 && this.goods.status == 0) {
            //   Toast("商品已下架");

            //   this.$router.push(this.fun.getUrl("home"));
            //   return;
            // } else if (
            //   this.coupon.coupon_status == 1 &&
            //   this.goods.status == 1
            // ) {
            //   Toast("优惠券已被领取");
            //   this.$router.push(
            //     this.fun.getUrl("goods", { id: this.goods.id })
            //   );
            //   return;
            // }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //领取
    selectedcoupon() {
      var that = this;
      $http.get('coupon.member-coupon.get-coupon', { coupon_id: this.$route.params.id }, '').then(
        function (response) {
          if (response.result == 1) {
            Toast('领取成功');
            if (that.goods.length == 1) {
              //单个指定商品才跳转商品详情
              that.toDetail(that.goods[0].id);
            }
          } else {
            if(response.data.reason){
              that.$dialog.alert({message:response.data.reason,title:response.msg});
            }else{
              that.$dialog.alert({message:response.msg});
            }
          }
        },
        function (response) {
          // error callback
        }
      );
    },
    // 复制文案
    onCopy() {
      Toast({
        message: '复制成功',
        position: 'bottom',
        duration: 5000
      });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === 'android' ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        response => {
          if (response.result === 1) {
            // var cs = data.shop.cservice;
            if (response.data.config) {
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function (response) {
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
      this.$dialog.alert({message:'请点击右上角微信分享'});

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
        function (response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      let _title = '';
      let _imgUrl = '';
      let _desc = '';
      _title = that.goods[0].title ? that.goods[0].title : data.share.title;
      _imgUrl = that.goods[0].thumb ? that.goods[0].thumb : data.share.icon;
      _desc = '现价：￥' + that.goods[0].price + '   券后价：￥' + that.goods[0].deduct_price;
      let _link = document.location.href + '&share_tag=2';
      _link = that.fun.isMid(_link, data.info.uid);
      YDB.Share(_title, _desc, _imgUrl, _link, 'Sharesback');
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = '';
        let _imgUrl = '';
        let _desc = '';
        _title = that.goods[0].title ? that.goods[0].title : data.share.title;
        _imgUrl = that.goods[0].thumb ? that.goods[0].thumb : data.share.icon;
        _desc = '现价：￥' + that.goods[0].price + '   券后价：￥' + that.goods[0].deduct_price;
        let _link = document.location.href + '&share_tag=2';
        _link = that.fun.isMid(_link, data.info.uid);
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
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
          success: function () {
            Toast('分享成功');
          },
          cancel: function () {
            Toast('取消分享');
          }
        });
      });
    }
  },
  activated() {
    this.getData();
    // this.initShare();
    this.fun.wxShare(
      "",
      {},
      {
        title: this.goods[0] ? this.goods[0].title : '',
        imgUrl: this.goods[0] ? this.goods[0].thumb : '',
        description: this.goods[0] ? '现价：￥' + this.goods[0].price + '   券后价：￥' + this.goods[0].deduct_price : ''
      }
    );
  }
};
