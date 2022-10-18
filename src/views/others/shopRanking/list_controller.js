import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      calsst: 'z',
      id: '',
      info: [],
      status: [],
      navinfo: [],
      setting: [],
      topBanner:''
    };
  },
  activated() {
    console.log(this.$route.params);
    this.id = this.$route.params.id;
    window.scrollTo(0, 0);
    this.getData();
  },
  mouted() {

  },
  complete: {

  },
  filters:{
    rankMet(str){
      console.log(str);
      if(str == 1){
        return '昨日';
      }else if(str == 2){
        return '上一周';
      }else if(str == 3){
        return '上一月';
      }else if(str == 4){
        return '上一季度';
      }
    },
  },
  methods: {
    goDetail(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    tapClass(ind) {
      if (ind == 'z') {
        this.calsst = ind;
        this.topBanner = this.info.banner;
      } else {
        this.navinfo = [];
        this.navinfo = this.info.other_rank_list[ind];
        this.calsst = ind;
        this.topBanner = this.info.other_rank_list[ind].banner;
      }
    },
    getData() {
      let that = this;
      $http
        .get(
          "plugin.goods-ranking.api.index.rank-info",
          {
            id: that.id
          },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              this.info = response.data;
              this.status = response.data.has_category;
              this.setting = response.data.setting;
              this.topBanner = response.data.banner;
              if (response.data.has_category == '1') {
                that.calsst = 'z';
                if(response.data.other_rank_list.length >0){
                  that.navinfo = response.data.other_rank_list[0];
                }
              }
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
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
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