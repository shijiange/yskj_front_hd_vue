var canvas = "";
import QRCode from "qrcode";
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      WriteOffData: [],
      show: false
    };
  },
  activated() {
    this.getWriteOff();
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
    });
  },
  methods: {
    // 获取核销数据
    getWriteOff() {
      $http
        .get("plugin.store-projects.frontend.project-service.get-service-info", {
          id: this.$route.params.item.id
        })
        .then(response => {
          if (response.result === 1) {
            this.WriteOffData = response.data;
            this.createQrc(this.WriteOffData);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    createQrc(item) {
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/BusinessVerification/" + item.id + "?tag=pro&i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid();
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
        }
      });
    }
  },
  components: { cTitle }
};
