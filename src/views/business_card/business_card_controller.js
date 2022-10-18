import cTitle from "components/title";
import cLive from "components/goods/children/liveList";
import cVideo from "components/video_waterfall";
import cFlow from "components/Waterfalls_flow";
import storelist02 from "components/temp/storelist02";
import { scrollMixin } from "utils/mixin";

import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,

      cisLoadMore: true,
      cPage: 1,
      cTotal_page: 0,

      roomIsLoadMore: true,
      roomPage: 1,
      roomTotal_page: 0,

      ArticleIsLoadMore: true,
      ArticlePage: 1,
      ArticleTotal_page: 0,
      // 我的贴子
      newClassification: [],
      isVideo: [],
      isArticle: [],

      toolbar: false,
      AllData: {},
      show1: false,
      award: null,
      voice: "",
      playAudio: false,
      custom_name: {
        love_name: "",
        point_name: ""
      },
      card_id: "",
      visit_id: "",
      cardData: {
        picture: []
      },
      areas: "",
      clickStatus: {},
      nums: {
        visit_statistics: {}
      },
      goods: [],
      cardType: "",
      shop_owner: {},

      level_name: "",
      store_name: "",
      active: 0,
      visit: 0,
      collection: 0,
      reliable: 0,

      //供应商
      supplier: null,

      // 门店
      good_page: 1,
      store_good: [],
      coupon_list: [],

      // 招商员
      cardUrl: "",
      cardList_page: 1,
      cardList: [],
      showMore: true,
      member: {},

      income_name_text: "",
      // 导航盒子的高度
      // isintro:false,

      area_name: "",
      //导航
      istapBtn: "intro",
      //开关
      is_trick: "",
      is_video: "",
      is_article: "",
      is_street: "",

      //live more
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [], //直播间列表
      is_room: 0,
      openTemplate: 0
    };
  },
  activated() {
    this.card_id = this.fun.getKey("mark_id");
    // this.playAudio = false;
    this.initData();
    this.getCardDate();
    window.scrollTo(0, 0);
    this.customizeIncome();
  },
  mounted() {
    this.visit_id = localStorage.getItem("uid");
  },
  methods: {
    loadMore2(str) {
      if (str == "postMy") {
        this.cisLoadMore = true;
      } else if (str == "video") {
        this.roomIsLoadMore = true;
      }
    },
    format(shijianchuo) {
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    },
    getMoreData() {
      this.isLoadMore = false;
      this.roomIsLoadMore = false;
      this.ArticleIsLoadMore = false;
      let flag = false;
      let url = "";
      let json = {
        card_id: this.card_id
      };

      if (this.istapBtn == "postMy") {
        url = "plugin.business-card.frontend.controllers.card.paging.tricks";
        if (this.cPage >= this.cTotal_page) {
          this.isLoadMore = true;
        } else {
          this.cPage = this.cPage + 1;
          json.page = this.cPage;
          flag = true;
        }
      } else if (this.istapBtn == "video") {
        url = "plugin.business-card.frontend.controllers.card.paging.videos";
        if (this.roomPage >= this.roomTotal_page) {
          this.isLoadMore = true;
          this.roomIsLoadMore = true;
        } else {
          this.roomPage = this.roomPage + 1;
          json.page = this.roomPage;
          flag = true;
        }
      } else if (this.istapBtn == "text") {
        url = "plugin.business-card.frontend.controllers.card.paging.articles";
        if (this.ArticlePage >= this.ArticleTotal_page) {
          this.isLoadMore = true;
          this.ArticleIsLoadMore = true;
        } else {
          this.ArticlePage = this.ArticlePage + 1;
          json.page = this.ArticlePage;
          flag = true;
        }
      } else {
        url = "plugin.business-card.frontend.controllers.card.paging.rooms";
        if (this.live_page >= this.total_page) {
          this.isLoadMore = true;
          this.showMoreLive = true;
        } else {
          this.live_page = this.live_page + 1;
          json.page = this.live_page;
          flag = true;
        }
      }
      this.cisLoadMore = false;
      if (flag) {
        $http
          .post(url, json, "加载中")
          .then(
            response => {
              this.cisLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.data;
                this.isLoadMore = true;
                if (this.istapBtn == "postMy") {
                  this.newClassification = this.newClassification.concat(myData);
                } else if (this.istapBtn == "video") {
                  this.isVideo = this.isVideo.concat(myData);
                } else if (this.istapBtn == "text") {
                  this.isArticle = this.isArticle.concat(myData);
                } else {
                  this.recordsList = this.recordsList.concat(myData);
                }
              } else {
                this.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    getCardArticle() {
      this.ArticleIsLoadMore = false;
      $http
        .get("plugin.business-card.frontend.controllers.card.paging.articles", { card_id: this.card_id, page: 1 })
        .then(response => {
          if (response.result == 1) {
            this.ArticleIsLoadMore = true;
            this.ArticleTotal_page = response.data.last_page;
            if (this.ArticleTotal_page === 0) {
              this.ArticleIsLoadMore = false;
            }
            this.isArticle = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCardVideo() {
      this.roomIsLoadMore = false;
      $http
        .get("plugin.business-card.frontend.controllers.card.paging.videos", { card_id: this.card_id, page: 1 })
        .then(response => {
          if (response.result == 1) {
            this.roomTotal_page = response.data.last_page;
            if (this.roomTotal_page <= 1) {
              this.roomIsLoadMore = true;
            }
            this.isVideo = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreCommunities() {
      this.cisLoadMore = false;
      $http
        .get("plugin.business-card.frontend.controllers.card.paging.tricks", { card_id: this.card_id, page: 1 })
        .then(response => {
          if (response.result == 1) {
            this.cTotal_page = response.data.last_page;
            // if (this.cTotal_page === 0) {
            this.cisLoadMore = true;
            // }
            this.newClassification = response.data.data;
          }
        })
        .catch(error => {
          this.cisLoadMore = true;
          console.log(error);
        });
    },
    getLiveList(more) {
      let that = this;
      if (!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (more && this.live_page >= this.total_page) {
        that.showMoreLive = false;
        console.log("没有更多直播间数据！");
      } else {
        that.live_page = more ? that.live_page + 1 : 1;
        $http
          .post("plugin.business-card.frontend.controllers.card.paging.rooms", { card_id: this.card_id, page: that.live_page }, "")
          .then(response => {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              if (!more && that.total_page >= 2) {
                that.showMoreLive = true;
              }
              that.recordsList = [...that.recordsList, ...response.data.data];
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    tabChange() {
      if (this.istapBtn == "postMy") {
        if (this.newClassification.length <= 0) {
          this.getStoreCommunities();
        }
      } else if (this.istapBtn == "video") {
        if (this.isVideo.length <= 0) {
          this.getCardVideo();
        }
      } else if (this.istapBtn == "text") {
        if (this.isArticle.length <= 0) {
          this.getCardArticle();
        }
      } else if (this.istapBtn == "live") {
        if (this.recordsList.length <= 0) {
          this.getLiveList(false);
        }
      }
      this.isLoadMore = true;
    },
    toDetail(kid, name) {
      console.log(kid, name);
      if (name == "post") {
        this.$router.push(
          this.fun.getUrl("microCommentDetails", {
            stickId: kid
          })
        );
      } else if (name == "text") {
        this.$router.push(this.fun.getUrl("articleContent", { id: kid.id }));
      }
    },
    // loadNext(str){
    // 	console.log(str)
    // 	if(str == 'intro'){
    // 		this.isintro = true
    // 	}
    // },
    showToolbar() {
      this.toolbar = !this.toolbar;
    },
    end(blob) {
      const that = this;
      this.$refs.audios.src = URL.createObjectURL(blob);
      this.$refs.audios.onended = function() {
        that.playAudio = false;
      };
    },
    playMp3(src) {
      const that = this;
      this.$refs.audios.src = src;
      this.$refs.audios.onended = function() {
        that.playAudio = false;
      };
    },
    playAmr() {
      if (this.$refs.audios.paused) {
        this.playAudio = true;
        this.$refs.audios.play();
      } else {
        this.playAudio = false;
        this.$refs.audios.pause();
      }
    },
    initWithUrl(url) {
      if (this._isInit || this._isInitRecorder) {
        throw new Error("AMR has been initialized. For a new AMR, please generate a new BenzAMRRecorder().");
      }
      const p = new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "application/octet-stream" },
          credentials: "include"
        })
          .then(response => {
            if (response.ok) {
              response.blob().then(function(blob) {
                console.log(blob);
                resolve(blob);
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      });
      return p.then(blob => {
        return blob;
      });
    },
    loadDemoBtn(voice) {
      const that = this;
      // http://localhost:8081/addons/yun_shop/static/app/mario.amr
      // https://dev1.yunzshop.com/addons/yun_shop/storage/app/public/business_card/3f91e0ce6866d86639e81aab8f4951a2_5.amr
      that.initWithUrl(voice).then(data => {
        Recorder.amr2wav(
          data,
          function(blob) {
            that.end(blob);
            console.log("已转码成wav播放");
          },
          function(msg) {
            console.log("转码成wav失败：" + msg);
          }
        );
      });
    },
    initData() {
      this.cardData = {};
      this.show1 = false;
      // this.post_page = 1;
      this.active = 0;
      this.good_page = 1;
      this.store_good = [];
      this.cardUrl = "";
      this.cardList_page = 1;
      this.cardList = [];
      this.showMore = true;
    },
    toCardVisit() {
      this.triggerAction("3");
      this.$router.push(this.fun.getUrl("CardVisit", { card_id: this.card_id }));
    },
    toPage(url) {
      if (url == "CardCode") {
        this.$router.push(this.fun.getUrl(url, { card_id: this.card_id }));
      } else {
        this.$router.push(this.fun.getUrl(url));
      }
    },
    toGood(item) {
      this.$router.push(
        this.fun.getUrl(
          "goods",
          { id: item.id },
          {
            mark: "card",
            mark_id: this.fun.getKey("mark_id")
          }
        )
      );
    },
    toShop(id, str) {
      if (str === "hotel") {
        this.$router.push(this.fun.getUrl("HotelHome", { id: id, fromHome: 1 }));
      } else if (str === "store") {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: id, fromHome: 1 }));
      } else if (str === "supplier") {
        this.$router.push(this.fun.getUrl("SupplierShop", { id: id, fromHome: 1 }));
      }
    },
    toBuy(id) {
      this.$router.push(this.fun.getUrl("cashier_pay", { store_id: id }));
    },
    getGoods() {
      let url = ""; // 供应商
      if (this.cardType === "supplier") {
        url = "plugin.business-card.frontend.controllers.card.card.getSupplierGoods"; // 供应商
      } else if (this.cardType === "shop_owner" || this.cardType === "clerk") {
        url = "plugin.business-card.frontend.controllers.card.card.getStoreGoods"; //门店
      } else {
        return;
      }
      $http
        .get(url, { page: this.good_page, card_id: this.card_id }, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.store_good = this.store_good.concat(response.data.data);
              response.data.current_page >= response.data.last_page ? (this.showMore = false) : (this.showMore = true);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    getList() {
      $http
        .get(this.cardUrl, { page: this.cardList_page, card_id: this.card_id }, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.cardList = this.cardList.concat(response.data.data);
              response.data.current_page >= response.data.last_page ? (this.showMore = false) : (this.showMore = true);
              if (response.data.hasOwnProperty("store_list_style")) {
                this.openTemplate = response.data.store_list_style || 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    loadMore(str) {
      if (str === "good") {
        this.good_page++;
        this.getGoods();
      } else if (str === "list") {
        this.cardList_page++;
        this.getList();
      }
    },
    chooseTab(index, title) {
      this.nowTab = index;
      if (this.cardType === "staff") {
        //招商员
        if (title === "供应商") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getStaffSupplier";
        } else if (title === "门店") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getStaffStore";
        } else if (title === "酒店") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getStaffHotel";
        }
      } else if (this.cardType === "center") {
        //招商中心
        if (title === "供应商") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getCenterSupplier";
        } else if (title === "门店") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getCenterStore";
        } else if (title === "酒店") {
          this.cardUrl = "plugin.business-card.frontend.controllers.card.card.getCenterHotel";
        }
      } else {
        return;
      }
      this.cardList_page = 1;
      this.showMore = true;
      this.cardList = [];
      this.getList();
    },
    getCardDate() {
      let that = this;
      $http
        .get(
          "plugin.business-card.frontend.controllers.card.card.sendCardByRoleId",
          {
            card_id: this.card_id,
            mark: "card",
            mark_id: this.fun.getKey("mark_id")
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.AllData = response.data;
              this.cardData = response.data.card;
              this.award = response.data.award;
              this.member = response.data.result.member;
              this.voice = this.cardData.voice;
              // this.newClassification = response.data.tricks;
              // this.isVideo = response.data.videos;
              // this.isArticle = response.data.articles;
              // 开关
              this.is_trick = response.data.is_trick;
              this.is_video = response.data.is_video;
              this.is_article = response.data.is_article;
              this.is_street = response.data.is_street;
              // this.
              if (this.AllData.banner) {
                this.bacImage = { backgroundImage: "url(" + this.AllData.banner + ")" };
              }
              // if(this.fun.isWeiXin() && this.voice){
              // 	this.voice.endsWith(".mp3") ? this.playMp3(this.voice) : this.loadDemoBtn(this.voice);
              // }
              // if(this.cardData.picture.length<=0){
              // 	this.isintro = true;
              // }
              if (!this.member.member && this.member.name) {
                this.level_name = this.member.name.level_name;
              } else {
                this.level_name = this.cardData.level_name;
              }
              if (this.award) {
                this.show1 = true;
                this.custom_name = response.data.result.member.custom_name;
              }
              if (response.data.is_street === "1" && this.cardData.areas[0]) {
                this.areas = this.cardData.areas[0] + this.cardData.areas[1] + this.cardData.areas[2] + this.cardData.areas[3] + this.cardData.address;
              } else if (this.cardData.areas[0]) {
                this.areas = this.cardData.areas[0] + this.cardData.areas[1] + this.cardData.areas[2] + this.cardData.address;
              }
              this.visit = response.data.result?.member?.achievement?.visit_statistics?.visit;
              this.collection = response.data.card.card_statistics?.collection;
              if (this.collection >= 10000) {
                this.collection = (this.collection / 10000).toFixed(1) + `w`;
              }
              this.reliable = response.data.card?.card_statistics?.reliable;
              this.setData(response.data.result.member);
              if (this.member.is_supplier == 1) {
                this.chooseTab(0, "供应商");
              } else if (this.member.is_store == 1) {
                this.chooseTab(1, "门店");
              } else if (this.member.is_hotel == 1) {
                this.chooseTab(2, "酒店");
              }

              this.getGoods();
              this.visit_id = response.data.result.member?.self;
              this.clickStatus = response.data.result.member?.status;
              this.nums = response.data.result.member?.achievement;
              this.goods = response.data.result.member?.goods;
              // this.initShare();
              this.fun.wxShare(
                "",
                {},
                {
                  title: `您好，这是【${that.cardData.card_name || ""}】的名片，望惠存`,
                  link: that.AllData.share_url,
                  imgUrl: that.cardData.card_avatar ? that.cardData.card_avatar : "",
                  description: that.fun.isTextEmpty(that.cardData.introduction) ? "什么也没写~" : that.cardData.introduction
                }
              );
              if (response.data.is_room && response.data.is_room == 1) {
                this.is_room = 1;
                // this.getLiveList(false);
              }
            } else {
              Toast(response.msg);
              if (response.msg != "请登录") {
                this.$router.push(this.fun.getUrl("home"));
              }
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    setData(data) {
      if (data.member) {
        this.cardType = "member";
      } else if (data.team_dividend) {
        this.cardType = "team_dividend";
      } else if (data.commission) {
        this.cardType = "commission";
      } else if (data.staff) {
        this.cardType = "staff";
      } else if (data.center) {
        this.cardType = "center";
      } else if (data.area_dividend) {
        this.cardType = "area_dividend";
        if (data.name) {
          this.level_name = data.name.level_name;
        } else {
          this.level_name = data.area_dividend.level_name;
        }
      } else if (data.supplier) {
        this.cardType = "supplier";
        this.supplier = data.supplier;
        if (data.name) {
          this.level_name = data.name.level_name;
        } else {
          this.level_name = data.supplier.store_name;
        }
      } else if (data.shop_owner) {
        this.cardType = "shop_owner";
        this.store_name = data.shop_owner.store_name;
        this.shop_owner = data.shop_owner;
        this.coupon_list = data.coupon;
      } else if (data.clerk) {
        this.cardType = "clerk";
        this.store_name = data.clerk.store_name;
        this.coupon_list = data.coupon;
      }
    },
    selectedcoupon(item, index) {
      if (item.received === 3) {
        return;
      }
      //领取
      var that = this;
      $http.get("plugin.store-cashier.frontend.store.couponGet.index", { coupon_id: item.id }, "正在抢此优惠券").then(
        function(response) {
          if (response.result === 1) {
            let temp = response.data;
            that.$set(that.coupon_list, index, temp);
            that.$dialog.alert({ message: "领取成功" });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    changeLike(type) {
      $http
        .get("plugin.business-card.frontend.controllers.action.card-action.index", { card_id: this.card_id, card_type: type }, " ")
        .then(
          response => {
            if (response.result === 1) {
              if (type === "1") {
                this.clickStatus.collected = response.data;
              } else {
                this.clickStatus.reliabled = response.data;
              }
              this.getCardDate();
            } else {
              Toast("不能给自己点赞");
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    triggerAction(type) {
      $http
        .get("plugin.business-card.frontend.controllers.action.card-pre-action.index", { card_id: this.card_id, card_type: type })
        .then(
          response => {
            if (response.result === 1) {
              console.log(response);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    //复制邀请码
    onCopy: function(e) {
      this.triggerAction("4");
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function(e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(
          response => {
            if (response.result === 1) {
              this.share(response.data);
            } //else {
            //}
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    //组装分享设置
    share(data) {
      let that = this;
      // alert(that.AllData.share_url);
      wx.config(data.config);
      wx.ready(function() {
        let _title = `您好，这是【${that.cardData.card_name || ""}】的名片，望惠存`;
        let _link = that.AllData.share_url;
        // _link = that.fun.isMid(_link, that.fun.getKeyByMid());

        let _imgUrl = that.cardData.card_avatar;
        let _desc = that.fun.isTextEmpty(that.cardData.introduction) ? "什么也没写~" : that.cardData.introduction;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
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
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle, cLive, cVideo, cFlow, storelist02 }
};
