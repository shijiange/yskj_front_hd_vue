import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoadMore: true,
      activeName: "first",
      active: 0,
      loading: false,

      mailDividend: '',
      dividend_amount: '',
      name_of_withdrawal: "",

      dataList: [{
        level: {},
        statistics: {},
        isLoadMore: true,
        total_page: null,
        page: 1,
        list: []
      }, {
        level: {},
        statistics: {},
        isLoadMore: true,
        total_page: null,
        page: 1,
        list: []
      }]
    };
  },

  activated() {
    // this.initMailLanguage();
    this.init();
    this.getData(0, true);
  },

  methods: {
    //setting Language
    initMailLanguage() {
      this.mailLanguage = this.fun.initMailLanguage();
      let _title = this.fun.setMailLanguage("经销商", this.mailLanguage.team_dividend.title);
      this.fun.setWXTitle(`${_title}平级奖`);
      this.mailDividend = this.fun.setMailLanguage("提成", this.mailLanguage.team_dividend.dividend);
      this.dividend_amount = this.fun.setMailLanguage("佣金", this.mailLanguage.team_dividend.dividend_amount);
      this.name_of_withdrawal = this.fun.setMailLanguage("提现", this.mailLanguage.income.name_of_withdrawal);
    },
    init() {
      this.isLoadMore = true;
      this.active = 0;
      this.loading = false;
      this.activeName = 'first';
      this.dataList = [{
        level: {},
        statistics: {},
        isLoadMore: true,
        total_page: null,
        page: 1,
        list: []
      }, {
        level: {},
        statistics: {},
        isLoadMore: true,
        total_page: null,
        page: 1,
        list: []
      }];
    },
    getData(tag, isQ) {
      let that = this;
      that.active = tag;
      if (isQ && !this.fun.isTextEmpty(this.dataList[tag].list)) {
        return;
      }
      this.loading = true;
      $http
        .get("plugin.team-sideways.frontend.center.index", { page: 1, award_type: tag }, "").then(res => {
          that.loading = false;
          if (res.result == 1) {
            that.dataList[tag].level = res.data.level;
            that.dataList[tag].statistics = res.data.statistics;

            that.isLoadMore = true;
            that.dataList[tag].isLoadMore = true;
            that.dataList[tag].total_page = res.data.list.last_page;
            if (!res.data.list.last_page) {
              that.dataList[tag].total_page = 0;
            }
            that.dataList[tag].list = res.data.list.data;
          } else {
            that.$dialog.alert({message:res.msg});
                     
          }
          // if (tag == 0) {
          //     that.$refs.loadmore0.onTopLoaded();
          // } else {
          //     that.$refs.loadmore1.onTopLoaded();
          // }

        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.active].isLoadMore = false;
      that.isLoadMore = false;// 防止多次请求分页数据
      if (that.dataList[that.active].page >= that.dataList[that.active].total_page) {
        return;
      } else {
        let _json = {};
        that.dataList[that.active].page = that.dataList[that.active].page + 1;
        _json.page = that.dataList[that.active].page;
        _json.award_type = that.active;

        $http.get('plugin.team-sideways.frontend.center.index', _json, "加载中").then((response) => {
          that.isLoadMore = true;
          that.dataList[that.active].isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            that.dataList[that.active].list = that.dataList[that.active].list.concat(myData); //数组拼接
          } else {
            that.dataList[that.active].page = that.dataList[that.active].page - 1;
            that.dataList[that.active].isLoadMore = false;
            that.isLoadMore = false;
          }
        },
        function (response) {
          // error callback
        }
        );
      }
    },
  },
  components: { cTitle }
};
