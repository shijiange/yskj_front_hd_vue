import cTitle from "components/title";
import cMent from "components/ment";
import cGoodsList from "components/goodsList";
import { Toast } from "vant";

//旧装修
// import showbanner from "components/temp/banner";
// import showsign from "components/temp/showsign";
// import showmenu from "components/temp/menu";
// import showtitle from "components/temp/title";
// import showsearch from "components/temp/search";
// import showline from "components/temp/line";
// import showblank from "components/temp/blank";
// import showrichtext from "components/temp/richtext";
// import showpicture from "components/temp/picture";
// import showcube from "components/temp/cube";
// import showarea from "components/temp/area";
// import showshop from "components/temp/shop";
// import showgoods from "components/temp/goods";
// import shownearbygoods from "components/temp/near_goods";
// import shownotice from "components/temp/notice";
// import showlocation from "components/temp/location";
// import showstore from "components/temp/stores";
// import showcoupon from "components/cupcon";
// import showheadline from "components/topline";
// import showarticle from "components/article";
// import showvideo from "components/temp/video";
import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";

import newcomerAward from "components/newcomer_award"; //新人奖

//新装修
import top_navigation from "components/new_diy/top_navigation";
import U_article from "components/new_diy/article";
import U_backup from "components/new_diy/backup";
import U_blank from "components/new_diy/blank";
import U_button from "components/new_diy/button";
import U_community from "components/new_diy/community";
import U_coupons from "components/new_diy/coupons";
import U_cpssearch from "components/new_diy/cpssearch";
import U_cube from "components/new_diy/cube";
import U_deposit from "components/new_diy/deposit";
import U_form from "components/new_diy/form";
import U_goods from "components/new_diy/goods";
import U_goodscps from "components/new_diy/goodscps";
import U_goodsgroup from "components/new_diy/goodsgroup";
import U_goodsnearby from "components/new_diy/goodsnearby";
import U_goodsrush from "components/new_diy/goodsrush";
import U_goodstores from "components/new_diy/goodstores";
import U_headline from "components/new_diy/headline";
import U_homedata from "components/new_diy/homedata";
import U_line from "components/new_diy/line";
import U_livestreaming from "components/new_diy/livestreaming";
import U_location from "components/new_diy/location";
import U_lottery from "components/new_diy/lottery";
import U_maps from "components/new_diy/maps";
import U_notice from "components/new_diy/notice";
import U_richtext from "components/new_diy/richtext";
import U_search from "components/new_diy/search";
import U_staff from "components/new_diy/staff";
import U_shopfor from "components/new_diy/shopfor";
import U_shortvideo from "components/new_diy/shortvideo";
import U_signin from "components/new_diy/signin";
import U_simplegraph from "components/new_diy/simplegraph";
import U_slideshow from "components/new_diy/slideshow";
import U_stores from "components/new_diy/stores";
import U_storesranking from "components/new_diy/storesranking";
import U_suspendbutton from "components/new_diy/suspendbutton";
import U_tabcontrol from "components/new_diy/tabcontrol";
import U_title from "components/new_diy/title";
import U_video from "components/new_diy/video";
import U_stargroup from "components/new_diy/stargroup";
import U_foot from "components/new_diy/foot";
import U_moretabcontrol from "components/new_diy/multistageTab";
import U_selfpick from "components/new_diy/selfpick";
import U_wechatcode from "components/new_diy/wechatcode";
import U_bonuspool from "components/new_diy/bonusPoolsShow";

window.firstAdvertisement = 1; //弹出周期设置为关闭网页(弹窗广告)
window.secondAdvertisement = 1; //弹出周期设置为关闭网页（全屏广告）

const documentElement = document.documentElement;
const body = document.body;
export default {
  data() {
    return {
      home_default: "",
      old_decorate: "",
      posterShow: false,
      address: "",
      city: "",
      point: {},
      fullShow: false,
      timer: null,
      popShow: false,
      amout: false,
      follow_mode: {}, //引导关注
      category: [],
      goodsListData: [],
      ads: [],
      isfollow: false,
      pageinfo: "",
      isMiniApp: false,
      sliderNav: {},
      advertisement: {},
      isInDiy: 0,
      showNewcomerAward: false, //新人奖弹窗
      newcomerAward_data: {}, //新人奖活动信息

      isDecorate: false, //是否新装修
      clientWidth: "375",
      id: "M" + new Date().getTime(),
      advertising: {},
      full_screen: {},
      top_info: {},
      bottom_info: "",
      components: [],
      page_id: "",
      page_info: {},
      isBottom: false,
      btnFlag: false,

      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: "",

      showPage: false,
      scrollTopTab: "",
      isInitVideoScrollFn: true,//true,则还未进行初始化，可触发initVideoScrollFn
      userID:0,
      fatherTitle:''
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "goods" || from.name === "grab_group" || from.name === "newRetailSalesGood") {
      if (toGoodListIOS) {
        toGoodListIOS({ body: "toGoodListIOS" });
      }
    }
    next();
  },
  mounted() {
    localStorage.setItem("isset", 1);
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }
    window.HomeScrollTop = 0;
    // this.guideFollow();
  },
  beforeRouteLeave(to, from, next) {
    //诸葛统计
    zhuge.endTrack('商城首页停留时长');
    window.HomeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  deactivated() {
    clearTimeout(this.timer);
    this.timer = null;
    window.removeEventListener("scroll", this.debounce(this.handleScroll, 50));
  },
  activated() {

    //诸葛统计
    //console.log('uid:'+window.localStorage.uid);
    //通过接口获取用户信息
    if(window.localStorage.uid){
        $http.get("member.member.getMemberDetailInfo", { uid: window.localStorage.uid }, " ")
        .then(response => {
          if (response.result === 1) {
            zhuge.track('进入首页',{
              '用户id':''+window.localStorage.uid,
              '用户昵称':response.data.nickname,
              '手机号':response.data.mobile,
              '会员等级':response.data.level_name
            });
            zhuge.identify(''+window.localStorage.uid,{
              '用户昵称':response.data.nickname,
              '手机号':response.data.mobile,
              '会员等级':response.data.level_name
            });
          }else{
            zhuge.track('进入首页');
          }
            
        });
    }else{
      zhuge.track('进入首页');
    }


    
    zhuge.startTrack('商城首页停留时长'); 
    this.posterShow = false;
    this.fullShow = false;
    this.popShow = false;
    this.advertisement = {};
    window.addEventListener("scroll", this.debounce(this.handleScroll, 50));

    if (this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    } else {
      this.clientWidth = document.body.clientWidth;
    }

    if (window.__wxjs_environment === "miniprogram") {
      window.isMiniprogram = true;
    }
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }
    if (this.fun.getTyep() == 7) this.fun.setWXTitle(this.$store.state.temp.item.janst || "刷新中");
    wx.miniProgram &&
      wx.miniProgram.postMessage({
        data: { goods_title: this.$store.state.temp.item.janst }
      });

    this.sliderNav = this.$store.state.temp.item.topmenu;

    window.isInHome = 1; // 判断是否进入了首页
    if (!this.sliderNav && this.$store.state.temp.item.is_decorate !== 1) {
      this.sliderNav = {};
      this.tempInfo();
    } else if (window.isInDiy || window.HomeScrollTop == 0) {
      this.isInDiy = 1;
      window.isInDiy = 0;
      this.tempInfo();
    } else {
      if (window.location.href.indexOf("#/home?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.HomeScrollTop);
        }, 200);
      }
    }
    if (window.GDTArr && window.GDTArr.length > 0) {
      TencentGDT.NATIVE.renderAd(window.GDTArr[0]);
      window.GDTArr.splice(0, 1);
      this.lookGDT(); //请求接口记录已观看，用于广告返利
    }
  },
  methods: {
    getParams() {
      let that = this;
      let _url = document.location.href;
      // 要用post  链接太长
      $http
        .post("home-page.get-params", { url: _url }, " ")
        .then(response => {
          if (response.result === 1) {
            if (this.showNewcomerAward) {
              if (response.data.advertisement && response.data.advertisement.advertisement) {
                this.advertisement = response.data.advertisement.advertisement;
              }
            } else {
              if (response.data.advertisement && response.data.advertisement.advertisement && !window.isDecorate) {
                this.getAdvertise(response.data.advertisement.advertisement);
              } else if (window.isDecorate) {
                if (this.advertising && this.advertising.id && window.firstAdvertisement === 1 && this.advertising.show_rule === 1) {
                  window.firstAdvertisement = 0;
                  this.popShow = true;
                  this.$nextTick(() => {
                    this.initAdvertising();
                  });
                }
              } else {
                this.$route.meta.foot = false;
                this.$emit("changeFoot", this.$route.meta.foot);
              }
            }
            // 刷新页面时，在这刷新顶部菜单栏
            this.sliderNav = this.$store.state.temp.item.topmenu ? this.$store.state.temp.item.topmenu : {};

            this.guideFollow(response.data.guide);
          } else {
            if (response.msg == "站点已关闭") {
              that.$dialog.alert({ message: response.msg });
            }
            console.log(response.msg);
          }
        })
        .catch(err => {
          console.error(err, "app");
        });
    },

    // 获取装修或者是默认的数据
    tempInfo() {
      let that = this;
      this.showPage = false;
      $http.get("plugin.overseas.frontend.home-page.index", {}, "加载中").then(
        response => {
          if (!response) return;
          if (response.result === 1) {
            this.showPage = true;

            this.showNewcomerAward = false;
            this.newcomerAward_data = {};
            try {
              //第一次进入首页并带参数basic_info，并符合新人奖条件
              if (response.basic_info && response.basic_info.home.plugin && response.basic_info.home.plugin.new_member_prize) {
                this.newcomerAward_data = response.basic_info.home.plugin.new_member_prize;
              }
            } catch (err) {
              console.log(err);
            }
            try {
              //第一次不是进入首页但符合新人奖条件，返回首页后显示
              let _new_member_prize = JSON.parse(window.localStorage.getItem("new_member_prize"));
              if (_new_member_prize && !this.fun.isTextEmpty(_new_member_prize.prize)) {
                this.showNewcomerAward = true;
              }
            } catch (err) {
              console.log(err);
            }

            if (response.basic_info && !this.fun.isTextEmpty(this.newcomerAward_data.prize)) {
              //第一次进入首页并带参数basic_info，并符合新人奖条件
              // this.newcomerAward_data = response.basic_info.home ? response.basic_info.home.plugin.new_member_prize : {}
              this.showNewcomerAward = true;
            }
            // else if (!this.fun.isTextEmpty(response.data.plugin.new_member_prize) && !this.fun.isTextEmpty(response.data.plugin.new_member_prize.prize)) {
            //   //有多个新人奖活动，不是第一次领取新人奖
            //   this.newcomerAward_data = response.data.plugin.new_member_prize;
            //   this.showNewcomerAward = true;
            // }
            else if (this.showNewcomerAward) {
              //第一次不是进入首页但符合新人奖条件，返回首页后显示
              this.newcomerAward_data = JSON.parse(window.localStorage.getItem("new_member_prize"));
            }
            if (window.location.href.indexOf("#/home?") > -1 && that.isInDiy == 1) {
              // diy页面返回首页，也要跳转到记录的高度
              setTimeout(() => {
                window.scrollTo(0, window.HomeScrollTop);
              }, 200);
            }
            that.isInDiy = 0;
            if (!response.data.default) {
              if (response.data.item.is_decorate === 1) {
                this.page_id = response.data.item.id;
                if (response.data.item.page) {
                  this.total_page = response.data.item.page.total_page;
                  this.current_page = response.data.item.page.current_page;
                  this.lastIndex = response.data.item.page.count - 1;
                  this.isLoadMore = true;
                }

                let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community", "U_homedata", "U_storesranking","U_goodstores"];
                // this.$store.commit("setNewDiyData", response.data.item);
                this.page_info = response.data.item.page_info;
                response.data.item.janst =
                  response.data.item.page_info && response.data.item.page_info.page_title
                    ? response.data.item.page_info.page_title
                    : this.$store.state.temp.mailInfo
                    ? this.$store.state.temp.mailInfo.name
                    : "商城";

                this.components = response.data.item.datas;
                if (this.components && this.components.length > 0) {
                  this.components.map(item => {
                    if (needLocations.includes(item.component_key)) {
                      if (YDB) {
                        //云打包APP调用SDK获取地理位置
                        YDB.GetGPS("DoWithYDBGPS");
                        //云打包APP调用SDK获取手机设备uid
                        YDB.GetDeviceInformation("senduid");
                      }
                      this.isLocation = true;
                    }
                  });
                }

                // if (this.isLocation) {
                // 组件里面已经有定位
                //   this.fun.getLocation();
                // }

                if (response.data.item.page_info) {
                  //弹窗广告
                  this.advertising = response.data.item.page_info.advertising_id || {};
                  if (this.advertising.id && this.advertising.datas) {
                    this.advertising.datas = JSON.parse(this.advertising.datas);
                  }

                  // 全屏广告
                  this.full_screen = response.data.item.page_info.full_screen_id || {};
                }

                //弹窗广告
                this.getParams();

                if (this.full_screen && this.full_screen.id && window.secondAdvertisement === 1 && this.full_screen.show_rule === 1) {
                  window.secondAdvertisement = 0;
                  this.fullShow = true;
                  this.countDown(this.full_screen.show_time);
                }

                if (response.data.item.top && response.data.item.top.id) {
                  this.top_info = JSON.parse(response.data.item.top.page_info);
                }

                if (this.fun.isCPS() && this.fun.isCPSAPPI() && response.data.item.cps_foot_type) {
                  if (response.data.item.cps_foot_type == -1) {
                    // 不显示
                    this.bottom_info = "";
                  } else if (response.data.item.cps_foot_type == 1) {
                    // 显示默认
                    if (!response.data.item.foot) {
                      // 显示系统默认
                      this.bottom_info = {
                        defaultData: true
                      };
                    } else {
                      // 显示列表设置的默认
                      if (response.data.item.foot && response.data.item.foot.page_info) {
                        this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                      } else {
                        this.bottom_info = {
                          defaultData: true
                        };
                      }
                    }
                  } else if (response.data.item.cps_foot_type == 2) {
                    // 显示自定义的底部导航
                    if (response.data.item.foot && response.data.item.foot.id) {
                      this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                    }
                  }
                } else {
                  // 首页的底部有三种情况
                  if (response.data.item.foot_type == -1) {
                    // 不显示
                    this.bottom_info = "";
                  } else if (response.data.item.foot_type == 1) {
                    // 显示默认
                    if (!response.data.item.foot) {
                      // 显示系统默认
                      this.bottom_info = {
                        defaultData: true
                      };
                    } else {
                      // 显示列表设置的默认
                      if (response.data.item.foot && response.data.item.foot.page_info) {
                        this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                      } else {
                        this.bottom_info = {
                          defaultData: true
                        };
                      }
                    }
                  } else if (response.data.item.foot_type == 2) {
                    // 显示自定义的底部导航
                    if (response.data.item.foot && response.data.item.foot.id) {
                      this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                    }
                  }
                }

                this.isDecorate = true;
              } else {
                for (let j of response.data.item.data) {
                  j.temp = "show" + j.temp;
                  if (j.temp == "showlocation" || j.temp == "showstore" || j.temp == "showbusiness") {
                    that.isLocation = true;
                  }
                }
                //弹窗广告
                this.getParams();
                response.data.item.janst = response.data.item.pageinfo.params.title || this.$store.state.temp.mailInfo.name;
                this.sliderNav = response.data.item.topmenu;
                this.old_decorate = response.data.item;
                this.$store.commit("tempItemIndex", this.old_decorate);
              }
            } else {
              this.home_default = response.data.default || {};
              response.data.item.janst = this.$store.state.temp.mailInfo.name;
              //弹窗广告
              this.getParams();
            }
            // this.$store.commit("tempIndex", response.data);
            // window.localStorage.setItem("tempIndex", JSON.stringify(response.data));  存vuex里不存localStorage
            this.fun.setWXTitle(response.data.item.janst || "欢迎使用");
            this.$store.commit("setWatchDiypage", response.data.item.pageinfo.params.allowauth);
            this.initShare_v2();
            if (response.data.item.pageinfo.params.allowauth == 0 && response.data.item.page_info.member_level_url && response.data.item.page_info.member_level_url.link) {
              this.timer = setTimeout(() => {
                clearTimeout(this.timer);
                window.location.href = response.data.item.page_info.member_level_url.link;
              }, 3000);
            }
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          console.log(response);
        }
      );
      this.fatherTitle = document.title;
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", { decorate_page: this.current_page, decorate_id: this.page_id }, "..").then(response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.components = this.components.concat(response.data.datas);
          } else {
            this.isLoadMore = false;
            this.current_page = this.current_page - 1;
          }
        });
      } else {
        console.log("加载完了");
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log("图片加载出错");
        };
      }
    },
    initAdvertising() {
      let that = this;
      this.getImg(this.advertising.image, function(scale) {
        // 图片加载完后获取图片高度
        let script = document.createElement("script");
        script.type = "text/wxtag-template";
        script.text = `<div style="width: ${that.clientWidth * 0.65}px;height: ${that.clientWidth * 0.65 * scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    toatten() {
      if (this.follow_mode.type == "1") {
        window.location.href = this.follow_mode.url;
      } else {
        this.posterShow = true;
      }
    },
    cloneNewcomerAward(data) {
      // this.$store.commit("setNewcomerAward", false);
      window.localStorage.removeItem("new_member_prize");
      this.showNewcomerAward = false;
      if (this.advertisement) {
        this.getAdvertise(this.advertisement);
      } else if (this.advertising) {
        if (this.advertising && this.advertising.id && window.firstAdvertisement === 1) {
          window.firstAdvertisement = 0;
          this.popShow = true;
          this.$nextTick(() => {
            this.initAdvertising();
          });
        }
      } else {
        this.$route.meta.foot = false;
        this.$emit("changeFoot", this.$route.meta.foot);
      }
    },
    //关注方法
    guideFollow(data) {
      // $http.get("member.member.guideFollow").then(
      //   response => {
      if (data) {
        this.isfollow = true;
        this.follow_mode = data;
      } else {
        this.follow_mode = false;
      }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    },
    tosearch() {
      //this.$router.push(this.fun.getUrl("search", { fromHome: 1 }));
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(body.clientHeight, documentElement.clientHeight);
      } else {
        clientHeight = Math.max(body.clientHeight, documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    debounce(fn, delay) {
      let last, deferTimer
        return function (args) {
            let that = this
            let _args = arguments
            let now = +new Date()
            if (last && now < last + delay) {
                clearTimeout(deferTimer)
                deferTimer = setTimeout(function () {
                    last = now
                    fn.apply(that, _args)
                }, delay)
            }else {
                last = now
                fn.apply(that,_args)
            }
        }
    },
    handleScroll() {
      var top = document.documentElement.scrollTop || document.body.scrollTop;
      top < 50 ? (this.amout = false) : (this.amout = true);
      this.scrollTopTab = top;
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 60) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }

      //滚动事件触发
      if (Number(this.getScrollTop() + this.getClientHeight() + 105) >= this.getScrollHeight()) {
        if (this.isLoadMore) {
          this.getMoreDecorate();
        }
        //此处发起请求
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }

      this.videoScrollHandle(); //监听处理视频组件逻辑
    },
    videoScrollHandle() {
      //监听处理视频组件，当视频组件不在可视区时，视频暂停播放，且暂停页面渲染
      // const runInArr = [];
      if (!this.$refs.U_video) {
        return;
      }
      const videoRefArr = this.$refs.U_video || [];
      videoRefArr.forEach((item, index) => {
        const offset = item.$el.getBoundingClientRect();
        const offsetTop = offset.top + 200;
        const offsetBottom = offset.bottom;
        if (offsetTop - 200 <= window.innerHeight && offsetBottom >= 0) {
          item.showComponent(); //进入可视区域
        } else {
          item.pauseFn(); //移出可视区域，暂停视频
        }
      });
    },
    pauseVideoOther(_id) {
      //只保留当前点击的视频播放，暂停其他视频的播放
      if (!this.$refs.U_video) {
        return;
      }
      const videoRefArr = this.$refs.U_video || [];
      videoRefArr.forEach((item, index) => {
        if (item.id != _id) item.pauseFn();
      });
    },
    initVideoScrollFn(){
      this.$nextTick(() => {
        this.videoScrollHandle();
      });
    },
    //banner点击
    bannerClick(item) {
      if (!this.fun.isTextEmpty(item.link)) {
        window.location.href = item.link; //跳转
      }
    },

    //旧装修--方法--开始
    gotoBrand(item) {
      this.$router.push(this.fun.getUrl("brandgoods", { id: item.id, fromHome: 1 }));
    },
    gotoTimeGood(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    gotoAdvs(link) {
      if (!this.fun.isTextEmpty(link)) {
        window.location.href = link; //跳转
      }
    },
    //显示首屏广告和弹窗广告
    getAdvertise(data) {
      // $http.get("member.member.getAdvertisement").then(response => {
      if (data) {
        this.advertisement = data;

        if (this.advertisement.Midswitch) {
          if (this.advertisement.Midrule === 0 && window.firstAdvertisement === 1) {
            // this.$route.meta.foot = false;
            // this.$emit("changeFoot", this.$route.meta.foot);
            this.popShow = true;
            window.firstAdvertisement = 0;
          } else {
            // this.$route.meta.foot = false;
            // this.$emit("changeFoot", this.$route.meta.foot);
          }
        }

        if (this.advertisement.switch) {
          if (this.advertisement.rule === 0 && window.secondAdvertisement === 1) {
            this.$route.meta.foot = true;
            this.fullShow = true;
            this.$emit("changeFoot", this.$route.meta.foot);
            this.countDown(this.advertisement.time);
            window.secondAdvertisement = 0;
          } else {
            this.$route.meta.foot = false;
            this.$emit("changeFoot", this.$route.meta.foot);
          }
        } else {
          this.$route.meta.foot = false;
          this.$emit("changeFoot", this.$route.meta.foot);
        }
      } else {
        this.$route.meta.foot = false;
        this.$emit("changeFoot", this.$route.meta.foot);
      }
      // });
    },
    close() {
      this.fullShow = false;
    },
    closePop() {
      this.popShow = false;
    },
    countDown(num) {
      this.full_screen.show_time = num;
      this.advertisement.time = num;
      --num;
      this.timer = setTimeout(() => {
        if (num <= 0) {
          this.fullShow = false;
          this.$route.meta.foot = false;
          this.$emit("changeFoot", this.$route.meta.foot);
        } else {
          this.countDown(num);
        }
      }, 1000);
    },
    turnTo() {
      if (this.advertisement.link) {
        if (this.advertisement.link === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertisement.link;
        }
      }
    },

    turnFullTo() {
      if (this.full_screen.h_url) {
        if (this.full_screen.h_url !== window.location.href) {
          window.location.href = this.full_screen.h_url;
        }
      }
    },
    turnTo2() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },
    refreshComponent(e) {
      // console.log("有子组件触发", e);
      if (e) {
        if (e.type == "selfpick") {
          this.initShare_v2();
        } else if (e.type == "video") {
          this.pauseVideoOther(e.id); //只保留当前点击的视频播放，暂停其他视频的播放
        } else if (e.type == "initVideo") {
          if(this.isInitVideoScrollFn){
            this.isInitVideoScrollFn = false;
            this.initVideoScrollFn(); //isInitVideoScrollFn为true,则还未进行初始化，触发initVideoScrollFn，判断视频位置
          }
        }
      }
    },
    initShare_v2() {
      if (this.page_info.page_title && window.isDecorate) {
        //新装修
        this.fun.wxShare(
          "",
          { mid: this.fun.getKeyByMid() },
          {
            title: this.page_info.page_title || null,
            imgUrl: this.page_info.page_icon || null,
            description: this.page_info.page_description || null
          }
        );
      } else {
        this.fun.wxShare();
      }
    },
    // 初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => {});
    },
    share(data) {
      let that = this;
      data.config.openTagList = ["wx-open-launch-weapp"];
      console.log("打印home组件app分享", data.config);
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";

        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = "";
        let _desc = "";

        // 分享优先级： 单页设置（例如商品，拓客活动）> 店铺装修页面设置（仅限装修页面或者设置为首页的装修页面）data.share.title > 全局设置data.shop.share.title > 商城名称data.shop.shop.name
        if (data.share && data.share.title && !window.isDecorate) {
          // 旧装修页面有设置标题
          _title = that.fun.isTextEmpty(data.share.title) ? data.shop.shop.name : data.share.title;
          _imgUrl = that.fun.isTextEmpty(data.share.icon) ? data.shop.icon : data.share.icon;
          _desc = that.fun.isTextEmpty(data.share.desc) ? data.shop.shop.name : data.share.desc;
        } else if (that.page_info.page_title && window.isDecorate) {
          //新装修
          _title = that.fun.isTextEmpty(that.page_info.page_title) ? data.shop.share.title : that.page_info.page_title;
          _imgUrl = that.fun.isTextEmpty(that.page_info.page_icon) ? data.shop.share.icon : that.page_info.page_icon;
          _desc = that.fun.isTextEmpty(that.page_info.page_description) ? data.shop.share.desc : that.page_info.page_description;
        } else {
          // 全局标题
          _title = that.fun.isTextEmpty(data.shop.share.title) ? data.shop.shop.name : data.shop.share.title;
          _imgUrl = that.fun.isTextEmpty(data.shop.share.icon) ? data.shop.icon : data.shop.share.icon;
          _desc = that.fun.isTextEmpty(data.shop.share.desc) ? data.shop.shop.name : data.shop.share.desc;
        }

        // _title = _title.trim();
        // _imgUrl = _imgUrl.trim();
        // _desc = _desc.trim();
        console.log("qiang," + _title + "," + _imgUrl + "," + _desc);

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
    lookGDT() {
      $http.get("plugin.qq-advertise.frontend.advertise.look", {}, "").then(response => {
        if (response.result == 0) {
          console.log("lookGDT() error::::", response);
        }
      });
    }
  },

  components: {
    cTitle,
    cMent,
    cGoodsList,
    cMyswipe,
    Swipe,
    SwipeItem,
    newcomerAward,

    //旧装修弃用了
    // showflashsale: () => import('../../components/time_limit'),
    // showbusiness: () => import('../../components/temp/business'),
    // showassemble: () => import('../../components/time_group'),
    // showdiyform: () => import('../../components/temp/form'),
    // showlivestreaming: () => import('../../components/temp/livestreaming'),
    // showtogetherpurchase: () => import('../../components/temp/group_buy'),
    // showbanner,
    // showsign,
    // showmenu,
    // showtitle,
    // showsearch,
    // showline,
    // showblank,
    // showrichtext,
    // showpicture,
    // showcube,
    // showarea,
    // showshop,
    // showgoods,
    // shownearbygoods,
    // shownotice,
    // showlocation,
    // showstore,
    // showcoupon,
    // showheadline,
    // showarticle,
    // showvideo,

    //新装修
    top_navigation,
    U_article,
    U_backup,
    U_blank,
    U_button,
    U_community,
    U_coupons,
    U_cpssearch,
    U_cube,
    U_deposit,
    U_form,
    U_goods,
    U_goodscps,
    U_goodsgroup,
    U_goodsnearby,
    U_goodsrush,
    U_goodstores,
    U_headline,
    U_homedata,
    U_line,
    U_livestreaming,
    U_location,
    U_lottery,
    U_maps,
    U_notice,
    U_richtext,
    U_search,
    U_staff,
    U_shopfor,
    U_shortvideo,
    U_signin,
    U_simplegraph,
    U_slideshow,
    U_stores,
    U_storesranking,
    U_suspendbutton,
    U_tabcontrol,
    U_title,
    U_video,
    U_stargroup,
    U_foot,
    U_moretabcontrol,
    U_selfpick,
    U_wechatcode,
    U_bonuspool
  }
};
