import cTitle from "components/title";
import { Toast } from 'vant';
import diyform from "../activity_form";
export default {
  data() {
    return {
      payStatus:'',
      form_data_id:'',
      id: "",
      detail: {},
      has_one_activity: {},
      city: "",
      type: "Detail",
      datas: {
        params: {},
        data: {
          form_id: ""
        }
      },
      has_one_order:{}
    };
  },
  activated() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getData();
    } else {
      this.$router.go(-1);
    }
  },
  mounted() {},
  methods: {
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes()) + ":";
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getData() {
      let json = { order_id: this.id };
      $http
        .get("plugin.activity-apply.api.order.getMyEnrol", json, "获取中")
        .then(
          response => {
            if (response.result == 1) {
              this.detail = response.data;
              this.has_one_activity = this.detail.has_one_activity;
              this.city = this.has_one_activity.city_name;
              this.datas.data.form_id = this.detail.form_data_id.form_id;
              this.form_data_id=this.detail.form_data_id.form_data_id;
              this.payStatus=this.detail.status;
              this.has_one_order = this.detail.has_one_order;
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    }
  },
  components: {
    cTitle,
    diyform
  }
};
