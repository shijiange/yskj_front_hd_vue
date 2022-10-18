import cTitle from "components/title";
import { Toast } from "vant";

let cart_ides = [];
export default {
  data() {
    return {
      list: [],
      ActiveIndex: null,
      timeoutId: null,
      loading: false //加载状态中不可以下单，确保数量更新接口已请求完毕
    };
  },
  activated() {
    cart_ides = [];
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post("plugin.channel.frontend.freedom-cart.index", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data;
            for (var i = 0; i < this.list.length; i++) {
              cart_ides.push(this.list[i].id);
            }
          } else {
            this.$dialog.alert({ message: response.msg });

            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //提交订单
    submitGoods() {
      this.$router.push(
        this.fun.getUrl("placeOrder", {
          tag: "channel_freedom",
          cart_ids: cart_ides
        })
      );
    },
    changeCount(goods, _num, index) {
      console.log(goods);
      let that = this;
      let json = {
        id: goods,
        num: _num,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      this.loading = true;
      $http.get("plugin.channel.frontend.freedom-cart.updateNum", json, "").then(
        function(response) {
          console.log(response);
          if (response.result === 1) {
            if (_num == 1) {
              that.list[index].total = Number(that.list[index].total) + 1;
            } else if (_num == -1) {
              that.list[index].total = Number(that.list[index].total) - 1;
            }
          } else {
            Toast(response.msg);
            // that.list[index].total = 1;
          }
          that.loading = false;
        },
        function(response) {
          console.log(response);
          that.loading = false;
        }
      );
    },
    getActiveNewTotal(event) {
      if (this.ActiveIndex == null) {
        return;
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      let that = this;
      let _inputTotal = event.target.value;
      let _changeNum = null;
      this.timeoutId = setTimeout(function() {
        // 1000毫秒以后执行方法
        if (that.list[that.ActiveIndex].total == _inputTotal) {
          console.log("值没有变化！！！");
          that.getData();
          return;
        } else {
          console.log(_inputTotal);
          if (_inputTotal < 1) {
            Toast(`订货数量不少于1`);
            that.$refs.tcInput[that.ActiveIndex].value = 1;
            _inputTotal = 1;
          }
          if (_inputTotal > that.list[that.ActiveIndex].goods.stock) {
            Toast(`当前商品库存为${that.list[that.ActiveIndex].goods.stock}`);
            that.$refs.tcInput[that.ActiveIndex].value = that.list[that.ActiveIndex].goods.stock;
            _inputTotal = that.list[that.ActiveIndex].goods.stock;
          }
          _changeNum = Number(-(that.list[that.ActiveIndex].total - _inputTotal));
          console.log("数量变化：：", that.list[that.ActiveIndex].total, _inputTotal, _changeNum);
          that.$refs.tcInput[that.ActiveIndex].blur();
          if (_changeNum != 0) {
            that.changeCount(that.list[that.ActiveIndex].id, _changeNum, that.ActiveIndex);
            return;
          }
        }
      }, 50); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },
    getActiveOldTotal(_index) {
      this.ActiveIndex = _index;
    },
    numberLeft(index) {
      let lNum = Number(this.list[index].total) - 1;
      if (lNum <= 0) {
        Toast("商品数量不能为负数或零");
        this.list[index].total = 1;
        return;
      }
      this.changeCount(this.list[index].id, -1, index);
    },
    numberRight(index) {
      this.changeCount(this.list[index].id, 1, index);
    },
    delCart(index) {
      let that = this;
      that.$dialog
        .confirm({
          message: "确认删除该商品吗",
          confirmButtonText: "确定"
        })
        .then(() => {
          $http.get("plugin.channel.frontend.freedom-cart.destroy", { ids: that.list[index].id }, "").then(
            function(response) {
              console.log(response);
              if (response.result === 1) {
                Toast("移除成功！");
                that.getData();
              } else {
                Toast(response.msg);
              }
            },
            function(response) {
              console.log(response);
            }
          );
        })
        .catch(() => {
          // on cancel
        });
    },
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
  },
  components: { cTitle }
};
