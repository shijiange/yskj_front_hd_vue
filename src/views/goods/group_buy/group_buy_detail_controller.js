import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      info: {},
      isCheckActivity: true,//下单前检查客户今天是否超出限制
    };
  },
  activated() {
    this.init();
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    //初始化数据
    init() {
      this.info = {};
      this.isCheckActivity = true;
    },
    //获取数据列表
    getData() {
      let that = this;
      $http.get("plugin.together-purchase.api.index.getTogetherData", { art: 'purchaseDetail', o_id: that.id }, "")
        .then(
          response => {
            if (response.result === 1) {
              that.info = response.data.purchaseDetail;
              that.checkActivity();
              // that.initShare();
              that.fun.wxShare(
                "",
                { mid: that.fun.getKeyByMid(),goods_id: that.info.goods_id },
                {
                  title:that.info.title,
                  imgUrl:that.info.thumb,
                  description:'向您分享一个拼购商品'
                }
              );
            } else {
              Toast(response.msg);
            }
          },
          response => { }
        );
    },
    //获取数据列表
    checkActivity() {
      let that = this;
      $http.get("plugin.together-purchase.api.index.getTogetherData", { art: 'checkActivity', at_id: that.info.activity_id })
        .then(
          response => {
            if (response.result === 1) {
              that.isCheckActivity = true;
            } else {
              that.isCheckActivity = false;
              Toast(response.msg);
            }
          },
          response => { }
        );
    },
    joinTeam() {
      let that = this;
      if (!this.isCheckActivity) {
        Toast("抱歉，您已超出限制条件");
        return;
      }
      if (this.info.status == 0) {
        Toast("很抱歉，该活动已结束");
        return;
      }
      let goods = [];
      goods.push(that.info.goods_id);
      $http.get('from.div-from.isDisplay', { goods_ids: JSON.stringify(goods) }, '加载中').then(
        function (response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog.confirm({ message: "购买跨境商品,请补充您的个人信息"})
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl('myinfo', {
                      tag: 'groupBuy_join',
                      goodsId: that.goods_id,
                      at_id: that.activity,//活动ID
                      optionsId: 0,
                      total: 1
                    })
                  );
                }).catch(() => {});
            } else {
              that.$router.push(
                that.fun.getUrl("goodsorder",{}, {
                  tag: "-2",
                  orderType: 'groupBuy_join',
                  goodsId: that.info.goods_id,
                  total: 1,
                  at_id: that.info.activity_id,
                  leader_id: that.info.leader_id
                })
              );
            }
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    openGroup() {
      if (!this.isCheckActivity) {
        Toast("抱歉，您已超出限制条件");
        return;
      }
      if (this.info.status == 0) {
        Toast("很抱歉，该活动已结束");
        return;
      }
      let that = this;
      let goods = [];
      goods.push(that.info.goods_id);
      $http.get('from.div-from.isDisplay', { goods_ids: JSON.stringify(goods) }, '加载中').then(
        function (response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog.confirm({ message: "购买跨境商品,请补充您的个人信息"})
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl('myinfo', {
                      tag: 'groupBuy_open',
                      goodsId: that.info.goods_id,
                      at_id: that.info.activity_id,//活动ID
                      optionsId: 0,
                      total: 1
                    })
                  );
                }).catch(() => {});
            } else {
              that.$router.push(
                that.fun.getUrl("goodsorder",{}, {
                  tag: "-2",
                  orderType: 'groupBuy_open',
                  goodsId: that.info.goods_id,//活动商品ID
                  at_id: that.info.activity_id,//活动ID
                  total: 1,
                })
              );
            }
          } else {
            console.log(response.msg);
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
        this.appShare();
        return;
      }
      this.$dialog.alert({ message:"请点击右上角微信分享"});
          
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === 'android' ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid(),
        goods_id: this.info.goods_id
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        response => {
          if (response.result === 1) {
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
    //app分享设置
    appShare() {
      var that = this;
      let _title = that.info.title;
      let _imgUrl = that.info.thumb;
      let _desc = '向您分享一个拼购商品';

      let _link = document.location.href;
      _link = that.fun.isMid(_link, that.fun.getKeyByMid());

      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },
    //组装分享设置
    share(data) {
      let that = this;

      let _titles = that.info.title;
      let _imgUrls = that.info.thumb;
      let _descs = '向您分享一个拼购商品';

      let a_link = document.location.href;
      _link = that.fun.isMid(a_link, data.info.uid);

      wx.config(data.config);
      wx.ready(function () {
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
    gotoGoods() {
      this.$router.push(this.fun.getUrl("groupBuy", { id: this.info.goods_id, aid: this.info.activity_id }));
    },
    gotoOrderDetail() {
      let that = this;
      this.$router.push(
        this.fun.getUrl('orderdetail', {
          order_id: that.$route.params.id,
          orderType: 'groupsBuy'
        })
      );
    },
  },
  filters: {
    setStateName: function (value) {
      if (!value) return '';
      let _name = '';
      switch (value) {
      case 0:
        _name = '待支付';
        break;
      case 1:
        _name = '拼购中';
        break;
      case 2:
        _name = '拼购成功';
        break;
      case 3:
        _name = '拼购失败';
        break;
      case 4:
        _name = '成团中';
        break;
      case 5:
        _name = '已退款';
        break;
      case 6:
        _name = '已返还爱心值';
        break;
      case 7:
        _name = '无效';
        break;
      }
      return _name;
    }
  },
  computed: {},
  components: { cTitle }
};
