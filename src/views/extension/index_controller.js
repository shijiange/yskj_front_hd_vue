import { Toast } from 'vant';
import echarts from 'utils/echarts';
import countTo from 'vue-count-to';
import { scrollMixin } from "../../utils/mixin";
import DConnectCustomerService from "@/components/other/common/DConnectCustomerService";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import { posterMixin } from "../../utils/poster"; //海报
export default {
  mixins: [scrollMixin, posterMixin], //加载更多
  data() {
    return {
      show_member_id: '',
      //营业业绩
      withdraw_date:{},
      is_show_performance: "", //营业额是否显示
      is_show_unable: "",//更多权限是否显示
      show1: false,
      mailLanguage: "", //商城自定义语言

      //是否有权限 来控制view显示
      is_agent: false,
      //总收入
      total_income: 0.0,

      info_img: "",

      //优化v2数据
      //会员信息
      userInfo: {},

      //推广权限
      extension: [],

      //更多推广
      unextension: [],
      //优化v2数据--结束

      //收入分享页面开关
      share_page: false,

      //领取权益页面开关
      showEarning: false,

      template: "",
      income_name_text: "",
      is_show_limit: false,
      amount_num: 0,

      // 高灯
      high_light:[],

      // 新模板
      income_statistic_type: '',
      income_statistic_type_box: [
        {type: '',title: '全部'},
        {type: '1',title: '今日'},
        {type: '2',title: '昨日'},
        {type: '3',title: '本周'},
        {type: '4',title: '上周'},
        {type: '5',title: '本月'},
        {type: '6',title: '上月'},
      ],
      charts_type: '',
      fans_type: '',
      extension_type: '',
      available_type: '',

      income_page: "",
      background_color: "",
      income_statistic: [],
      income_dynamic: {},
      fans_fission: {},
      extension_order: {},
      isLoadMore: true,

      buttonClientWidth: "",
      service: "",
      showPopup: false,
      btnFlag: false,
      btnData: {
        button_size: 40,
        over_top: 500,
        position_location: 'right',
        icon_url: ''
      },
      moreIdentity: false,
      highLightName: '高灯'
    };
  },
  activated() {
    this.getExtensionData();
    this.customizeIncome();
  },
  mounted() {
    console.log("this.mailLanguage", this.mailLanguage);
    this.buttonClientWidth = document.body.clientWidth - 52 + 'px';
    this.customizeIncome();
  },
  updated() {
    //解决从首页进入被标题覆盖
    this.fun.setWXTitle($i18n.t('我的推广'));
  },
  methods: {
    initEcharts() {
      if(!document.getElementById('echats-income')) {
        return;
      }
      let $echartsDOM = document.getElementById('echats-income');
      let myEcharts = echarts.init($echartsDOM);
      let maxMoney = Math.ceil(Math.max(...this.income_dynamic.total_amount)) || 50;
      let maxCount = Math.max(...this.income_dynamic.income_count) || 50;
      let intervalMoney = maxMoney/5 || 5;
      let intervalCount = maxCount/5 || 5;
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['金额', '笔数']
        },
        xAxis: [
          {
            type: 'category',
            data: this.income_dynamic.x_axis,
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额',
            min: 0,
            max: maxMoney,
            interval: intervalMoney
          },
          {
            type: 'value',
            name: '笔数',
            min: 0,
            max: maxCount,
            interval: intervalCount
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            color: "#3b84f2",
            data: this.income_dynamic.total_amount
          },
          {
            name: '笔数',
            type: 'line',
            yAxisIndex: 1,
            color: "#ffc11e",
            data: this.income_dynamic.income_count
          }
        ]
      };
      myEcharts.setOption(option);
    },
    initPieEcharts() {
      let $echartsDOM = document.getElementById('echats-income-pie');
      let myEcharts = echarts.init($echartsDOM);
      let option = {
        legend: {
          top: 'bottom',
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {show: true}
          }
        },
        series: [
          {
            name: '收入占比',
            type: 'pie',
            radius: [15, 50],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              formatter: '{name|{b}}\n{time|{c} 元}',
              rich: {
                time: {
                  fontSize: 10,
                  color: '#999'
                }
              }
            },
            data: this.income_dynamic
          }
        ]
      };
      myEcharts.setOption(option);
    },
    initFansEcharts() {
      if(!document.getElementById('echats-fans')) {
        return;
      }
      let $echartsDOM = document.getElementById('echats-fans');
      let myEcharts = echarts.init($echartsDOM);
      let maxMoney = Math.max(...this.fans_fission.totalFansSeries) || 50;
      let maxCount = Math.max(...this.fans_fission.fansNewSeries) || 50;
      let intervalMoney = maxMoney/5 || 5;
      let intervalCount = maxCount/5 || 5;
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          data: ['粉丝总数', '单日新增粉丝']
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.fans_fission.x_axis
        },
        yAxis: [
          {
            type: 'value',
            name: '总数',
            min: 0,
            max: maxMoney,
            interval: intervalMoney
          },
          {
            type: 'value',
            name: '单日',
            min: 0,
            max: maxCount,
            interval: intervalCount
          }
        ],
        series: [
          {
            name: '粉丝总数',
            type: 'line',
            color: "#77c399",
            data: this.fans_fission.totalFansSeries
          },
          {
            name: '单日新增粉丝',
            type: 'line',
            yAxisIndex: 1,
            color: "#f19c70",
            data: this.fans_fission.fansNewSeries
          }
        ]
      };
      myEcharts.setOption(option);
    },
    initOrderEcharts() {
      if(!document.getElementById('echats-fans-line')) {
        return;
      }
      let $echartsDOM = document.getElementById('echats-fans-line');
      let myEcharts = echarts.init($echartsDOM);
      let maxMoney = Math.max(...this.fans_fission.orderCountSeries) || 50;
      let maxCount = Math.max(...this.fans_fission.orderPriceSeries) || 50;
      let intervalMoney = maxMoney/5 || 5;
      let intervalCount = maxCount/5 || 5;
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['订单金额', '订单数量']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.fans_fission.x_axis,
        },
        yAxis: [
          {
            type: 'value',
            name: '订单金额',
            min: 0,
            max: maxCount,
            interval: intervalCount
          },
          {
            type: 'value',
            name: '订单数量',
            min: 0,
            max: maxMoney,
            interval: intervalMoney
          }
        ],
        series: [
          {
            name: '订单金额',
            type: 'bar',
            color: "#f19c70",
            data: this.fans_fission.orderPriceSeries
          },
          {
            name: '订单数量',
            type: 'line',
            yAxisIndex: 1,
            color: "#77c399",
            data: this.fans_fission.orderCountSeries
          }
        ]
      };
      myEcharts.setOption(option);
    },

    tabChange(type, data_type) {
      if(type === 'income_statistic_type') {
        this.income_statistic_type = data_type;
        this.getIncomeStatistic(data_type);
      }else if(type === 'charts_type') {
        this.charts_type = data_type;
        this.getEchats(data_type);
      }else if(type === 'available_type') {
        this.available_type = data_type;
      }else if(type === 'fans_type') {
        this.fans_type = data_type;
        this.getFans(data_type);
      }else if(type === 'extension_type') {
        this.extension_type = data_type;
        this.getExtension(data_type);
      }
    },
    getIncomeStatistic(data_type) {
      $http.get("finance.income-page.income-statistic", {income_statistic_type: data_type}, "loading").then(
        (response)=> {
          if (response.result === 1) {
            this.income_statistic = response.data;
          } else {
            Toast(response.msg);
          }
        });
    },
    getEchats(data_type) {
      this.income_dynamic = [];
      $http.get("finance.income-page.income-charts", {charts_type: data_type}, "loading").then(
        (response)=> {
          if (response.result === 1) {
            this.income_dynamic = response.data;
            this.$nextTick(()=>{
              if(data_type === '1') {
                this.initPieEcharts();
              }else {
                this.initEcharts();
              }
            });
          } else {
            Toast(response.msg);
          }
        });
    },
    getFans(data_type) {
      $http.get("finance.income-page.fans-charts", {charts_type: data_type}, "loading").then(
        (response)=> {
          if (response.result === 1) {
            this.fans_fission = response.data;
            this.$nextTick(()=>{
              if(data_type === '1') {
                this.initOrderEcharts();
              }else {
                this.initFansEcharts();
              }
            });
          } else {
            Toast(response.msg);
          }
        });
    },
    getExtension(data_type) {
      this.extension_order = {};
      this.isLoadMore = false;
      $http.get("finance.income-page.extension", {extension_type: data_type}, "loading").then(
        (response)=> {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.extension_order = response.data;
          } else {
            Toast(response.msg);
          }
        });
    },
    //加载更多订单数据
    getMoreData() {
      if(this.template !== "01") {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.extension_order.current_page >= this.extension_order.last_page) {
        this.isLoadMore = false;
      } else {
        this.extension_order.current_page += 1;
        $http
          .get("finance.income-page.extension", {
            page: this.extension_order.current_page,
            extension_type: this.extension_type
          })
          .then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              let nextPageData = res.data.data;
              this.extension_order.data = this.extension_order.data.concat(nextPageData);
            } else {
              this.isLoadMore = false;
            }
          });
      }
    },

    getTemplate(data) {
      if (data.extension) {
        this.template = data.extension.name;
      }
      if(this.$store.state.temp.item.is_decorate === 1) {
        if(this.$store.state.temp.item.ViewSet.extension.is_default != 0) {
          this.template = this.$store.state.temp.item.ViewSet.extension.code.substring(9);
        }else {
          this.template = "01";
        }
      }
      if (!this.template) {
        this.template = "01";
      }
      require("@/assets/css/extension/extension_icon.scss");
      if (this.template === "02") {
        // 背景图片样式
        require("@/assets/css/extension/01.scss");
      } else {
        /// 阿里图标库样式
        require("@/assets/css/extension/02.scss");
      }
    },
    initMailLanguage() {
      this.mailLanguage = this.fun.initMailLanguage();
    },

    //验证手机身份
    gotoIncome() {
      $http.get("member.member.withdrawByMobile", {}, "loading").then(
        (response)=> {
          if (response.result === 1) {
            if (response.data.is_bind_mobile == 1) {
              this.$router.push(this.fun.getUrl("withdrawEditmobile", {}));
            } else {
              this.$router.push(this.fun.getUrl("withdrawal", {}));
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        });
    },

    //接口优化
    getExtensionData() {
      $http
        .get("finance.income-page.index", {}, "loading")
        .then(response => {
          if (response.result === 1) {
            const plugin_setting = JSON.parse(localStorage.getItem("plugin_setting"));
            this.highLightName = plugin_setting && plugin_setting.high_light && plugin_setting.high_light.diy_name || '高灯';
            if (!(this.fun.isTextEmpty(response.data.income_page.jump_link))) {
              window.location.href = response.data.income_page.jump_link;
              return;
            }

            if (response.data.template_set || this.$store.state.temp.item.is_decorate === 1) {
              this.getTemplate(response.data.template_set);
            } else {
              this.template = "01";
              require("@/assets/css/extension/02.scss");
              require("@/assets/css/extension/extension_icon.scss");
            }

            if(this.template == "01") {
              if(this.income_page) {
                return;
              }
              this.income_page = response.data.income_page;
              require("@/assets/css/icon.scss");
              if(this.income_page.set) {
                this.background_color = this.income_page.set.background_color || '#ffc11e';
              }
              this.share_page = this.income_page.button_enabled.share_page;
              this.income_statistic = this.income_page.income_statistic;
              this.income_dynamic = this.income_page.income_dynamic;
              this.fans_fission = this.income_page.fans_fission;
              this.isLoadMore = true;
              this.extension_order = this.income_page.extension_order;
              this.service = this.income_page.service;
              this.is_show_unable = this.income_page.button_enabled.is_show_unable;
              this.show_member_id = this.income_page.button_enabled.show_member_id;
              this.withdraw_date = this.income_page.button_enabled.withdraw_date;

              this.$nextTick(()=>{
                this.initEcharts();
                this.initFansEcharts();
              });
            }else {
              //是否显示更多权限
              this.is_show_unable = response.data.income_page.is_show_unable;
              this.show_member_id = response.data.income_page.show_member_id;
              this.withdraw_date = response.data.income_page.withdraw_date;
              //是否显示营业额
              this.is_show_performance = response.data.income_page.is_show_performance;

              if(response.data.income_page.parameter) {
                // 显示收入分享
                this.share_page = response.data.income_page.parameter.share_page;
                // 显示领取收益
                this.showEarning = response.data.income_page.parameter.plugin_settle_show;
              }
            }

            // 获取高灯数据
            if(response.data.high_light) {
              this.high_light = response.data.high_light;
            }

            // 用户信息
            this.userInfo = response.data.income_page.info;

            // 可用权限
            this.extension = response.data.income_page.available;
            // 更多权限
            this.unextension = response.data.income_page.unavailable;

            if (response.data.income_page && response.data.income_page.withdraw_limit) {
              this.is_show_limit = response.data.income_page.withdraw_limit.is_show;
              if (this.is_show_limit) {
                this.amount_num = response.data.income_page.withdraw_limit.amount;
              }
            }
          } else {
            this.template = "01";
            require("@/assets/css/extension/02.scss");
            require("@/assets/css/extension/extension_icon.scss");
          }
          // this.fun.setWXTitle($i18n.t('extension.我的推广')); //注释原因：快速切换导航会出现该执行语句把当前的标题覆盖掉，任务编号: 39656
        })
        .catch(error => {
          this.template = "01";
          require("@/assets/css/extension/02.scss");
          require("@/assets/css/extension/extension_icon.scss");
          console.error(error);
        });
    },
    showMoreIdentity() {
      this.moreIdentity = !this.moreIdentity;
    },
    toToast(){
      Toast(this.withdraw_date.day_msg);
    },
    openService() {
      console.log(this.service);
      if(this.service.cservice || this.service.service_mobile || this.service.service_QRcode) {
        this.showPopup = true;
      }else {
        window.location.href = this.service;
      }
    },
    pluginGoto(item) {
      // 插件跳转
      if(!item.name) {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
        return;
      }
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.url == "liveList") {
        this.$router.push(this.fun.getUrl(item.url, { from: 1 }));
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      }else if(item.name == "m-erweima") {
        // 海报
        this.openQrCode('block');
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.supplier_id
          })
        );
      } else {
        this.$router.push(this.fun.getUrl(item.url, { fromHome: 1 }));
      }
    },

    //页面跳转
    toPage(page) {
      if(page === 'withdrawal' && (this.withdraw_date&&this.withdraw_date.disable || this.userInfo.auto_withdraw&&this.withdraw_date&&!this.withdraw_date.disable)) {
        if(this.withdraw_date&&this.withdraw_date.disable) {
          this.toToast();
        }
        return;
      }
      if(page.indexOf('http') >= 0) {
        window.location.href = page;
      }else {
        this.$router.push(this.fun.getUrl(page, {}, { extension: "extension" }));
      }
    },

    //权限跳转
    gotoPage(item) {
      if (!item.is_relation) {
        this.$dialog.alert({message:"未开放该权限"});
        return;
      }

      if (!item.is_agent) {
        this.$router.push(this.fun.getUrl("ExtensionApply", {}));
        return;
      }

      if (item.mark === "point_activity") {
        this.$router.push(
          this.fun.getUrl(item.url, {}, { num: this.userInfo.member_id })
        );
        return;
      }

      this.$router.push(this.fun.getUrl(item.url, {}));
    },

    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      if (mailLanguage && mailLanguage.income) {
        this.income_name_text = mailLanguage.income.income_name;
      }

    },
    // 高灯入口跳转
    btnHighLight(){
      location.href = this.high_light.url;
    }

    //推广页
    // nextPage() {
    //   this.$router.push(this.fun.getUrl("ExtensionPage"));
    // },

    //跳转连锁店首页
    // gotoChainShop() {
    //   this.$router.push(this.fun.getUrl("ChainShopIndex"));
    // },

    //设置用户信息
    // setUserInfo() {
    //   $http.get("member.member.getUserInfo", {}).then(
    //     (response)=> {
    //       if (response.result === 1) {
    //         this.userName = response.data.nickname;
    //         this.vipId = response.data.uid;
    //         this.level = response.data.level_name;
    //         this.userAvatar = response.data.avatar;
    //       }
    //     },
    //     (response)=> {
    //       console.error(response);
    //     }
    //   );
    // },

    //获取设置信息
    // getExtensionInfo() {
    //   let that = this;
    //   let json = { i: this.fun.getKeyByI(), type: this.fun.getTyep() };
    //   $http.get("member.member.agentbase", json).then(
    //     function (response) {
    //       console.log(response);
    //       if (response.result == 1) {
    //         that.info_img = response.data.banner;
    //       } else {
    //         that.info_img = "";
    //       }
    //     },
    //     function (response) {
    //       console.log(response);
    //     }
    //   );
    // },
  },
  components: {
    countTo,
    yzGoodsposter,
    DConnectCustomerService,
    U_backup: () => import('../../components/new_diy/backup.vue'),
  }
};
