import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from '../../utils/mixin'; //引入加载更多
export default {
  mixins: [scrollMixin],
  data() {
    return {
      title: "我的战绩",
      //累计支付
      payAmount: "",
      //累计收入
      rewardAmount: "",
      //成功打卡天数
      clockNum: 0,
      //战绩详情
      recordDetail: [],

      //奖励详情
      rewardDetail: "",

      //战绩明细显示控制
      recordDetailShow: false,
      //战绩明细奖励显示控制
      recordDetailAmountShow: false,

      share_title: "",

      share_icon: "",

      share_desc: "",

      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      // page: 1,
      // total_page: 0,
      // isLoading: false,
      //more
      page: 1, //分页数，当前页数
      // isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
    };
  },

  methods: {
    //我的战绩统计
    getMyRecord() {
      $http
        .get("plugin.clock-in.api.clock-in-member.statistic", {})
        .then(response => {
          console.log(response);

          if (response.result == 1) {
            this.payAmount = response.data.pay_amount;
            this.rewardAmount = response.data.reward_amount;
            this.clockNum = response.data.colck_num;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //我的战绩明细
    getMyRecordDetail() {
      $http
        .get("plugin.clock-in.api.clock-in-member.get-clock-list", {
          page: this.page
        })
        .then(response => {
          console.log(response);
          if (response.result == 1) {
            if (!this.fun.isTextEmpty(response.data.data)) {
              this.recordDetailShow = true;
              this.recordDetail = response.data.data;
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
            }
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    detailDate(time) {
      let date = new Date(time);
      let month =
        date.getMonth() + 1 < 10
          ? "0" + date.getMonth() + 1
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return month + "-" + day;
    },

    //获取分享数据
    getShareData() {
      $http
        .get("plugin.clock-in.api.clock-in.get-set", {})
        .then(response => {
          this.share_title = response.data.share.share_title;
          this.share_icon = response.data.share.share_icon;
          this.share_desc = response.data.share.share_desc;

          // this.initShare();
          this.fun.wxShare(
            "",
            {},
            {
              title: this.share_title,
              imgUrl:  this.share_icon,
              description: this.share_desc
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    },

    //微信分享
    initShare() {
      let that = this;
      console.log(document.location.href);
      let _url = document.location.href;
      let json = { url: _url };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function (response) {
          console.log(response);
          if (response.result == 1) {
            that.share(response.data);
          }// else {
          //}
        },
        function (response) {
          console.log(response);
        }
      );
    },

    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = that.share_title;
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);
        let _imgUrl = that.share_icon;
        let _desc = that.share_desc;
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

    getMoreDetail() {
      if (this.page == this.total_page) {
        return;
      }

      if (this.page >= this.total_page) {
        this.loading = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.clock-in.api.clock-in-member.get-clock-list",
            { page: this.page },
            "加载中..."
          )
          .then(response => {
            if (response.result == 1) {
              this.loading = false;
              this.recordDetail = this.recordDetail.concat(response.data.data);
            } else {
              this.page = that.page - 1;
              this.loading = true;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      let that = this;
      this.loading = false;
      if (that.page >= that.total_page) {
        this.loading = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.clock-in.api.clock-in-member.get-clock-list",
            { page: this.page },
            "加载中..."
          )
          .then(response => {
            if (response.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              var myData = response.data.data;
              this.recordDetail = this.recordDetail.concat(myData);
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              this.loading = true;
              this.allLoaded = true;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.recordDetail = [];
    },

    loadTop() {
      this.initData();
      this.getMyRecordDetail();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },

    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.getMoreDetail(this.page);
        this.$refs.coupon_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    }
  },
  activated() { },

  mounted() {
    this.share_title = "";
    this.share_icon = "";
    this.share_desc = "";
    this.getMyRecord();
    this.getMyRecordDetail();
    this.getShareData();
  },
  components: { cTitle }
};
