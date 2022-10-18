import cTitle from "components/title";
import loading from "components/loading";
import cLive from "components/goods/children/liveList";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import cFlow from "components/Waterfalls_flow";
import cComment from "components/comment";
import deliveryMap from "components/delivery_map";
import cGrouplist from "./o2oGroup/grouplist";
import depositLadderCell from "./components/deposit-ladder-cell";

const documentElement = document.documentElement;
const body = document.body;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tabList: [],
      micro_communities: [],
      get_recommend_goods: [],
      store_member: [],
      store_room: [], //直播间列表
      nearbyClassification: [],
      isShow: false,
      category: [],
      mainInfo: {},
      telephone: "",
      info: {},
      infoShow: false,

      delivery_note: "", //门店配送说明
      delivery_area: [[116.403322, 39.920255]], // 配送范围经纬度
      locations: [116.403322, 39.920255], //门店经纬度
      is_open_store_delivery: false, //是否开启门店配送

      //more
      isLoadMore: true,

      commentList: [],

      // 装修
      store_id: "",
      page_id: "",
      clientWidth: "375",
      page_name: "",
      id: "M" + new Date().getTime(),
      store_components: [],
      store_pageInfo: {},
      isBottom: false,
      btnFlag: false,
      current_page: 1,
      total_page: 0,
      lastIndex: "",
      bottom_info: "",

      // 起送金额
      delivery_amount: 0,
      // 门店独立余额
      // 1:显示余额模块0:不显示模块
      is_open: 0,
      // 余额名称
      title: "",
      // 	会员拥有该门店的余额数量
      member_balance: "",
      // 	1:显示充值按钮0:不显示充值按钮
      show_button: 0,
      // 是否显示二维码
      show_qr_code: false,
      // 门店独立余额 end

      menuList: [], //标签的数组集合
      tabName: "门店详情",
      tabIndex: 0,
      isLoading: false, //是否处于请求状态

      showPage: true,
      isBottom: false,
      btnFlag: false,
      isMounted: false,
      isInitVideoScrollFn: true,//true,则还未进行初始化，可触发initVideoScrollFn
    };
  },
  beforeRouteLeave(to, from, next) {
    window.homesellerScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  mounted() {
    window.homesellerScrollTop = 0;
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.store_id = this.$route.params.store_id;
      this.init();
      this.getStoreInfo();
      this.getBalance();
    }
  },
  activated() {
    this.tabName= "门店详情";
    if (this.$route.params.fromHome === 1) {
      this.store_id = this.$route.params.store_id;
      this.init();
      this.getStoreInfo();
      this.getBalance();
    } else {
      if (this.store_pageInfo.page_title) {
        this.fun.setWXTitle(this.store_pageInfo.page_title || "商家");
      }
      this.lastScrollHeight();
    }
    window.addEventListener("scroll", this.debounce(this.handleScroll, 50));
  },
  deactivated() {
    window.removeEventListener("scroll", this.debounce(this.handleScroll, 50));
  },
  methods: {
    FromTo(data) {},
    toStoreBalance(key) {
      if (key == "balance") {
        this.$router.push(this.fun.getUrl("storeBalance", { name: "store", store_id: this.$route.params.store_id }));
      } else {
        this.$router.push(this.fun.getUrl("independenceBalance", { store_id: this.$route.params.store_id }));
      }
    },
    lastScrollHeight() {
      if (window.location.href.indexOf("#/o2o/home/homeseller/") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.homesellerScrollTop);
        }, 200);
      }
    },
    toCard(id) {
      if (id) {
        this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: id, mark: "card" }));
      }
    },
    onCopy: function(e) {
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
    chooseTab(item, index) {
      this.tabName = item.name;
      this.tabIndex = index;
      if (this.tabName == "门店活动") {
        this.$router.push(this.fun.getUrl("ActivityDetail", {}, { activity_id: item.id, store_id: this.$route.params.store_id }));
        return;
      }
      if(item.value == 80){
        console.log('sssssssss',item)
        this.$router.push(this.fun.getUrl("storeSign", {id: this.$route.params.store_id}, {}));
        return
      }
      this.getTabsData(); //请求标签数据
    },

    getTabsData() {
      if (!this.menuList[this.tabIndex].url) {
        // getStoreInfo()方法返回并处理menuList数组
        // 如该标签数据需要请求api获取，让后端返回请求接口的api;
        console.log("menu_list该标签没有返回请求api");
        return;
      }
      if (!this.fun.isTextEmpty(this.menuList[this.tabIndex].list)) {
        this.isLoadMore = this.menuList[this.tabIndex].isLoadMore;
        return;
      }
      let _totalPage = 1;
      let _list = [];
      this.isLoading = true;
      $http
        .post(this.menuList[this.tabIndex].url, { page: 1, store_id: this.$route.params.store_id }, "")
        .then(response => {
          this.isLoading = false;
          if (response.result === 1) {
            if (this.tabName == "门店微贴") {
              _totalPage = response.data.last_page;
              _list = this.setCommunities(response.data.data);
            } else if (this.tabName == "门店员工") {
              _list = response.data;
            } else if (response.data?.data) {
              _totalPage = response.data.last_page;
              _list = response.data.data;
            } else {
              console.log("getTabsData()::error", response.data);
            }

            this.isLoadMore = true;
            this.menuList[this.tabIndex].isLoadMore = true;
            this.menuList[this.tabIndex].total_page = _totalPage;
            if (!this.menuList[this.tabIndex].total_page) {
              this.menuList[this.tabIndex].total_page = 0;
            }
            this.$set(this.menuList[this.tabIndex], "list", _list);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      if(!that.menuList[that.tabIndex]){
        return;
      }
      that.menuList[that.tabIndex].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.menuList[that.tabIndex].page >= that.menuList[that.tabIndex].total_page) {
        return;
      } else {
        let _list = [];
        let _json = { store_id: this.$route.params.store_id };
        that.menuList[that.tabIndex].page = that.menuList[that.tabIndex].page + 1;
        _json.page = that.menuList[that.tabIndex].page;

        $http.get(that.menuList[that.tabIndex].url, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.menuList[that.tabIndex].isLoadMore = true;
            if (response.result === 1) {
              if (this.tabName == "门店微贴") {
                _list = this.setCommunities(response.data.data);
              } else if (this.tabName == "门店员工") {
                _list = response.data;
              } else if (response.data?.data) {
                _list = response.data.data;
              } else {
                console.log("getTabsData()::error", response.data);
              }
              that.menuList[that.tabIndex].list = that.menuList[that.tabIndex].list.concat(_list); //数组拼接
            } else {
              that.menuList[that.tabIndex].page = that.menuList[that.tabIndex].page - 1;
              that.menuList[that.tabIndex].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            console.log(response);
            // error callback
          }
        );
      }
    },
    loadMore() {
      this.cisLoadMore = true;
    },
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    setCommunities(_data) {
      let arr = [];
      _data.map(item => {
        arr.push({
          id: item.id,
          title: item.title,
          praise_num: item.praise_num,
          has_one_stick_user: {
            avatar: item.user_avatar,
            nickname: item.user_nickname
          },
          has_many_image: [
            {
              url: item.image,
              stick_id: item.id
            }
          ]
        });
      });
      return arr;
    },
    getBalance() {
      $http
        .post("plugin.store-cashier.frontend.store.balance.setting.index", { store_id: this.$route.params.store_id }, "")
        .then(response => {
          if (response.result === 1) {
            this.is_open = response.data.is_open;
            this.title = response.data.title;
            this.member_balance = response.data.member_balance;
            this.show_button = response.data.show_button;
            this.show_qr_code = response.data.show_qr_code;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStoreInfo() {
      $http
        .post(
          "plugin.store-cashier.frontend.store.get-store-info.get-the-provider",
          {
            store_id: this.$route.params.store_id,
            url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
          },
          "loading"
        )
        .then(response => {
          if (response.result === 1) {
            this.tabList = [];
            this.menuList = [];
            // 处理并重新组装新数组和请求api
            response.data.menu_list.forEach((val, index) => {
              if (val.is_show) {
                this.tabList.push(val);
                this.menuList.push({
                  isLoadMore: true,
                  page: 1,
                  total_page: 0,
                  list: [],
                  url: val.api
                });
              }
            });
            this.getStore(response.data.store_info);
            if (response.data.store_decorate && response.data.store_decorate.datas) {
              this.store_components = response.data.store_decorate.datas;
              this.store_pageInfo = response.data.store_decorate.page_info;
              this.fun.setWXTitle(this.store_pageInfo.page_title || "商家");
              console.log(this.store_components, "ssss");
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
                  if (response.data.store_decorate.foot_id && response.data.store_decorate.foot_id.page_info) {
                    this.bottom_info = JSON.parse(response.data.store_decorate.foot_id.page_info);
                  } else {
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
            } else {
              this.get_recommend_goods = response.data.get_recommend_goods;

              if (!this.fun.isTextEmpty(response.data.store_information)) {
                this.info = response.data.store_information;
                this.infoShow = true;
              }
            }

            // this.initShare();
            this.fun.wxShare(
              "",
              {},
              {
                title: this.store_pageInfo.page_title ? this.store_pageInfo.page_title : this.mainInfo.store_name,
                imgUrl: this.store_pageInfo.page_icon ? this.store_pageInfo.page_icon : this.mainInfo.store_thumb,
                description: this.store_pageInfo.page_description ? this.store_pageInfo.page_description : this.mainInfo.store_introduce
              }
            );
            this.isShow = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取页面主要信息
    getStore(data) {
      // $http
      //   .get(
      //     "plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id",
      //     { store_id: this.$route.params.store_id }
      //   )
      //   .then(response => {
      // console.log(response.data);
      // if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
      this.mainInfo = data;
      this.telephone = "tel:" + data.store_mobile;
      this.commentList = data.comment;
      // 门店配送数据
      //开启门店配送
      if (data.dispatch_type.indexOf(3) != -1) {
        if (data.store_delivery && data.store_delivery.delivery_status == 1) {
          this.is_open_store_delivery = true;
          this.delivery_amount = data.store_delivery.delivery_amount;
          this.delivery_note = data.store_delivery ? data.store_delivery.delivery_note : "";
          this.delivery_note = this.delivery_note.replace(/\n|\r/g, "<br/>"); //文本域换行处理
          let delivery_area = data.store_delivery && data.store_delivery.delivery_area ? data.store_delivery.delivery_area : [];
          let locations = data.store_delivery ? data.store_delivery.locations : [];
          let arr_delivery_area = [];
          delivery_area.forEach((item, index) => {
            arr_delivery_area.push([Number(item.R), Number(item.Q)]);
          });
          this.delivery_area = arr_delivery_area;
          this.locations = [Number(locations.longitude).toFixed(6), Number(locations.latitude).toFixed(6)];
        }
      }

      //   }
      // })
      // .catch(error => {
      //   console.log(error);
      // });
    },

    goToShop(key) {
      if (key == "code") {
        this.$router.push(
          this.fun.getUrl("homesellerCode", {
            id: this.$route.params.store_id,
            tag: "storeBalance"
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("o2oStore_v2", {
            store_id: this.$route.params.store_id,
            fromHome: 1
          })
        );
      }
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.mainInfo.lng, this.mainInfo.lat);
      //window.location.href="http://api.map.baidu.com/marker?location="+this.mainInfo.lat+","+this.mainInfo.lng+"&title=商家位置&content="+this.mainInfo.store_name+"&output=html";
      // https://m.amap.com/navi/?dest=${point.lng},${point.lat}&destName=${items.store_name}&key=43de56d8e65fe042493541213d9ad7b0 高德另一种
      this.fun.goToWXAdress(point, this.mainInfo.store_name, this.mainInfo.store_address);
    },

    goToCrash() {
      this.$router.push(
        this.fun.getUrl("cashier_pay", {
          store_id: this.$route.params.store_id
        })
      );
    },

    init() {
      this.isShow = false;
      this.category = [];
      this.mainInfo = {};
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      this.is_open = 0;
      this.title = "";
      this.member_balance = "";
      this.show_button = 0;
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
          // this.getMoreDecorate();
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
  },
  components: {
    cTitle,
    cFlow,
    loading,
    cLive,
    cComment,
    deliveryMap,
    cGrouplist,
    depositLadderCell,
    U_backup: () => import("../../components/new_diy/backup.vue"),
    U_blank: () => import("../../components/new_diy/blank.vue"),
    U_button: () => import("../../components/new_diy/button.vue"),
    U_community: () => import("../../components/new_diy/community.vue"),
    U_cube: () => import("../../components/new_diy/cube.vue"),
    U_goods: () => import("../../components/new_diy/goods.vue"),
    U_line: () => import("../../components/new_diy/line.vue"),
    U_location: () => import("../../components/new_diy/location.vue"),
    U_maps: () => import("../../components/new_diy/maps.vue"),
    U_notice: () => import("../../components/new_diy/notice.vue"),
    U_richtext: () => import("../../components/new_diy/richtext.vue"),
    U_simplegraph: () => import("../../components/new_diy/simplegraph.vue"),
    U_slideshow: () => import("../../components/new_diy/slideshow.vue"),
    U_suspendbutton: () => import("../../components/new_diy/suspendbutton.vue"),
    U_title: () => import("../../components/new_diy/title.vue"),
    U_video: () => import("../../components/new_diy/video.vue"),
    U_foot: () => import("../../components/new_diy/foot.vue"),
    U_storebalance: () => import("../../components/new_diy/storebalance.vue")
  }
};
