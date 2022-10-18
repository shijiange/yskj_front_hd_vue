import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

//标记 防止重复加载 招商员 招商中心切换
var currentBaseTabIndex = "0";
var is_enterprise_content = false;
var is_enterprise_center_content = false;

//标记 防止重复加载 招商员 切换
var currentEnterpriseTabIndex = "0";
var is_enterprise_first_content = false;
var is_enterprise_second_content = false;
var is_enterprise_third_content = false;
//标记 防止重复加载 招商员 切换

//标记 防止重复加载 招商中心 切换
var currentEnterpriseCenterTabIndex = "0";
var is_enterprise_center_first_content = false;
var is_enterprise_center_second_content = false;
var is_enterprise_center_third_content = false;
//标记 防止重复加载 招商中心 切换

export default {
  mixins: [scrollMixin],
  data() {
    return {
      enterpriseBaseActiveName: "enterprise", //招商员 招商中心切换

      //招商员数据
      enterpriseInfo_1: {},
      enterpriseRatioDatas: [],
      enterpriseSupplier: 0,
      enterpriseActiveName: "enterprise_first",
      enterprise_first_content: [],
      enterprise_second_content: [],
      enterprise_third_content: [],
      enterprise_store_number: 0,
      //招商员数据

      //招商中心数据
      enterpriseCenterInfo_1: {},
      enterpriseCenterRatioDatas: [],
      enterpriseCenterSupplier: 0,
      enterpriseCenterActiveName: "enterprise_center_first",
      enterprise_center_first_content: [],
      enterprise_center_second_content: [],
      enterprise_center_third_content: [],
      enterprise_level_title: "",
      enterprise_level_li: "",
      erchants_name: "",
      erchants_ratio: "",
      // 门店人数
      store_number: 0,
      //招商中心数据

      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      page: 1, //分页数，当前页数
      total_page2: 0, //  待优化。。。
      page2: 1,
      total_page3: 0,
      page3: 1,
      total_page4: 0,
      page4: 1,
      total_page5: 0,
      // page2: 5,
      total_page6: 0,
      page6: 1,

      // 自定义语言
      merchant_center: "",
      merchant_people: "",
      merchant_reward: "",
      merchant_title: ""

    };
  },
  activated() {
    currentBaseTabIndex = '0';
    if (this.$route.query.selectIndex && this.$route.query.selectIndex == 1) {
      console.log("执行");
      this.enterpriseBaseActiveName = "enterprise_centre";
      this.enterpriseBaseHandleClick("1");
    }


    this.setDataByTabIndex();
    this.initData(); //初始化参数
  },


  methods: {
    //初始化参数
    initData() {
      //招商员 招商中心切换
      currentBaseTabIndex = "0";
      is_enterprise_content = false;
      is_enterprise_center_content = false;
      this.enterpriseBaseActiveName = "enterprise";
      //招商员 招商中心切换

      //招商员数据
      this.enterpriseSupplier = 0;
      this.enterpriseRatioDatas = [];
      this.enterpriseActiveName = "enterprise_first";
      currentEnterpriseTabIndex = "0";
      is_enterprise_first_content = false;
      is_enterprise_second_content = false;
      is_enterprise_third_content = false;
      this.enterprise_first_content = [];
      this.enterprise_second_content = [];
      this.enterprise_third_content = [];
      this.enterprise_store_number = 0;
      //招商员数据

      //招商中心数据
      this.enterpriseCenterSupplier = 0;
      this.enterpriseCenterRatioDatas = [];
      this.enterpriseCenterActiveName = "enterprise_center_first";
      currentEnterpriseCenterTabIndex = "0";
      is_enterprise_center_first_content = false;
      is_enterprise_center_second_content = false;
      is_enterprise_center_third_content = false;
      this.enterprise_center_first_content = [];
      this.enterprise_center_second_content = [];
      this.enterprise_center_third_content = [];
      //招商中心数据

      this.store_number = 0;
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.total_page2 = 0;
      this.page2 = 1;
      this.total_page3 = 0;
      this.page3 = 1;
      this.total_page4 = 0;
      this.page4 = 1;
      this.total_page5 = 0;
      this.page5 = 1;
      this.total_page6 = 0;
      this.page6 = 1;

      // 自定义语言
      this.merchant_center = "";
      this.merchant_people = "";
      this.merchant_reward = "";
      this.merchant_title = "";
    },

    //初始化info数据
    initInfo() {
    },

    //设置选择后的数据
    setDataByTabIndex() {
      if (currentBaseTabIndex == "0" && !is_enterprise_content) {
        is_enterprise_content = true;
        this.getEnterpriseData();
      } else if (currentBaseTabIndex == "1" && !is_enterprise_center_content) {
        //is_enterprise_center_content = true;//特殊处理
        this.isEnterpriseCenter(); //判断是否是招商中心
      }
    },

    //tab 点击
    enterpriseBaseHandleClick(tab, event) {
      //点击同tab 不刷新界面
      // if (currentBaseTabIndex == tab.index) {
      //     return;
      // } else {
      //     currentBaseTabIndex = tab.index;
      // }
      /*因修改组建改方法*/
      if (currentBaseTabIndex == tab) {
        return;
      } else {
        currentBaseTabIndex = tab;
      }
      this.setDataByTabIndex();
    },
    // 获取招商员我的门店数量
    getEnterpriseStoreNumber() {
      let that = this;
      let json = {};

      $http
        .get(
          "plugin.merchant.frontend.store.list.getStoreCountByStaff",
          json,
          "获取中"
        )
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterprise_store_number = response.data.store_count;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //---------招商中心---------//

    isEnterpriseCenter() {
      let that = this;
      let json = {};
      $http
        .get("plugin.merchant.frontend.get-center-permission", json, "获取中")
        .then(
          function(response) {
            if (response.result == 1) {
              if (response.data.status == -1) {
                is_enterprise_center_content = false;
                //不是招商中心 跳转去申请
                that.$router.push(
                  that.fun.getUrl("enterprose_center_apply", {})
                );
              } else if (response.data.status == 1) {
                //是招商中心 获取数据
                is_enterprise_center_content = true;
                that.getEnterpriseCenterData(); //获取招商中心全部信息
              }
              that.initLang();
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商中心全部信息
    getEnterpriseCenterData() {
      this.getEnterpriseCenterInfo_1(); //获取招商中心信息
      this.getEnterpriseCenterInfo_2(); //获取招商中心统计信息
      this.getEnterpriseCenterInfo_3(); //获取招商中心 供应商人数
      this.setEnterpriseCenterDataByTabIndex(); //获取招商中心分红信息
      this.getStoreNumber(); // 获取招商中心我的门店数量
    },

    // 获取招商中心我的门店数量
    getStoreNumber() {
      let that = this;
      let json = {};

      $http
        .get(
          "plugin.merchant.frontend.store.list.getStoreCount",
          json,
          "获取中"
        )
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.store_number = response.data.store_count;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取招商中心信息
    getEnterpriseCenterInfo_1() {
      let that = this;
      let json = {};

      $http
        .get("plugin.merchant.frontend.merchant-center", json, "获取中")
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterpriseCenterInfo_1 = response.data;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商中心统计信息
    getEnterpriseCenterInfo_2() {
      let that = this;
      let json = { merchant_type: "1" };

      $http
        .get(
          "plugin.merchant.frontend.merchant.get-merchant-statistic",
          json,
          "获取中"
        )
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterpriseCenterRatioDatas = []; //清空数据源
              //组装数据
              let itemDay = new Object();
              itemDay.money = response.data.today;
              itemDay.data = "今日";
              itemDay.name = "data";
              that.enterpriseCenterRatioDatas.push(itemDay);

              let itemYesterday = new Object();
              itemYesterday.money = response.data.yesterday;
              itemYesterday.data = "昨日";
              itemYesterday.name = "data";
              that.enterpriseCenterRatioDatas.push(itemYesterday);

              let itemWeek = new Object();
              itemWeek.money = response.data.this_week;
              itemWeek.data = "本周";
              itemWeek.name = "data";
              that.enterpriseCenterRatioDatas.push(itemWeek);

              let itemMonth = new Object();
              itemMonth.money = response.data.this_month;
              itemMonth.data = "本月累计" + that.merchant_reward;
              itemMonth.name = "mounth";
              that.enterpriseCenterRatioDatas.push(itemMonth);
              //组装数据
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商中心 供应商人数
    getEnterpriseCenterInfo_3() {
      let that = this;
      let json = {};

      $http
        .get(
          "plugin.merchant.frontend.merchant-center-supplier",
          json,
          "获取中"
        )
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterpriseCenterSupplier = response.data.total;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商中心结算信息
    getEnterpriseCenterInfo_4(status, pages) {
      let that = this;
      let json = { merchant_type: "1", status: status, page: pages };

      $http
        .get(
          "plugin.merchant.frontend.merchant.get-merchant-list",
          json,
          "获取中"
        )
        .then(
          function(response) {
            that.isLoadMore = true;
            console.log(response.data);
            if (response.result == 1) {
              if (pages == 1) {
                switch (currentEnterpriseCenterTabIndex) {
                case "0":
                  that.total_page4 = response.data.last_page;
                  if (!that.total_page4) {
                    that.total_page4 = 0;
                  }
                  that.enterprise_center_first_content = response.data.data;
                  break;
                case "1":
                  that.total_page5 = response.data.last_page;
                  if (!that.total_page5) {
                    that.total_page5 = 0;
                  }
                  that.enterprise_center_second_content = response.data.data;
                  break;
                case "2":
                  that.total_page6 = response.data.last_page;
                  if (!that.total_page6) {
                    that.total_page6 = 0;
                  }
                  that.enterprise_center_third_content = response.data.data;
                  break;

                default:
                  break;
                }
              } else {
                var nextPageData = response.data.data;
                switch (currentEnterpriseCenterTabIndex) {
                case "0":
                  that.enterprise_center_first_content = that.enterprise_center_first_content.concat(
                    nextPageData
                  );
                  break;
                case "1":
                  that.enterprise_center_second_content = that.enterprise_center_second_content.concat(
                    nextPageData
                  );
                  break;
                case "2":
                  that.enterprise_center_third_content = that.enterprise_center_third_content.concat(
                    nextPageData
                  );
                  break;

                default:
                  break;
                }
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //招商中心切换标签
    enterpriseCenterHandleClick(tab, event) {
      //点击同tab 不刷新界面
      // if (currentEnterpriseCenterTabIndex == tab.index) {
      //     return;
      // } else {
      //     currentEnterpriseCenterTabIndex = tab.index;
      // }
      /*因修改组建改方法*/
      if (currentEnterpriseCenterTabIndex == tab) {
        return;
      } else {
        currentEnterpriseCenterTabIndex = tab;
        this.setWatchMore2(tab);
      }
      this.setEnterpriseCenterDataByTabIndex();
    },

    //设置选择后的数据 招商中心
    setEnterpriseCenterDataByTabIndex() {
      if (
        currentEnterpriseCenterTabIndex == "0" &&
        !is_enterprise_center_first_content
      ) {
        is_enterprise_center_first_content = true;
        this.getEnterpriseCenterInfo_4("", 1);
      } else if (
        currentEnterpriseCenterTabIndex == "1" &&
        !is_enterprise_center_second_content
      ) {
        is_enterprise_center_second_content = true;
        this.getEnterpriseCenterInfo_4("1", 1);
      } else if (
        currentEnterpriseCenterTabIndex == "2" &&
        !is_enterprise_center_third_content
      ) {
        is_enterprise_center_third_content = true;
        this.getEnterpriseCenterInfo_4("0", 1);
      }
    },

    //---------招商中心---------//

    //---------招商员---------//

    //获取招商员全部信息
    getEnterpriseData() {
      this.getEnterpriseInfo_1(); //获取招商员信息
      this.getEnterpriseInfo_2(); //获取招商员统计信息
      this.getEnterpriseInfo_3(); //获取招商员 供应商人数
      this.setEnterpriseDataByTabIndex(); //获取招商员分红信息
      this.getEnterpriseStoreNumber(); // 获取招商员我的门店数量
    },

    //获取招商员信息
    getEnterpriseInfo_1() {
      let that = this;
      let json = {};

      $http.get("plugin.merchant.frontend.merchant-staff", json, "获取中").then(
        function(response) {
          console.log(response.data);
          if (response.result == 1) {
            that.enterpriseInfo_1 = response.data;
            that.erchants_name = response.data.realname;
            that.erchants_ratio = response.data.bonus_ratio;
            that.enterprise_level_title = response.data.has_one_staff_level
              ? response.data.has_one_staff_level.level_name
              : "";
            that.enterprise_level_li = response.data.has_one_staff_level
              ? response.data.has_one_staff_level.bonus_ratio
              : "";
            that.initLang();
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //获取招商员统计信息
    getEnterpriseInfo_2() {
      let that = this;
      let json = { merchant_type: "0" };

      $http
        .get(
          "plugin.merchant.frontend.merchant.get-merchant-statistic",
          json,
          "获取中"
        )
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterpriseRatioDatas = []; //清空数据源
              //组装数据
              let itemDay = new Object();
              itemDay.money = response.data.today;
              itemDay.data = "今日";
              itemDay.name = "data";
              that.enterpriseRatioDatas.push(itemDay);

              let itemYesterday = new Object();
              itemYesterday.money = response.data.yesterday;
              itemYesterday.data = "昨日";
              itemYesterday.name = "data";
              that.enterpriseRatioDatas.push(itemYesterday);

              let itemWeek = new Object();
              itemWeek.money = response.data.this_week;
              itemWeek.data = "本周";
              itemWeek.name = "data";
              that.enterpriseRatioDatas.push(itemWeek);

              let itemMonth = new Object();
              itemMonth.money = response.data.this_month;
              itemMonth.data = "本月累计" + that.merchant_reward;
              itemMonth.name = "mounth";
              that.enterpriseRatioDatas.push(itemMonth);
              //组装数据
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商员 供应商人数
    getEnterpriseInfo_3() {
      let that = this;
      let json = {};

      $http
        .get("plugin.merchant.frontend.merchant-staff-supplier", json, "获取中")
        .then(
          function(response) {
            console.log(response.data);
            if (response.result == 1) {
              that.enterpriseSupplier = response.data.total;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    //获取招商员结算信息
    getEnterpriseInfo_4(status, pages) {
      let that = this;
      let json = { merchant_type: "0", status: status, page: pages };
      $http
        .get(
          "plugin.merchant.frontend.merchant.get-merchant-list",
          json,
          "获取中"
        )
        .then(
          function(response) {
            that.isLoadMore = true;
            if (response.result == 1) {
              if (pages == 1) {
                switch (currentEnterpriseTabIndex) {
                case "0":
                  that.total_page = response.data.last_page;
                  if (!that.total_page) {
                    that.total_page = 0;
                  }
                  that.enterprise_first_content = response.data.data;
                  break;
                case "1":
                  that.total_page2 = response.data.last_page;
                  if (!that.total_page2) {
                    that.total_page2 = 0;
                  }
                  that.enterprise_second_content = response.data.data;
                  break;
                case "2":
                  that.total_page3 = response.data.last_page;
                  if (!that.total_page3) {
                    that.total_page3 = 0;
                  }
                  that.enterprise_third_content = response.data.data;
                  break;

                default:
                  break;
                }
              } else {
                var nextPageData = response.data.data;
                switch (currentEnterpriseTabIndex) {
                case "0":
                  that.enterprise_first_content = that.enterprise_first_content.concat(
                    nextPageData
                  );
                  break;
                case "1":
                  that.enterprise_second_content = that.enterprise_first_content.concat(
                    nextPageData
                  );
                  break;
                case "2":
                  that.enterprise_third_content = that.enterprise_first_content.concat(
                    nextPageData
                  );
                  break;

                default:
                  break;
                }
              }
            } else {
              Toast(response.msg);
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },

    setWatchMore(tab) {
      switch (tab) {
      case "0":
        if (this.page >= this.total_page) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      case "1":
        if (this.page2 >= this.total_page2) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      case "2":
        if (this.page3 >= this.total_page3) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      default:
        console.log("error:: 找不到匹配项");
        break;
      }
    },
    setWatchMore2(tab) {
      switch (tab) {
      case "0":
        if (this.page4 >= this.total_page4) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      case "1":
        if (this.page5 >= this.total_page5) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      case "2":
        if (this.page6 >= this.total_page6) {
          return;
        } else {
          this.isLoadMore = true;
        }
        break;
      default:
        console.log("error:: 找不到匹配项");
        break;
      }
    },

    //招商员切换标签
    enterpriseHandleClick(tab, event) {
      //点击同tab 不刷新界面
      // if (currentEnterpriseTabIndex == tab.index) {
      //     return;
      // } else {
      //     currentEnterpriseTabIndex = tab.index;
      // }
      /*因修改组建改方法*/
      if (currentEnterpriseTabIndex == tab) {
        return;
      } else {
        currentEnterpriseTabIndex = tab;
        this.setWatchMore(tab);
      }
      this.setEnterpriseDataByTabIndex();
    },

    //设置选择后的数据 招商员
    setEnterpriseDataByTabIndex() {
      if (currentEnterpriseTabIndex == "0" && !is_enterprise_first_content) {
        is_enterprise_first_content = true;
        this.getEnterpriseInfo_4("", 1);
      } else if (
        currentEnterpriseTabIndex == "1" &&
        !is_enterprise_second_content
      ) {
        is_enterprise_second_content = true;
        this.getEnterpriseInfo_4("1", 1);
      } else if (
        currentEnterpriseTabIndex == "2" &&
        !is_enterprise_third_content
      ) {
        is_enterprise_third_content = true;
        this.getEnterpriseInfo_4("0", 1);
      }
    },

    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (currentBaseTabIndex == "0") {
        switch (currentEnterpriseTabIndex) {
        case "0":
          if (that.page >= that.total_page) {
            return;
          } else {
            that.page += 1;
            that.getEnterpriseInfo_4("", that.page);
          }
          break;
        case "1":
          if (that.page2 >= that.total_page2) {
            return;
          } else {
            that.page2 += 1;
            that.getEnterpriseInfo_4("1", that.page2);
          }
          break;
        case "2":
          if (that.page3 >= that.total_page3) {
            return;
          } else {
            that.page3 += 1;
            that.getEnterpriseInfo_4("0", that.page3);
          }
          break;
        default:
          console.log("error:: 找不到匹配项");
          break;
        }
      } else if (currentBaseTabIndex == "1") {
        switch (currentEnterpriseCenterTabIndex) {
        case "0":
          if (that.page4 >= that.total_page4) {
            return;
          } else {
            that.page4 += 1;
            that.getEnterpriseCenterInfo_4("", that.page4);
          }
          break;
        case "1":
          if (that.page5 >= that.total_page5) {
            return;
          } else {
            that.page5 += 1;
            that.getEnterpriseCenterInfo_4("1", that.page5);
          }
          break;
        case "2":
          if (that.page6 >= that.total_page6) {
            return;
          } else {
            that.page6 += 1;
            that.getEnterpriseCenterInfo_4("0", that.page6);
          }
          break;
        default:
          console.log("error:: 找不到匹配项");
          break;
        }
      }
    },

    //---------招商员---------//
    // 跳转
    gotoStoreList(type) {
      this.$router.push(
        this.fun.getUrl("enterprise_store", {
          type: type
        })
      );
    },
    initLang() {
      let mailLanguage = this.fun.initMailLanguage();
      this.merchant_center = mailLanguage.merchant.merchant_center || "招商中心";
      this.merchant_people = mailLanguage.merchant.merchant_people || "招商员";
      this.merchant_reward = mailLanguage.merchant.merchant_reward || "分红";
      this.merchant_title = mailLanguage.merchant.title || "招商";
      this.fun.setWXTitle(this.merchant_title);
    }
  },
  components: { cTitle }
};
