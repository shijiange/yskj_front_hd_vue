import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      mine: {}
    };
  },
  activated() {
    this.getMine();
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
    gotoUrl(str, query) {
      this.$router.push(this.fun.getUrl(str, {}, query));
    },
    getMine() {
      $http
        .get(
          "plugin.appointment.frontend.member.get-info",
          {},
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.mine = response.data;
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
