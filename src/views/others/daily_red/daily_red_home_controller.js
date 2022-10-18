import cTitle from "components/title";
import { Toast } from "vant";
var tapMore = false;
// import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      show1: false,
      info: [],
      color: [],
      receive_logs_lastPage: 1,
      receive_logs_Page: 1,
      goods_list_lastPage: 1,
      goods_list_page: 1,
      //领取金额
      amount: 0,
      ru_open:false,
      bfb:''
    };
  },
  deactivated() {},
  activated() {
    this.getData();
    this.share();
  },
  methods: {
    init() {
      this.receive_logs_lastPage = 1;
      this.receive_logs_Page = 1;
      this.goods_list_lastPage = 1;
      this.goods_list_page = 1;
      this.info = [];
    },
    tapPerson(){
      this.$router.push(this.fun.getUrl('personRed',{}));
    },
    toPage(str) {
      this.$router.push(this.fun.getUrl(str,{tag:'new'}));
    },
    swipeToTop(e) {
      if (this.receive_logs_Page < this.receive_logs_lastPage) {
        // 有分页 第一个开始就加载下一页
        if (this.info.receive_logs.data.length - 14 == e) {
          this.getMore("log", this.receive_logs_Page + 1);
        }
      }
    },
    goback() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else if (this.url) {
        // this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    },
    golink() {},
    closeShow(){
      this.show = false;
      this.init();
      this.getData();
    },
    // 领取
    sureGet(value) {
      if (value == 1) {
        if(tapMore){
          console.log('等请求完才能重新点击');
          return;
        }else{
          tapMore = true;
          $http
            .get("plugin.redpack-tool.frontend.redpack.index", {}, "")
            .then(response => {
              if (response.result === 1) {
                this.show = true;
                this.amount = response.data.amount;
              } else {
                if(response.data.alert){
                  this.show1 = true;
                }else{
                  Toast(response.msg);
                }
              }
              tapMore = false;
            })
            .catch(error => {
              console.log(error);
              tapMore = false;
            });
        }
      } else if (value == 0) {
        console.log("不可领取状态");
      } else if(value == -2){
        Toast('当前红包已领完');
      } else if(value == -1){
        Toast('额度不足');
      }
    },
    toGood(id) {
      this.$router.push(
        this.fun.getUrl("goods", {
          id: id
        })
      );
    },
    // 获取数据
    getData() {
      $http
        .get("plugin.redpack-tool.frontend.homePage.index", {}, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.info = response.data;
            this.color = response.data.color;
            this.goods_list_lastPage = response.data.goods_list.last_page;
            this.receive_logs_lastPage = response.data.receive_logs.last_page;
            this.fun.setWXTitle(response.data.plugin_name);
            this.ru_open = response.data.ru_open;
            this.bfb = 
            (Number(this.info.quota_info.use_total) / Number(this.info.quota_info.quota_total).toFixed(2)) * 100 >= 100
              ? "100"
              : (Number(this.info.quota_info.use_total) / Number(this.info.quota_info.quota_total).toFixed(2)) * 100;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 加载更多
    getMore(key, page) {
      let json = {};
      if (key == "log") {
        json.log_page = page;
      } else {
        if (page >= this.goods_list_lastPage) {
          return;
        } else {
          this.goods_list_page = page + 1;
        }
        json.goods_page = this.goods_list_page;
      }
      $http
        .get("plugin.redpack-tool.frontend.homePage.index", json)
        .then(response => {
          if (response.result === 1) {
            let contenLis, conlist;
            if (key == "log") {
              contenLis = response.data.receive_logs.data;
              conlist = this.info.receive_logs.data.concat(contenLis);
              this.info.receive_logs.data = conlist;
              this.receive_logs_lastPage = response.data.receive_logs.last_page;
            } else {
              contenLis = response.data.goods_list.data;
              conlist = this.info.goods_list.data.concat(contenLis);
              this.info.goods_list.data = conlist;
              this.goods_list_lastPage = response.data.goods_list.last_page;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(){
      $http
        .get("plugin.redpack-tool.frontend.share.index", {}, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: response.data.share_title,
                imgUrl: response.data.share_pictures,
                description: response.data.share_content
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
