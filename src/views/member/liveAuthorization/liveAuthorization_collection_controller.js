import cTitle from "components/title";
import html2canvas from "html2canvas";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { scrollMixin } from "utils/mixin";
export default {
  components: { cTitle, yzWechatShareImg },
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      //
      id: "",
      posterShow: false,
      loadingImg: false,
      popShow: false,
      showWechatshar: false,
      info: [],
      posterId: "",
      qr_code: "",
      shopName: "",
      logo: "",
      backgroundImg: ""
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.getData();
  },
  methods: {
    tapCatch(item, ind) {
      this.posterId = item.id;
      if (item.is_sold == "1") {
        this.popShow = true;
        this.fun.wxShare(
          "",
          {},
          {
            link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/liveAuthorization_pay/" + this.id + "?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep(),
            title: item.level_name,
            description:''
          }
        );
      } else {
        this.$set(this.info[ind], "show", !this.info[ind].show);
        console.log(item, this.info);
      }
    },
    inviteFirend() {
      this.popShow = false;
      this.showWechatshar = true;
      
    },
    popShowClose(){
      this.posterId = '';
      this.popShow = false;
    },
    saveImg() {
      var content = document.getElementById("img_box");
      const that = this;
      html2canvas(content, {
        useCORS: true, // 【重要】开启跨域配置
        // allowTaint: true,//允许跨域图片
        backgroundColor: null // 解决生成的图片有白边
      }).then(canvas => {
        that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
        document.getElementById("thecanvas").setAttribute("src", that.dataURL);
      });
    },
    getData() {
      let that = this;
      $http.get("plugin.room.frontend.code.waitPay", { level_id: that.id }, "加载中").then(
        function(response) {
          if (response.result == 1) {
            that.info = response.data.data;
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getPoster() {
      window.scrollTo(0,0);
      let that = this;
      $http.get("plugin.room.frontend.goods-poster.new-goods-poster", { id: that.posterId }, "加载中").then(
        function(response) {
          if (response.result == 1) {
            console.log(response);
            that.qr_code = response.data.qrcode;
            that.shopName = response.data.shopName;
            that.logo = response.data.logo;
            that.backgroundImg = response.data.backgroundImg;
            that.popShow = false;
            that.loadingImg = true;
            setTimeout(() => {
              that.saveImg();
              that.posterShow = true;
              that.loadingImg = false;
            }, 1000);
            console.log(that.qr_code);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 加载更多
    getMoreData() {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        page: 1,
        level_id: that.id
      };
      if (that.page >= that.total_page) {
        that.loading = true;
        return;
      } else {
        that.page = that.page + 1;
        json.page = that.page;
        $http.get("plugin.room.frontend.code.waitPay", json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.loading = false;
            if (response.result === 1) {
              var myData = response.data.data;
              that.info = that.info.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.loading = true;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
            console.log(response);
          }
        );
      }
    }
  }
};
