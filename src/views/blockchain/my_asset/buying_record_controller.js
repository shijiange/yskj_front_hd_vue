import cTitle from "components/title";
import BScroll from "better-scroll";
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";

var dataJSON = {};
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "认购",
      date: new Date(),
      chooseDate: "",
      showChooseDate: "",
      minDate: new Date(2021, 1, 1),
      // "认购", "出售", "买入", （删
      Record: ["转让", "奖励", "激活", "分红"],
      showPopup: false,
      chooseItem: 0,   // 选择哪个记录
      chooseClassifyID: "", // 出售记录提交的状态
      chooseClassifyIndex: 0, // 页面对应的分类  转让记录提交的状态
      chooseClassifyName: "全部",
      recordData: {},
      recordList: [],
      classify: [],
      recordApi: "",
      lang: {
        asset_name: "",
        bonus_name: "",
        buy_name: "",
        capital_name: "",
        digitization_name: "",
        sell_name: "",
        subscription_name: ""
      },
      show: false,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false
    };
  },
  activated() {
    dataJSON = {};
    this.initData();
    this.asset_id = this.$route.params.asset_id;
    this.getLang();
    this.chooseRecord(this.chooseItem, this.Record[this.chooseItem]);
  },
  methods: {
    getLang() {
      $http.get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
          this.fun.setWXTitle(this.lang.capital_name + "记录");
          // this.Record[0] = this.lang.subscription_name;
          // this.Record[1] = this.lang.sell_name;
          // this.Record[3] = this.lang.buy_name;
          this.Record[3] = this.lang.bonus_name;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
      });
    },
    showClassify1() {
      this.showPopup = true;
      this.$nextTick(() => {
        if (!this.cartScroll) {
          this._initScrollCart();
        } else {
          this.cartScroll.refresh();
        }
      });
    },
    chooseClassify(index, item) {
      this.chooseClassifyIndex = index;
      this.chooseClassifyName = item;

      if (index === "a") {
        this.chooseClassifyID = "";
      } else {
        this.chooseClassifyID = index;
      }
      this.getData(this.recordApi);
    },
    toDetail(item, type) {
      this.$router.push(this.fun.getUrl("TransactionDetails", { id: item.id }, { name: type }));
    },
    openPicker() {
      this.show = true;
    },
    handleCancel() {
      this.show = false;
    },
    clearPicker() {
      this.showChooseDate = "";
      this.chooseDate = "";
      this.getData(this.recordApi);
    },
    handleConfirm(time1) {
      this.show = false;
      console.log(time1.getTime() / 1000);
      this.showChooseDate = time1.getFullYear() + "-" + ((time1.getMonth() + 1 < 10) ? ("0" + (time1.getMonth() + 1)) : (time1.getMonth() + 1));
      this.chooseDate = time1.getTime() / 1000;
      this.getData(this.recordApi);
    },
    chooseRecord(index, item) {
      this.title = item;
      if (!index) {
        this.chooseItem = 0;
      } else {
        this.chooseItem = index;
      }

      // 初始化
      this.initData();
      switch (Number(index)) {
      // case 0:
      //   this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.subscription-records.index";
      //   break;
      // case 1:
      //   this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.sell_records.index";
      //   this.classify = [];
      //   this.chooseClassifyIndex = "a";
      //   break;
      case 0:
        this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.Transfer-records.index";
        this.classify = ["全部", "转出", "转入"];
        break;
      // case 3:
      //   this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.buy-records.index";
      //   this.classify = ["全部", "买入", "售出"];
      //   break;
        // 奖励
      case 1:
        this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.reward-records.index";
        this.classify = [];
        this.chooseClassifyIndex = "a";
        break;
        // 激活
      case 2:
        this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.activation-records.index";
        this.classify = [];
        this.chooseClassifyIndex = "a";
        break;
        // 分红
      case 3:
        this.recordApi = "plugin.asset.Frontend.Modules.Digitization.Controllers.bonus-records.index";
        break;
      default:
        this.recordApi = "record-buying";
        break;
      }
      this.getData(this.recordApi);

    },
    //刷新
    loadTop() {
      console.log("下拉刷新");
      this.initData();
      this.chooseRecord(this.chooseItem, this.Record[this.chooseItem]);
      // this.$refs.loadmore.onTopLoaded();
    },
    setJSON() {
      switch (Number(this.chooseItem)) {
      // 认购
      // case 0:
      //   dataJSON = {
      //     asset_id: this.asset_id,
      //     time: this.chooseDate
      //   };
      //   break;
      //   // 出售
      // case 1:
      //   dataJSON = {
      //     status: this.chooseClassifyID,
      //     asset_id: this.asset_id,
      //     time: this.chooseDate
      //   };
      //   break;
      // 转让
      case 0:
        dataJSON = {
          state: this.chooseClassifyID,
          asset_id: this.asset_id,
          time: this.chooseDate
        };
        break;
        // 买入
      // case 3:
      //   dataJSON = {
      //     asset_id: this.asset_id,
      //     time: this.chooseDate
      //   };
      //   break;
        // 奖励
      case 1:
        dataJSON = {
          asset_id: this.asset_id,
          time: this.chooseDate,
          reward_type: this.chooseClassifyID
        };
        break;
        // 激活
      case 2:
        dataJSON = {
          asset_id: this.asset_id,
          time: this.chooseDate,
          type: this.chooseClassifyID
        };
        break;
        // 分红
      case 3:
        dataJSON = {
          asset_id: this.asset_id,
          time: this.chooseDate
        };
        break;
      default:
        dataJSON = {
          state: this.chooseClassifyID,
          asset_id: this.asset_id
        };
        break;
      }
    },
    getData(url) {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      this.setJSON();
      $http.get(url, dataJSON, "加载中").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.recordList = response.data.page_list.data;
          this.recordData = response.data;
          // if (this.chooseItem === 1) {
          //   this.classify = response.data.sell_status;
          // } else
          if (this.chooseItem === 1 || this.chooseItem === 2) {
            this.classify = response.data.type_list;
          }
          this.isLoading = false;
        } else {
          Toast(response.msg);
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      this.isLoadMore = false;  // 防止多次请求分页数据
      this.setJSON();
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        dataJSON.page = this.page;
        $http.get(this.recordApi, dataJSON, "加载中").then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            that.recordList = that.recordList.concat(myData);//数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        }, function(response) {
          // error callback
        });

      }
    },
    initData() {
      this.date = new Date();
      this.chooseDate = "";
      this.showChooseDate = "";
      this.showPopup = false;
      // this.chooseItem = 0;
      this.chooseClassifyID = "";
      this.chooseClassifyIndex = 0;
      this.chooseClassifyName = "全部";
      this.recordData = {};
      this.recordList = [];
      this.classify = [];
      this.recordApi = "";

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    }
  },
  components: { cTitle }
};
