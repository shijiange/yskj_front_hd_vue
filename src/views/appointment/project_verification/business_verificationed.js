import { Toast } from "vant";

export default {
  data() {
    return {
      dataList: [],
      write_off_num: "",
      judge: true
    };
  },
  activated() {
    this.getWriteOff();
  },
  methods: {
    // 核销页面数据
    getWriteOff() {
      $http
        .get("plugin.store-projects.frontend.project-service.get-service-info", {
          id: this.$route.params.id || 1
        })
        .then(response => {
          if (response.result === 1) {
            this.dataList = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getConfirmWriteOf() {
      $http
        .get("plugin.store-projects.frontend.project-service.create", {
          id: this.$route.params.id || 1,
          used_count: this.write_off_num
        })
        .then(response => {
          if (response.result === 1) {
            Toast({
              message: response.msg,
              icon: "certificate"
            });
            this.getFresh(response.data.id);
            if (response.msg === "成功") {
              this.judge = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击核销
    btnConfirm() {
      this.getConfirmWriteOf();
    },
    // 核销成功后刷新数据
    getFresh(id) {
      $http
        .get("plugin.store-projects.frontend.project-service.get-detail", {
          id: id
        })
        .then(response => {
          if (response.result === 1) {
            this.dataList = response.data;
            this.dataList.used_count = this.dataList.total_use_count;
            this.dataList.rest_count = this.dataList.total_rest_count;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
