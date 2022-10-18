import cTitle from "components/title";
import { Toast } from 'vant';
import cCalendar from "components/calendar";

export default {
  data() {
    return {
      calendarEvents: [],
      currentTime: "12:00",
      isRest: false,
      today: "",
      show1: false,  // 编辑时间
      showDay: false, // 按天添加时间
      showTime: false, // 选择时间
      showDefault: false,  // 添加默认时间
      showStore: false,    // 显示门店
      store: [],
      chooseStore: {},
      default_time: [],
      day_time: [],
      choose_start: "",
      choose_end: "",
      start: false,
      isDefault: 0,
      period_id: "",
      from: "",
      isChange: false,
    };
  },
  activated() {
    this.initData();
    this.from = this.$route.query.from;
    this.worker_id = this.$route.params.worker_id;
    this.today = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
    if (this.$route.query.id) {
      this.choose({
        id: this.$route.query.id,
        store_name: this.$route.query.store_name
      });
    }
  },
  computed: {
    appointmentLang() {
      if(this.$store.state.shopLanguage.appointment) {
        return this.$store.state.shopLanguage.appointment;
      }else {
        return {worker: "技师", project: "项目", service: "服务"};
      }
    },
  },
  methods: {
    initData() {
      this.calendarEvents= [];
      this.currentTime= "12:00";
      this.isRest= false;
      this.today= "";
      this.show1= false;  // 编辑时间
      this.showDay= false; // 按天添加时间
      this.showTime= false; // 选择时间
      this.showDefault= false;  // 添加默认时间
      this.showStore= false;    // 显示门店
      this.store= [];
      this.chooseStore= {};
      this.default_time= [];
      this.day_time= [];
      this.choose_start= "";
      this.choose_end= "";
      this.start= false;
      this.isDefault= 0;
      this.isChange = false;
    },
    editTime(item) {
      if (item.work_hour_start) {
        this.choose_start = item.work_hour_start;
        this.choose_end = item.work_hour_end;
        this.isDefault = 0;
        this.period_id = item.id;
      }
      this.show1 = true;
      this.showDay = false;
      this.showDefault = false;
    },
    clearTime() {
      this.show1 = false;
      this.choose_start = "";
      this.choose_end = "";
    },
    addDefaultTime() {
      this.showDefault = true;
      this.isDefault = 1;
    },
    addTime() {
      this.showDay = true;
      this.isDefault = 2;
    },
    confirmTime(e) {
      this.start ? this.choose_start = e : this.choose_end = e;
      this.showTime = false;
    },
    selectedDay(e) {
      if (this.chooseStore.id) {
        let date = "";
        if (e.length >= 3) {
          date = e[0] + "-" + e[1] + "-" + e[2];
        }
        this.today = date;
        this.getService();
      }
    },
    monthChanged(e) {
      // console.log(e);
    },
    chooseTime(str, time) {
      str === "start" ? this.start = true : this.start = false;
      if (time) {
        this.currentTime = time;
      }
      this.showTime = true;
    },
    choose(item) {
      this.chooseStore = item;
      this.showStore = false;
      this.getDefaultTime();  // 获取门店默认工作时间
      this.getAllService();   // 获取门店全部预约时间
      this.getService();     // 获取门店今天预约时间
    },
    getStore() {
      $http
        .get(
          "plugin.appointment.frontend.store.get-list-by-worker-uid",
          {},
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.store = response.data;
            this.showStore = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDefaultTime() {
      $http
        .get(
          "plugin.appointment.frontend.work-time.get-default-period",
          { store_id: this.chooseStore.id, worker_id: this.worker_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.default_time = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getService() {
      $http
        .get(
          "plugin.appointment.frontend.work-time.get-period-list-by-date",
          { store_id: this.chooseStore.id, worker_id: this.worker_id, work_date: this.today },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            for(let i = 0;i< response.data.period_list.length;i++) {
              response.data.period_list[i].status == 1 ? response.data.period_list[i].status = false: response.data.period_list[i].status = true;
            }
            this.day_time = response.data.period_list;
            response.data.worker_status == 1 ? this.isRest = false: this.isRest = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllService() {
      $http
        .get(
          "plugin.appointment.frontend.work-time.get-worker-dates-by-store-id",
          { store_id: this.chooseStore.id, worker_id: this.worker_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.calendarEvents = response.data.map(item => {
              if (item.work_status == 1) {
                return item.work_date_format + "-休";
              } else {
                return item.work_date_format;
              }
            });
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteTime(date) {
      $http
        .get(
          "plugin.appointment.frontend.work-time.del-default-period",
          { time_id: date.id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.getDefaultTime();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitTime() {
      let json = {};
      let url = "";
      if (this.isDefault === 1) {
        // 添加默认时间
        url = "plugin.appointment.frontend.work-time.add-default-period";
        json = {
          store_id: this.chooseStore.id,
          worker_id: this.worker_id,
          work_hour_start: this.choose_start,
          work_hour_end: this.choose_end
        };
      } else if (this.isDefault === 2) {
        // 按天添加时间
        url = "plugin.appointment.frontend.work-time.add-date-period";
        json = {
          store_id: this.chooseStore.id,
          worker_id: this.worker_id,
          work_hour_start: this.choose_start,
          work_hour_end: this.choose_end,
          work_date: this.today
        };
      } else {
        // 编辑时间
        url = "plugin.appointment.frontend.work-time.edit-date-period";
        json = { period_id: this.period_id, work_hour_start: this.choose_start, work_hour_end: this.choose_end };
      }
      $http
        .post(url, json, "获取中")
        .then(response => {
          if (response.result === 1) {
            this.show1 = false;
            this.choose_start = "";
            this.choose_end = "";
            if (this.isDefault === 1) {
              this.getDefaultTime();
            } else {
              this.getService();
            }
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeStatus(item, str) {
      let status = 0;
      str ? status = 0 : status = 1;
      if(!this.isChange) {
        this.isChange = true;
        $http
          .get(
            "plugin.appointment.frontend.work-time.change-status-by-id",
            { period_id: item.id, status: status },
            "获取中"
          )
          .then(response => {
            if (response.result === 1) {
              this.getService();
              // Toast(response.msg);
            } else {
              Toast(response.msg);
            }
            setTimeout(()=>{
              this.isChange = false;
            },1000);
          })
          .catch(err => {
            this.isChange = false;
            console.log(err);
          });
      }
    },
    changeDayStatus(str) {
      let status = 0;
      str ? status = 0 : status = 1;
      if(!this.isChange) {
        this.isChange = true;
        $http
          .get(
            "plugin.appointment.frontend.work-time.change-status-by-date",
            { store_id: this.chooseStore.id, worker_id: this.worker_id, work_date: this.today, status: status },
            "获取中"
          )
          .then(response => {
            if (response.result === 1) {
              this.getService();
              // Toast(response.msg);
            } else {
              Toast(response.msg);
            }
            setTimeout(()=>{
              this.isChange = false;
            },1000);
          })
          .catch(err => {
            this.isChange = false;
            console.log(err);
          });
      }
    }
  },
  components: { cTitle, cCalendar }
};
