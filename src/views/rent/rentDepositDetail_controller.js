import cTitle from 'components/title';

var currentTabIndex = "0";
//标记 防止重复加载
var is_first_content = false;
var is_second_content = false;
var is_third_content = false;
export default {
  components: { cTitle },
  data() {
    return {
      first_content: "",
      second_content: "",
      third_content: [],
      activeName: 'first',
      income_name_text: "",
    };
  },

  activated() {
    //初始化参数
    this.initData();
    this.getData();
    this.customizeIncome();
  },

  methods: {

    //初始化参数
    initData() {
      currentTabIndex = "0";
      is_first_content = false;
      is_second_content = false;
      is_third_content = false;

      this.first_content = "";
      this.second_content = "";
      this.third_content = [];
      this.activeName = 'first';

    },

    //获取数据
    getData(type) {
      let json = { "service_type": type};
      $http.get('plugin.lease.Frontend.Modules.Deposit.Controllers.record.index', json, "加载中...").then(function (response) {
        if (response.result == 1) {
          console.log(response);
        } else {
          console.log(response.msg);
        }

      }, function (response) {
      });
    },

    //设置选择后的数据
    setDataByTabIndex() {
      console.log("setDataByTabIndex");
      if (currentTabIndex == "0" && !is_first_content) {
        is_first_content = true;
        this.getData("0");
      } else if (currentTabIndex == "1" && !is_second_content) {
        is_second_content = true;
        this.getData("1");
      } else if (currentTabIndex == "2" && !is_third_content) {
        is_third_content = true;
        this.getData("2");
      }
    },

    //tab 点击
    handleClick(tab, event) {
      //点击同tab 不刷新界面
      // if (currentTabIndex == tab.index) {
      // 	return;
      // } else {
      // 	currentTabIndex = tab.index;
      // }
      /*因修改组建改方法*/
      if (currentTabIndex == tab) {
        return;
      } else {
        currentTabIndex = tab;
      }
      this.setDataByTabIndex();
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  }
};
