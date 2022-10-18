import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      rank_list: [],
      setting: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.page = 1;
    this.getData();
  },
  mouted() {

  },
  methods: {
    goDetail(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    toBd(kid) {
      this.$router.push(this.fun.getUrl("shopRankingList", { id: kid }));
    },
    onClickLeft() {
      this.show = false;
    },
    getData() {
      let that = this;
      $http
        .post(
          "plugin.goods-ranking.api.index.rank-list",
          { page: that.page },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.rank_list = response.data.data.rank_list;
              that.setting = response.data.data.setting;
              that.fun.setWXTitle(response.data.data.setting.title);
              that.total_page = response.data.last_page;
              that.page = response.data.current_page;
              that.isLoadMore = true;
              // that.initShare();
              let setting = that.setting;
              that.fun.wxShare(
                "",
                {},
                {
                  title: setting.share_title,
                  imgUrl: setting.share_logo,
                  description: setting.share_desc
                }
              );
              if (response.data.data.length == 0) {
                that.isLoadMore = false;
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .post('plugin.goods-ranking.api.index.rank-list', { page: that.page }, '')
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data.rank_list;
              that.rank_list = that.rank_list.concat(nextPageData); //进行数组拼接
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
    initShare() {
      // this.share(this.info.setting);
      let json = {
        url: this.fun.isIosOrAndroid() === "android"
          ? window.location.href
          : window.initUrl
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
        .catch(error => {
        });
    },

    //组装分享设置
    share(data) {
      let that = this;
      let setting = that.setting;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(setting.share_title)
          ? data.share.title
          : setting.share_title;

        let _link = document.location.href; 

        let _imgUrl = that.fun.isTextEmpty(setting.share_logo)
          ? data.share.icon
          : setting.share_logo;
        let _desc = that.fun.isTextEmpty(setting.share_desc)
          ? data.share.desc
          : setting.share_desc;

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
  },
  components: {
    cTitle,
  }
};