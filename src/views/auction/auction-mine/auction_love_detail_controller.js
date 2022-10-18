import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      recordsList: [],
      activeName: 0,
      currentTabIndex: 0,
      name: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      income_name_text: "",
    };
  },
  activated() {
    this.initData();
    this.getName();
    this.getData();
    this.customizeIncome();
  },
  methods: {
    getName() {
      $http
        .get("plugin.integral.Frontend.Controllers.page.get-name", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.name = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initData() {
      this.recordsList = [];
      this.activeName = 0;
      this.currentTabIndex = 0;
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.name = "";
    },
    //tab 点击
    handleClick(index, title) {
      if (this.currentTabIndex !== index) {
        this.currentTabIndex = index;
        this.getData();
      }
    },
    getData() {
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.Records",
          { index: this.currentTabIndex },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.page = 1;
            this.total_page = response.data.pageList.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.pageList.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.integral.Frontend.Modules.Integral.Controllers.Records",
            {
              index: this.currentTabIndex,
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.pageList.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
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
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: { cTitle }
};
