import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      store_id: 0,
      technicianList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.store_id = this.$route.query.store_id;
    this.getTechnician();
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
    toAdd(item) {
      if (item.id) {
        this.$router.push(this.fun.getUrl("AddTechnician", { store_id: this.store_id}, {worker_id: item.id }));
      } else {
        this.$router.push(this.fun.getUrl("AddTechnician", { store_id: this.store_id }));
      }
    },
    deleteItem(item) {
      $http
        .get(
          "plugin.appointment.frontend.worker.delete-worker",
          { worker_id: item.id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.getTechnician();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTechnician() {
      $http
        .get(
          "plugin.appointment.frontend.worker.get-list-by-store-id",
          { store_id: this.store_id, page: 1 },
          "获取中"
        )
        .then(response => {
          this.fun.setWXTitle("门店"+this.appointmentLang.worker);
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.technicianList = response.data.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.appointment.frontend.worker.get-list-by-store-id",
            {
              store_id: this.store_id,
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.technicianList = that.technicianList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
