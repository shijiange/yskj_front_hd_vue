import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], // 加载更多
  data() {
    return {
      module_type: {},
      queue_id: "",
      convertType: "",
      convertTypeId: "",
      convertTypeUnit: "",
      convertTypeExchange_count: "",
      show3: false,
      active: 0,
      rewardsData: {},
      recordsList: [],
      MemberData: {},
      url: "",
      amount_id: "",
      currentTabIndex: 1,

      // more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      titleInfo: "" // 标题
    };
  },
  created() {
    this.getInfoTitle();
  },
  activated() {
    this.initData();
    this.getIndex();
    this.getMember();
    this.handleClick(0);
  },
  methods: {
    SureExchange() {
      //兑换操作
      const that = this;
      $http
        .get(
          "plugin.diy-queue.frontend.diy-queue.exchange",
          {
            queue_id: that.queue_id,
            exchange_code: that.convertTypeId
          },
          "兑换中..."
        )
        .then(
          function(response) {
            if (response.result === 1) {
              that.show3 = false;
              that.getData();
            } else {
              that.show3 = false;
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    chooseType(item) {
      // 根据选择类型显示弹框
      this.convertType = item.name;
      this.convertTypeId = item.exchange_code;
      this.convertTypeUnit = item.unit;
      this.convertTypeExchange_count = item.exchange_count;
    },
    show(item) {
      this.queue_id = "";
      this.convertType = "";
      this.convertTypeId = "";
      this.convertTypeUnit = "";
      this.convertTypeExchange_count = "";
      this.show3 = true;
      this.module_type = item;
      this.queue_id = item.id;
    },
    // 获取title名字
    getInfoTitle() {
      $http.get("plugin.diy-queue.frontend.get-plugin-name.index").then(res => {
        if (res.result == 1) {
          this.titleInfo = res.data.plugin_name;
          this.fun.setWXTitle(this.titleInfo);
        } else {
          this.$dialog.alert({message:res.msg});
        }
      });
    },
    initData() {
      this.module_type = {};
      this.queue_id = "";
      this.convertType = "";
      this.convertTypeId = "";
      this.convertTypeUnit = "";
      this.convertTypeExchange_count = "";
      this.show3 = false;
      this.rewardsData = {};
      this.recordsList = [];
      this.active = 0;
      this.page = 1;
      this.currentTabIndex = 1;
      this.total_page = 0;
      this.amount_id = "";
      this.isLoadMore = true;
      // this.fun.setWXTitle(this.WXtitle)
    },
    // tab 点击
    handleClick(index, title) {
      this.amount_id = "";
      this.recordsList = [];
      if (this.currentTabIndex !== index) {
        this.currentTabIndex = index;
        if (index === 1) {
          this.url = "plugin.diy-queue.frontend.diy-queue.get-logs";
        } else {
          this.url = "plugin.diy-queue.frontend.diy-queue.get-queues";
        }
        this.getData();
      }
    },
    showMore(obj) {
      if (obj.show && this.amount_id === obj.id) {
        obj.show = false;
        return;
      }
      this.amount_id = obj.id;
      this.$set(obj, "show", true);
    },
    getIndex() {
      $http
        .get("plugin.diy-queue.frontend.diy-queue.get-statistics", {}, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.rewardsData = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getMember() {
      $http.get("plugin.diy-queue.frontend.diy-queue.get-member").then(
        response => {
          if (response.result === 1) {
            this.MemberData = response.data.member;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 获取数据
    getData() {
      this.isLoadMore = false;
      this.page = 1;
      $http
        .get(this.url, { page: 1 }, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              if (this.currentTabIndex === 1) {
                this.total_page = response.data.logs.last_page;
                this.recordsList = response.data.logs.data;
              } else {
                this.total_page = response.data.queues.last_page;
                this.recordsList = response.data.queues.data;
              }

              if (!this.total_page) {
                this.total_page = 0;
              }
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
    // 获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
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
              this.isLoadMore = true;
              let myData = [];
              if (response.result === 1) {
                if (this.currentTabIndex === 1) {
                  myData = response.data.logs.data;
                } else {
                  myData = response.data.queues.data;
                }

                this.recordsList = this.recordsList.concat(myData); // 数组拼接
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
    }
  },
  components: { cTitle }
};
