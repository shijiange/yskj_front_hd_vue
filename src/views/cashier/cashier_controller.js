// import { mapState, mapMutations } from "vuex";
import cTitle from "../../components/title";

var intervalid;

export default {
  data() {
    return {
      store: {
        name: "",
        thumb: ""
      },
      income: {
        money_total: 0.0,
        sure_withdraw_money: 0.0
      },
      store_set: {
        is_cash_pay: "",
        is_open_cashier: "",
        is_write_information: ""
      },

      vedioSrc: "",
      order_status: []
    };
  },

  mounted() {},
  methods: {
    toPage(str,query={}) {
      if (str === "cashierOrderlist") {
        if(this.order_status && this.order_status.length > 0) {
          this.$router.push(
            this.fun.getUrl(str, { status: this.order_status[0].toString(), orderType: "cashier" }, {status: this.order_status.toString()})
          );
        }else {
          this.$router.push(
            this.fun.getUrl(str, { status: "0", orderType: "cashier" })
          );
        }
        return;
      }
      this.$router.push(this.fun.getUrl(str,{},query));
    },
    goback() {
      this.$router.go(-1);
    },
    getStoreInfo() {
      var that = this;
      $http
        .get("plugin.store-cashier.frontend.cashier.center.index", {})
        .then(
          (response)=> {
            if (response.result == 1) {
              that.store = response.data.store;
              that.income = response.data.income;
              that.store_set = response.data.store_set;
              this.order_status = response.data.store_set.order_status || [];

              //that.openTime(response.data.store.store_id);
              //that.credit = myData.credit;
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            // error callback
          }
        );
    },

    openTime(id) {
      intervalid = setInterval(() => {
        this.vedioSrc = "";
        $http
          .get("plugin.store-cashier.frontend.cashier.voice-broadcast.index", {
            store_id: id
          })
          .then(res => {
            if (res.result == 1) {
              this.vedioSrc = res.data.url;
              this.wxPlay(this.vedioSrc);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }, 5000);
    },

    wxPlay(src) {
      var that = this;
      let json = {
        url: document.location.href
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(res => {
          if (res.result == 1) {
            wx.config(res.data.config);
            wx.ready(function() {
              var isPageHide = false;
              window.addEventListener("pageshow", function() {
                if (isPageHide) {
                  window.location.reload();
                  if (!that.fun.isTextEmpty(src)) {
                    var bgAudio = document.getElementById("yp");
                    console.log(bgAudio);
                    bgAudio.play();
                  }
                }
              });
              window.addEventListener("pagehide", function() {
                isPageHide = true;
                if (!that.fun.isTextEmpty(src)) {
                  var bgAudio = document.getElementById("yp");
                  console.log(bgAudio);
                  bgAudio.play();
                }
              });

              if (!that.fun.isTextEmpty(src)) {
                var bgAudio = document.getElementById("yp");
                console.log(bgAudio);
                bgAudio.play();
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    closeTimeInterval() {
      clearInterval(intervalid);
    },

    // 退出登录
    outInfo() {
      $http.get("member.logout.index").then(
        response => {
          if (response.result == 1) {
            window.localStorage.setItem("isWxLogin", -1);
            this.$store.commit("savemodel", {});
            localStorage.setItem("token", "");
            localStorage.setItem("loginUid", "");
            this.$dialog.alert({ message: response.msg})
              .then(() => {
                this.$router.push(this.fun.getUrl("login"));
              }).catch(() => {});

          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },

  },
  activated() {
    this.getStoreInfo();
  },
  beforeDestroy() {
    this.closeTimeInterval();
  },

  components: { cTitle, }
};
