import cTitle from "components/title";
import { Toast } from "vant";
import BScroll from "better-scroll";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      date: new Date(),
      chooseDate: "",
      showChooseDate: "",
      minDate: new Date(2017, 1, 1),
      show: false,

      showPopup: false,
      chooseClassifyIndex: "-1",
      chooseClassifyID: "",
      recordData: {},
      recordList: [],
      classify: ["全部", "后台配发", "认购", "转让-转出", "转让-转入", "冻结激活", "出售", "奖励", "购买"],
      lang: {},
      asset_id: "",
      chooseClassifyName: "全部",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false
    };
  },
  activated() {
    this.asset_id = this.$route.params.asset_id;
    this.initData();
    this.getLang();
    this.getData();
  },
  methods: {
    getLang() {
      $http.get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
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
    showClassify() {
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
      if (index === "-1") {
        this.chooseClassifyID = "";
      } else {
        this.chooseClassifyID = index;
      }
      this.getData();
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
      this.getData();
    },
    //刷新
    loadTop() {
      console.log("下拉刷新");
      this.initData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    },
    getData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      let dataJSON = {
        source_type: this.chooseClassifyID,
        time: this.chooseDate,
        asset_id: this.asset_id
      };
      $http.get("plugin.asset.Frontend.Modules.Digitization.Controllers.change-records.index", dataJSON, "加载中").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.recordList = response.data.page_list.data;
          this.classify = response.data.source_type;
          this.recordData = response.data.asset_member;
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
      if (this.page >= this.total_page) {
        return;
      } else {
        let dataJSON = {
          source_type: this.chooseClassifyID,
          time: this.chooseDate,
          asset_id: this.asset_id
        };
        this.page = this.page + 1;
        dataJSON.page = this.page;
        $http.get("plugin.asset.Frontend.Modules.Digitization.Controllers.change-records.index", dataJSON, "加载中").then(function(response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            that.recordList = that.recordList.concat(myData);//数组拼接

          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
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
      this.show = false;

      this.showPopup = false;
      this.chooseClassifyID = "";
      this.chooseClassifyIndex = "-1";
      this.chooseClassifyName = "全部";
      this.recordData = {};
      this.recordList = [];

      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    }
  },
  components: { cTitle }
};
