import cTitle from "components/title";
import { Toast } from 'vant';
// import { scrollMixin } from "utils/mixin";

export default {
  data() {
    return {
      store_id: 0,
      worker_id: 0,
      store: []
    };
  },
  activated() {
    this.worker_id = this.$route.query.worker_id;
    this.getData();
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
    addTime(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("TechnicianTime", { worker_id: this.worker_id }, item));
      } else {
        this.$router.push(this.fun.getUrl("TechnicianTime", { worker_id: this.worker_id }));
      }

    },
    showMore(obj) {
      if (obj.show && this.amount_id === obj.amount_id) {
        obj.show = false;
        return;
      }
      this.amount_id = obj.amount_id;
      this.$set(obj, "show", true);
    },
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.store.get-list-by-worker-uid",
          {},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.store = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTime(obj) {
      if (obj.show) {
        obj.show = false;
        return;
      }
      this.store_id = obj.id;
      $http
        .get(
          "plugin.appointment.frontend.appointment-service.get-by-worker",
          { store_id: this.store_id, worker_id: this.worker_id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.$set(obj, "show", true);
            this.$set(obj, "times", response.data);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
