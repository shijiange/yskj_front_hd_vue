import cTitle from "components/title";
import cCalendar from "components/calendar";
import { Toast } from 'vant';
export default {
  data() {
    return {
      showProjects: false,
      show1: false,
      id: 0,
      project_id: 0,
      project: {},
      store: [],
      AStore: {},
      chooseTechnician: {
        name: ""
      },
      activeNames: ['1'],
      times: [],
      calendarEvents: [],
      technician: [],
      result: "",
      isRest: false,
      work_date: "",
      start_time: "",
      applyModel: {
        order_id: "",
        store_id: "",
        worker_id: "",
        customer_name: "",
        customer_tel: "",
        begin_time: ""
      },
      point: {},
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.project_id = this.$route.query.project_id;
    this.init();
    this.getData();
    this.today = new Date().getFullYear() + "-" + (new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : "0" + (new Date().getMonth() + 1)) + "-" + (new Date().getDate() >= 10 ? new Date().getDate() : "0" + new Date().getDate());
    this.work_date = this.today;
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
    init() {
      this.show1 = false;
      this.start_time = "";
      this.AStore = {};
      this.times = [];
      this.calendarEvents = [];
      this.technician = [];
      this.result = "";
      this.chooseTechnician = { name: "" };
      this.applyModel = {
        order_id: "",
        store_id: "",
        worker_id: "",
        customer_name: "",
        customer_tel: "",
        remark: "",
        begin_time: ""
      };
    },
    Sure() {
      this.showProjects = false;
    },
    clickTechnician(item) {
      this.chooseTechnician = item;
      console.log(this.chooseTechnician, "this.chooseTechnician");
    },
    toTime() {
      if (!this.applyModel.store_id) {
        Toast("请先选择门店");
        return;
      }
      this.activeNames = ['1'];
      this.getDate();
      this.getTime();
    },
    chooseStore(item) {
      this.AStore = item;
      this.applyModel.store_id = this.AStore.id;
      this.show1 = false;
      this.start_time = "";
      this.chooseTechnician.name = "";
    },
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.appointment-order.detail",
          { project_id: this.id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            if(response.data.default_customer) {
              this.applyModel.customer_tel = response.data.default_customer.tel;
              this.applyModel.customer_name = response.data.default_customer.name;
            }
            this.project = response.data.project;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStore() {
      if (!this.point.lng) {
        this.ready();
        return;
      }
      $http
        .get(
          "plugin.appointment.frontend.store.get-list-by-project-id",
          { lng: this.point.lng, lat: this.point.lat, project_id: this.project_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.store = response.data;
            this.show1 = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    makeAppointment() {
      if (!this.start_time) {
        Toast("请选择时间");
        return;
      }
      if (!this.start_time) {
        Toast("请填写电话");
        return;
      }
      if (!this.chooseTechnician.name) {
        Toast("请选择"+this.appointmentLang.worker);
        return;
      }
      if (!this.applyModel.customer_name) {
        Toast("请填写姓名");
        return;
      }
      if (!this.applyModel.customer_tel) {
        Toast("请填写电话");
        return;
      }
      this.applyModel.order_id = this.id;
      this.applyModel.worker_id = this.chooseTechnician.id;
      this.applyModel.begin_time = this.work_date + " " + this.start_time;
      $http
        .post(
          "plugin.appointment.frontend.appointment-service.create-service",
          this.applyModel,
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.$dialog.alert({ message: response.msg})
              .then(() => {

                this.$router.go(-1);
              }).catch(() => {});
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },

    selectedDay(e) {
      let date = "";
      if (e.length >= 3) {
        date = e[0] + "-" + e[1] + "-" + e[2];
      }
      if (e.length >= 4 && e[3].eventName) {
        this.isRest = false;
      } else {
        this.isRest = true;
      }
      this.work_date = date;
      this.start_time = "";
    },
    selectedTime(time) {
      this.start_time = time;
      this.getTechnician();
    },
    monthChanged(e) {
      // console.log(e);
    },
    getDate() {
      let that = this;
      $http
        .get(
          "plugin.appointment.frontend.work-time.get-work-dates",
          { store_id: this.applyModel.store_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.showProjects = true;
            this.calendarEvents = response.data.map(item => {
              if (item.work_date_format == that.today) {
                item.work_sattus == 1 ? that.isRest = true : that.isRest = false;
              }
              if (item.work_status == 1) {
                return item.work_date_format + "-休";
              } else {
                return item.work_date_format;
              }
            });
            if(response.data.length <= 0) {
              this.isRest = true;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTime() {
      $http
        .get(
          "plugin.appointment.frontend.work-time.get-start-times",
          { store_id: this.applyModel.store_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.times = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getTechnician() {
      $http
        .get(
          "plugin.appointment.frontend.worker.get-appointment-workers",
          {
            store_id: this.applyModel.store_id,
            project_id: this.project_id,
            work_date: this.work_date,
            start_time: this.start_time
          },
          "获取中"
        )
        .then(response => {
          this.activeNames = [];
          if (response.result === 1) {
            this.technician = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;

      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   //初始化数据
      //   this.getStore();
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }

      this.fun.getLocation()
        .then((res)=> {
          this.point = res.point;
          this.address = res.title;
          this.city = res.city;
          this.getStore();
        })
        .catch((err)=> {
          console.log(err);
        });
    },
  },
  components: { cTitle, cCalendar }
};
