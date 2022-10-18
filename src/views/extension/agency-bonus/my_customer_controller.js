import cTitle from "components/title";
import Modal from "components/modal";
import { Toast } from 'vant';

var currentTabIndex = "0";

//标记 防止重复加载
var is_first_content = false;
var is_second_content = false;
var is_third_content = false;
export default {
  data() {
    return {
      title1: "",
      title2: "",
      title3: "",
      WeChat: "",
      phone: "",
      //客户数据统计
      customer_num: "",
      total_customer: "",
      customer_order: "",
      total_order: "",
      //我的推荐人
      myReferral: "",
      //我推荐的人
      level1: "",
      level2: "",
      level3: "",

      activeName: "first",
      first_content: [],
      second_content: [],
      third_content: [],

      keyword: "",
      relationLevel: "1",
      last_page: "",
      iswechat: "",
      isphone: "",
      sort: 10000,


      show2: false,

      filterData: [], //筛选数据
      filterSort: -1,
      filterLevelData: [],
      filterLeveSort: -1,
      level1_page: 0,
      level2_page: 0,
      level3_page: 0,

      btnShow1: true,
      btnShow2: true,
      btnShow3: true,

      //微信弹窗
      showModal: false, // 控制弹窗显示
      mdTitle: "", // 弹窗标题
      mdTips: " ", // 弹窗底部提示
      mdValue: "", // 弹窗内容，电话或者微信号
      mdType: "Wechat"        // 目前只有微信, 可暂时不传
    };
  },
  methods: {
    // 控制弹窗显示的方法
    handleToggle: function(item) {
      this.showModal = !this.showModal;

      // 判断是微信，修改data值
      if (item) {
        this.mdTitle = item.nickname + "的微信号";
        this.mdTips = "点击复制客户微信,通过微信添加朋友可加客户好友!";
        this.mdValue = item.wechat.toString();
      }
    },
    toggle(event, n) {
      if (n == this.sort) {
        this.sort = 9999;
        return;
      } else {
        this.sort = n;
      }

    },

    initData() {
      currentTabIndex = "0";

      is_first_content = false;
      is_second_content = false;
      is_third_content = false;

      this.myReferral = "";
      this.level1 = { level: "一级", total: 0 };
      this.level2 = { level: "二级", total: 0 };
      this.level3 = { level: "三级", total: 0 };

      this.activeName = "first";
      this.first_content = [];
      this.second_content = [];
      this.third_content = [];

      this.keyword = "";
      this.relationLevel = "1";

      this.sort = 10000;

      this.show2 = false;
      this.filterData = [];
      this.filterLevelData = [];

      this.filterSort = -1;
      this.filterLeveSort = -1;

    },

    pageInit() {
      this.level1_page = 0;
      this.level2_page = 0;
      this.level3_page = 0;
      this.first_content = [];
      this.second_content = [];
      this.third_content = [];
      this.btnShow1 = true;
      this.btnShow2 = true;
      this.btnShow3 = true;
    },

    //我的推荐人
    getMyRelation() {
      var that = this;
      $http.get("plugin.agent-dividend.api.controllers.customer.index", {}, "").then(function(response) {
        if (response.result == 1) {
          that.myReferral = response.data;
        }// else {
        //}
      }, function(response) {

      });
    },

    // //我推荐的人基本信息
    getMyAgentBaseInfo() {
      var that = this;
      $http.get("plugin.agent-dividend.api.controllers.customer.get-data", {level_type: this.relationLevel}, "").then( (response) => {
        if (response.result == 1) {
          that.first_content = response.data.data;
          that.level1.total = response.data.member_count;
          that.level2.total = response.data.partner_member_count;
          that.level3.total = response.data.agent_member_count;
        } else {
          Toast(response.msg);
        }
      }, function(response) {

      });
    },

    //设置选择后的数据
    setDataByTabIndex() {
      if (currentTabIndex == "0" && !is_first_content) {
        is_first_content = true;
        this.relationLevel = "1";
        this.getData();
      } else if (currentTabIndex == "1" && !is_second_content) {
        is_second_content = true;
        this.relationLevel = "2";
        this.getData();
      } else if (currentTabIndex == "2" && !is_third_content) {
        is_third_content = true;
        this.relationLevel = "3";
        this.getData();
      }
    },

    //tab 点击
    handleClick(tab, event) {
      // let name = tab.name;
      /*因修改组建改方法*/
      let name = this.activeName;
      let index = "";
      switch (name) {
      case "first":
        index = "0";
        break;
      case "second":
        index = "1";
        break;
      case "third":
        index = "2";
        break;

      default:
        break;
      }
      //点击同tab 不刷新界面
      if (currentTabIndex == index) {
        return;
      } else {
        currentTabIndex = index;
      }

      console.log(currentTabIndex);
      this.setDataByTabIndex();
    },

    //加载数据
    getData() {
      var that = this;
      var page = 0;

      switch (currentTabIndex) {
      case "0":
        that.relationLevel = "1";
        page = that.level1_page + 1;
        that.level1_page = page;
        break;
      case "1":
        that.relationLevel = "2";
        page = that.level2_page + 1;
        that.level2_page = page;
        break;
      case "2":
        that.relationLevel = "3";
        page = that.level3_page + 1;
        that.level3_page = page;
        break;

      default:
        break;
      }
      console.log(that.relationLevel, "打印that.relationLevel");
      let json = {
        "page": page,
        "level_type": that.relationLevel
      };
      $http.get("plugin.agent-dividend.api.controllers.customer.get-data", json, "").then(function(response) {
        if (response.result == 1) {
          if (page >= response.data.last_page) {
            that.hidebutton();
          }

          if (that.fun.isTextEmpty(response.data.data)) {
            that.hidebutton();
          }

          if (response.data.data.length == 0) {
            that.hidebutton();
          }
          switch (currentTabIndex) {
          case "0":
            that.first_content = that.first_content.concat(response.data.data); //数组拼接
            break;
          case "1":
            that.second_content = that.second_content.concat(response.data.data); //数组拼接
            break;
          case "2":
            that.third_content = that.third_content.concat(response.data.data); //数组拼接
            break;
          default:
            break;
          }
        }
      }, function(response) {
        // error callback
      });
    },

    hidebutton() {
      switch (currentTabIndex) {
      case "0":
        this.btnShow1 = false;
        break;
      case "1":
        this.btnShow2 = false;
        break;
      case "2":
        this.btnShow3 = false;
        break;
      default:

        break;
      }
    }
  },
  computed: {
    labelValue1() {
      return `客户(${this.level1.total}人)`;
    },
    labelValue2() {
      return `合伙人(${this.level2.total}人)`;
    },
    labelValue3() {
      return `市代理(${this.level3.total}人)`;
    }
  },
  activated() {
    this.initData(); //初始化参数
    this.pageInit();
    this.getMyRelation();
    this.getMyAgentBaseInfo();
  },
  components: {
    cTitle,
    modal: Modal
  }
};
