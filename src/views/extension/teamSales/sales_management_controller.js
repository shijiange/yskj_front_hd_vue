import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      id: "1",
      year_sales: "",
      month_sales: "",
      currentDate:
        String(new Date().getFullYear()) +
        "-" +
        String(
          new Date().getMonth() + 1 > 9
            ? new Date().getMonth() + 1
            : "0" + String(new Date().getMonth() + 1)
        ) +
        "-" +
        "01",
      currentDate2: String(new Date().getFullYear()) + "-" + "01" + "-" + "01",
      empower: [
        {
          id: 1,
          name: "按月",
          checked: true
        },
        {
          id: 2,
          name: "按年",
          checked: false
        }
      ],
      datas: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      activeName: "0",
      custom_name: "",
      tapone:false,
      taptwo:false,
      DateOne:new Date(),
      DateTwo:new Date()
    };
  },

  activated() {
    this.initData();
    if (this.activeName == "0") {
      console.log('12312312');
      this.getData();
    } else if (this.activeName == "1") {
      this.getnext();
    }
  },
  mounted() {},

  methods: {
    initData() {
      this.id = "1";
      this.currentDate =
        String(new Date().getFullYear()) +
        "-" +
        String(
          new Date().getMonth() + 1 > 9
            ? new Date().getMonth() + 1
            : "0" + String(new Date().getMonth() + 1)
        ) +
        "-" +
        "01";
      this.currentDate2 =
        String(new Date().getFullYear()) + "-" + "01" + "-" + "01";
      this.empower = [
        {
          id: 1,
          name: "按月",
          checked: true
        },
        {
          id: 2,
          name: "按年",
          checked: false
        }
      ];
      this.datas = [];
      (this.page = 1), //分页数，当前页数
      (this.isLoadMore = true), //判断是否要加载更多的标志
      (this.total_page = 0); //总页数
    },
    cut(item) {
      return item.split("-");
    },
    selectTime() {
      if (this.activeName == "0") {
        this.getData();
      } else {
        this.getnext();
      }
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    setOne(){
      this.currentDate = this.timestampToTime(this.DateOne);
      this.tapone = false;
      this.selectTime();
    },
    setTwo(){
      this.currentDate2 = this.timestampToTime(this.DateTwo);
      this.taptwo = false;
      this.selectTime();
    },
    showTime() {
      if (this.activeName == "0") {
        if (this.id == 1) {
          // this.$refs.datetime.open();
          this.tapone = true;
        } else if (this.id == 2) {
          // this.$refs.datetime2.open();
          this.taptwo = true;
          setTimeout(() => {
            document.getElementsByClassName("van-picker-column")[1].style.display = "none";
          }, 100);
        }
      } else if (this.activeName == "1") {
        if (this.id == 1) {
          // this.$refs.datetime.open();
          this.tapone = true;
        } else if (this.id == 2) {
          // this.$refs.datetime2.open();
          this.taptwo = true;
          setTimeout(() => {
            document.getElementsByClassName("van-picker-column")[1].style.display = "none";
          }, 100);
        }
      }
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    chooseEnp(item) {
      this.empower.forEach((list, index, key) => {
        if (item.id == list.id) {
          list.checked = true;
          this.id = item.id;
          this.page = 1;
          this.isLoadMore = true;
          if (this.activeName == "0") {
            this.getData();
          } else {
            this.getnext();
          }
        } else {
          list.checked = false;
        }
      });
    },
    //获取数据
    getData() {
      let that = this;
      let json = {
        time_types: this.id == "1" ? "1" : "2",
        year:
          this.id == "1"
            ? this.cut(this.currentDate)[0]
            : this.cut(this.currentDate2)[0],
        month: this.id == "1" ? this.cut(this.currentDate)[1] : ""
      };
      $http
        .post(
          "plugin.goods-sales.frontend.controllers.list.index",
          { search: json },
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.month_sales = response.data.month_sales;
              that.year_sales = response.data.year_sales;
              that.custom_name = response.data.set.custom_name
                ? response.data.set.custom_name
                : "团队销量管理";
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取下级数据
    getnext() {
      let that = this;
      let json = {
        search: {
          time_types: this.id == "1" ? "1" : "2",
          year:
            this.id == "1"
              ? this.cut(this.currentDate)[0]
              : this.cut(this.currentDate2)[0],
          month: this.id == "1" ? this.cut(this.currentDate)[1] : ""
        },
        page: this.page
      };
      $http
        .post(
          "plugin.goods-sales.frontend.controllers.list.index",
          json,
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.total_page = response.data.subordinate.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.datas = response.data.subordinate.data;
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据，加载更多
    getMoreData() {
      if (this.activeName == "1") {
        this.isLoadMore = false; // 防止多次请求分页数据
        const that = this;
        if (that.page >= that.total_page) {
          return;
        } else {
          that.page += 1;
          let json = {
            search: {
              time_types: this.id == "1" ? "1" : "2",
              year:
                this.id == "1"
                  ? this.cut(this.currentDate)[0]
                  : this.cut(this.currentDate2)[0],
              month: this.id == "1" ? this.cut(this.currentDate)[1] : ""
            },
            page: this.page
          };
          $http
            .post(
              "plugin.goods-sales.frontend.controllers.list.index",
              json,
              "加载中..."
            )
            .then(res => {
              that.isLoadMore = true;
              if (res.result == 1) {
                var nextPageData = res.data.subordinate.data;
                that.datas = that.datas.concat(nextPageData); //进行数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else {
        return;
      }
    },
    handleClick(index, title) {
      this.initData();
      if (this.activeName == "0") {
        console.log('12312312');
        this.getData();
      } else if (this.activeName == "1") {
        this.getnext();
      }
      // this.getNetData();
    }
  },
  components: { cTitle }
};
