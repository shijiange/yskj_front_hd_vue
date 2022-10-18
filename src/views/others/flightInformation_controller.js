import cTitle from "components/title";
import { Toast } from "vant";
// import { scrollMixin } from "utils/mixin";
import cDyPopup from "components/diyform";

export default {
  // mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false, //说明显示
      columnsShow: false, //picke显示
      columns: [], //pick数据
      start_name: "", //始发地名称
      destination_name: "", //到达地名称
      flight_name: "", //航班名称
      info: [], //主数据
      banner_one: "", //轮播图
      banner_two: "", //轮播图
      banner_three: "", //轮播图
      dfData: [], //表单数据
      goodDYDormID: "", //表单id
      dyFormPopup: false, //表单显示
      start_id: "", //始发地id
      destination_id: "", //到达地id
      flight_id: "", //航班id
      form_data_id: "", //编辑id
      flight_time: "", //航班日期
      startTime: "",
      endTime: "",
      nowDate: Date.parse(new Date()),
      // 二期
      calendarShow: false,
      minDate: new Date(),
      maxDate: new Date(),
      form: {
        destination: "",
        terminus: "",
        flight: "",
        isDateName: ""
      },
      moreList: [],
      selectShow: false,
      noKey: "",
      morePage: 1,
      page: 1
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    goDetail() {
      this.$router.push(this.fun.getUrl("flightInformationDetailList", { id: this.$route.params.id, type: "livePlay" }));
    },
    search(e) {
      console.log(e);
      if (e == "des") {
        // 出发地搜索
        this.selectShow = true;
        this.noKey = e;
        this.searchGinfo();
        console.log("出发地搜索");
      } else if (e == "ter") {
        // 目的地搜索
        console.log("目的地搜索");
        this.selectShow = true;
        this.noKey = e;
        this.searchGinfo();
      } else if (e == "fli") {
        // 航班号搜索
        console.log("航班号搜索");
        this.noKey = "fli";
        this.selectShow = true;
        this.searchFlight();
      }
    },
    // 搜索城市
    searchGinfo(info) {
      console.log(info, this.noKey);
      let word;
      if (info == "more") {
        this.page = this.page + 1;
      } else {
        this.page = 1;
      }
      if (this.noKey == "des") {
        word = this.form.destination;
      } else if (this.noKey == "ter") {
        word = this.form.terminus;
      }
      $http
        .get("plugin.flight-collect.frontend.index.get-city", { keyword: word, page: this.page }, " ")
        .then(response => {
          if (response.result === 1) {
            if (info == "more") {
              let more = this.moreList.concat(response.data.data);
              this.moreList = more;
            } else {
              this.moreList = response.data.data;
            }
            this.morePage = response.data.last_page;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 搜索航班
    searchFlight(info) {
      $http
        .get("plugin.flight-collect.frontend.index.get-flight-number", { keyword: this.form.flight, page: this.page }, " ")
        .then(response => {
          if (response.result === 1) {
            if (info == "more") {
              let more = this.moreList.concat(response.data.data);
              this.moreList = more;
            } else {
              this.moreList = response.data.data;
            }
            this.morePage = response.data.last_page;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    tapMore() {
      if (this.noKey == "fli") {
        this.searchFlight("more");
      } else {
        this.searchGinfo("more");
      }
    },
    checkClose() {
      console.log(this.noKey);
      if (this.noKey == "des") {
        if (this.start_id == "") {
          console.log("11111");
          this.form.destination = "";
        }
      } else if (this.noKey == "ter") {
        if (this.destination_id == "") {
          console.log("11111");
          this.form.terminus = "";
        }
      } else if (this.noKey == "fli") {
        if (this.flight_id == "") {
          console.log("11111");
          this.form.flight = "";
        }
      }
    },
    tapSelect(item) {
      if (this.noKey == "des") {
        this.start_id = item.id;
        this.form.destination = item.flight_city_name;
      } else if (this.noKey == "ter") {
        this.destination_id = item.id;
        this.form.terminus = item.flight_city_name;
      } else if (this.noKey == "fli") {
        this.flight_id = item.id;
        this.form.flight = item.flight_number;
      }
      this.selectShow = false;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.form.isDateName = this.formatDate(date);
      let timestr = this.formartDateTime(this.form.isDateName) / 1000;
      this.flight_time = timestr;
    },
    formartDateTime(dateStr) {
      dateStr = dateStr.replace(/-/g, "/");
      dateStr = dateStr + " 00:00:00";
      var timestamp = new Date(dateStr).getTime();
      return timestamp;
    },
    fun_date(num) {
      var date1 = new Date();
      //今天时间
      var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
      console.log(time1);
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + num);
      //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
      var time2 = date2.getFullYear() + "/" + (date2.getMonth() + 1) + "/" + date2.getDate();
      return time2;
    },
    linkUrl(url) {
      window.location.href = url;
    },
    onCancel(e) {
      console.log(e);
    },
    getData() {
      let that = this;
      $http
        .get("plugin.flight-collect.frontend.index", {}, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.columns = response.data.flight;
              this.info = response.data;
              this.banner_one = response.data.banner_one;
              this.banner_two = response.data.banner_two;
              this.banner_three = response.data.banner_three;
              this.goodDYDormID = response.data.diyform;
              this.dfData = response.data.form_data;
              this.startTime = this.info.hours_start;
              this.endTime = this.info.hours_end;
              // 二期 日期规则
              let time1 = this.fun_date(1);
              this.minDate = new Date(time1);
              if(response.data.flight_time) {
                let time2 = this.fun_date(Number(response.data.flight_time));
                console.log(time2);
                this.maxDate = new Date(time2);
              }
              
              // 二期 日期规则 end
              if (this.info.is_submit) {
                // 指定时间限制
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let start_Min = Date.parse(`${year}/${month}/${day} ${this.startTime}:00`);
                let end_Min = Date.parse(`${year}/${month}/${day} ${this.endTime}:00`);
                console.log(start_Min, end_Min, this.nowDate);
                if (this.nowDate >= start_Min && this.nowDate <= end_Min) {
                  this.info.is_submit = 1;
                } else {
                  this.info.is_submit = 0;
                }
              }
              if (response.data.form_data) {
                // 已填回显处理
                if (response.data.form_data.form_data_id) {
                  this.form_data_id = response.data.form_data.form_data_id;
                }
              }
              that.dyFormPopup = true;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    dfsave(e) {
      let arr = e;
      console.log(e);
      let json = {
        start_id: this.start_id,
        destination_id: this.destination_id,
        flight_id: this.flight_id,
        form_id: this.goodDYDormID,
        form_data: JSON.stringify(arr),
        form_data_id: this.form_data_id ? this.form_data_id : "",
        flight_time: this.flight_time
      };
      $http
        .get("plugin.flight-collect.frontend.index.save-diy-form-data", json, " ")
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.start_id = "";
            this.destination_id = "";
            this.flight_id = "";
            this.form_data = "";
            this.form_type = "";
            this.flight_time = "";
            this.form = {
              destination: "",
              terminus: "",
              flight: "",
              isDateName: ""
            };
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    gofunarr(e) {
      if (this.fun.isTextEmpty(this.start_id)) {
        Toast("请填写出发地");
        return;
      }

      if (this.fun.isTextEmpty(this.destination_id)) {
        Toast("请填写目的地");
        return;
      }

      if (this.fun.isTextEmpty(this.flight_id)) {
        Toast("请填写航班");
        return;
      }

      if (this.fun.isTextEmpty(this.flight_time)) {
        Toast("请填写飞行计划日期");
        return;
      }

      if (this.info.is_submit) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let start_Min = Date.parse(`${year}/${month}/${day} ${this.startTime}:00`);
        let end_Min = Date.parse(`${year}/${month}/${day} ${this.endTime}:00`);
        if (this.nowDate >= start_Min && this.nowDate <= end_Min) {
          this.info.is_submit = 1;
          this.$refs.gofunarr.submit();
        } else {
          this.info.is_submit = 0;
          return;
        }
      }
    }
  },
  components: { cTitle, cDyPopup }
};
