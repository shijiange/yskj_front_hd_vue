import { Toast } from 'vant';
import cTitle from "components/title";
import cMyswipe from "components/myswipe";
import cLive from "components/goods/children/liveList";
import cSort from "components/sort";
import classify_view from "./component/classify";
import activity from "./component/activity.vue";

const INDEX_URL = "plugin.supplier.frontend.shop.index.index";
const GOOD_URL = "plugin.supplier.frontend.shop.index.search-goods";
const ACTIVITY_URL = "plugin.supplier.frontend.shop.index.goods-limit";
// const CATEGORY_URL_1 = "plugin.supplier.frontend.shop.index.getParendCategory";
// const CATEGORY_URL_2 = "plugin.supplier.frontend.shop.index.getChildrenCategory";

const documentElement = document.documentElement;
const body = document.body;

export default {
  data() {
    return {
      tabActive: 0,
      activeLevel_1:0,
      activeLevel_2:0,
      // ================
      showPage: false,
      supplier_id: '',
      order_id: '', //  订单id参数(从订单页面过来的时候带

      show1: false,
      cservice: "",
      service_QRcode:'',
      service_mobile:'',
      //首页数据
      tab: 0,
      sliderShow: false,
      indexData: {},
      supplierInfo: {},
      //商品数据
      goodsArr: [],
      good_isLoadMore: true,
      good_page: 1,
      good_total_page: 0,
      order_field: "",
      order_by: "",
      //活动数据
      actGoodsArr: [],
      act_isLoadMore: true,
      act_page: 1,
      act_total_page: 0,

      cat_level:'2',
      //分类数据
      categoryInfo:[],
      current_page_first:1,
      last_page_first:1,

      categoryInfo_two:[],
      current_page_two:1,
      last_page_two:1
    };
  },
  created() {
    this.supplier_id = this.$route.params.id;
    if(this.$route.query.fromOrder == 1) {
      this.order_id = this.$route.params.id;
      this.supplier_id = '';
    }
    if (this.$route.params.fromHome != 1) {
      this.initData();
      this.getIndexData();
    }
  },
  activated() {
    this.supplier_id = this.$route.params.id;
    if(this.$route.query.fromOrder == 1) {
      this.order_id = this.$route.params.id;
      this.supplier_id = '';
    }
    if (this.$route.params.fromHome == 1) {
      this.initData();
      this.getIndexData();
      // this.getGoodsData(); 放到getIndexData里
      //this.getNewGoodsData();
      // this.getActivityData();
    } else {
      this.lastScrollHeight();
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted() {
    window.SupplierShopScrollTop = 0;
  },
  beforeRouteLeave(to, from, next) {
    window.SupplierShopScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    actLevelBtnTwo(index) {
      this.activeLevel_2 = index;
    },
    initData() {
      this.showPage = false;
      this.tab = 0;
      this.sliderShow = false;
      this.indexData = {};
      this.supplierInfo = {};
      this.service_mobile='';
      this.service_QRcode='';
      this.show1=false;
      this.cservice = "";
      this.initGoodData();
      this.initActData();

    },
    toggleSlide() {
      this.sliderShow = !this.sliderShow;
    },
    changeTab(index) {
      if (index == 1) {
        this.getGoodsData();
      } else if (index == 2) {
        this.getActivityData();
      }else if (index == 3) {
        this.$nextTick(() => {
          this.$refs.child.refShow();
        });
      }
    },
    //首页
    getIndexData() {
      $http.get(INDEX_URL, { sid: this.supplier_id, order_id: this.order_id }, "加载中...").then(res => {
        if (res.result == 1) {
          this.supplier_id = res.data.supplier.supplier_id;
          if(res.data.aggregate == 1){
            this.$router.replace(this.fun.getUrl("SupplierShop2",{id: this.supplier_id, fromHome: 1}));
            return;
          }
          this.showPage = true;
          // this.getGoodsData();
          // this.getActivityData();
          this.indexData = res.data;
          console.log(140,this.indexData);
          this.supplierInfo = res.data.supplier;
          if(this.indexData.hasOwnProperty('cservice')){
            this.cservice=this.indexData.cservice;
          }
          if(!this.indexData.hasOwnProperty('cservice')){
            this.cservice=this.indexData.supplier_link;
          }
          if(this.indexData.hasOwnProperty('service_QRcode')){
            this.service_QRcode=this.indexData.service_QRcode;
          }
          if(this.indexData.hasOwnProperty('service_mobile')){
            this.service_mobile=this.indexData.service_mobile;
          }
          // this.initShare();
          this.fun.wxShare(
            "",
            { },
            {
              title: this.supplierInfo.store_name,
              imgUrl: this.supplierInfo.logo,
            }
          );
          if(res.data.is_room&&res.data.is_room == 1){
            this.is_room = 1;
            // this.getLiveList(false)
          }
        }else {
          this.showPage = true;
        }
      }).catch(error => {
        this.showPage = true;
        console.log(error);
      });
    },
    //商品
    getGoodsData() {
      let json = {
        sid: this.supplier_id,
        page: this.good_page,
        order_field: this.order_field,
        order_by: this.order_by,
        "search[keyword]": ""
      };
      $http.get(GOOD_URL, json, "加载中").then(res => {
        if (res.result == 1) {
          this.goodsArr = res.data.data;
          this.good_total_page = res.data.last_page;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getLiveList(more){
      let that = this;
      if(!this.isLoadMore){
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (more&&this.live_page >= this.total_page) {
        that.showMoreLive = false;
        console.log("没有更多直播间数据！");
        return;
      } else {
        that.live_page = more?that.live_page + 1:1;
        $http.post("plugin.supplier.frontend.shop.index.get-room",{supplier_id: this.supplier_id,page: that.live_page},"").then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            if(!more&&that.total_page>=2){
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
    sortOut(e) {
      if (this.goodsArr.length == 0) {
        return;
      }
      this.order_field = e.order_field;
      this.order_by = e.order_by;
      this.goodsArr = [];
      this.getGoodsData();
    },

    getGoodsMoreData() {
      this.good_isLoadMore = false;
      if (this.good_page >= this.good_total_page) {
        return;
      } else {
        this.good_page = this.good_page + 1;
        $http.get(GOOD_URL, {
          sid: this.supplier_id,
          page: this.good_page,
          order_field: this.order_field,
          order_by: this.order_by
        }, "加载中").then(res => {
          this.good_isLoadMore = true;
          if (res.result == 1) {
            this.goodsArr = this.goodsArr.concat(res.data.data);//数组拼接
          } else {
            this.good_page = this.good_page - 1;
            this.good_isLoadMore = false;
            return;
          }
        }).catch(error => {
          console.log(error);
        });

      }
    },

    initGoodData() {
      this.goodsArr = [];
      this.good_isLoadMore = true;
      this.good_page = 1;
      this.good_total_page = 0;
      // this.order_field='';
      // this.order_by='';
    },


    //活动
    getActivityData() {
      $http.get(ACTIVITY_URL, { sid: this.supplier_id, page: this.act_page }).then(res => {
        if (res.result == 1) {
          this.actGoodsArr = res.data.list.data;
          this.act_total_page = res.data.list.last_page;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getActivityMoreData() {
      this.act_isLoadMore = false;
      if (this.act_page >= this.act_total_page) {
        return;
      } else {
        this.act_page = this.act_page + 1;
        $http.get(ACTIVITY_URL, { sid: this.supplier_id, page: this.act_page }, "加载中").then(res => {
          this.act_isLoadMore = true;
          if (res.result == 1) {
            this.actGoodsArr = this.actGoodsArr.concat(res.data.list.data);//数组拼接
          } else {
            this.act_page = this.act_page - 1;
            this.act_isLoadMore = false;
            return;
          }
        }).catch(error => {
          console.log(error);
        });

      }
    },

    initActData() {
      this.actGoodsArr = [];
      this.act_isLoadMore = true;
      this.act_page = 1;
      this.act_total_page = 0;
    },


    //跳转
    goToService() {  // 客服
      this.indexData.supplier_link && ( window.location.href = this.indexData.supplier_link);
    },
    goToAdvertise(link) {
      if (link) {
        window.location.href = link;
      }
      return;
    },
    goToUrl(href, type) {
      if (type == "href") {
        window.location.href = href;
      } else if (type == "route") {
        if (href == "orderlist") {
          this.$router.push(this.fun.getUrl(href, { status: "0" }));
        } else {
          console.log(this.fun.getUrl(href));
          this.$router.push(this.fun.getUrl(href));
        }

      }
    },

    goToSupplierInfo(){
      this.$router.push(this.fun.getUrl("SupplierInfo", { id: this.supplier_id }));
    },

    goToDetail(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },

    //返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },

    //跳转搜素
    goToSearch(type) {
      if(type == 1){
        this.$router.push(this.fun.getUrl("SupplierSearch", { sid: this.supplier_id,is_hot:1}));
      }else{
        this.$router.push(this.fun.getUrl("SupplierSearch", { sid: this.supplier_id}));
      }
    },


    lastScrollHeight() {
      if (window.location.href.indexOf("#/supplier_shop/") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.SupplierShopScrollTop);
        }, 200);
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
    handleScroll() {
      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
        //此处发起请求
        if (this.tab == 1) {
          if (this.good_isLoadMore) {
            this.getGoodsMoreData();
          } else {
            console.log("没有更多数据");
          }
        } else if (this.tab == 2) {
          if (this.act_isLoadMore) {
            this.getActivityMoreData();
          } else {
            console.log("没有更多数据");
          }
        }
      }
    },
  },
  components: { cTitle, cMyswipe, cSort, cLive, classify_view, activity }
};
