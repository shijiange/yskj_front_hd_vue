<template>
  <div class="page">
    <c-title text="卡密"></c-title>

    <div class="page-container">
      <div class="voucher-list" v-if="cards.length > 0">
        <div class="voucher-item" v-for="(item, index) in cards" :key="index">
          <div class="item-content">
            <div class="item-text">卡号：{{item.card_number}}</div>
            <div class="item-text">卡密：{{item.card_secret}}</div>
          </div>
          <div class="item-btn" v-clipboard:copy="`卡号：${item.card_number}
卡密：${item.card_secret}`" v-clipboard:success="onCopy">复制
          </div>
        </div>
        <div class="voucher-btns">
          <div class="voucher-btn" v-clipboard:copy="copy_text" v-clipboard:success="onCopy">一键复制</div>
        </div>
      </div>
      <div v-else>
        暂无卡密
      </div>
      <div class="operating">
        <p>*操作说明</p>
        <p style="margin-bottom: 1.5rem;">
          {{info.description || "暂无"}}
        </p>
        <p>*使用方式：</p>
        <div id="a_content" style="margin-bottom: 1.5rem;" v-html="info.content || '暂无'"></div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      copy_text: "",
      cards: [],
      info: {}
    };
  },
  activated() {
    this.getdata();
  },
  methods: {
    onCopy() {
      this.$toast("复制成功");
    },
    getdata() {
      $http
        .get(
          "plugin.yz-supply-camilo-resources.frontend.index.index.getCamiloResources",
          {
            order_id: this.$route.params.order_id
          }, "load"
        )
        .then(
          response => {
            if (response.result == 1) {
              this.info = response.data;
              this.cards = response.data.card || [];
              if (this.cards.length > 0) {
                // 不要格式化
                this.cards.map((item) => {
                  this.copy_text += `卡号：${item.card_number}
卡密：${item.card_secret}
`;
                });
              }
            } else {
              console.log("失败", response);
            }
          }
        );
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background-color: rgb(249, 249, 249);
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .page-container {
    padding: 0.625rem;
    .voucher-list {
      width: 100%;
      padding: 0 0.781rem;
      background: #fff;
      border-radius: 0.313rem;
      .voucher-item {
        display: flex;
        align-items: center;
        height: 4.469rem;
        text-align: left;
        border-bottom: 0.031rem solid #eee;
        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          height: 4.469rem;
          padding: 0.3rem;
          padding-left: 0.063rem;

          .item-text {
            font-size: 0.875rem;
            color: #333333;
          }
        }
        .item-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.75rem;
          height: 1.438rem;
          font-size: 0.625rem;
          color: #ffffff;
          background-color: #ea575f;
          border-radius: 0.719rem;
        }
      }
      .voucher-btns {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3.625rem;
        .voucher-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 11.25rem;
          height: 1.75rem;
          font-size: 0.75rem;
          color: #ffffff;
          background-color: #ea575f;
          border-radius: 0.875rem;
        }
      }
    }
    .operating {
      margin-top: 1.188rem;
      text-align: left;
      font-size: 0.75rem;
      color: #515151;
      font-weight: bold;
      p {
        margin-bottom: 0.719rem;
      }
    }
  }
</style>