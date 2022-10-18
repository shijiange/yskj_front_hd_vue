import cTitle from "components/title";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      customTitle: "", //自定义顶部标题
      pluginName: "",
      activeName: 0,
      dataList: [],
      titleArr: [],

      isLoading: false,
      isLoadMore: true, //判断是否要加载更多的标志
      // 拼团限制 start
      is_frequency: 0,
      member: [],
      frequency: 0,
      // 拼团限制 end

      yhShow: false,
      barter_order_sn: "",
      barter_plugin_name: "",
      barter_value: "",
      group_member_id: null
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.dataList = [];
      this.titleArr = ["正在拼团", "拼团成功", "拼团失败"];
      if (this.$route.name == "MyGroups") {
        this.customTitle = "我的拼团";
      } else {
        this.customTitle = "我的珍惠拼";
      }
      this.fun.setWXTitle(this.customTitle);
      this.pluginName = this.$route.name;

      this.isLoadMore = true;
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });

      this.activeName = this.$route.params.status || 0;
      this.$nextTick(() => {
        this.$refs.tabs.resize();
      });

      this.getData();
    },
    getData() {
      let that = this;
      let json = {};
      let _url = "";

      if (this.$route.name == "MyGroups") {
        //我的拼团
        json.team_status = this.activeName + 1;
        _url = "plugin.fight-groups.frontend.controllers.fight-groups.get-member-join-teams";
      } else {
        // 珍惠拼拼团抽奖
        //0不中，1中奖 ,2没开奖
        json.is_win = this.activeName;
        _url = "plugin.zhp-group-lottery.frontend.group-member.get-group-member-list";
      }
      $http.get(_url, json, "").then(
        response => {
          if (response.result === 1) {
            if (that.$route.name == "MyGroups") {
              that.is_frequency = response.data.is_frequency;
              that.member = response.data.member;
              that.frequency = response.data.frequency;
            }
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
            that.$set(this.dataList[that.activeName], "page", 1);
            that.isLoading = false;
          } else {
            that.isLoading = false;
            Toast(response.msg);
          }
        },
        response => { }
      );
    },
    cancelTap(gid) {
      let that = this;
      $http
        .post("plugin.zhp-group-lottery.frontend.group-member.quit-msg", { id: gid }, "加载中")
        .then(response => {
          if (response.result === 1) {
            let refund_poundage_amount = response.data.refund_poundage_amount;
            if (refund_poundage_amount == 0) {
              // refund_poundage_amount == 0 不显示手续费
              this.$dialog
                .confirm({ message: `退出该团` })
                .then(() => {
                  $http
                    .post("plugin.zhp-group-lottery.frontend.group-member.quit-group", { id: gid }, "加载中")
                    .then(response => {
                      if (response.result === 1) {
                        Toast(response.msg);
                        that.getData();
                      } else {
                        Toast(response.msg);
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    });
                })
                .catch(() => { });
            } else {
              this.$dialog
                .confirm({ message: `退团需要扣除退团手续费￥${refund_poundage_amount},退出该团？` })
                .then(() => {
                  $http
                    .post("plugin.zhp-group-lottery.frontend.group-member.quit-group", { id: gid }, "加载中")
                    .then(response => {
                      if (response.result === 1) {
                        Toast(response.msg);
                        that.getData();
                      } else {
                        Toast(response.msg);
                      }
                    })
                    .catch(err => {
                      console.log(err);
                    });
                })
                .catch(() => { });
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    gotoUrl(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    },

    gotoGroup(obj) {
      let json = { id: obj.team_id };
      if (obj.store_id) {
        json.store_id = obj.store_id;
      }
      this.$router.push(this.fun.getUrl("GroupDetail", json));
    },
    groupBtn(tag, id) {
      let url = tag == 0 ? "plugin.zhp-group-lottery.frontend.order.participate-group" : "plugin.zhp-group-lottery.frontend.group-member.cancel-group-member";
      let json = {};
      json.group_member_id = id;

      $http
        .post(url, json, "加载中")
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.init();
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      let json = {};
      let _url = "";
      if (this.$route.name == "MyGroups") {
        //我的拼团
        json.team_status = this.activeName + 1;
        _url = "plugin.fight-groups.frontend.controllers.fight-groups.get-member-join-teams";
      } else {
        // 珍惠拼拼团抽奖
        //0不中，1中奖 ,2没开奖
        json.is_win = this.activeName;
        _url = "plugin.zhp-group-lottery.frontend.group-member.get-group-member-list";
      }

      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        json.page = that.dataList[that.activeName].page;

        $http
          .get(_url, json, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(nextPageData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      //console.log("触发下拉", this.active);
      this.init();
      this.getData(this.active);
      // this.$refs.loadmore.onTopLoaded();
    },
    // 拼团插件 =================================
    zhpYh(_id) {
      this.group_member_id = _id;
      $http.get("plugin.zhp-group-lottery.frontend.goods.validate-barter", { group_member_id: _id }, ".").then(
        response => {
          if (response.result == 1) {
            this.yhShow = true;
            this.barter_order_sn = response.data.barter_order_sn;
            this.barter_plugin_name = response.data.barter_plugin_name;
            this.barter_value = response.data.barter_value;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    cancelyh() {
      this.yhShow = false;
    },
    submityh(tag) {
      let _url = tag == 0 ? "plugin.zhp-group-lottery.frontend.goods.barter-action" : "plugin.zhp-group-lottery.frontend.goods.sendAction";
      $http.get(_url, { group_member_id: this.group_member_id }, ".").then(
        response => {
          if (response.result == 1) {
            console.log(response);
            this.yhShow = false;
            this.$dialog
              .alert({
                title: "",
                message: response.msg
              })
              .then(() => {
                this.getData();
              });
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    zhpSendAction(_id) {
      this.group_member_id = _id;
      this.$dialog.confirm({
        title: '',
        message: '订单选择发货',
      })
        .then(() => {
          this.submityh(1);
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    showPopover(index) {
      let _isShow = this.dataList[this.activeName].list[index].showPopover;
      this.$set(this.dataList[this.activeName].list[index], "showPopover", !_isShow);
    }
  },
  components: { cTitle, yzBlank },
  filters: {
    startTimes(t) {
      // let unixTimestamp = new Date(t * 1000);
      // return unixTimestamp.toLocaleString();
      let date = new Date(t * 1000);
      let Y = date.getFullYear() + "-";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h = date.getHours() + ":";
      let m = date.getMinutes() + ":";
      let s = date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
};
