<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <!-- <div class="box">
      <div class="a"></div>
      <div class="b"></div>
      <div class="c"></div>
    </div> -->
    <div class="circleBox_1" v-if="is_open">
      <div class="circleimg"></div>
      <div class="circleLeft" @click="toStoreBalance">
        <span class="txt">{{ title }}</span>
        <div class="priceCir">
          <span>{{ $i18n.t("money") }}</span>
          <span class="pric">{{ member_balance }}</span>
        </div>
      </div>
      <div class="circleRight" v-if="show_button" @click="toStoreBalance('balance')">充值</div>
    </div>
    <div v-else>请先开启门店余额</div>
  </div>
</template>
<script>
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    // 确保数据已传入
    let datas = this.plugin_active && this.openTemplate == 1 ? this.datas_style02 : this.datas;
    const { balance_bg_color, button_bg_color, button_color, font_color, number_color } = datas;

    return `
        .component-${this.id} .circleBox_1 {
            background: ${balance_bg_color};
        }
        .component-${this.id} .circleRight {
            background-color: ${button_bg_color};
            color:${button_color}
        }
        .component-${this.id} .txt {
            color: ${font_color};
        }
        .component-${this.id} .priceCir {
            color: ${number_color};
        }
    `;
  }
};
export default {
  data() {
    return {
      is_open: false,
      member_balance: "",
      show_button: false
      // store_id: ""
    };
  },
  props: ["store_id", "id", "datas"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  activated() {
    this.getBalance();
  },
  mounted() {
    this.getBalance();
  },
  methods: {
    toStoreBalance(key) {
      if (key == "balance") {
        this.$router.push(this.fun.getUrl("storeBalance", { name: "store", store_id: this.$route.params.store_id }));
      } else {
        this.$router.push(this.fun.getUrl("independenceBalance", { store_id: this.$route.params.store_id }));
      }
    },
    getBalance() {
      $http
        .post("plugin.store-cashier.frontend.store.balance.setting.index", { store_id: this.store_id }, "")
        .then(response => {
          if (response.result === 1) {
            console.log("ssssssssssssss");
            this.is_open = response.data.is_open;
            this.member_balance = response.data.member_balance;
            this.show_button = response.data.show_button;
            this.title = response.data.title;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.circleBox_1 {
  margin: 0 0.5rem;
  // padding: 0.5rem;
  border-radius: 0.5rem;
  height: 7.19rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-top: 0.3125rem;

  .circleimg {
    width: 103%;
    height: 2rem;
    position: absolute;
    left: -5px;
    bottom: 0;
    background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/independent_store/storeBalance.png);
    background-repeat: no-repeat;
    background-size: cover;
  }

  .circleLeft {
    margin-left: 1.03rem;
    color: #ffd772;
    font-size: 0.84rem;
    text-align: left;

    .priceCir {
      margin-top: 0.5rem;
      margin-bottom: 0.8rem;
      font-size: 0.84rem;

      .pric {
        font-size: 1.75rem;
      }
    }
  }

  .circleRight {
    width: 4.38rem;
    height: 1.56rem;
    border-radius: 0.78rem;
    font-size: 0.84rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.03rem;
  }
}
// .box {
//   width: 100%;
//     height: 49px;
//     background-color: #000;
//     float: left;
//     /* border-radius: 30px 30px 0 0; */
//     position: absolute;
//     bottom: 144px;
//     overflow: hidden;
//   .a {
//     border-radius: 0 40px 0 0;
//   }
//   .b {
//         margin-top: 30px;
//     height: 57px;
//     margin-left: -2px;
//     /* border-radius: 10px; */
//     overflow: hidden;
//   }
//   .b::after{
//     content: '';
//     position: absolute;
//     margin-top: -52px;
//     left: -8px;
//     width: 106%;
//     height: 60px;
//     border-radius: 50%;
//     background-color: #fff;
// }
//   .c {
//     margin-left: -2px;
//     border-radius: 40px 0 0 0;
//   }
// }
</style>
