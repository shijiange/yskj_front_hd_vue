import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      is_show_cate: false,
      cateList: [], //分类
      category_id: 0,
      videoList: [],
      bannerList: [],
      newArray1: [],
      newArray2: [],
      showLoading: false,

      //more
      isLoadMore: false,
      page: 1,
      total_page: 0,

      isOpenBtn: false,
      is_rotation: 0,
      cacheTimestamp: null //防止img加载过程中快速跳转页面导致列表数据有重复
    };
  },
  activated() {
    zhuge.track("进入视频首页");
    if (this.fun.getKey("cat_id") !== undefined && this.fun.getKey("cat_id") !== null) {
      this.category_id = Number(this.fun.getKey("cat_id"));
    }
    if (this.$route.params.from !== "release") {
      this.getBanner();
      this.getBasicSet();
      this.getData();
    }
    if (this.$route.params.from === "release") {
      this.getData();
    } else {
      if (window.location.href.indexOf("#/videoList") > -1 && window.videoScrollTop) {
        setTimeout(() => {
          window.scrollTo(0, window.videoScrollTop);
        }, 200);
      }
    }
  },
  deactivated() {
    this.isOpenBtn = false;
  },
  mounted() {
    window.videoScrollTop = 0;
  },
  beforeRouteLeave(to, from, next) {
    window.videoScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
    goUrl(url) {
      zhuge.track('进入视频发布按钮');
      this.$router.push(this.fun.getUrl(url));
    },
    my() {
      this.$router.push(this.fun.getUrl("myVideo"));
    },
    gotoAgreement() {
      this.$router.push(this.fun.getUrl("videoAgreement"));
    },
    changeBtn() {
      this.isOpenBtn = !this.isOpenBtn;
    },
    getBanner() {
      //获取幻灯片海报
      $http
        .get("plugin.video-share.frontend.set.getSlide", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.bannerList = response.data.slide;
            this.is_rotation = response.data.is_rotation;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getBasicSet() {
      //获取视频设置
      $http
        .get("plugin.video-share.frontend.video.getBasicSet", {}, " ")
        .then(response => {
          if (response.result === 1) {
            if (response.data.set.is_show_cate == "1") {
              this.getCategory();
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getCategory() {
      $http
        .get("plugin.video-share.frontend.video.getCategory", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.cateList = [];
            this.cateList.push({
              id: 0,
              name: "全部"
            });
            this.cateList = this.cateList.concat(response.data);
            this.is_show_cate = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 图片加载完回调
    getImg(url, callback, callback2, cacheTimestamp) {
      let img = new Image();
      let _cacheTimestamp = cacheTimestamp;
      let _that = this;
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        if (_cacheTimestamp != _that.cacheTimestamp) return;
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          if (_cacheTimestamp != _that.cacheTimestamp) return;
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          callback2();
        };
      }
    },
    getData() {

      this.cateList.forEach(item => {
        if((item.id === this.category_id) && (item.id !== 0)){
          zhuge.track('视频首页点击视频标签',{
            '标签名称':item.name
          })
        }
      });

      this.videoList = [];
      this.page = 1;
      this.isLoadMore = false;
      this.showLoading = false;
      $http
        .post("plugin.video-share.frontend.video.getList", { page: this.page, search: { category_id: this.category_id } }, "load")
        .then(response => {
          if (response.result === 1) {
            this.total_page = response.data.list.last_page;
            if (response.data.list.total === 0) {
              this.showLoading = true;
            }
            this.videoList = response.data.list.data;
            this.newArray1 = [];
            this.newArray2 = [];
            this.cacheTimestamp = Date.now();
            this.$nextTick(() => {
              this.sort(0, this.videoList);
            });
          } else {
            Toast(response.msg);
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list.length > index) {
        that.getImg(
          list[index].cover,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;

            if (document.getElementsByClassName("zq-waterfall-left")[0]) {
              boxA = document.getElementsByClassName("zq-waterfall-left")[0].clientHeight;
            }

            if (document.getElementsByClassName("zq-waterfall-right")[0]) {
              boxB = document.getElementsByClassName("zq-waterfall-right")[0].clientHeight;
            }

            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            list[index].cover = "https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png";
            that.$nextTick(() => {
              that.sort(index, list);
            });
          },
          this.cacheTimestamp
        );
      }
      if (list.length - 1 == index) {
        this.isLoadMore = true;
        this.showLoading = true;
      }
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      this.showLoading = false;
      if (this.page >= this.total_page) {
        this.showLoading = true;
      } else {
        this.page = this.page + 1;
        $http
          .post(
            "plugin.video-share.frontend.video.getList",
            {
              page: that.page,
              search: { category_id: that.category_id }
            },
            "加载中"
          )
          .then(
            response => {
              if (response.result === 1) {
                let myData = response.data.list.data;
                let oldLength = that.videoList.length;
                that.videoList = that.videoList.concat(myData); //数组拼接
                that.sort(oldLength, that.videoList);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    toVideo(item) {

      this.cateList.forEach(value => {
        if(value.id === item.category_id){
          zhuge.track('视频首页点击视频',{
            '视频标题':item.title,
            '视频id':item.id,
            '发布人':item.nickname,
            '发布人id':item.uid,
            '标签名称':value.name//营养知识、才艺展示
          });
        }
      });

      zhuge.track('通用-点击视频',{
            '视频名称':item.title,
            '视频id':item.id,
            '发布人姓名':item.nickname,
            '发布人id':item.uid
      });

      zhuge.track('个人主页-点击视频',{
        '视频名称':item.title,
        '视频id':item.id,
        '发布人':item.nickname,
        '发布人id':item.uid
      });

      let page = this.videoList.findIndex((value, index, arr) => {
        return value.id === item.id;
      });
      //页数
      page = Math.ceil((page + 1) / 15);
      this.$router.push(this.fun.getUrl("VideoDetail", { fromHome: 1 }, { vid: item.id, page: page, category: this.category_id > 0 ? true : false }));
    },
    clickBanner(bannerItem){
      zhuge.track('视频首页点击banner',{
       "轮播图src":bannerItem.img,
       "跳转链接":bannerItem.url
      });
    }
  },
  components: { yzBlank }
};
