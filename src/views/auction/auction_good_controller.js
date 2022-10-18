import cTitle from "components/title";
import { Toast } from "vant";
import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";
import { yzPay } from "../../utils/yz_pay"; //引入支付方法

export default {
  mixins: [yzPay],
  data() {
    return {
      record: [],
      record_length: 0,
      posterShow: false,
      invite_mobile: "",
      posterImg: {},
      show1: false,
      id: "",
      goods_id: "",
      auction: "",
      auctioneer: "",
      passwd: "",
      is_verify: "",
      status: "",
      password: "",
      now: "",
      show2: false,
      price: 0,
      rewardPayshow: false,
      btnData: [],
      isclick: true,
      setIntervalMth: '',
      isEnd: false,
    };
  },
  deactivated() {
    clearInterval(this.setIntervalMth);
  },
  activated() {
    window.scrollTo(0, 0); //页面向上滚动
    this.initData();
    this.id = this.$route.params.id;
    this.goods_id = this.$route.params.goods_id;
    this.now = new Date(this.timestampToTime(new Date().valueOf() / 1000)).valueOf() / 1000;
    this.getStatus();
  },
  methods: {
    reversedMessage(e) {
      return String(e).slice(0, 1);
    },
    payBtn(type, name) {
      if (type == 3 && !this.isclick) {
        return;
      }
      let that = this;
      let json = {
        money: Number(that.auction.prepayment),
        goods_id: Number(that.goods_id),
        pay_way: Number(type)
      };
      $http
        .post("plugin.auction.api.prepayment.recharge", json, "支付中...")
        .then(response => {
          that.rewardPayshow = false;
          if (response.result == 1) {
            this.handleOtherPay({ value: type }, response, "auction");
            this.getData();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          that.$dialog.alert({ message: response.msg });
        });
    },

    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      let json = { goods_id: this.goods_id };
      $http
        .get("plugin.auction.api.prepayment.page", json)
        .then(response => {
          if (response.result == 1) {
            let btnData = response.data.buttons;
            this.btnData = btnData;
            this.rewardPayshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "/";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      // let s = this.change(date.getSeconds());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    toRecord() {
      this.$router.push(this.fun.getUrl("auctionRecord", { goods_id: this.goods_id }));
    },
    bidTo() {
      let json = { goods_id: Number(this.goods_id), price: Number(this.price) };
      $http
        .post("plugin.auction.api.bid.bid", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
            this.show2 = false;
            this.getData();
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    up() {
      this.price = Number(Number(this.price) + Number(this.auction.mini_markup)).toFixed(2);
    },
    down() {
      if (Number(this.price) <= Number(this.auction.now_price)) {
        Toast("出价不能小于起拍价");
        return;
      }
      this.price = Number(Number(this.price) - Number(this.auction.mini_markup)).toFixed(2);
    },
    timeEnd(key) {
      // clearInterval(this.setIntervalMth);
      if (this.auction) {
        this.now = new Date(this.timestampToTime(new Date().valueOf() / 1000)).valueOf() / 1000;
        this.getData(false, key);
      }
    },
    bid() {
      if (this.invite_mobile == 0) {
        this.$router.push(this.fun.getUrl("editmobile"));
      } else if (this.auction.is_prepay == 0) {
        Toast(`需先支付${this.auction.prepayment}保证金方可出价`);
        this.getPayData();
      } else {
        this.show2 = true;
      }
    },
    getInvite() {
      $http.get("member.member.isValidatePage").then(res => {
        if (res.result === 1) {
          this.invite_mobile = res.data.invite_mobile;
        }
      });
    },
    initData() {
      this.posterShow = false;
      this.posterImg = {};
      this.show1 = false;
      this.id = "";
      this.goods_id = "";
      this.auction = "";
      this.auctioneer = "";
      this.passwd = "";
      this.is_verify = "";
      this.status = "";
      this.password = "";
      this.now = "";
      this.show2 = false;
      this.price = 0;
      this.rewardPayshow = false;
      this.btnData = [];
      this.isclick = true;
      this.record = [];
    },
    confirm() {
      let json = { art: "verifyPassword", auction_id: this.id, passwd: this.password };
      $http
        .get("plugin.auction.api.index.getAuctionData", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            this.show1 = false;
            this.getStatus();
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStatus() {
      let json = {
        member_id: this.id
      };
      $http
        .get("plugin.auction.api.index.getAuctionData", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            this.status = response.data.getVerify.status;
            this.is_verify = response.data.getVerify.is_verify;
            if (this.is_verify == 0 && this.status == 1) {
              this.show1 = true;
            } else {
              this.is_verify = 1;
              this.getData();
              this.setIntervalMth = setInterval(() => {
                this.getData(true);
              }, 10000);
              this.getInvite();
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toShop() {
      this.$router.push(this.fun.getUrl("auctioneerShop", { id: this.id }));
    },
    toMy() {
      this.$router.push(this.fun.getUrl("myIndex"));
    },
    toBuy() {
      this.$router.push(
        this.fun.getUrl("goodsorder", {}, {
          tag: "auction",
          goodsId: this.goods_id,
          total: 1,
          fixed_price: 1,
          auction_sn: this.auction.auction_sn
        })
      );
    },
    todian() {
      this.$router.push(this.fun.getUrl("auctioneerShop", { id: window.localStorage.uid }));
    },
    //跳转购物车
    gotoCart() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    goto() {
      this.$router.go(-1);
    },
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg.base64Image)) {
        this.posterShow = true;
      } else {
        Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        $http
          .get("plugin.auction.api.goodsPoster.generateGoodsPoster", { id: this.goods_id }, "")
          .then(response => {
            Toast.clear();
            if (response.result == 1) {
              this.posterImg = response.data;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({ message: response.msg });
            }
          })
          .catch(error => {
            Toast.clear();
            console.log(error);
          });
      }
    },
    toCollect() {
      let json = {
        art: "collectionShop",
        auctioneer_id: this.id
      };
      $http
        .get("plugin.auction.api.index.getAuctionData", json, "获取中")
        .then(response => {
          if (response.result == 1) {
            if (this.auctioneer.is_collection == 1) {
              Toast("取消收藏");
            } else {
              Toast("收藏成功");
            }
            this.getData();
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取数据
    getData(key = false, qekey) {
      let that = this;
      let json = { member_id: this.id, goods_id: this.goods_id, art: "goodsDetail" };
      $http
        .get("plugin.auction.api.index.getAuctionData", json)
        .then(response => {
          if (response.result == 1) {
            this.auction = response.data.goodsDetail.auction;
            if (response.data.goodsDetail.auction && response.data.goodsDetail.auction.auc_status == '-1') {
              this.isEnd = true;
              clearInterval(this.setIntervalMth);
            }
            if (!key) {
              this.auctioneer = response.data.goodsDetail.auctioneer;
              if (qekey == 'start') {
                if (response.data.goodsDetail.auction && response.data.goodsDetail.auction.bid_record && response.data.goodsDetail.auction.bid_record.is_last_bidder) {
                  this.$dialog.alert({ message: "您是本场出价最高者，3分钟后自动生成订单，请到我的 → 待确认栏目里确认订单。" });
                }
              }
            }
            this.record = this.auction.bid_record.data.splice(0, 5);
            this.record_length = this.auction.bid_record.total;
            this.price = Number(this.auction.now_price).toFixed(2);
            this.fun.wxShare(
              "",
              {},
              {
                title: that.auction.has_one_share && !that.fun.isTextEmpty(that.auction.has_one_share.share_title) ? that.auction.has_one_share.share_title : "",
                imgUrl: that.auction.has_one_share && !that.fun.isTextEmpty(that.auction.has_one_share.share_thumb) ? that.auction.has_one_share.share_thumb : "",
                description: that.auction.has_one_share && !that.fun.isTextEmpty(that.auction.has_one_share.share_desc) ? that.auction.has_one_share.share_desc : ""
              }
            );
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              this.$router.go(-1);
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
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
      this.$dialog.alert({ message: "请点击右上角微信分享" });
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
      $http.post("member.member.wxJsSdkConfig", json).then(
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
      var _title = that.fun.isTextEmpty(that.auction.has_one_share.share_title) ? that.auction.title : that.auction.has_one_share.share_title;
      var _link = document.location.href + "&share_tag=2";
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(that.auction.has_one_share.share_thumb) ? that.auction.thumb : that.auction.has_one_share.share_thumb;
      var _desc = that.fun.isTextEmpty(that.auction.has_one_share.share_desc) ? data.shop.shop.name : that.auction.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    }
  },
  components: {
    cTitle,
    Swipe,
    SwipeItem,
    cMyswipe
  }
};
