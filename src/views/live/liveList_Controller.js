import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      kwd: null,
      isShowBack: true,
      active: "",
      recordsList: [],
      liveBanner: [],
      clientWidth: document.body.clientWidth,
      list_style: 0, //直播列表样式

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isloading: false, //是否正在请求状态，true时为空图片不显示

      newArray1: [],
      newArray2: [],

      category: [],
      isCateStyle: false
    };
  },
  mounted() {
    this.getBanner();
    // if (this.$route.params.from != 1) {
    this.init();
    //   this.getData('2');
    // }
    this.isCateStyle = this.$route.params.cate_id ? true : false;
    this.getCategory();
    this.getShowBack();
  },
  activated() {
    this.isCateStyle = this.$route.params.cate_id ? true : false;
    if (this.$route.params.from == 1) {
      this.init();
      this.getCategory();
    }
  },
  methods: {
    init() {
      this.active = "";
      this.recordsList = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.isloading = false;
      this.isCateStyle = false;
    },
    getBanner() {
      $http
        .post("plugin.room.frontend.live-list.banner", {}, "")
        .then(response => {
          this.isloading = false;
          if (response.result === 1) {
            this.liveBanner = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCategory() {
      // 分类+停留页
      $http
        .post("plugin.room.frontend.live-list.get-room-page", {}, "")
        .then(response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(response.data.category)) {
              this.category = this.fun.chunk(response.data.category, 10);
            }
            this.active = response.data.wait_page + "";
            this.list_style = Number(response.data.list_style);
            this.getData(this.active);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    gotoAnchor(_status, _Mid, _Rid, _backId) {
      //_status:1直播状态,_Mid：直播id,_Rid:直播间id
      if (_status == 1 && _Rid) {
        //直播中，跳转到主播间
        console.log("直播中，跳转到主播间");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, type: "livePlay" }));
      } else if (_status == 3 && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log("直播回放中，跳转到主播间回放");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, backid: _backId, type: "playBack" }));
      } else if (_status == 0 && _Mid) {
        //我的关注 非直播状态，跳转到主播页面（个人中心）
        this.$router.push(this.fun.getUrl("anchorDetail", { id: _Mid }));
      } else if (_status == 2 && _Rid) {
        //预告页面
        this.$router.push(this.fun.getUrl("foreshow", { id: _Rid }));
      } else {
        console.log("缺少参数");
      }
    },
    gotoAnchor_1(_status, _Mid, _Rid, _backId) {
      if (_status == "1" && _Rid) {
        //直播中，跳转到主播间
        console.log("直播中，跳转到主播间");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, type: "livePlay" }));
      } else if (_status == "2" && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log("直播回放中，跳转到主播间回放");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, backid: _backId, type: "playBack" }));
      } else {
        console.log("error::::", _status, _Mid, _Rid, _backId);
      }
    },
    gotoAnchor_2(_status, _Mid, _Rid, _backId) {
      //_status:1直播状态,_Mid：直播id,_Rid:直播间id
      if (_status == 3 && _Rid) {
        //直播中，跳转到主播间
        console.log("直播中，跳转到主播间");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, type: "livePlay" }));
      } else if (_status == 4 && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log("直播回放中，跳转到主播间回放");
        this.$router.push(this.fun.getUrl("livePage", { id: _Rid, backid: _backId, type: "playBack" }));
      } else if (_status == 2) {
        //预告页面
        Toast("直播暂未开始！");
        // this.$router.push(this.fun.getUrl("foreshow", { id: _Rid }));
      } else {
        console.log("缺少参数");
      }
    },
    onSearch() {
      this.getData(this.active, this.kwd);
    },
    gotoMember() {
      // let _routerName = this.isCateStyle ? "liveList" : "member";
      // if (window.history.length <= 1 || _routerName === 'liveList') {
      //   this.$router.push(this.fun.getUrl(_routerName, {}));
      // } else {
      //   this.$router.go(-1);
      // }
      this.$router.push(this.fun.getUrl("member", {}));
    },
    onCancel() {},
    getData(name, title) {
      this.isloading = true;
      let _url = null;
      let _json = {};
      let that = this;
      this.recordsList = [];
      this.newArray1 = [];
      this.newArray2 = [];
      switch (name) {
      case "-1":
        that.active = "-1";
        _url = "plugin.room.frontend.live-list.get-live-concern"; //关注
        break;
      case "0":
        that.active = "0";
        _url = "plugin.room.frontend.live-list.get-all-live-list"; //全部
        break;
      case "1":
        that.active = "1";
        _url = "plugin.room.frontend.live-list.get-live-recommend"; //推荐
        break;
      case "2":
        that.active = "2";
        _url = "plugin.room.frontend.live-list.get-live-list"; //直播中
        _json.status = 3;
        break;
      case "3":
        that.active = "3";
        _url = "plugin.room.frontend.live-list.get-live-list"; //预告
        _json.status = 2;
        break;
      case "4":
        that.active = "4";
        _url = "plugin.room.frontend.live-list.play-back"; //回放
        break;

      default:
        that.active = "-1";
        _url = "plugin.room.frontend.live-list.get-live-concern"; //关注
        break;
      }
      if (this.kwd) {
        _json.keyword = this.kwd;
      }
      if (that.isCateStyle && that.active != "-1") {
        _json.cate_id = that.$route.params.cate_id;
      }

      $http
        .post(_url, _json, "", true)
        .then(response => {
          this.isloading = false;
          if (response.result === 1) {
            // if (that.active != "1") {
            this.recordsList = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            // } else {
            //   this.recordsList = response.data;
            // }

            if (this.fun.isTextEmpty(this.recordsList)) {
              return;
            }
            if (this.list_style == 0) {
              this.sort(0, this.recordsList);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          callback2();
        };
      }
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
          }
        );
      }
      if (list.length - 1 == index) {
        this.isLoadMore = true;
        this.showLoading = true;
      }
    },
    getShowBack() {
      //是否开启精彩回放
      $http
        .post("plugin.room.frontend.live-list.record", {}, "")
        .then(response => {
          if (response.result === 1) {
            if (response.data.result == 1) {
              this.isShowBack = true;
            } else {
              this.isShowBack = false;
            }
          } else {
            Toast(response.msg);
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
      if (that.active == "1") {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        let _url = null;
        let _json = {};
        this.page = this.page + 1;

        switch (this.active) {
        case "-1":
          _url = "plugin.room.frontend.live-list.get-live-concern"; //关注
          break;
        case "0":
          _url = "plugin.room.frontend.live-list.get-all-live-list"; //全部
          break;
        case "1":
          _url = "plugin.room.frontend.live-list.get-live-recommend"; //推荐
          break;
        case "2":
          _url = "plugin.room.frontend.live-list.get-live-list"; //直播中
          _json.status = 3;
          break;
        case "3":
          _url = "plugin.room.frontend.live-list.get-live-list"; //预告
          _json.status = 2;
          break;
        case "4":
          _url = "plugin.room.frontend.live-list.play-back"; //回放
          break;
        default:
          _url = "plugin.room.frontend.live-list.get-live-concern"; //关注
          break;
        }
        _json.page = this.page;
        $http.get(_url, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              let oldLength = that.recordsList.length;
              var myData = response.data.data;
              that.recordsList = that.recordsList.concat(myData); //数组拼接
              that.sort(oldLength, that.recordsList);
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
    }
  },
  components: {
    cTitle
  }
};
