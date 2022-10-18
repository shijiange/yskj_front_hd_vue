import cTitle from "components/title";
import { Toast } from 'vant';
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      loadingImg: true,
      card_id: "",
      cardData: {}
    };
  },
  activated() {
    this.card_id = this.$route.params.card_id;
    this.loadingImg = true;
    this.cardData = {};
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.center.card-pic.index",
          { card_id: this.card_id, card_type: 2 },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.cardData = response.data;
              setTimeout(() => {
                this.saveImg();
              }, 1000);
              setTimeout(() => {
                this.loadingImg = false;
              }, 1500);
            } else {
              Toast(response.msg);
            }
          },
          function (response) {
            console.log(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },
    saveImg() {
      var content = document.getElementById("code_box");
      const that = this;
      html2canvas(content, {
        useCORS: true,
        backgroundColor: null // 解决生成的图片有白边
      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
      });
    }
  },
  components: { cTitle }
};
