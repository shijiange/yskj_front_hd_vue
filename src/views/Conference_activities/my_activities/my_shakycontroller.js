import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: "",
      id: "0",
      categories: [
        {
          name: "待付款",
          id: "1"
        },
        {
          name: "报名成功",
          id: "2"
        }
      ],
      datas: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading: false
    };
  },
  activated() {
    this.initData();
    this.active = "0";
    this.id = "0";
    //获取数据
    this.getData();
  },
  deactivated() {
  },
  mounted() {
  },

  methods: {
    toRefund(item){
      if(item.refund_id){
        this.$router.push(
          this.fun.getUrl("pickUpCardReimburse", {
            order_id: item.id,
            type: 1
          })
        );
      }else{
        this.$router.push(
          this.fun.getUrl("refund", {
            order_id: item.id,
            order_type: 1
          },{value:'13'})
        );
      }
    },
    checkPay(item) {
      let json = {
        activity_id: item.activity_id
      };

      $http
        .get("plugin.activity-apply.api.order.getOrder", json, "获取中")
        .then(
          response => {
            if (response.result == 1) {
              this.$router.push(
                this.fun.getUrl("orderpay", {
                  order_ids: item.id,
                  route: "myShaky"
                })
              );
            } else {
              Toast(response.msg);

            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes()) + ":";
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.datas = [];
    },
    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.shaky_loadmore.onTopLoaded();
    },
    cancleOrder(item) {
      let that = this;
      that.$dialog.confirm({ message: "确定取消此订单?" })
        .then(() => {
          //删除当前选中的地址
          that.datas.splice(that.datas.indexOf(item), 1);
          $http.get("order.operation.close", { order_id: item.id }, "").then(
            function(response) {
              if (response.result == 1) {
                Toast("取消订单成功");
              } else {
                that.$dialog.alert({ message: response.msg });

              }
            }
          );
        }).catch(() => {
        });
    },
    //获取数据
    getData() {
      let that = this;
      let json = {
        member_id: window.localStorage.uid,
        page: this.page,
        status: this.id
      };

      $http
        .get("plugin.activity-apply.api.lecturer.getOrder", json, "获取中")
        .then(
          response => {
            if (response.result == 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              if (response.data.data.length > 0) {
                that.datas = response.data.data;
              }
              that.isLoading = false;
            } else {
              that.isLoading = false;
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    getMoreData(page) {
      var that = this;

      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          member_id: window.localStorage.uid,
          page: this.page,
          status: this.id
        };
        $http
          .get("plugin.activity-apply.api.lecturer.getOrder", json, "加载中")
          .then(
            function(response) {
              if (response.result === 1) {
                that.total_page = response.data.last_page;
                that.datas = that.datas.concat(response.data.data);
              } else {
                that.page = that.page - 1;
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

    toRegistration(item) {
      this.$router.push(this.fun.getUrl("RegistrationDetail", { id: item.id }));
    },
    onClick(index, title) {
      console.log(index,title);
      this.initData();
      if(index == 0){
        this.id = 0;
      }else{
        this.id = this.categories[index - 1].id;
      }
      // let tab = document.getElementById("tab");
      // let tabChild = tab.getElementsByClassName("tabChild");
      // this.id = tabChild[index].getAttribute("id");
      this.getData();
    }
  },
  components: { cTitle }
};
