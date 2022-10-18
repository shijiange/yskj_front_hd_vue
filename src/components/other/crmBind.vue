<!-- 益生 crm绑定 -->
<template>
  <div id="crmBind">
    <van-dialog v-model="showSuccess" show-cancel-button cancel-button-text="联系客服" confirm-button-text="关闭" @cancel="linkService">
      <div class="crm-binb-success">
        <div class="title">恭喜您注册成功！</div>
        <div style="line-height: 24px;">
          系统检测到您是益生康健会员已为您自动绑定，<template v-if="selectMember && selectMember.Address != ''">绑定账户中的收件地址为{{ selectMember.Address | numHidden }}，</template
          >如有疑问可联系在线客服
          <template v-if="mobile">，或致电{{ mobile }}</template>
        </div>
      </div>
    </van-dialog>
    <van-dialog v-model="showSelectBind" :show-confirm-button="false" :before-close="beforeClose" @close="onClose">
      <div class="crm-binb-select">
        <div class="text">系统检测到您存在多个益生康健线下账户，请在以下收件信息中，选择一个账户进行绑定：</div>
        <div class="bind-list-main">
          <van-radio-group v-model="selectRadio" checked-color="#f15353">
            <van-radio shape="square" :name="index" v-for="(item, index) in crm_member_list" :key="item.CrmID">{{ item.Address | numHidden }}</van-radio>
          </van-radio-group>
        </div>
        <van-button type="primary" block color="#f15353" style="margin:24px auto 0;font-size:15px;" @click.stop="bindCrm">确认绑定</van-button>
        <div class="size-text" v-if="cservice" @click.stop="linkService">都不是我, 联系客服</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSuccess: false,
      showSelectBind: false,
      crm_member_list: [],
      selectMember: {},
      selectRadio: null,
      cservice: null, //在线客服
      mobile: null //客服电话
    };
  },

  created() {
    this.getBindData();
  },

  components: {},

  computed: {},

  mounted() {
    this.cservice = this.$store.state.temp.mailInfo.cservice;
    this.mobile = this.$store.state.temp.mailInfo.service_mobile;
  },

  methods: {
    getBindData() {
      let that = this;
      $http
        .get("plugin.ys-system.frontend.member-info.search-user", {}, ".")
        .then(response => {
          if (response.result === 1) {
            this.crm_member_list = response.data.list || [];
            if (!response.data.list || response.data.list.length == 0) {
              return;
            }
            if (response.data.is_binding == 0) {
              // 需要选择
              this.showSelectBind = true;
            } else {
              // 无需选择，自动绑定,list不为空时才显示
              this.showSuccess = true;
              this.selectMember = response.data.list[0];
            }
          } else {
            this.$dialog.alert({
              title:'账户异常',
              message:response.msg,
              confirmButtonText:'联系客服'
            }).then(function(){
              that.linkService();
            });
            this.$store.commit("setCrmBind", false);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    bindCrm() {
      // 绑定crm账号
      if (this.selectRadio == null) {
        this.$toast("请选择其中一个账号");
        return;
      }
      this.selectMember = this.crm_member_list[this.selectRadio];
      $http
        .get("plugin.ys-system.frontend.member-info.appoint-bind-user", { ys_user_id: this.crm_member_list[this.selectRadio].CrmID }, ".")
        .then(response => {
          if (response.result === 1) {
            this.showSelectBind = false;
            this.showSuccess = true;
            location.reload();
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    linkService() {
      this.$store.commit("setCrmBind", false);
      if (!this.cservice) {
        this.$toast("暂无客服联系方式！");
        return;
      }
      this.showSuccess = false;
      this.showSelectBind = false;
      this.$nextTick(() => {
        window.location.href = this.cservice;
      });
    }
  },
  filters: {
    numHidden: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.replace(/[0-9]/gi, "*");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#crmBind {
  .crm-binb-success {
    padding: 12px 18px;
    text-align: left;
    .title {
      font-size: 18px;
      line-height: 48px;
      font-weight: 600;
    }
  }
  .crm-binb-select {
    padding: 18px;
    text-align: left;
    .text {
      font-size: 13px;
      line-height: 20px;
    }
    .bind-list-main {
      max-height: 15rem;
      overflow-y: scroll;
    }
    .van-radio-group {
      .van-radio {
        padding: 10px 0;
      }
    }
    .size-text {
      font-size: 12px;
      text-align: center;
      color: #f15353;
      padding-top: 12px;
    }
  }
}
</style>
