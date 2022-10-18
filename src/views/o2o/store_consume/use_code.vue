<template>
  <div id="use-code">
    <c-title :hide="false" :text="'门店消费卡核销'"> </c-title>
    <div class="img-box">
      <div class="img-text">
        <img src="../../../assets/images/cart_list.png" alt="" />
      </div>
      <div class="card-text">
        <p class="quota">消费卡额度</p>
        <p class="price"><span>&#165;</span>{{info.amount}}</p>
      </div>
    </div>
    <div class="card-name">{{info.card_name}}</div>

    <div class="sure-sale" v-if="!btnStatus">
      <i class="iconfont icon-all_select_active success-icon"></i>
      <p class="tip-text">核销成功!</p>
    </div>
    <van-button :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" type="primary" color="#f14e4e" round @click="confirmSale()" class="btn" v-if="btnStatus">确认核销</van-button>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      btnStatus: true,
      hold_id:'',
      store_id:'',
      info:{},
    };
  },
  activated() {
    this.hold_id = this.$route.params.card_id;
    this.store_id = this.$route.params.id;
    console.log(this.hold_id,this.store_id);
    this.getInfo();
  },
  methods: {
    getInfo() {
      $http.get("plugin.store-card.Frontend.Modules.Verifier.Controllers.audit.page",{hold_id:this.hold_id,store_id:this.store_id}).then(response => {
        if (response.result === 1) {
          console.log(response);
          this.info = response.data;
        } else {
          Toast(response.msg);
        }
      });
    },
    confirmSale() {
      $http.get("plugin.store-card.Frontend.Modules.Verifier.Controllers.audit.index",{hold_id:this.hold_id,store_id:this.store_id}).then(response => {
        if (response.result === 1) {
          this.btnStatus = false;
        } else {
          Toast(response.msg);
        }
      });
    }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#use-code {
  background: #fff;

  .bg {
    background: #fff;
  }

  .img-box {
    position: relative;
    margin: 15px auto;
    width: 20.9375rem;
    height: 9.375rem;
    border-radius: 10px;
    // background: url(../../../assets/images/cart_list.png) no-repeat center 0px;
    // background-position: center 0px;
    // background-size: cover;
    // border-top: 1px solid #f3f3f3;
    img {
      width: 20.9375rem;
      height: 9.375rem;
    }
  }

  .img-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }

  .card-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;

    .quota,
    .price {
      text-align: left;
      color: #fff;
    }
  }

  .price {
    margin-top: 0.3125rem;
    font-size: 25px;
    font-weight: bold;

    span {
      padding-right: 0.3125rem;
    }
  }

  .card-name {
    width: 100%;
    font-size: 14px;
    color: #202020;
    text-align: left;
    padding: 0 15px 10px 15px;
    white-space: pre-wrap;
  }

  .btn {
    position: fixed;
    bottom: 1rem;
    left: 10%;
    width: 19.0625rem;
    height: 2.5rem;
  }

  .sure-sale {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #f14e4e;
  }

  .success-icon {
    font-size: 30px;
  }

  .tip-text {
    margin-top: 0.3125rem;
    font-size: 16px;
  }

  .pcStyle {
    position: fixed;
    width: 375px;
    bottom: 70px;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>

<style lang="scss">
.pcStyle #fixed-price .set-pc-styleLeft {
  margin-left: 0;
}

.pcStyle #fixed-price .specifications {
  text-align: center;
}

.pcStyle #fixed-price .yz_wechatShareImg-main {
  position: absolute;
  width: 375px;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.pcStyle #fixed-price .yz_wechatShareImg-main p {
  width: 375px;
}
</style>
