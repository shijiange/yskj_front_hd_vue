import { Toast } from "vant";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";

export default {
  data() {
    return {
      list: {},//数据
      json: {},//参数
      showWechatshar: false, // 弹出提示浏览器打开
    };
  },
  activated() {
    this.json.apk_name = this.fun.getKey('apk_name');
    this.json.download_id = this.fun.getKey('download_id');
    this.json.version_code = this.fun.getKey('version_code');
    this.getdata();
  },
  updated() {
    //给富文本标签增加样式
    let img = document.querySelectorAll(".detail img");
    for (let i = 0; i < img.length; i++) {
      img[i].style.cssText = "width: 100%; height: auto;";
    }
  },
  methods: {
    //获取数据
    getdata() {
      $http
        .get("plugin.aggregation-cps.api.app-version.downloadPage", this.json, "")
        .then(
          response => {
            if (response.result == 1) {
              this.list = response.data;
              this.list.log = this.list.log.split("\n");
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    // 下载
    download() {
      if (this.fun.isWeiXin()) {
        this.showWechatshar = true;
      }else {
        window.location.href = this.list.url;
      }
    },
    goUrl(){
      window.location.href = this.list.top_image_link;
    }
  },
  components: {
    yzWechatShareImg
  }
};
