import cTitle from "components/title";

export default {
  data() {
    return {
      thumb: "",
      name: "",
      total: "",
      sure: "",
      hotel_id: 0,
      title: ""
    };
  },

  activated() {
    //console.log(this.$route.meta.title);
    this.title = this.$route.meta.title;

    //this.title = this.fun.getCustomizeHotelHead().hotels + '管理';
    this.getData();
  },

  mounted() {
  },

  methods: {
    initData() {
      this.user_info = {};
      this.income_info = {};
    },
    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.title =
          JSON.parse(localStorage.getItem("customizeHotelHead")).hotels +
          "管理";
        this.fun.setWXTitle(this.title);
      } else {
        $http
          .get(
            "plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name",
            {},
            "加载中..."
          )
          .then(response => {
            if (response.result == 1) {
              this.title = response.data.hotels + "管理";
              this.fun.setWXTitle(this.title);
              localStorage.setItem(
                "customizeHotelHead",
                JSON.stringify(response.data)
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getData() {
      let url = "";
      if (this.title == "收银台") {
        url = "plugin.hotel.frontend.cashier.center.index";
      } else {
        url = "plugin.hotel.frontend.hotel.center.index";
        this.getCustomizeHotelHead();
      }
      $http
        .get(url, {}, "加载中...")
        .then(res => {
          if (res.result == 1) {
            console.log(res);
            // this.thumb=res.data.store.thumb;
            // this.name=res.data.store.name;
            // this.total=res.data.income.money_total;
            // this.sure

            let [thumb, name, total, sure] = [
              res.data.hotel.thumb,
              res.data.hotel.name,
              res.data.income.money_total,
              res.data.income.sure_withdraw_money
            ];

            console.log(thumb);

            this.thumb = thumb;
            this.name = name;
            this.total = total;
            this.sure = sure;
            this.hotel_id = res.data.hotel.hotel_id;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    gotoRecharge() {
      this.$router.push(this.fun.getUrl("withdrawal"));
    },

    gotoOrder() {
      if (this.title == "收银台") {
        this.$router.push(
          this.fun.getUrl("hotelOrderlist", {
            status: "0",
            orderType: "hotelcashier"
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("hotelOrderlist", {
            status: "0",
            orderType: "hotel_center"
          })
        );
      }
    },
    gotoRecord() {
      if (this.title == "收银台") {
        this.$router.push(this.fun.getUrl("presentationRecord", {}, { from: "hotel_cashier" }));
      } else {
        this.$router.push(this.fun.getUrl("presentationRecord", {}, { from: "hotel" }));
      }

    },
    gotoStat() {
      this.$router.push(
        this.fun.getUrl("hotel_cashier_stat", {
          hotel_id: this.hotel_id,
          tag: "hotel"
        })
      );
    },
    gotoCode() {
      this.$router.push(
        this.fun.getUrl("hotel_cashier_qr", {
          hotel_id: this.hotel_id,
          tag: "hotel"
        })
      );
    }
  },
  components: { cTitle }
};
