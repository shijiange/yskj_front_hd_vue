import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
// import { Toast } from 'vant';
import BScroll from "better-scroll";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      PopupShow: false,
      url: "plugin.product-market.api.order.index",

      domain: "",
      projectList: [],

      showList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      // domianShow:false,
      serviceDetailsShow: false,
      serviceNetword: false,
      current_domain: "",
      remaining_time: 0,

      service_allLoad: false,
      service_page: 1,
      service_total_page: 0,
      service_listData: [],
      service_show: 0,
      serviceContentScroll: null
    };
  },
  activated() {
    if (this.$route.name == "marketSub") {
      this.url = "plugin.market-sub.api.order.index";
    }
    this.serviceNetword = false;
    this.getData();
  },
  methods: {
    _initScroll() {
      this.$nextTick(() => {
        if (!this.serviceContentScroll) {
          console.log("执行", this.$refs.serviceContent);
          this.serviceContentScroll = new BScroll(this.$refs.serviceContent, {
            // click: true,
            pullUpLoad: true
          });

          this.serviceContentScroll.on("pullingUp", () => {
            console.log("上拉加载更多");
            // 发送网络请求，请求更多页的数据
            if (!this.service_allLoad && this.service_page < this.service_total_page) {
              this.getMoreServiceDetails();
            } else {
              this.service_allLoad = true;
            }

            // 等数据请求完成，并且将新的数据展示出来后
            setTimeout(() => {
              //this.serviceContentScroll.finishPullUp();
            }, 2000);
          });
        } else {
          this.serviceContentScroll.refresh();
        }
      });
    },
    toShow(good, item) {
      for (let i = 0; i < item.has_market_product.widget.length; i++) {
        if (good.goods_id === item.has_market_product.widget[i].goods_id) {
          this.showList = item.has_market_product.widget[i].widget.plugin;
        }
      }
      this.PopupShow = true;
    },
    init() {
      this.allLoad = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.projectList = [];
    },
    getData() {
      this.init();
      $http
        .get(
          this.url,
          {
            page: this.page
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.domain = response.data.domain;
            this.isLoadMore = true;
            this.total_page = response.data.order.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.order.data;
            this.current_domain = response.data.current_domain;
            this.remaining_time = response.data.remaining_time;
            this.service_show = response.data.is_show;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.allLoad = true;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            this.url,
            {
              page: this.page
            },
            "加载中"
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.order.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          );
      }
    },
    initService() {
      this.service_allLoad = false;
      this.service_page = 1;
      this.service_total_page = 0;
      this.service_listData = [];
    },
    getServiceDetails() {
      if (this.serviceNetword) {
        this.serviceDetailsShow = true;
        this._initScroll();
        return;
      }
      this.initService();
      this.serviceNetword = true;
      let url = "plugin.product-market.api.order.index.check-record";
      if (this.$route.name == "marketSub") {
        url = "plugin.market-sub.api.order.index.check-record";
      }
      $http
        .get(
          url,
          {
            page: this.service_page
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.service_total_page = response.data.last_page;
            if (!this.service_total_page) {
              this.service_total_page = 0;
            }
            this.service_listData = response.data.data;
            this.serviceDetailsShow = true;

            this._initScroll();
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getMoreServiceDetails() {
      this.service_page++;
      $http
        .get(
          "plugin.market-sub.api.order.index.check-record",
          {
            page: this.service_page
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            let nextData = response.data.data;
            this.service_listData = this.service_listData.concat(nextData);
            this.serviceContentScroll.finishPullUp();
            this._initScroll();
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: { cTitle }
};
