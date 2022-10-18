import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../../utils/mixin";
var currentTabIndex = "0";
//标记 防止重复加载
var is_first_content = false;
var is_second_content = false;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: "first",
      first_content: [],
      second_content: [],

      amountTotal: "0.00",
      team_level: "",

      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      capping_money: "",
      capping: "",
      custom_name:"",
      isLoading:false
    };
  },

  mounted() {},

  activated() {
    this.initData(); //初始化参数
    this.getData(); //初始化数据
    this.setDataByTabIndex();
  },

  methods: {
    //初始化参数
    initData() {
      currentTabIndex = "0";
      is_first_content = false;
      is_second_content = false;

      this.activeName = "first";

      this.first_content = [];
      this.second_content = [];

      this.amountTotal = "0.00";
      this.team_level = "";

      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.capping_money = "";
      this.capping = "";
      this.custom_name = "";
    },

    //更新
    loadTop() {
      this.initData();
      this.getDividendList();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },
    // 加载更多
    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     this.getMoreDividendListData();
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

    //初始化数据
    getData() {
      let that = this;
      $http
        .get(
          "plugin.shareholder-dividend.api.shareholder.get-shareholder-statistic",
          {},
          ""
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.amountTotal = response.data.amountTotal;
              that.team_level = response.data.team_level;
              that.capping_money = response.data.capping_money;
              that.capping = response.data.capping;
              that.custom_name = response.data.set.custom_name || '股东分红';
              that.fun.setWXTitle(that.custom_name);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },

    //获取分红记录
    getDividendList() {
      let that = this;
      $http
        .get(
          "plugin.shareholder-dividend.api.shareholder.get-shareholder-log",
          { page: this.page },
          ""
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.first_content = response.data.data;
              that.total_page = response.data.last_page;
              that.isLoading = false;
            } else {
              that.isLoading = false;
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },

    //获取分红记录 分页 
    getMoreData() {
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.shareholder-dividend.api.shareholder.get-shareholder-log",
            { page: this.page },
            "加载中..."
          )
          .then(
            function(response) {
              if (response.result == 1) {
                var myData = response.data;
                that.loading = false;
                that.allLoaded = false;
                that.first_content = that.first_content.concat(myData.data); //数组拼接
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
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

    //设置选择后的数据
    setDataByTabIndex() {
      if (currentTabIndex == "0" && !is_first_content) {
        is_first_content = true;
        this.getDividendList(); //获取分红队列
      } else if (currentTabIndex == "1" && !is_second_content) {
        is_second_content = true;
      }
    },

    //tab 点击
    handleClick(tab, event) {
      //点击同tab 不刷新界面
      // if (currentTabIndex == tab.index) {
      //     return;
      // } else {
      //     currentTabIndex = tab.index;
      // }
      //因为修改组建改方法
      if (currentTabIndex == tab) {
        return;
      } else {
        currentTabIndex = tab;
      }
      this.setDataByTabIndex();
    }
  },
  components: { cTitle }
};
