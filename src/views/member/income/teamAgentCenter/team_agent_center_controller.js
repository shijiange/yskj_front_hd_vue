import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../../utils/mixin";
var currentTabIndex = "0";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
// var is_third_content = false;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      team_agent:'',
      display1:'-1',//查看详情索引值
      display2:'-1',//查看详情索引值
      is_team_buyer:0,//是否显示用户详情
      is_team_order_details:0,//是否显示订单详情
      mailLanguage: "",
      mailTeamDividendTitle: "",
      mailDividend: "",
      is_activation_code: "0",
      level_name: "",
      dividend_ratio: "",
      next_dividend_ratio: "",
      ratioDatas: [],
      activeName: "first",
      first_content: [],
      second_content: [],
      third_content: [],
      four_content: [],
      bonus_active: true,
      leveling_active: true,
      prize_active: true,
      extra_active: true,
      record_index: "",
      record_key: "",
      record_extra: "",
      tab_name: "提成",
      bonus_lable: "",
      leveling_label: "",
      prize_label: "",
      extra_label: "",
      bonus_save: [],
      leveling_save: [],
      prize_save: [],
      extra_save: [],
      peopleCount: 0,
      teamPerformance: {},
      showRed: 0,
      dividend_amount: "", //佣金名称
      dividend: {},
      flat_prize: {},
      award_gratitude: {},
      extra_award: {},
      //分页
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      dividend_type: "0",
      is_customer: false,
      is_team_data: false,
      is_commission_record: false,
      is_show_order_survey: false,
    };
  },

  activated() {
    setTimeout(() => {
      this.team_agent = JSON.parse(window.localStorage.getItem("mailLanguage")).team_dividend && JSON.parse(window.localStorage.getItem("mailLanguage")).team_dividend.my_agent ? JSON.parse(window.localStorage.getItem("mailLanguage")).team_dividend.my_agent : "我的客户";
    }, 2000);
    this.getBasic();
    // this.isGratitude();
    this.initMailLanguage();
    this.initData(); //初始化参数
    // this.infoData(0); //初始化数据
    // this.initInfo(); //初始化info数据
    // this.getPeople();
    this.setDataByTabIndex();
    // this.getTeamPerformance();
    // this.getShowRed();
    // this.getTeamDividend();

    // this.initPageData();
  },
  computed: {
    teamDividendLang() {
      if (this.$store.state.shopLanguage.team_dividend) {
        return this.$store.state.shopLanguage.team_dividend;
      } else {
        return { wait_dividend: "未结算", settle_dividend: "已结算", extra_award: "额外奖励" };
      }
    }
  },
  methods: {
    // 已结算佣金和未结算佣金的总额数目
    getTeamDividend() {
      // $http
      //   .get(
      //     "plugin.team-dividend.api.team-dividend.getTeamDividend",
      //     {},
      //     "获取中"
      //   )
      //   .then(
      //     response => {
      // if (response.result === 1) {
      // this.dividend = response.data.dividend;
      // this.flat_prize = response.data.flat_prize;
      // this.award_gratitude = response.data.award_gratitude;
      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //   }
      // );
    },
    //获取我的客户人数
    getPeople(data) {
      // let that = this;
      // $http.get("plugin.team-dividend.api.team.getTeamChildCount", {}).then(
      //   function(response) {
      //     if (response.result === 1) {
      this.peopleCount = data;
      //   } else {
      //     console.log(response.msg);
      //   }
      // },
      // function(response) {
      //   Toast(response.msg);
      // }
      // );
    },
    //是否显示红包奖励
    getShowRed(data) {
      // let that = this;
      // $http.get("plugin.team-dividend.api.red-pack.enable", {}, "获取中").then(
      //   function(response) {
      //     if (response.result === 1) {
      this.showRed = data;
      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //   }
      // );
    },
    //团队业绩（订单金额，商品销量总数）
    getTeamPerformance(data) {
      // let that = this;
      // $http.get("plugin.team-dividend.api.results.index", {}, "获取中").then(
      //   function(response) {
      //     if (response.result === 1) {
      this.teamPerformance = data;
      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //   }
      // );
    },

    //setting Language
    initMailLanguage() {
      this.mailLanguage = this.fun.initMailLanguage();
      this.fun.setWXTitle(
        this.fun.setMailLanguage(
          "经销商管理中心",
          this.mailLanguage.team_dividend.team_agent_centre
        )
      );
      this.mailTeamDividendTitle = this.fun.setMailLanguage(
        "经销商管理中心",
        this.mailLanguage.team_dividend.team_agent_centre
      );
      this.mailDividend = this.fun.setMailLanguage(
        "提成",
        this.mailLanguage.team_dividend.dividend
      );
      this.dividend_amount = this.fun.setMailLanguage(
        "佣金",
        this.mailLanguage.team_dividend.dividend_amount
      );
    },

    //是否出现感恩奖
    isGratitude(data) {
      var uiClass = document.getElementsByClassName("mint-tab-item");
      var that = this;
      // $http
      //   .post("plugin.team-dividend.api.team-dividend.get-dividend-type", {})
      //   .then(
      //     response => {
      that.bonus_lable = that.fun.setMailLanguage(
        "提成",
        that.mailLanguage.team_dividend.dividend
      );
      that.leveling_label = that.fun.setMailLanguage(
        "平级奖",
        that.mailLanguage.team_dividend.flat_prize
      );
      that.prize_label = that.fun.setMailLanguage(
        "感恩奖",
        that.mailLanguage.team_dividend.award_gratitude
      );
      that.extra_label = "额外分红";
      that.record_index = data.is_flat_prize;
      that.record_key = data.is_award_gratitude;
      that.record_extra = data.is_extra_award;
      if (
        data.is_flat_prize == 1 &&
        data.is_award_gratitude == 1 &&
        data.is_extra_award == 1
      ) {
        that.leveling_active = true;
        that.prize_active = true;
        that.extra_active = true;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "25%";
          uiClass[1].style.width = "25%";
          uiClass[2].style.width = "25%";
          uiClass[3].style.width = "25%";
        }
      } else if (
        data.is_flat_prize == 1 &&
        data.is_award_gratitude == 1 &&
        data.is_extra_award == 0
      ) {
        that.leveling_active = true;
        that.prize_active = true;
        that.extra_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "33.33%";
          uiClass[1].style.width = "33.33%";
          uiClass[2].style.width = "33.33%";
        }
      } else if (
        data.is_flat_prize == 0 &&
        data.is_award_gratitude == 1 &&
        data.is_extra_award == 1
      ) {
        that.extra_active = true;
        that.prize_active = true;
        that.leveling_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "33.33%";
          uiClass[1].style.width = "33.33%";
          uiClass[2].style.width = "33.33%";
        }
      } else if (
        data.is_flat_prize == 1 &&
        data.is_award_gratitude == 0 &&
        data.is_extra_award == 1
      ) {
        that.extra_active = true;
        that.leveling_active = true;
        that.prize_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "33.33%";
          uiClass[1].style.width = "33.33%";
          uiClass[2].style.width = "33.33%";
        }
      } else if (
        data.is_flat_prize == 0 &&
        data.is_award_gratitude == 1 &&
        data.is_extra_award == 0
      ) {
        that.leveling_active = false;
        that.prize_active = true;
        that.extra_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "50%";
          uiClass[1].style.width = "50%";
        }
      } else if (
        data.is_flat_prize == 1 &&
        data.is_award_gratitude == 0 &&
        data.is_extra_award == 0
      ) {
        that.leveling_active = true;
        that.prize_active = false;
        that.extra_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "50%";
          uiClass[1].style.width = "50%";
        }
      } else if (
        data.is_flat_prize == 0 &&
        data.is_award_gratitude == 0 &&
        data.is_extra_award == 1
      ) {
        that.leveling_active = false;
        that.prize_active = false;
        that.extra_active = true;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "50%";
          uiClass[1].style.width = "50%";
        }
      } else if (
        data.is_flat_prize == 0 &&
        data.is_award_gratitude == 0 &&
        data.is_extra_award == 0
      ) {
        that.leveling_active = false;
        that.prize_active = false;
        that.extra_active = false;
        if(uiClass.length > 0) {
          uiClass[0].style.width = "100%";
        }
      }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //   }
      // );
    },

    //初始化参数
    initData() {
      this.display1 = '-1';
      this.display2 = '-1';
      this.is_team_buyer = 0,//是否显示用户详情
      this.is_team_order_details = 0,//是否显示订单详情
      this.dividend = {};
      this.flat_prize = {};
      this.award_gratitude = {};
      this.extra_award = {};
      this.is_activation_code = "0";
      this.level_name = "";
      this.dividend_ratio = "";
      this.next_dividend_ratio = "";

      this.showRed = 0;
      this.ratioDatas = [];

      currentTabIndex = "0";
      // is_first_content = false;
      // is_second_content = false;
      // is_third_content = false;
      this.activeName = "first";

      this.first_content = [];
      this.second_content = [];
      this.third_content = [];
      this.four_content = [];
      this.teamPerformance = {};

      this.dividend_type = "0";
      this.is_customer = false;
      this.is_team_data = false;
      this.is_commission_record = false;
      this.is_show_order_survey = false;
    },

    //初始化info数据，获取（经销商等级，提成比例，下级提成比例，我的激活码开启关闭按钮）
    initInfo(data) {
      // let that = this;
      // $http.get("plugin.team-dividend.api.index", {}).then(
      //   function(response) {
      // if (response.result == 1) {
      this.is_activation_code = data.is_activation_code;
      this.level_name = data.level_name;
      this.dividend_ratio = data.dividend_ratio;
      this.next_dividend_ratio = data.next_dividend_ratio;
      //     } else {
      //       Toast(response.msg);
      //     }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //   }
      // );
    },

    //初始化数据（根据不同的选项卡获取今日，昨日，本周，及本月的提成总额),方法名原本为getData
    infoData(value) {
      let that = this;
      let json = { dividend_type: value };
      $http
        .get(
          "plugin.team-dividend.api.team-dividend.get-dividend-statistic",
          json,
          ""
        )
        .then(
          function(response) {
            that.ratioDatas = [];
            if (response.result == 1) {
              //组装数据
              let itemDay = {};
              itemDay.money = response.data.today;
              itemDay.data = "今日";
              itemDay.name = "data";
              that.ratioDatas.push(itemDay);

              let itemYesterday = {};
              itemYesterday.money = response.data.yesterday;
              itemYesterday.data = "昨日";
              itemYesterday.name = "data";
              that.ratioDatas.push(itemYesterday);

              let itemWeek = {};
              itemWeek.money = response.data.this_week;
              itemWeek.data = "本周";
              itemWeek.name = "data";
              that.ratioDatas.push(itemWeek);

              let itemMonth = {};
              itemMonth.money = response.data.this_month;
              // itemMonth.data = "本月累计"+that.mailDividend;
              itemMonth.data = "本月累计" + that.tab_name;
              itemMonth.name = "mounth";
              that.ratioDatas.push(itemMonth);
              if (value == 0) {
                that.dividend = {
                  unliquidated: response.data.unliquidated,
                  liquidated: response.data.liquidated
                };
                that.bonus_save = [];
                that.bonus_save.push(itemDay);
                that.bonus_save.push(itemYesterday);
                that.bonus_save.push(itemWeek);
                that.bonus_save.push(itemMonth);
              } else if (value == 1) {
                that.flat_prize = {
                  unliquidated: response.data.unliquidated,
                  liquidated: response.data.liquidated
                };
                that.leveling_save = [];
                that.leveling_save.push(itemDay);
                that.leveling_save.push(itemYesterday);
                that.leveling_save.push(itemWeek);
                that.leveling_save.push(itemMonth);
              } else if (value == 2) {
                that.award_gratitude = {
                  unliquidated: response.data.unliquidated,
                  liquidated: response.data.liquidated
                };
                that.prize_save = [];
                that.prize_save.push(itemDay);
                that.prize_save.push(itemYesterday);
                that.prize_save.push(itemWeek);
                that.prize_save.push(itemMonth);
              } else if (value == 3) {
                that.extra_award = {
                  unliquidated: response.data.unliquidated,
                  liquidated: response.data.liquidated
                };
                that.extra_save = [];
                that.extra_save.push(itemDay);
                that.extra_save.push(itemYesterday);
                that.extra_save.push(itemWeek);
                that.extra_save.push(itemMonth);
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },

    //获取佣金列表，方法名原本为getDividendList
    getData() {
      let that = this;
      let json = { dividend_type: this.dividend_type, page: this.page };
      $http
        .get(
          "plugin.team-dividend.api.team-dividend.get-dividend-list",
          json,
          "获取中"
        )
        .then(
          function(response) {
            if (response.result == 1) {
              switch (that.dividend_type) {
              case "0":
                that.first_content = response.data.data;
                break;
              case "1":
                that.second_content = response.data.data;
                break;
              case "2":
                that.third_content = response.data.data;
                break;
              case "3":
                that.four_content = response.data.data;
                break;
              default:
                break;
              }
              that.total_page = response.data.lastpage;
              that.is_team_buyer = parseInt(response.data.is_team_buyer);
              that.is_team_order_details = parseInt(response.data.is_team_order_details);
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },
    //setting sun
    //直推奖
    // getDividendListByType2() {
    //   let that = this;
    //   let json = {};
    //   $http
    //     .get(
    //       "plugin.team-dividend.api.team-dividend.get-reward",
    //       json,
    //       "获取中"
    //     )
    //     .then(
    //       function(response) {

    //         if (response.result == 1) {
    //           that.third_content = response.data;
    //         } else {
    //           Toast(response.msg);
    //         }
    //       },
    //       function(response) {
    //         Toast(response.msg);
    //       }
    //     );
    // },

    //setting sun
    //设置选择后的数据
    setDataByTabIndex() {
      // //setting sun
      // if (this.record_index == 0 && this.record_key == 1) {
      //   if (currentTabIndex == 1) {
      //     currentTabIndex = 2;
      //   }
      // }
      this.initPageData();

      if (currentTabIndex == "0") {
        //is_first_content = true;
        this.dividend_type = "0";
        this.getData();
        this.tab_name = this.fun.setMailLanguage(
          "提成",
          this.mailLanguage.team_dividend.dividend
        );
        this.infoData("0");
      } else if (currentTabIndex == "1") {
        //is_second_content = true;
        this.dividend_type = "1";
        this.getData();

        this.tab_name = this.fun.setMailLanguage(
          "平级奖",
          this.mailLanguage.team_dividend.flat_prize
        );
        this.infoData("1");
      } else if (currentTabIndex == "2") {
        //is_third_content = true;
        this.dividend_type = "2";
        this.getData();
        this.tab_name = this.fun.setMailLanguage(
          "感恩奖",
          this.mailLanguage.team_dividend.award_gratitude
        );
        this.infoData("2");
        // this.getDividendListByType2();
      } else if (currentTabIndex == "3") {
        //is_third_content = true;
        this.dividend_type = "3";
        this.getData();
        this.tab_name = "额外分红";
        this.infoData("3");
        // this.getDividendListByType2();
      }
      //防止重复加载
      // if (currentTabIndex == "0"&&is_first_content == true) {
      //     this.ratioDatas = this.bonus_save;
      // } else if (currentTabIndex == "1"&&is_second_content == true) {
      //     this.ratioDatas = this.leveling_save;
      // } else if (currentTabIndex == "2"&&is_third_content == true) {
      //     this.ratioDatas = this.prize_save;
      // }
    },
    //setting sun
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
        this.display1 = '-1';
        this.display2 = '-1';
      }

      console.log(tab);
      this.setDataByTabIndex();
    },

    initPageData() {
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    //方法名原本为getMoreDividendList
    getMoreData() {
      if (this.page == this.total_page || this.loading) {
        return;
      }
      this.loading = true;
      if (this.page >= this.total_page) {
        this.loading = true;
        this.allLoaded = true;
      } else {
        this.page = this.page + 1;
        let json = { dividend_type: this.dividend_type, page: this.page };
        $http
          .get(
            "plugin.team-dividend.api.team-dividend.get-dividend-list",
            json,
            "加载中..."
          )
          .then(res => {
            if (res.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              switch (this.dividend_type) {
              case "0":
                this.first_content = this.first_content.concat(res.data.data);
                break;
              case "1":
                this.second_content = this.second_content.concat(
                  res.data.data
                );
                break;
              case "2":
                this.third_content = this.third_content.concat(res.data.data);
                break;
              case "3":
                this.four_content = this.four_content.concat(res.data.data);
                break;
              default:
                break;
              }
            } else {
              this.page = this.page - 1;
              this.loading = true;
              this.allLoaded = true;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     this.getMoreDividendList();
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },
    getBasic() {
      $http
        .get("plugin.team-dividend.api.index", {}, "获取中")
        .then(response => {
          if (response.result === 1) {
            if(response.data.is_not_agent){
              this.$dialog.alert({message:`你不是${response.msg?response.msg:'经销商'}`});
            }
            this.is_customer = response.data.is_customer;
            this.is_team_data = response.data.is_team_data;
            this.is_commission_record = response.data.commission_record;
            this.is_show_order_survey = response.data.order_survey;
            this.getPeople(response.data.child_count);
            this.getShowRed(response.data.redpack_enable);
            this.initInfo({
              level_name: response.data.level_name,
              is_activation_code: response.data.is_activation_code,
              dividend_ratio: response.data.dividend_ratio,
              next_dividend_ratio: response.data.next_dividend_ratio
            });
            this.getTeamPerformance({
              team_goods_total: parseFloat(response.data.team_goods_total),
              team_order_price: parseFloat(response.data.team_order_price)
            });
            this.isGratitude({
              is_award_gratitude: response.data.is_award_gratitude,
              is_extra_award: response.data.is_extra_award,
              is_flat_prize: response.data.is_flat_prize
            });
          } else {
            Toast(response.msg);
          }
        });
    },
    // 查看订单详情
    openDetail(index1,index2) {
      if (this.display1 == index1 && this.display2 == index2) {
        this.display1 = "-1";
        this.display2 = "-1";
        return;
      }
      this.display1 = index1;
      this.display2 = index2;
    }
  },
  components: { cTitle }
};
