import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      radio: "1",
      address: []
    };
  },
  activated() {
    this.getData();
    this.inniData();
  },
  methods: {
    inniData() {
      this.radio = "1";
      this.address = [];
    },
    getData() {
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.integral-currency-withdraw-address.index"
        )
        .then(response => {
          if (response.result == 1) {
            this.address = response.data;
            this.address.map((item, index, key) => {
              if (item.is_default == 1) {
                this.radio = item.id;
              }
            });
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toPage(item) {
      this.$router.push(this.fun.getUrl("reviseAddress", { id: item.id }));
    },
    change(item) {
      let json = {
        address_id: item
      };
      $http
        .get(
          "plugin.integral.Frontend.Modules.Integral.Controllers.integral-currency-withdraw-address.isDefault",
          json
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    del(item, itemIndex) {
      this.$dialog.confirm({ message: "确定删除此提出地址?"})
        .then(() => {
        //删除当前选中的地址
          console.log(item);
          var that = this;
          $http
            .get(
              "plugin.integral.Frontend.Modules.Integral.Controllers.integral-currency-withdraw-address.delete",
              { address_id: item.id }
            )
            .then(
              function(response) {
                Toast(response.msg);
                that.address.splice(itemIndex, 1);
              },
              function(response) {
              // error callback
                that.$dialog.alert({ message: response.msg});
              }
            );
        }).catch(() => {});
    }
  },
  components: { cTitle }
};
