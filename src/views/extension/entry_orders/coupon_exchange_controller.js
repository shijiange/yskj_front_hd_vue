import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      info: {},
      wholesaleNum: null,
      isFirst: true //避免重复点击
    };
  },
  activated() {
    this.info = {};
    this.wholesaleNum = null;
    this.isFirst = true;
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.pending-order.frontend.member-wholesale.point").then(
        response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
            this.isNO = true;
            this.$router.go(-1);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    pointSwap() {
      let hasIntegral = Number(this.info.credit1);
      let needIntegral = parseInt(this.wholesaleNum) * this.info.point_convert;

      if (!this.isFirst) {
        return;
      }
      this.isFirst = false; //避免重复提交

      if (this.fun.isTextEmpty(this.wholesaleNum) || this.wholesaleNum == 0) {
        Toast("请输入兑换张数");
        return;
      }
      if (hasIntegral < needIntegral) {
        Toast("积分不足！");
        return;
      }
      if (this.fun.isTextEmpty(this.info.activity_id)) {
        Toast("活动ID无效！");
        return;
      }
      let json = {
        wholesale_unm: parseInt(this.wholesaleNum), //兑换批发劵数量
        activity_id: this.info.activity_id //活动id
      };
      $http
        .get("plugin.pending-order.frontend.member-wholesale.point-swap", json)
        .then(
          response => {
            this.isFirst = true;
            if (response.result === 1) {
              Toast(response.msg);
              this.$router.push(this.fun.getUrl("EntryVolume", {}));
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    }
  },
  components: { cTitle }
};
