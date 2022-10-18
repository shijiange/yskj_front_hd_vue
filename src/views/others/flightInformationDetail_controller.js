import cTitle from "components/title";
import { Toast } from "vant";
// import { scrollMixin } from "utils/mixin";
import cDyPopup from "components/diyform";

export default {
  data() {
    return {
      id: "",
      form_id: "",
      dfData: [],
      from: [],
      dyFormPopup: false
    };
  },
  activated() {
    console.log(this.$route);
    this.id = this.$route.params.id;
    this.form_id = this.$route.params.form_id;
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.flight-collect.frontend.index.get-form-details", { form_id: this.form_id, id: this.id }, " ")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.dfData = response.data.diy_from;
            this.from = response.data.form_data;
            this.dyFormPopup = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    //将时间戳转换成正常时间格式
    timestampToTime: function(timestamp) {
      if (!Number(timestamp) || timestamp == "") {
        return "";
      }
      let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + ".";
      let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + ".";
      let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      // let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      // let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return Y + M + D ;
    }
  },
  components: { cTitle, cDyPopup }
};
