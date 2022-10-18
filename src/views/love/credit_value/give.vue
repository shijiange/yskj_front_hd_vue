<template>
  <div>
    <c-title :hide="false" :text="'信用值赠送'">
    </c-title>

    <div class="containe">
      <van-field type="tel" v-model="stock"  label="库存信用值" label-class="label" :readonly="true" colon />
      <van-field  v-model="form.merberId" label="会员ID" label-class="label" placeholder="请输入受赠人ID" colon>
        <template #button>
          <div style="color: #f14e4e;" @click="searchMerber">搜索</div>
        </template>
      </van-field>
      <div class="member-info" v-show="isShowMerber">
        <div class="avatar">
          <img :src="merberInfo.avatar" alt="">
        </div>
        <span style="margin-left: 10px;">{{merberInfo.nickname}}</span>
      </div>
      <van-field label="赠送信用值" label-class="label" label-width="100%" class="custom-input">
        <template #input>
          <div style="margin-top: 5px; flex: 1;">
            ￥ &nbsp; <input type="number" style="width: 90%;"  v-model="form.giveValue" placeholder="0.00">
          </div>
        </template>
      </van-field>
      <div class="confirm-give" @click="confirmGive">确认赠送</div>
    </div>


    <van-popup
      v-model="showPop"
      :style="{ width: '19rem', background: 'none' }"
      close-on-click-overlay="false"
    >
      <div class="top-title">请输入密码</div>
      <div class="pop-content">
        <input type="password" placeholder="请输入您的提现密码" v-model="password" class="pop-input">
        <div class="tip">请确认id无误，赠送后无法撤回</div>
        <div class="confirm" @click="confirmPass">确认</div>
        <div class="forget" @click.stop="forgetPass">忘记密码</div>
      </div>
      <div class="close-pop" @click="closePop">X</div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      stock: 0,
      form: {
        merberId: "",
        giveValue: ""
      },
      merberInfo: {},
      isShowMerber: false,
      password: '',
      has_password: false,
      need_password: false,
      showPop: false,
    };
  },
  activated () {
    this.init();
    this.getData();
  },
  methods:{
    async getData () {
      let res = await $http.post("plugin.credit-inventory.frontend.controllers.give.center", {}, "加载中...");
      if (res.result === 0) {
        Toast(res.msg);
        return;
      }
      this.stock = res.data.stock;
      this.need_password = res.data.need_password;
      this.has_password = res.data.has_password;
      if(this.need_password == true && this.has_password == false){
        this.$dialog
          .confirm({ message: "请先设置支付密码" })
          .then(() => {
            this.$router.push(this.fun.getUrl("set_balance_password", {}));
          });
        return;
      }
    },


    // 搜索用户
    async searchMerber () {
      if (!this.form.merberId) {
        Toast("请输入受赠人ID");
        return 0;
      }
      let res = await $http.post(
        "plugin.credit-inventory.frontend.controllers.give.detail",
        {member_id: this.form.merberId},
        "搜索中"
      );
      if (res.result !== 1) {
        Toast(res.msg);
        this.isShowMerber = false;
        return 0;
      }
      this.merberInfo = res.data;
      this.isShowMerber = true;
      return 1;
    },



    async confirmGive () {
      let res = await this.searchMerber();
      if (res === 0) {
        return;
      }
      if (!this.form.giveValue) {
        Toast("请输入赠送值");
        return;
      }
      if ((this.stock - this.form.giveValue) < 0) {
        Toast('库存信用值不足');
        return;
      }
      if (!this.need_password) {
        this.confirmPass();
        return;
      }
      if(this.need_password && !this.has_password){
        this.$dialog
          .alert({ message: "请先设置支付密码" })
          .then(() => {
            this.$router.push(this.fun.getUrl("set_balance_password", {}));
          });
        return;
      }
      if (this.need_password && this.need_password) {
        this.showPop = true;
      }
    },

    async confirmPass () {
      if (this.need_password && !this.password) {
        Toast("请输入密码");
        return;
      }

      let json = {};
      if (this.need_password && this.has_password) {
        json = {
          password: this.password,
          recipient_id: this.form.merberId,
          give_amounts: this.form.giveValue
        };
      } else {
        json = {
          recipient_id: this.form.merberId,
          give_amounts: this.form.giveValue
        };
      }
      let res = await $http.post(
        "plugin.credit-inventory.frontend.controllers.give.handle",
        json,
        "赠送中"
      );
      Toast(res.msg);
      if (res.result === 1) {
        this.closePop();
      }

    },


    forgetPass () {
      this.$router.push(this.fun.getUrl('balance_password'), {});
    },
    closePop () {
      this.showPop = false;
      this.init();
      this.getData();
    },

    init () {
      this.stock = 0;
      this.showPop = false;
      this.password = '';
      this.isShowMerber = false;
      this.form = {
        merberId: "",
        giveValue: ""
      };
      this.merberInfo = {};
    }
  },
  components: {
    cTitle
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.containe {
  width: 22rem;
  background-color: #fff;
  border-radius: 5px;
  margin: 0 auto;
  margin-top: 10px;
  padding: 1px;
  font-size: 14px;

  .member-info {
    display: flex;
    padding-left: 1rem;

    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      overflow: hidden;

      img {
        margin: 0 auto;
        width: 100%;
        height: 100%;
      }
    }
  }
}

.custom-input {
  flex-direction: column;
}

input {
  height: 2rem;
  border: none;
  text-shadow: none;
  -webkit-appearance: none;
  -webkit-user-select: text;
  outline: none;
  box-shadow: none;
}

.confirm-give {
  width: 18rem;
  height: 2rem;
  margin: 1.5rem auto;
  background-color: #f14e4e;
  color: white;
  border-radius: 1rem;
  line-height: 2rem;
}

.top-title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 19rem;
  height: 4rem;
  font-size: 1rem;
  font-weight: bold;
  line-height: 2.5rem;
  text-align: center;
  color: #fff;
  background-image: url("../../../assets/images/password_pop.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.pop-content {
  width: 16.6rem;
  padding: 4rem 1rem 0.8rem 1rem;
  border-radius: 1rem;
  margin: 0 auto;
  background: #fff;
}

.pop-input {
  width: 14rem;
  height: 2rem;
  border-radius: 5px;
  border: solid 1px #eee;
  padding-left: 10px;
}

.tip {
  margin-top: 10px;
  font-size: 10px;
  color: #666;
  text-align: left;
  padding-left: 0.5rem;
}

.confirm {
  width: 14rem;
  height: 2rem;
  margin-top: 3rem;
  margin-bottom: 1rem;
  background-color: #f14e4e;
  border-radius: 1rem;
  font-size: 16px;
  line-height: 2rem;
  color: #fff;
}

.forget {
  font-size: 10px;
  color: #f14e4e;
}

.close-pop {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 2rem;
  color: #fff;
  border: solid 2px #fff;
}
</style>