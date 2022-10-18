import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
import QRCode from "qrcode";

var canvas = "";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      num: 0,
      projectList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
    });
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
    toAppointment(item) {
      this.$router.push(this.fun.getUrl("MakeAppointment", { id: item.id },{ project_id: item.project_id }));
    },
    createQrc(item) {
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/client_verification/" + item.id + "?tag=pro&i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid();
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
          this.show = true;
        }
      });
    },
    init() {
      this.projectList = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.show = false;
    },
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.appointment-order.get-list",
          { status: this.num, page: 1 },
          "加载中"
        )
        .then(response => {
          this.fun.setWXTitle("我的"+this.appointmentLang.project);
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
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
            "plugin.appointment.frontend.appointment-order.get-list",
            {
              status: this.num,
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
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
    },
    //判断tab
    selectTab() {
      this.init();
      this.getData();
    }
  },
  components: { cTitle }
};
