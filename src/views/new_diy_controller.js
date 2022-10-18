// import { Toast } from "vant";
import U_tabcontrol from "components/new_diy/tabcontrol.vue";
import top_navigation from "components/new_diy/top_navigation";

const documentElement = document.documentElement;
const body = document.body;
window.page_idAdvertisings = []; // 浏览周期内只显示一次
window.page_idFull_screens = [];

export default {
  data() {
    return {
      page_id: "",
      clientWidth: "375",
      page_name: "",
      isInHome: 0,
      id: "M" + new Date().getTime(),
      fullShow: false,
      popShow: false,
      advertising: {},
      full_screen: {},
      top_info: {},
      bottom_info: "",
      components: [],

      showPage: true,
      isBottom: false,
      btnFlag: false,
      isMounted: false,

      current_page: 1,
      total_page: 0,
      isLoadMore: true,
      lastIndex: "",

      is_store: false, //是否门店的装修
      isInitVideoScrollFn: true,//true,则还未进行初始化，可触发initVideoScrollFn

      // "gh_id": "gh_cdb1a2dfcd17",
      // "minApp_link": "/pages/index/index.html",
     fatherTitle:""
    };
  },
  mounted() {
    window.diyHomeScrollTop = 0;
    this.isInHome = 1;
    this.getTemp();
    // mounted 肯定是第一次进来
    this.isMounted = true;
  },
  activated() {
    if (this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    } else {
      this.clientWidth = document.body.clientWidth;
    }
    //console.log(window.page_id);
    //console.log(this.fun.getKey("page_id"));
   // console.log(window.isInHome);
    if (window.page_id != this.fun.getKey("page_id") || window.isInHome) {
      if (!this.isMounted) {//this.isMounted=false  不是第一次进来
        // mounted 请求了这里就不请求
        this.fun.setWXTitle("");
        this.isInHome = 1;
        this.getTemp();
      }
      this.getTemp();
      setTimeout(()=>{
        let titleDiy = this.fatherTitle;
      //console.log(33333); 
     // console.log(titleDiy);
      zhuge.track('进入'+titleDiy+'页面');
      zhuge.startTrack(titleDiy+'首页停留时长');
      },2000);
    } else {//不执行getTemp（）
      let title = window.localStorage.getItem("diypage_title");
      this.fun.setWXTitle(title);
      if (window.location.href.indexOf("#/newDiy?") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.diyHomeScrollTop);
        }, 200);
      }

     // console.log(2222);
      //console.log(title);
      zhuge.track('进入'+title+'页面');
      zhuge.startTrack(title+'首页停留时长');
    }

    if (this.isMounted) {
      // 防止下次进入同样的页面还请求
      this.isMounted = false;
    }
    this.page_id = this.fun.getKey("page_id");
    window.page_id = this.fun.getKey("page_id");
    window.isInDiy = 1; // 判断是否进入了装修页
    window.addEventListener("scroll", this.debounce(this.handleScroll, 50));
  },
  deactivated() {
    window.removeEventListener("scroll", this.debounce(this.handleScroll, 50));
    //诸葛统计
    let titleDiy = window.localStorage.getItem("diypage_title");
    //console.log(titleDiy);
    zhuge.endTrack(titleDiy+'首页停留时长');
  },
  beforeRouteLeave(to, from, next) {
    window.diyHomeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
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
        script.text = `<div style="width: ${that.clientWidth * 0.65}px;height: ${(that.clientWidth * 0.65) * scale}px;"></div>`;
        that.advertising.html = `<wx-open-launch-weapp username="${that.advertising.s_id}" path="${that.advertising.s_url}">${script.outerHTML}</wx-open-launch-weapp>`;
        that.$forceUpdate();
      });
    },
    //获取装修信息
    getTemp() {
      this.showPage = false;
      let url = "home-page.index";
      let json = { page_id: this.fun.getKey("page_id") };
      this.is_store=false;
      if(this.fun.getKey("store_id")) {
        this.is_store=true;
        url = "plugin.store-cashier.frontend.store.get-store-info.get-the-provider";
        json = { page_id: this.fun.getKey("page_id"), store_id: this.fun.getKey("store_id") };
      }
      $http
        .get(url, json, "loading")
        .then(
          response => {
            if (!response) return;
            if(this.is_store && response.data.store_decorate && response.data.store_decorate.datas) {
              // 门店装修
              this.showPage = true;
              this.components = response.data.store_decorate.datas;
              this.store_pageInfo = response.data.store_decorate.page_info;
              this.page_name = this.store_pageInfo && this.store_pageInfo.page_title ? this.store_pageInfo.page_title : this.$store.state.temp.mailInfo.name;

              // 门店的底部有三种情况
              if (response.data.store_decorate.foot_type == -1) {
                // 不显示
                this.bottom_info = "";
              } else if (response.data.store_decorate.foot_type == 1) {
                // 显示默认
                if (!response.data.store_decorate.foot_id) {
                  // 显示系统默认
                  this.bottom_info = {
                    defaultData: true
                  };
                } else {
                  // 显示列表设置的默认
                  if(response.data.store_decorate.foot_id && response.data.store_decorate.foot_id.page_info) {
                    this.bottom_info = JSON.parse(response.data.store_decorate.foot_id.page_info);
                  }else {
                    this.bottom_info = {
                      defaultData: true
                    };
                  }
                }
              } else if (response.data.store_decorate.foot_type == 2) {
                // 显示自定义的底部导航
                if (response.data.store_decorate.foot_id instanceof Array) {
                  this.bottom_info = {};
                } else {
                  this.bottom_info = JSON.parse(response.data.store_decorate.foot_id.page_info);
                }
              }
              this.shareInfo = response.data.store_decorate.page_info || {};
              this.getShareData();
              this.fun.setWXTitle(this.page_name);
              return;
            }

            if (response.data.item) {
              this.showPage = true;
              if (response.data.item.page) {
                this.total_page = response.data.item.page.total_page;
                this.current_page = response.data.item.page.current_page;
                this.lastIndex = response.data.item.page.count - 1;
                this.isLoadMore = true;
              }
              let needLocations = ["U_location", "U_stores", "U_goodsnearby", "U_community", "U_goodstores"];
              this.components = response.data.item.datas;
              if (this.components && this.components.length > 0) {
                this.components.map((item) => {
                  if (needLocations.includes(item.component_key)) {
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
                this.advertising = response.data.item.page_info.advertising_id;
                if (this.advertising.id && this.advertising.datas) {
                  this.advertising.datas = JSON.parse(this.advertising.datas);
                }

                // 全屏广告
                this.full_screen = response.data.item.page_info.full_screen_id;
              }

              if (response.data.item.top && response.data.item.top.id) {
                this.top_info = JSON.parse(response.data.item.top.page_info);
              }


              if(this.fun.isCPS() && this.fun.isCPSAPPI() && response.data.item.cps_foot_type) {
                // 聚合APP装修的底部有三种情况
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
                    if(response.data.item.foot && response.data.item.foot.page_info) {
                      this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                    }else {
                      this.bottom_info = {
                        defaultData: true
                      };
                    }
                  }
                } else if (response.data.item.cps_foot_type == 2) {
                  // 显示自定义的底部导航
                  if (response.data.item.foot instanceof Array) {
                    this.bottom_info = {};
                  } else {
                    this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                  }
                }

              }else {
                // 首页装修的底部有三种情况
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
                    if(response.data.item.foot && response.data.item.foot.page_info) {
                      this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                    }else {
                      this.bottom_info = {
                        defaultData: true
                      };
                    }
                  }
                } else if (response.data.item.foot_type == 2) {
                  // 显示自定义的底部导航
                  if (response.data.item.foot instanceof Array) {
                    this.bottom_info = {};
                  } else {
                    this.bottom_info = JSON.parse(response.data.item.foot.page_info);
                  }
                }
              }


              if (this.full_screen && this.full_screen.id && this.full_screen.show_rule === 1) {
                if (!window.page_idFull_screens.includes(this.page_id)) {
                  window.page_idFull_screens.push(this.page_id);
                  this.fullShow = true;
                  this.countDown(this.full_screen.show_time);
                }
              }

              if (this.advertising && this.advertising.id && this.advertising.show_rule === 1) {
                if (!window.page_idAdvertisings.includes(this.page_id)) {
                  window.page_idAdvertisings.push(this.page_id);
                  this.popShow = true;
                  this.$nextTick(() => {
                    this.initAdvertising();
                  });
                }
              }

              window.isInHome = 0;
              this.isInHome = 0;

              // 设置的标题（装修）
              this.page_name = response.data.item.page_info && response.data.item.page_info.page_title ? response.data.item.page_info.page_title : this.$store.state.temp.mailInfo.name;

              this.fun.setWXTitle(this.page_name);
              // 标题存到缓存，页面切换没有请求接口时，用缓存里的标题
              window.localStorage.setItem("diypage_title", this.page_name);
              this.fatherTitle = this.page_name;
              console.log(this.fatherTitle);
              console.log('diy');
              if (window.location.href.indexOf("#/newDiy?") > -1) {
                setTimeout(() => {
                  window.scrollTo(0, window.diyHomeScrollTop);
                }, 200);
              }

              if (response.data.item.page_info) {
                this.shareInfo = response.data.item.page_info || {};
                this.getShareData(response.data.item.page_info);
                this.$store.commit("setWatchDiypage", response.data.item.pageinfo.params.allowauth);
                if(response.data.item.pageinfo.params.allowauth == 0 && response.data.item.page_info.member_level_url && response.data.item.page_info.member_level_url.link) {
                  this.timer = setTimeout(() => {
                    clearTimeout(this.timer);
                    window.location.href = response.data.item.page_info.member_level_url.link;
                  }, 3000);
                }
              }
            } else {
              window.isInHome = 1;
              console.log(response.msg);
            }

          },
          response => {
            console.log(response);
          }
        );
    },
    getMoreDecorate() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.current_page < this.total_page) {
        this.current_page = this.current_page + 1;
        $http.get("plugin.decorate.frotend.decorate-api.get-page", {
          decorate_page: this.current_page,
          decorate_id: this.page_id
        }, "..").then((response) => {
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
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
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

    //获取装修分享数据
    getShareData() {
      this.fun.wxShare(
        "",
        {
          page_id: this.fun.getKey("page_id")
        },
        {
          title: this.shareInfo.page_title||'',
          imgUrl: this.shareInfo.page_icon||'',
          description: this.shareInfo.page_description||''
        }
      );
    },

    turnFullTo() {
      if (this.full_screen.h_url) {
        if (this.full_screen.h_url !== window.location.href) {
          window.location.href = this.full_screen.h_url;
        }
      }
    },
    turnTo() {
      if (this.advertising.h_url) {
        if (this.advertising.h_url === window.location.href) {
          this.popShow = false;
        } else {
          window.location.href = this.advertising.h_url;
        }
      }
    },
    close() {
      this.fullShow = false;
    },
    closePop() {
      this.popShow = false;
    },
    countDown(num) {
      this.full_screen.show_time = num;
      --num;
      setTimeout(() => {
        if (num <= 0) {
          this.fullShow = false;
          // this.$route.meta.foot = false;
          // this.$emit("changeFoot", this.$route.meta.foot);
        } else {
          this.countDown(num);
        }
      }, 1000);
    }
  },
  components: {
    top_navigation,
    U_article: () => import('../components/new_diy/article.vue'),
    U_backup: () => import('../components/new_diy/backup.vue'),
    U_blank: () => import('../components/new_diy/blank.vue'),
    U_button: () => import('../components/new_diy/button.vue'),
    U_community: () => import('../components/new_diy/community.vue'),
    U_coupons: () => import('../components/new_diy/coupons.vue'),
    U_cube: () => import('../components/new_diy/cube.vue'),
    U_deposit: () => import('../components/new_diy/deposit.vue'),
    U_form: () => import('../components/new_diy/form.vue'),
    U_goods: () => import('../components/new_diy/goods.vue'),
    U_goodsgroup: () => import('../components/new_diy/goodsgroup.vue'),
    U_goodsnearby: () => import('../components/new_diy/goodsnearby.vue'),
    U_goodstores: () => import('../components/new_diy/goodstores.vue'),
    U_goodsrush: () => import('../components/new_diy/goodsrush.vue'),
    U_headline: () => import('../components/new_diy/headline.vue'),
    U_homedata: () => import('../components/new_diy/homedata.vue'),
    U_line: () => import('../components/new_diy/line.vue'),
    U_livestreaming: () => import('../components/new_diy/livestreaming.vue'),
    U_location: () => import('../components/new_diy/location.vue'),
    U_lottery: () => import('../components/new_diy/lottery.vue'),
    U_maps: () => import('../components/new_diy/maps.vue'),
    U_notice: () => import('../components/new_diy/notice.vue'),
    U_richtext: () => import('../components/new_diy/richtext.vue'),
    U_search: () => import('../components/new_diy/search.vue'),
    U_staff: () => import('../components/new_diy/staff.vue'),
    U_shopfor: () => import('../components/new_diy/shopfor.vue'),
    U_shortvideo: () => import('../components/new_diy/shortvideo.vue'),
    U_signin: () => import('../components/new_diy/signin.vue'),
    U_simplegraph: () => import('../components/new_diy/simplegraph.vue'),
    U_slideshow: () => import('../components/new_diy/slideshow.vue'),
    U_stores: () => import('../components/new_diy/stores.vue'),
    U_storesranking: () => import('../components/new_diy/storesranking.vue'),
    U_suspendbutton: () => import('../components/new_diy/suspendbutton.vue'),
    U_tabcontrol,
    U_title: () => import('../components/new_diy/title.vue'),
    U_video: () => import('../components/new_diy/video.vue'),
    U_stargroup: () => import('../components/new_diy/stargroup.vue'),
    U_foot: () => import('../components/new_diy/foot.vue'),
    U_moretabcontrol:()=>import('../components/new_diy/multistageTab'),
    U_selfpick: () => import('../components/new_diy/selfpick.vue'),
    U_wechatcode: () => import('../components/new_diy/wechatcode.vue'),
    U_bonuspool:() => import('../components/new_diy/bonusPoolsShow')
  }
};
