import cTitle from 'components/title';
import { Toast } from 'vant';
var currentTabIndex = "0";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
// var is_third_content = false;
// var is_fourth_content = false;
export default {
  data() {
    return {
      level_name: "",
      rate: 0,
      ratioDatas: [],
      activeName: 'first',
      time_list: [], //时间列表
      datas: [], //详情数据，二维数组
      status: '', //空为全部，1已结算，0未结算，-1已失效
      first_content: [],
      second_content: [],
      third_content: [],

      fourth_content: [],

      dividend: {},
      mailLanguage: "", //全局语言包设置
      dividend_amount: '', //佣金名称
      area_dividend: '', //区域分红名字
      // 名丝分红 #79984
      agent_many:0,
      showPopup:false,
      moreList:[]
    };
  },

  mounted() {

  },

  activated() {
    this.initData(); //初始化参数
    this.getData(); //初始化数据
    this.initInfo(); //初始化info数据
    this.initMailLanguage();
    this.getAreaDividend();

    this.setDataByTabIndex();
    // this.getDividendList('');
  },

  methods: {
    initMailLanguage() {
      this.mailLanguage = this.fun.initMailLanguage();
      if (this.mailLanguage.area_dividend) {
        this.dividend_amount = this.fun.setMailLanguage("佣金", this.mailLanguage.area_dividend.dividend_amount);
        this.area_dividend = this.fun.setMailLanguage("区域代理中心", this.mailLanguage.area_dividend.area_dividend_center);
      } else {
        this.dividend_amount = "佣金";
        this.area_dividend = "区域代理中心";
      }
      this.fun.setWXTitle(this.area_dividend);
    },
    getAreaDividend() {
      $http.get('plugin.area-dividend.api.area-dividend.getAreaDividend', {}, '获取中').then((response) => {
        if (response.result === 1) {
          this.dividend = response.data;
        } else {
          console.log(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },
    //初始化参数
    initData() {
      this.dividend = {};
      this.ratioDatas = [];

      currentTabIndex = "0";
      // is_first_content = false;
      // is_second_content = false;
      // is_third_content = false;

      // is_fourth_content = false;


      this.activeName = 'first';


      this.first_content = [];
      this.second_content = [];
      this.third_content = [];
      this.fourth_content = [];

      this.time_list = [];
      this.datas = [];
      this.status = '';
    },
    toSelectionarea(){
      this.$router.push(this.fun.getUrl("applyRegionalAgency"));
    },
    initInfo() {
      let that = this;
      $http.get('plugin.area-dividend.api.area-dividend.get-area-agent', {}).then(function (response) {
        if (response.result == 1) {
          that.level_name = response.data.level_name;
          that.agent_many = response.data.agent_many;
          that.rate = response.data.rate;
        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },
    showPopupTap(){
      $http.get('plugin.area-dividend.api.area-dividend.get-all-area-agent','', {})
        .then( response =>{
          if (response.result == 1) {
            this.moreList = response.data;
            this.showPopup = true;
          } else {
            Toast(response.msg);
          }
        });
    },

    //初始化数据
    getData() {
      let that = this;
      $http.get('plugin.area-dividend.api.area-dividend.get-dividend-statistic', {}, '').then(function (response) {
        if (response.result === 1) {

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
          itemMonth.data = "本月累计分红";
          itemMonth.name = "mounth";
          that.ratioDatas.push(itemMonth);

        } else {
          Toast(response.msg);
        }
      }, function (response) {
        Toast(response.msg);
      });
    },


    //获取佣金列表
    getDividendList(status) {
      let that = this;
      let json = {
        "status": status
      };
      $http.get('plugin.area-dividend.api.area-dividend.get-dividend-list', json, '获取中').then(function (response) {
        if (response.result == 1) {
          that.time_list = response.data.time;
          that.time_list.forEach((item, index) => {
            that.datas.push({
              create_month: item.create_month,
              data: [],
              total: 0,
              current_page: 1,
              last_page: 1,
              is_loading: 0,
              is_show: 0
            });
          });
          that.datas[0].data = response.data.data.data;
          that.datas[0].total = response.data.data.total;
          that.datas[0].last_page = response.data.data.last_page;
          that.datas[0].current_page = response.data.data.current_page;
          that.datas[0].is_loading = 1;
          that.datas[0].is_show = 1;
        } else {
          Toast(response.msg);
        }
        console.log(that.datas[0]);
      }, function (response) {
        Toast(response.msg);
      });
    },
    // getDividendList(status) {
    //     let that = this;
    //     let json = { "status": status };
    //     $http.get('plugin.area-dividend.api.area-dividend.get-dividend-list', json, '获取中').then(function (response) {
    //         if (response.result == 1) {
    //             switch (status) {
    //                 case "":
    //                     that.first_content = response.data;
    //                     break;
    //                 case "1":
    //                     that.second_content = response.data;
    //                     break;
    //                 case "0":
    //                     that.third_content = response.data;
    //                     break;
    //                 case "-1":
    //                     that.fourth_content = response.data;
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         } else {
    //             Toast(response.msg);
    //         }
    //     }, function (response) {
    //         Toast(response.msg);
    //     });
    // },


    //设置选择后的数据
    getMore(date, index) {
      let that = this;
      that.datas[index].current_page =  that.datas[index].current_page+1;
      let json = {
        status: that.status,
        page: that.datas[index].current_page,
        create_month: date
      };
      console.log(that.datas[index]);
      $http.get('plugin.area-dividend.api.area-dividend.get-dividend-list', json, '获取中').then(function (response) {
        if (response.result == 1) {
          that.datas[index].data = that.datas[index].data.concat(response.data.data.data);

        } else {
          Toast(response.msg);
        }
        console.log(that.datas);
      }, function (response) {
        Toast(response.msg);
      });
      console.log(date, index);

    },
    getOtherList(date, index) {
      console.log("hahahah");
      let that = this;
      //隐藏数据
      if (that.datas[index].is_show == 1) {
        that.datas[index].is_show = 0;
        return;
      } else {
        that.datas[index].is_show = 1;
        //已经加载首页数据
        if (that.datas[index].is_loading == 1) {
          return;
        }
      }
      let json = {
        status: that.status,
        page: 1,
        create_month: date
      };
      $http.get('plugin.area-dividend.api.area-dividend.get-dividend-list', json, '获取中').then(function (response) {
        if (response.result == 1) {
          that.datas[index].data = response.data.data.data;
          that.datas[index].total = response.data.data.total;
          that.datas[index].last_page = response.data.data.last_page;
          that.datas[index].current_page = response.data.data.current_page;
          that.datas[index].is_loading = 1;
          that.datas[index].is_show = 1;
        } else {
          Toast(response.msg);
        }
        console.log(that.datas);
      }, function (response) {
        Toast(response.msg);
      });

    },
    setDataByTabIndex() {
      this.datas = [];
      if (currentTabIndex == "0") {
        this.getDividendList("");
        this.status = '';
      } else if (currentTabIndex == "1") {
        this.getDividendList("1");
        this.status = '1';
      } else if (currentTabIndex == "2") {
        this.getDividendList("0");
        this.status = '0';
      } else if (currentTabIndex == "3") {
        this.getDividendList("-1");
        this.status = '-1';
      }

    },
    // setDataByTabIndex() {
    //     if (currentTabIndex == "0" && !is_first_content) {
    //         is_first_content = true;
    //         this.getDividendList("");
    //         this.status = '';
    //     } else if (currentTabIndex == "1" && !is_second_content) {
    //         is_second_content = true;
    //         this.getDividendList("1");
    //         this.status = '1';
    //     } else if (currentTabIndex == "2" && !is_third_content) {
    //         is_third_content = true;
    //         this.getDividendList("0");
    //         this.status = '0';
    //     } else if(currentTabIndex == "3" && !is_fourth_content){
    //         is_fourth_content=true;
    //         this.getDividendList("-1");
    //         this.status = '-1';
    //     }
    // },

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
      }
      this.setDataByTabIndex();
    },
  },
  components: {
    cTitle
  }
};