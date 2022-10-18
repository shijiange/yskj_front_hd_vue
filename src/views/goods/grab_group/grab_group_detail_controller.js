import cTitle from "components/title";
import yzSpecs from "components/ui_components/yz_specs";
import { Toast } from "vant";
export default {
  data() {
    return {
      showShare: false,
      isHidden_text: false,
      info: {},
      goodsCount: null,
      optionsId: null, //规格id
      popupSpecs: false,
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳
      isCheckActivity: true //下单前检查客户今天是否超出限制
    };
  },
  activated() {
    this.init();
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    closeShare() {
      this.showShare = false;
    },
    //初始化数据
    init() {
      this.popupSpecs = false;
      this.info = {};
      this.isCheckActivity = true;
    },
    //获取数据列表
    getData() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.index.getSnatchData", { art: "raidDetail", leader_id: that.id }, "").then(
        response => {
          if (response.result === 1) {
            that.info = response.data.raidDetail;
            // that.checkActivity()
            // that.initShare();
            that.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid(),
                goods_id: that.info.goods_id },
              {
                title: that.fun.isTextEmpty(that.info.share_title) ? that.info.title : that.info.share_title,
                imgUrl: that.fun.isTextEmpty(that.info.share_thumb) ? that.info.thumb : that.info.share_thumb,
                description: that.fun.isTextEmpty(that.info.share_desc) ? "向您分享一个抢团活动" : that.info.share_desc
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    //获取数据列表
    checkActivity() {
      let that = this;
      $http
        .get(
          "plugin.snatch-regiment.api.index.getSnatchData",
          { art: "inspectOverrun", leader_id: this.id, at_id: this.$route.params.id, option_id: this.optionsId, total: this.goodsCount, goods_id: this.info.goods_id },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.isCheckActivity = true;
              that.joinTeam();
            } else {
              that.isCheckActivity = false;
              Toast(response.msg);
            }
          },
          response => {}
        );
    },
    hiddenText() {
      //倒计时已结束后隐藏后面的文字
      this.isHidden_text = true;
    },
    openSpecs() {
      this.popupSpecs = true;
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype) {
      this.optionsId = _optionsId;
      this.goodsCount = goodsCount;
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        if (this.$refs.goodSku.popPrice == 0) {
          this.$dialog.alert({ message: "开团/参团金额不正确，不能为0" });
          return;
        }
        this.checkActivity();
      }
    },
    joinTeam() {
      let that = this;
      if (!this.isCheckActivity) {
        Toast("抱歉，您已超出限制条件");
        return;
      }
      if (this.timestamp > Number(this.info.team_end_time)) {
        Toast("很抱歉，该活动已结束");
        return;
      }
      let goods = [];
      goods.push(that.info.goods_id);
      $http.get("from.div-from.isDisplay", { goods_ids: JSON.stringify(goods) }, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      goodsId: that.info.goods_id,
                      at_id: that.info.activity_id, //活动ID
                      optionsId: that.optionsId,
                      total: that.goodsCount
                    })
                  );
                })
                .catch(() => {});
            } else {
              that.$router.push(
                that.fun.getUrl(
                  "goodsorder",
                  {},
                  {
                    tag: "-2",
                    orderType: "grabGroup_join",
                    goodsId: that.info.goods_id,
                    total: that.goodsCount,
                    optionsId: that.optionsId,
                    at_id: that.info.activity_id,
                    leader_id: that.$route.params.id
                  }
                )
              );
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    openGroup() {
      this.$router.push(this.fun.getUrl("grab_group", { id: this.info.goods_id }));
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl("grab_group_home", {}));
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

      this.showShare = true;
    },
    //初始化分享设置
    initShare() {
      let that = this;
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid(),
        goods_id: this.info.goods_id
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare() {
      var that = this;
      let _title = this.fun.isTextEmpty(that.info.share_title) ? that.info.title : that.info.share_title;
      let _imgUrl = this.fun.isTextEmpty(that.info.share_thumb) ? that.info.thumb : that.info.share_thumb;
      let _desc = this.fun.isTextEmpty(that.info.share_desc) ? "向您分享一个抢团活动" : that.info.share_desc;

      let _link = document.location.href;
      _link = that.fun.isMid(_link, that.fun.getKeyByMid());

      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },
    //组装分享设置
    share(data) {
      let that = this;
      let _titles,
        _imgUrls,
        _descs = null;
      try {
        _titles = this.fun.isTextEmpty(that.info.share_title) ? that.info.title : that.info.share_title;
        _imgUrls = this.fun.isTextEmpty(that.info.share_thumb) ? that.info.thumb : that.info.share_thumb;
        _descs = this.fun.isTextEmpty(that.info.share_desc) ? "向您分享一个抢团活动" : that.info.share_desc;
      } catch (error) {
        console.log(error);
      }

      let _link = document.location.href;
      _link = that.fun.isMid(_link, data.info.uid);

      wx.config(data.config);
      wx.ready(function() {
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    gotoGoods() {
      this.$router.push(this.fun.getUrl("grab_group", { id: this.info.goods_id }));
    },
    gotoOrderDetail() {
      let that = this;
      this.$router.push(
        this.fun.getUrl("orderdetail", {
          order_id: that.info.order_id,
          orderType: "grabGroup"
        })
      );
    }
  },
  computed: {},
  components: { cTitle, yzSpecs }
};
