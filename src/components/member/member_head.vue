<template>
  <div>
    <template v-if="!Params.isnew">
      <member_head_top :Params="Params"
                       :member_item="member_item"
                       :isClick="isClick"
      >
      </member_head_top>

      <member_head_middle :Params="Params"
                          :member_item="member_item">
      </member_head_middle>

      <member_head_bottom :Params="Params"
                          :Order="Order"
                          :member_order="member_order">
      </member_head_bottom>
    </template>

    <template v-if="Params.isnew">
      <member_head_top :Params="Params"
                       :member_item="member_item"
                       :isClick="isClick"
      >
      </member_head_top>
    </template>
  </div>
</template>

<script>
import member_head_top from "components/member/member_head_top";
import member_head_bottom from "components/member/member_head_bottom";
import member_head_middle from "components/member/member_head_middle";
import { Toast } from 'vant';
export default {
  props: ["Params", "Order", "member_item", "member_order", "isClick"],
  data() {
    return {
      waitPay: 0,
      waitSend: 0,
      waitReceive: 0,
      waitrRefund: 0,
      name_of_withdrawal_text: ""
    };
  },
  mounted() {
    if (this.member_order.order) {
      // 0 待付款 1待发货 2待收货 3完成
      this.member_order.order.map(item => {
        if (item.status == 0) {
          this.waitPay = item.total;
        } else if (item.status == 1) {
          this.waitSend = item.total;
        } else if (item.status == 2) {
          this.waitReceive = item.total;
        } else if (item.status == 11) {
          this.waitrRefund = item.total;
        }
      });
    }
    this.customizeIncome();
  },
  watch: {
    member_order: {
      handler(newValue, oldValue) {
        if (this.member_order.order) {
          this.member_order.order.map(item => {
            if (item.status == 0) {
              this.waitPay = item.total;
            } else if (item.status == 1) {
              this.waitSend = item.total;
            } else if (item.status == 2) {
              this.waitReceive = item.total;
            } else if (item.status == 11) {
              this.waitrRefund = item.total;
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    gotoMemberGrade() {
      if (this.isClick && this.Params.memberleveltype == '1') {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }else if (this.Params.memberleveltype == '2'){
        if(!this.Params.levelname && !this.Params.isagent){
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        }else {
          this.$router.push(this.fun.getUrl("teamAgentCenter"));
        }
      }else if (this.Params.memberleveltype == '3'){
        if(!this.Params.levelname && !this.Params.isagent){
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        }else {
          this.$router.push(this.fun.getUrl("distribution"));
        }
      }
    },
    // 复制邀请码
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    }
  },
  components: {member_head_bottom, member_head_middle, member_head_top}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
