import cTitle from "components/title";
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data() {
    return {
      info: '',
      infoItem: '',
      combine_show: '',
      share_coupon: '',
      write_off_coupon: '',
      coupon_method: '',
      showPresenter: false,
      presenter_data: {},
      recharge_search: '',
      timeoutId: null,
      nickname: null,
      verification: false,
      showSelect: false,
      getSucceed:false,
      shareNum: null,
      datas: '',
      img_url: '',
      rule: '',
      timeSet: null,
      isPresenter: true,
      datainfo: {
        name:'',
        enough:0,
        deduct:0,
        discount:0,
        time_start:'',
        time_end:'',
        coupon_type_name:'',
        rule:'',
        isIntegralExchange:0
      },
      isShow:false,
      rechargeNum: 1,
      config_info: {},
      showRechargePay: false,
      multiple_use:{is_open:false,nums:0},  //是否开启多张赠送
    };
  },
  methods: {
    goMyCoupon() {
      this.$router.push(this.fun.getUrl("coupon", {}));
    },

    close_verification() {
      this.verification = false;
    },
    // 优惠券二维码轮询
    checkCoupon(id) {
      $http
        .post(
          "plugin.write-off-coupons.Frontend.controllers.code.get-status",
          { record_id: id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              if (response.data.status) {
                clearTimeout(this.timeSet);
                this.verification = false;
                Dialog.alert({
                  title: '',
                  message: '核销成功',
                }).then(() => {
                  location.reload();
                });
              }
            } else {
              this.$dialog.alert({message:response.msg});

              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    tapShow() {
      var that = this;
      $http
        .get(
          "plugin.write-off-coupons.Frontend.controllers.code.index",
          { record_id: this.info.id },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              that.verification = true;
              that.verificationImg = response.data;
              console.log(that.timeSet, that.timeSet == null);
              if (that.timeSet == null) {
                let _that = that;
                that.timeSet = setInterval(() => {
                  that.checkCoupon(_that.info.id);
                }, 3000);
              }
              // if(that.timeSet)


            } else {
              this.$dialog.alert({message:response.msg});

              //Toast(response.msg);
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    presenter(info) {
      // let that = this;
      this.showPresenter = true;
      this.presenter_data.item = info;
    },
    cancelP() {
      this.showPresenter = false;
      this.recharge_search = null;
      this.nickname = null;
    },
    cancelRecharge() {
      let that = this;
      if (this.config_info.switch) {
        if (that.fun.isTextEmpty(this.recharge_search)) {
          Toast("用户ID不能为空");
          return;
        }
        if (this.nickname == '查无此用户') {
          Toast("查询不到该用户ID，请确认无误！");
          that.recharge_search = null;
          that.nickname = null;
          return;
        }
        // if (this.rechargeNum > this.info.num) {
        //   Toast("优惠券已超出可转赠张数");
        //   this.rechargeNum = this.info.num
        //   return
        // }
        this.showRechargePay = true;
      } else {
        this.presenterPost();
      }
    },
    presenterPost() {
      let that = this;
      if (that.fun.isTextEmpty(this.recharge_search)) {
        Toast("用户ID不能为空");
        return;
      }
      if (this.nickname == '查无此用户') {
        Toast("查询不到该用户ID，请确认无误！");
        that.recharge_search = null;
        that.nickname = null;
        return;
      }
      console.log(that.info);
      let json = { recipient: this.recharge_search, record_id: this.presenter_data.item.id };
      if (this.config_info.switch) {
        json.quantity = that.rechargeNum;
        json.coupon_id = that.info.coupon_id;
      }else{
        json.transfer_num = that.rechargeNum;
      }
      if(this.multiple_use.is_open){
        json.transfer_num = that.rechargeNum;
      }
      $http.get("coupon.coupon-transfer.index", json, "处理中...").then(
        function (response) {
          that.showPresenter = false;
          that.recharge_search = null;
          that.nickname = null;
          if (response.result == 1) {
            if(that.multiple_use.is_open){
              // that.multiple_use.nums = that.multiple_use.nums-that.rechargeNum;
            }else if (that.config_info.switch) {
              //跳转支付手续费
              that.$router.push(that.fun.getUrl("orderpay", { status: 2, order_ids: response.data.order_ids }));
              return;
            }
            console.log(that.info);
            if (that.info.combine) {
              that.info.num = that.info.num - 1;
              that.$router.back(-1);
            } else {
              that.$router.back(-1);
            }
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    throttleFn(event) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      this.timeoutId = setTimeout(function () {
        // 100毫秒以后执行方法
        that.searchTransfer(event);
      }, 300); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    searchTransfer(event) {
      this.nickname = null;
      var reSearch = event.target.value;
      if (reSearch) {
        $http
          .get("member.member.memberInfo", { uid: reSearch }, ".")
          .then(response => {
            if (response.result === 1) {
              this.nickname = response.data ? response.data.nickname : '查无此用户';
            } else {
              this.nickname = null;
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.showSearch = false;
        this.search_list = [];
      }
    },
    //获取优惠券详情
    getdetail() {
      $http
        .get(
          "coupon.member-coupon.getCouponDetail",
          { coupon_id:this.$route.params.coupon_id }, ""
        )
        .then(response => {
          if (response.result === 1) {
            //this.img_url = response.data.img_url;
            this.datainfo = response.data;
            this.isShow = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            this.wxJsSdkConfig = response.data;
            console.log('刚进', this.wxJsSdkConfig);
            if (this.wxJsSdkConfig && this.wxJsSdkConfig.config) {
              this.share(this.wxJsSdkConfig);
            }
          } //else {
          //}
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data) {
      console.log(data);
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        // let _title = `${data.info.nickname}向您分享${info.belongs_to_coupon.name}`
        let _title = `${data.info.nickname}向您分享优惠券`;
        let _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/coupon/coupon_index?i=" + that.fun.getKeyByI();
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = data.share.icon;
        let _desc = data.share.desc;
        console.log(_title, _link, _imgUrl, _desc);
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
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
    selectedcoupon() {
      var that = this;
      let json = {
        coupon_id:this.$route.params.coupon_id
      };

      $http
        .get(
          "coupon.member-coupon.get-coupon",
          json,
          "正在抢此优惠券"
        )
        .then(
          function(response) {
            if (response.result == 1) {
                //that.$dialog.alert({message:"领取成功"});
                that.getSucceed = true;
            } else {
              if(response.data.reason){
                that.$dialog.alert({message:response.data.reason,title:response.msg});
              }else{
                that.$dialog.alert({message:response.msg});
              }
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    //通过类型去查询可用商品
    goBuy(item) {
      console.log(item.use_type);
      if (item.use_type == 0) {
        //0商城通用
        this.goHome();
      } else if (item.use_type == 1) {
        //1指定分类
        if (item.plugin_id == 32) {
          //门店商品优惠券
          this.$router.push(
            this.fun.getUrl(
              "StoreSearch",
              {
                store_id: item.storeids,
                fromHome: 3
              },
              { cid: item.category_ids }
            )
          );
        } else {
          this.$router.push(
            this.fun.getUrl("catelist", {
              id: JSON.stringify(item.category_ids),
              fromHome: 1
            })
          );
        }
      } else if (
        item.use_type == 2 ||
        item.use_type == 8
      ) {
        //2指定商品
        if (item.plugin_id == 32) {
          //门店商品优惠券
          this.$router.push(
            this.fun.getUrl(
              "StoreSearch",
              {
                store_id: item.storeids,
                fromHome: 2
              },
              { gid: item.goods_ids }
            )
          );
        } else {
          this.$router.push(
            this.fun.getUrl("search", {
              coupon: item.id,
              fromHome: 1
            })
          );
        }
      } else if (
        item.use_type === 4 &&
        Array.isArray(item.storeids)
      ) {
        //4门店列表
        this.$router.push(this.fun.getUrl("o2oHome"));
      } else if (
        item.use_type === 5 &&
        typeof item.storeids === "number"
      ) {
        //5单门店
        this.$router.push(
          this.fun.getUrl("o2oStore_v2", {
            store_id: item.storeids,
            fromHome: 1
          })
        );
      } else if (
        item.use_type === 7 &&
        Array.isArray(item.hotel_ids)
      ) {
        this.$router.push(this.fun.getUrl("HotelIndex"));
      } else if (
        item.use_type === 6 &&
        typeof item.hotel_ids === "number"
      ) {
        this.$router.push(
          this.fun.getUrl("HotelHome", {
            id: item.hotel_ids,
            fromHome: 1
          })
        );
      } else {
        this.goHome();
      }
    },
    goHome() {
      this.$router.push(this.fun.getUrl("home"));
    },
    init() {
      this.showSelect = false;
      this.showPresenter = false;
      this.verification = false;
      this.shareNum = 1;
      this.getSucceed = false;
    }
  },
  deactivated() {
    console.log('离开销毁轮询');
    clearTimeout(this.timeSet);
  },
  activated() {
    this.init();
    this.getdetail();
    // this.initShare();
    this.fun.wxShare(
      "",
      {},
      {
        title: `向您分享优惠券`,// 在wxShare处理
        link:this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/coupon/coupon_index?i=" + this.fun.getKeyByI(),
      },
    );
  },
  computed: {
    buttonStatus(){
      if(_.filter(this.datainfo.get_time_scope).length < 2){
        return {
          disabled : false,
          text: '立即领取'
        };
      }else{
        let now = new Date().getTime();
        if(now < new Date(this.datainfo.get_time_scope[0]).getTime()){
          return {
            disabled : true,
            text: '领取时间未开始'
          };
        }
        if(now > new Date(this.datainfo.get_time_scope[1]).getTime()){
          return {
            disabled : true,
            text: '领取时间已结束'
          };
        }
        return {
          disabled : false,
          text: '立即领取'
        };
      }
    }
  },
  mounted() { },
  components: {
    cTitle
  }
};