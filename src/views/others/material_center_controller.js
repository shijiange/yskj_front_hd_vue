import cTitle from "components/title";
import { Toast} from "vant";
import {scrollMixin} from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: "0",
      status: false,
      catgoryList: [],
      second_catgory: [],
      parentid: "0",
      childid: "",
      search_title: "",
      show1: false,
      posterShow: false,
      list: [],
      posterImg: {},
      shareData: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    window.addEventListener("scroll", () => {
      this.status = false;
    });
    this.initData();
    this.getData();
    this.getCatgory();
  },
  methods: {
    onPlayerPlay(e){
      let doc = document.getElementById('video'+e);
      if(doc.requestFullscreen){
        doc.requestFullscreen();
      }else if(doc.mozRequestFullscreen){
        doc.mozRequestFullscreen();
      }else if(doc.webkitRequestFullscreen){
        doc.webkitRequestFullscreen();
      }else if(doc.msbkitRequestFullscreen){
        doc.msbkitRequestFullscreen();
      }
      doc.addEventListener("x5videoenterfullscreen", function(){
        console.log('进入全屏********************');
        doc.play();
      });
      doc.addEventListener("x5videoenterfullscreen", function(){
        console.log('退出全屏********************');
        alert("enter fullscreen");
      });
    },
    changeSecond(id) {
      this.childid = id;
      this.getData();
    },
    close() {
      this.status = false;
    },
    onClick() {
      this.parentid = this.active;
      this.childid = "";
      this.getData();
      if (this.parentid == "0") {
        this.second_catgory = [];
        this.status = false;
      } else {
        this.catgoryList.forEach((item, index) => {
          if (item.id == this.parentid) {
            this.second_catgory = item.childrens;
            this.status = true;
          }
        });
      }
    },
    initData() {
      this.active = "0";
      this.status = false;
      this.catgoryList = [];
      this.second_catgory = [];
      this.parentid = "0";
      this.childid = "";
      this.search_title = "";
      this.posterImg = {};
      this.list = [];
      this.show1 = false;
      this.posterShow = false;
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    toSousuo() {
      this.$router.push(this.fun.getUrl("materialSearch"));
    },
    getCatgory() {
      $http
        .get("plugin.material-center.api.centerlist.getCategoryList", {}, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.catgoryList = response.data;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            this.$dialog.alert({
              message: response.msg
            });
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    getData() {
      let that = this;
      this.isLoadMore = false;
      this.page = 1;
      let json = {
        page: this.page,
        parentid: this.parentid,
        childid: this.childid,
        search_title: this.search_title
      };
      $http
        .get("plugin.material-center.api.centerlist.index", json, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.list.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.list = response.data.list.data;
              this.list.forEach((item, index) => {
                item.content1 = item.content.replace(/\n/g, "<br/>");
              });
              this.shareData = response.data.set;
              // this.initShare();
              this.fun.wxShare(
                "",
                { mid: that.fun.getKeyByMid() },
                {
                  title: that.fun.isTextEmpty(that.shareData.title) ? "素材中心" : that.shareData.title,
                  imgUrl: that.shareData.icon,
                  description: that.shareData.desc
                }
              );
            } else {
              Toast(response.msg);
            }
          },
          response => {
            this.$dialog.alert({
              message: response.msg
            });
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    //获取更多数据
    getMoreData() {
      let that = this;
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.material-center.api.centerlist.index", {
              page: that.page,
              parentid: that.parentid,
              childid: that.childid,
              search_title: that.search_title
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.list.data;
                myData.forEach((item, index) => {
                  item.content1 = item.content.replace(/\n/g, "<br/>");
                });
                this.list = this.list.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            response => {
              Toast(response.msg);
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
    },
    toGoods(good_id) {
      this.$router.push(this.fun.getUrl("goods", {
        id: good_id
      }));
    },
    //海报生成
    postShow(id) {
      this.posterShow = true;
      this.posterImg = {};

      $http
        .get("goods.goods-poster.generate-goods-poster", {
          id: id
        }, "生成中")
        .then(response => {
          if (response.result === 1) {
            this.posterImg = response.data;
          } else {
            this.posterShow = false;
            this.$dialog.alert({
              message: response.msg
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    update(id) {
      this.show1 = true;
      $http
        .get("plugin.material-center.api.centerlist.updateNum", {
          id: id,
          params: "share"
        })
        .then(response => {
          if (response.result === 1) {
            console.log(response.msg);
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onCopy(e) {
      Toast({
        message: "复制成功",
        position: "bottom",
        duration: 500
      });
    },
    onError(e) {
      Toast({
        message: "复制失败",
        position: "bottom",
        duration: 1000
      });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            this.share(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.shareData.title) ? "素材中心" : that.shareData.title;
        let _link = document.location.href;

        let _imgUrl = that.fun.isTextEmpty(that.shareData.icon) ? data.share.icon : that.shareData.icon;
        let _desc = that.fun.isTextEmpty(that.shareData.desc) ? data.share.desc : that.shareData.desc;
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
    }
  },
  components: {
    cTitle
  }
};