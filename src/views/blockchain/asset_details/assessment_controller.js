import cTitle from "components/title";
import BScroll from "better-scroll";
import { scrollMixin } from "utils/mixin";
import cMyswipe from "components/myswipe";
import cStar from "components/star";

import { Toast } from 'vant';
import ECharts from "../../../components/Echarts";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      asset_id: "",
      industry_detail: {},
      //默认高亮
      currentTab: "base",
      tabs: [],
      //全部弹窗
      showPopup: false,
      banner: [],
      //简况
      asset_detail: {},
      //请求选项的url
      tabUrl: "",

      desc: '',
      price: '',
      //公告
      notice_list: [],
      //评估
      assess_list: [],
      assess_data: {},
      //财务
      finance_list: [],
      //商品
      goods_list: [],
      //分红
      profit_list: [],
      profit: {},
      //门店
      store_list: [],
      //数字资产
      digitization_Data: {
        base: {},
        sell_price: [],
        subscribe_record: [],
        subscription_price: [],
      },
      can_subscribe: false,

      lang: {
        capital_name: ""
      },

      //加载更多
      isLoadMore: true,
      total_page: 0,
      page: 1
    };
  },
  activated() {
    this.initData();
    this.asset_id = this.$route.params.asset_id;
    this.getLang();
    this.getData();
  },
  methods: {
    getLang() {
      $http
        .get("plugin.asset.Frontend.Controllers.Lang.index", {}, "加载中...")
        .then(response => {
          if (response.result === 1) {
            this.lang = response.data;
            this.fun.setWXTitle(this.lang.capital_name + "详情");
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //跳转至详情
    gotoDetail(id) {
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: id }, "加载中...")
        .then(response => {
          if (response.result === 1) {
            if (response.data.is_course === 1) {
              this.$router.push(
                this.fun.getUrl("CourseDetail", { id: id })
              );
            } else if (response.data.goods_type === 1) {
              this.$router.push(
                this.fun.getUrl("goodsO2O", {
                  id: id,
                  tag: "o2o",
                  store_id: response.data.store_id
                })
              );
            } else {
              this.$router.push(this.fun.getUrl("goods", { id: id }));
            }
          }else this.$toast(response.msg);
        })
        .catch(error => {
          console.log(error);
        });

    },
    getData() {
      $http.get('plugin.asset.Frontend.Modules.Capital.Controllers.detail.index', {asset_id: this.asset_id}, "加载中").then((response) => {
        if (response.result === 1) {
          this.banner = response.data.slide_list;
          this.industry_detail = response.data.industry_detail;
          this.tabs = response.data.option_status;
          this.asset_detail = response.data.asset_detail;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //弹窗
    _initScrollCart() {
      this.cartScroll = new BScroll(this.$refs.cartWrapper, {
        click: true
      });
    },
    showClass() {
      this.showPopup = !this.showPopup;
      this.$nextTick(() => {
        if (!this.cartScroll) {
          this._initScrollCart();
        } else {
          this.cartScroll.refresh();
        }
      });
    },
    //点击切换分类
    handleChange(item) {
      this.currentTab = item.mark;
      //每次切换时 初始化
      this.showPopup = false;
      switch (item.mark) {
      case 'base':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Capital.Controllers.detail.index';
        break;
      case 'notice':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Notice.Controllers.records.index';
        break;
      case 'assess':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Assess.Controllers.Records.index';
        break;
      case 'digitization':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Digitization.Controllers.Detail.index';
        break;
      case 'finance':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Finance.Controllers.Records.index';
        break;
      case 'goods':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Goods.Controllers.records.index';
        break;
      case 'store':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Store.Controllers.records.index';
        break;
      case 'bonus':
        this.tabUrl = 'plugin.asset.Frontend.Modules.Bonus.Controllers.records.index';
        break;
      default:
        break;
      }
      this.getTabData();
    },
    initData() {
      this.banner = [];
      this.industry_detail = {};
      this.currentTab = 'base';
      this.tabs = [];
      this.showPopup = false;
      this.asset_detail = [];
      this.can_subscribe = false;
    },
    getTabData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.page = 1;
      let json = {
        asset_id: this.asset_id,
      };
      $http.get(this.tabUrl, json, "加载中").then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          if(response.data.can_subscribe){
            this.can_subscribe = response.data.can_subscribe;
          }
          if (this.currentTab !== 'digitization') {
            this.total_page = response.data.page_list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          }

          switch (this.currentTab) {
          case 'notice':
            this.notice_list = response.data.page_list.data;
            break;
          case 'assess':
            this.assess_data = response.data;
            this.assess_list = response.data.page_list.data;
            break;
          case 'digitization':
            this.digitization_Data = response.data;
            break;
          case 'finance':
            this.finance_list = response.data.page_list.data;
            break;
          case 'goods':
            this.goods_list = response.data.page_list.data;
            break;
          case 'store':
            this.store_list = response.data.page_list.data;
            break;
          case 'bonus':
            this.profit_list = response.data.page_list.data;
            this.profit = response.data.statistics_list;
            break;
          default:
            break;
          }
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {
        asset_id: this.asset_id,
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get(this.tabUrl, json, '加载中...').then((response) => {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            switch (this.currentTab) {
            case 'notice':
              this.notice_list = that.notice_list.concat(myData);
              break;
            case 'assess':
              this.assess_list = that.assess_list.concat(myData);
              break;
            case 'digitization':
              this.goods_list = that.goods_list.concat(myData);
              break;
            case 'finance':
              this.finance_list = that.finance_list.concat(myData);
              break;
            case 'goods':
              this.goods_list = that.goods_list.concat(myData);
              break;
            case 'store':
              this.store_list = that.store_list.concat(myData);
              break;
            case 'bonus':
              this.profit_list = that.profit_list.concat(myData);
              break;
            default:
              break;
            }
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        }, function (response) {
          // error callback
        });

      }
    },
    more() {
      this.$router.push(this.fun.getUrl('AssetIntroduction', {
        asset_id: this.asset_id
      }));
    },
    tobuy() {
      this.$router.push(this.fun.getUrl('Buying', {asset_id: this.asset_id}));
    },
    tosell() {
      this.$router.push(this.fun.getUrl('AssetSale', {asset_id: this.asset_id}));
    },
    auction() {
      // this.$router.push(this.fun.getUrl('TradingHall'));
    },
    detail() {
      this.$router.push(this.fun.getUrl('IncomeRecord'));
    },
    financeDel(item) {
      this.$router.push(this.fun.getUrl('DetailReport', {finance_id: item.id}));
    },
    noticeDel(item) {
      this.$router.push(this.fun.getUrl('AssetNotices', {notice_id: item.id}));
    },
    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(this.fun.getUrl("o2oStore_v2", {
          store_id: item.id
        }));
      } else {
        this.$router.push(this.fun.getUrl("HomeSeller", {store_id: item.id, fromHome: 1}));
      }
    },
  },
  components: {
    cTitle,
    cMyswipe,
    ECharts,
    cStar
  }
};
