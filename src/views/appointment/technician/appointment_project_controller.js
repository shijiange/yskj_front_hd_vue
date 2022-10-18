import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      active: 0,
      url: "",
      projectList: [],
      title: '已预约项目',

      // more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    if (this.$route.query.name === "store") {
      this.title = "门店预约";
      this.url = "plugin.appointment.frontend.appointment-service.get-list-by-store";
    } else {
      this.title = "技师预约";
      this.url = "plugin.appointment.frontend.appointment-service.get-list-by-worker";
    }
    this.active = 0;
    this.init();
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
    init() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.projectList = [];
    },
    sure(id) {
      this.$dialog.confirm({ message: "您确定要取消此预约吗?"})
        .then(() => {
          this.cancelDate(id);
        }).catch(() => {
          console.log("cancel");
        });
    },
    cancelDate(id) {
      $http
        .get(
          "plugin.appointment.frontend.appointment-service.cancel-service",
          {
            id: id
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.getData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectTab(e) {
      this.getData();
    },
    getData() {
      this.init();
      $http
        .get(
          this.url,
          {
            status: this.active,
            page: this.page
          },
          "获取中"
        )
        .then(response => {
          this.fun.setWXTitle(this.title);
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            this.url,
            {
              status: this.active,
              page: this.page
            },
            "加载中"
          )
          .then((response) => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.projectList = that.projectList.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
          );
      }
    }
  },
  components: {}
};
