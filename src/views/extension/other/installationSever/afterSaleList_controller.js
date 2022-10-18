import yzBlank from "components/ui_components/yz_blank";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      listData: [],
      another_name: {}
    };
  },
  activated() {
    this.getData();
  },

  components: { yzBlank },
  computed: {},
  methods: {
    getData() {
      $http
        .get("plugin.live-install.frontend.order.getRefundList", { order_id: this.$route.params.oid }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.listData = res.data.data;
            this.fun.setWXTitle(res.data.another_name.plugin_name);
            this.another_name = res.data.another_name;
          } else {
            Toast(res.msg);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    imgPreview(data) {
      ImagePreview(data);
    },
    clickBotton(item, id) {
      if (this.fun.isTextEmpty(item.api)) {
        return;
      }

      this.bottonRequest(item, id);
    },
    bottonRequest(item, id) {
      let _json = {
        refund_id: id
      };
      this.$dialog
        .confirm({ message: `确定${item.name}?` })
        .then(() => {
          var that = this;
          $http.get(item.api, _json).then(
            function(response) {
              if (response.result == 1) {
                that.getData();
                that.$notify({
                  background: "#f0f9eb",
                  message: `${item.name}成功`,
                  color: "#67c23a"
                });
              } else {
                that.$dialog.alert({ message: response.msg });
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {});
    }
  }
};
