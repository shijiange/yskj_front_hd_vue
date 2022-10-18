import cTitle from "components/title";
import {
  Toast
} from 'vant';
import {
  scrollMixin
} from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      shareData: {},
      second_catgory: [],
      parentid: '',
      childid: '',
      search_title: '',
      show1: false,
      posterShow: false,
      list: [],
      posterImg: '',
      // more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      posterId: 0
    };
  },
  activated() {

  },
  methods: {
    enterSearch(event){
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getData();
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
            console.log(response.data);
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
        function (response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(that.shareData.title) ? "素材搜索" : that.shareData.title;
        let _link = document.location.href;

        let _imgUrl = that.fun.isTextEmpty(that.shareData.icon) ? data.share.icon : that.shareData.icon;
        let _desc = that.fun.isTextEmpty(that.shareData.desc) ? data.share.desc : that.shareData.desc;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
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
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },
    getData() {
      let that = this;
      if (!this.search_title) {
        Toast('请输入搜索内容');
        return;
      }
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
                console.log(item.content);
              });
              this.shareData = response.data.set;
              // this.initShare();
              that.fun.wxShare(
                "",
                { mid: that.fun.getKeyByMid() },
                {
                  title: that.fun.isTextEmpty(that.shareData.title) ? "素材搜索" : that.shareData.title,
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
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.material-center.api.centerlist.index", {
              page: this.page,
              parentid: this.parentid,
              childid: this.childid,
              search_title: this.search_title
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
                  console.log(item.content);
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
  },
  components: {
    cTitle
  }
};