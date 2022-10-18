import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      ticket: {},
      color: ""
    };
  },

  activated() {
    this.getData();
  },

  methods: {
    getColor(col) {
      switch (col) {
      case "Color010":
        this.color = "#63B359";
        break;
      case "Color020":
        this.color = "#2C9F67";
        break;
      case "Color030":
        this.color = "#509FC9";
        break;
      case "Color040":
        this.color = "#5885CF";
        break;
      case "Color050":
        this.color = "#9062C0";
        break;
      case "Color060":
        this.color = "#D09A45";
        break;
      case "Color070":
        this.color = "#E4B138";
        break;
      case "Color080":
        this.color = "#EE903C";
        break;
      case "Color090":
        this.color = "#DD6549";
        break;
      case "Color100":
        this.color = "#CC463D";
        break;
      default:
        break;
      }
    },
    getData() {
      $http.post("plugin.wx-card-ticket.frontend.controllers.sign.getTicket").then(res => {
        if (res.result == 1) {
          this.ticket = res.data.ticket;
          if (this.ticket.color) {
            this.getColor(this.ticket.color);
          }
        } else {
          Toast(res.msg);
        }
      });
    },
    getType() {
      let _url = document.location.href;
      let json = {
        url: _url
      };
      $http.post("plugin.wx-card-ticket.frontend.controllers.sign.wxJsSdkConfig", json).then(res => {
        if (res.result == 1) {
          wx.config(res.data.js);
          wx.ready(function() {
            let card_package = res.data.cardPackage;  //返回的卡券包
            wx.addCard({
              cardList: card_package, // 需要添加的卡券列表
              success: function(res) {
                console.log(res);
              },
              error: function(res) {


              },
              fail: function(res) {


              }
            });
          });
        } else {
          Toast(res.msg);
        }
      });
    }
  },
  components: { cTitle }
};

