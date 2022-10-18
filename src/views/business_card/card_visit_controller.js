import cTitle from "components/title";
import { Toast } from 'vant';
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      loadingImg: true,
      card_id: "",
      cardData: {
        card_statistics: {}
      },
      area_name: "",
      role_name: {}
    };
  },
  activated() {
    // 问题：截图不全；原因：滚轮滑动造成的，主要是html2canvas是根据body进行截图，若内容高度高于body时，就会出现这样的问题(大概意思就是有滚动条时造成的)
    // 解决方案：(在生成截图前，先把滚动条置顶)
    window.pageYOffset = 0;
    window.pageXOffset = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    this.card_id = this.$route.params.card_id;
    this.loadingImg = true;
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.area_name = "";
    },
    getData() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.center.card-pic.index",
          { card_id: this.card_id, card_type: 1 },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.cardData = response.data;
              this.role_name = this.cardData.role_name;
              if (this.cardData.is_street === '1' && this.cardData.area_name[0]) {
                this.area_name =
                  this.cardData.area_name[0] +
                  this.cardData.area_name[1] +
                  this.cardData.area_name[2] +
                  this.cardData.area_name[3] +
                  this.cardData.address;
              } else if (this.cardData.area_name[0]) {
                this.area_name =
                  this.cardData.area_name[0] +
                  this.cardData.area_name[1] +
                  this.cardData.area_name[2] +
                  this.cardData.address;
              }
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
      var content = document.getElementById("img_box");
      const that = this;
      html2canvas(content, {
        // useCORS: true, // 【重要】开启跨域配置
        // allowTaint: true,//允许跨域图片
        backgroundColor: null // 解决生成的图片有白边
      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
      });
    }
  },
  components: { cTitle }
};
