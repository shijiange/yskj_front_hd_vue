import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      certificates: "",
      explain_that: "",
      plugin_name: "",
      integral: ""
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.certificates = "";
      this.explain_that = "";
      this.plugin_name = "";
      this.integral = "";
    },
    afterRead(e) {
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      axios
        .post(That.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          That.certificates = response.data.data.img_url;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .get("plugin.integral.Frontend.Controllers.recharge.display", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.explain_that = response.data.explain_that;
            this.plugin_name = response.data.plugin_name;
            this.fun.setWXTitle(this.plugin_name);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirm() {
      if (this.fun.isTextEmpty(this.certificates)) {
        Toast("请上传充值凭证");
        return;
      }
      if (this.fun.isTextEmpty(this.integral)) {
        Toast("请填写充值积分");
        return;
      }
      if (this.integral <= 0) {
        Toast("充值积分必须大于0");
        return;
      }
      let json = {
        certificates: this.certificates,
        integral: this.integral
      };
      $http
        .get(
          "plugin.integral.Frontend.Controllers.recharge.recharge",
          json,
          "提交中"
        )
        .then(response => {
          if (response.result == 1) {
            Toast("充值成功");
            this.$store.commit("savePop", {
              show: true,
              name: this.plugin_name
            });
            this.$router.go(-1);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: { cTitle }
};
