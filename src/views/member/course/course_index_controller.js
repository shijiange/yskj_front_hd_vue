import cTitle from "components/title";
import { Swipe, SwipeItem } from "c-swipe";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      listMarginLeft:0,
      carouselInfo: [],
      showCarousel: false,
      showRec: false,
      showHot: false,
      showNew: false,
      goodsList: [],
      recGoodList: [],
      hotGoodList: [],
      newGoodList: [],
      startX:0,
      endX:0,
      activeIndex:0,
      clientWidths:'',
      navigatioData:'',
      isNavigatioy:false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  mounted() {
    window.courseScrollTop = 0;
  },
  beforeRouteLeave (to, from, next) {
    window.courseScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  activated() {
    this.page = 1;
    this.total_page = 0;
    this.isLoadMore = true;
    if (this.$route.params.fromHome === 1) {
      this.getCarouselInfo();
      this.recGoodList = [];
      this.hotGoodList = [];
      this.newGoodList = [];
      this.getGoods("is_recommand", 1, "", "recGoodList");
      this.getGoods("is_hot", 1, "", "hotGoodList");
      // this.getGoods("is_new", 1, "", "newGoodList");
      //更改成全部数据
      this.getGoods("", 1, "", "newGoodList");
      // this.getGoods("");
    } else {
      if (window.location.href.indexOf("#/member/courseindex") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.courseScrollTop);
        }, 200);
      }
    }
    this.clientWidths = document.body.clientWidth;
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.getCarouselInfo();
      this.recGoodList = [];
      this.hotGoodList = [];
      this.newGoodList = [];
      this.getGoods("is_recommand", 1, "", "recGoodList");
      this.getGoods("is_hot", 1, "", "hotGoodList");
      // this.getGoods("is_new", 1, "", "newGoodList");
      //更改成全部数据
      this.getGoods("", 1, "", "newGoodList");
      // this.getGoods("");
    }
  },
  methods: {
    recommend_startBtn(e){
      var touch = e.targetTouches[0];
      this.startX = touch.pageX;
    },
    recommend_moveBtn(e){
      var touch = e.targetTouches[0];
      this.endX = touch.pageX;
    },
    recommend_endBtn(e){
      var distanceX=this.endX-this.startX;
      if(this.activeIndex>=0&&distanceX>0){
        this.listMarginLeft=this.listMarginLeft-10;
        this.activeIndex=this.activeIndex-1;
        if(this.listMarginLeft<=0||this.activeIndex<=0){
          this.listMarginLeft=0;
          this.activeIndex=0;
        }
      }else if(this.activeIndex<this.recGoodList.length-1&&distanceX<0){
        this.listMarginLeft=this.listMarginLeft+10;
        this.activeIndex=this.activeIndex+1;
      }
      console.log(this.activeIndex);
    },
    //获取轮播和导航
    getCarouselInfo() {
      //plugin.video-demand.api.video-demand.get-video-slid
      $http
        .get("plugin.video-demand.api.video-demand.get-video-info", {})
        .then(response => {
          if (response.result == 1 && (response.data &&!this.fun.isTextEmpty(response.data.slide))) {
            this.showCarousel = true;
            this.carouselInfo = response.data.slide;
          } else {
            this.showCarousel = false;
          }
          if(response.result == 1 && (response.data &&!this.fun.isTextEmpty(response.data.navigation))){
            this.setNavigatioyData(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //设置导航图标
    setNavigatioyData(data) {
      if (this.fun.isTextEmpty(data.navigation) || data.navigation.length == 0) {
        this.isNavigatioy = false;
        return;
      }
      this.isNavigatioy = true;
      let that = this;
      that.navigatioData = that.fun.chunk(data.navigation, 10);
    },
    //获取商品
    getGoods(type, page, search, container) {
      let param = {
        goods_type: type,
        // in_home_page: page ? page : "",
        search: search ? search : ""
      };
      if(type){
        param.in_home_page = page ? page : "";
      }else{
        param.page = page ? page : "";
      }
      $http
        .get(
          "plugin.video-demand.api.video-course-goods.get-course-goods",
          param,'...'
        )
        .then(response => {
          let arr = [];
          if (
            response.result == 1 &&
            !this.fun.isTextEmpty(response.data.data)
          ) {
            arr = response.data.data;
            switch (container) {
            case "recGoodList":
              this.showRec = true;
              this.recGoodList = arr;
              break;
            case "hotGoodList":
              this.showHot = true;
              this.hotGoodList = arr;
              break;
            case "newGoodList":
              this.isLoadMore = true;
              this.page = 1;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.showNew = true;
              this.newGoodList = arr;
              break;
            default:
              break;
            }
          } else {
            switch (container) {
            case "recGoodList":
              this.showRec = false;
              break;
            case "hotGoodList":
              this.showHot = false;
              break;
            case "newGoodList":
              this.showNew = false;
              break;
            default:
              break;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.video-demand.api.video-course-goods.get-course-goods",
            {
              goods_type: "",
              search:"",
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.newGoodList = that.newGoodList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    //更多商品
    moreGoods(type) {
      this.$router.push(
        this.fun.getUrl("CourseSearch", { goods_type: type, fromHome: 1 })
      );
    },

    //商品详情
    goToDetail(id) {
      $http
        .get(
          "plugin.video-demand.api.video-course-goods.get-course-goods-detail",
          { goods_id: id }
        )
        .then(response => {
          if (response.result == 1) {
            if (response.data.is_course == 1) {
              this.$router.push(
                this.fun.getUrl("CourseDetail", { id: id })
              );
            } else {
              this.$router.push(this.fun.getUrl("goods", { id: id }));
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //聚合页搜索跳转至首页
    gotoIndex() {
      this.$router.push(this.fun.getUrl("home"));
    }
  },
  components: { cTitle, Swipe, SwipeItem  },
};
