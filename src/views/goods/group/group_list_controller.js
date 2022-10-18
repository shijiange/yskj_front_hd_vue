import cTitle from "components/title";
import groupListPopup from "./groupListPopup";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      diyTitle: "拼团列表",
      isLoading: false,
      info: {},
      shareInfo: {},
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      earliestData:[],
      show:false
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.info = {};
      this.shareInfo = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      if (this.$route.name == "zhpGroupList") {
        this.diyTitle = "拼团列表";
        this.fun.setWXTitle("拼团列表");
      }
    },
    
    getData() {
      let that = this;
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups.index";
      if (this.$route.name == "zhpGroupList") {
        _url = "plugin.zhp-group-lottery.frontend.activity.get-activity-list";
      }
      $http
        .get(_url, {}, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.info = response.data.data;
              if (this.$route.name != "zhpGroupList") {
                this.shareInfo = response.data.set;
                that.fun.wxShare(
                  "",
                  {},
                  {
                    title: that.shareInfo.share_title,
                    link: that.shareInfo.share_url,
                    imgUrl: that.shareInfo.share_thumb,
                    description: that.shareInfo.share_desc
                  }
                );
              }

              this.isLoading = false;
              // this.initShare();
            } else {
              this.isLoading = false;
              console.log(response.msg);
            }
          },
          response => {}
        )
        .then(v => {});
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config && response.data.config.appId) {
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data) {
      wx.config(data.config);

      let that = this;
      let _link,
        _titles,
        _links,
        _imgUrls,
        _descs = "";
      try {
        _link = document.location.href;
        _titles = this.fun.isTextEmpty(that.shareInfo.share_title) ? data.shop.shop.name : that.shareInfo.share_title;
        _links = this.fun.isTextEmpty(that.shareInfo.share_url) ? _link : that.shareInfo.share_url;
        _imgUrls = this.fun.isTextEmpty(that.shareInfo.share_thumb) ? data.shop.icon : that.shareInfo.share_thumb;
        _descs = this.fun.isTextEmpty(that.shareInfo.share_desc) ? data.shop.shop.name : that.shareInfo.share_desc;
      } catch (error) {
        console.log("分享报错=============", error, that.shareInfo);
      }

      // console.log(_titles, _links, _imgUrls, _descs);

      wx.ready(function() {
        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    goGroup(id, store_id) {
      if (store_id) {
        this.$router.push(this.fun.getUrl("GroupGoods", { id: id, store_id: store_id }));
      } else {
        let _routerNames = this.$route.name == "zhpGroupList" ? "zhpGroup" : "GroupGoods";
        this.$router.push(this.fun.getUrl(_routerNames, { id: id }));
      }
    },
    goHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let _url = "plugin.fight-groups.frontend.controllers.fight-groups.index";
        if (this.$route.name == "zhpGroupList") {
          _url = "plugin.zhp-group-lottery.frontend.activity.get-activity-list";
        }
        $http
          .get(_url, { page: that.page }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      //console.log('触发下拉');
      this.init();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  components: { cTitle,groupListPopup  }
};
