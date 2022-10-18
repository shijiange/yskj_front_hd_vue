<template>
  <div v-if="isInit">
    <div class="realname-auth__info" v-if="isAuth">
      <van-cell-group :border="false" class="set-address">
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px">姓名</span>
          <span slot="default">{{ realname }}</span>
        </van-cell>
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px">身份证号</span>
          <span slot="default">{{ idcard.length ? idcard.replace(/(\d{3})\d*([0-9a-zA-Z]{3})/, '$1******$2') : '' }}</span>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="realname-auth__tips" v-else>
      <button type="button" class="btn-default" @click="toCert">实名认证</button>
      <div class="tips">*首次购买跨境商品的会员需要填写身份证号和真实姓名</div>
    </div>
    <van-popup v-model="isEdit" position="bottom" class="realname-auto__edit" :style="{ height: '70%' }" :close-on-click-overlay="false">
      <van-nav-bar title="我的信息" right-text="关闭" @click-right="closeInfo" />
      <div class="tips" style="margin: 10px 0px;">*首次购买跨境商品的会员需要填写身份证号和真实姓名</div>
      <div class="realname-auth__info" v-if="isEnsure">
        <van-cell-group :border="false" class="set-address">
          <van-cell :border="false" center>
            <span slot="title" style="font-size: 12px">姓名</span>
            <span slot="default">{{ realname }}</span>
          </van-cell>
          <van-cell :border="false" center>
            <span slot="title" style="font-size: 12px">身份证号</span>
            <span slot="default">{{ idcard.length ? idcard.replace(/(\d{3})\d*([0-9a-zA-Z]{3})/, '$1******$2') : '' }}</span>
          </van-cell>
        </van-cell-group>
        <div class="save__btn" @click="saveInfo">
          <span>开始验证</span>
        </div>
      </div>
      <div class="form" v-else>
        <ul class="info_box">
          <li class="info_list">
            <van-field v-model="form.member_name" label="真实姓名" placeholder="请输入真实姓名" />
          </li>
          <li class="info_list">
            <van-field v-model="form.member_card" label="身份证号码" placeholder="请输入身份证号码" />
          </li>
        </ul>
        <div class="save__btn" @click="saveInfo">
          <span>开始验证</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  props: {
    order_id:{
      type: Number,
      default: 0
    }
  },
  components: {},
  data() {
    return {
      isInit: false, // 是否初始化
      isAuth: false, // 是否已认证
      isEdit: false, // 是否是编辑状态
      isEnsure: false, //开始验证
      realname: '', // 真是名称
      idcard: '', // 卡片ID
      form: {
        member_name: '',
        member_card: '',
        is_ensure: false,
      },
    }
  },
  watch: {
    isInit(newVal, oldVal) {
        this.$emit('postMsg', ['isAuthInit', newVal]);
    },
    isAuth(newVal, oldVal) {
        this.$emit('postMsg', ['isAuthStatus', newVal]);
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getMember()
    },
    //获取会员信息
    getMember() {
      $http
        .get('plugin.overseas.frontend.cert.getMemberInfo')
        .then((response) => {
          this.isInit = true
          if (response.result == 1) {
            this.realname = response.data.realname
            this.idcard = response.data.idcard
            this.form.member_name = response.data.realname
            this.form.member_card = response.data.idcard
            if (!this.realname || !this.idcard) {
              this.isAuth = false
            } else {
              this.isAuth = true
            }
          } else {
            this.isAuth = false
            Toast(response.msg)
          }
        })
        .catch((error) => {
          this.isInit = true
          this.isAuth = false
          console.log(error)
        })
    },
    // 保存信息
    saveInfo() {
      $http
        .get(
          'plugin.overseas.frontend.cert.updateMemberInfo',
          {
            order_id:this.order_id,
            ...this.form,
          },
          '添加中...'
        )
        .then(
          (response) => {
            if (response.result == 1) {
              Toast('认证成功')
              this.realname = this.form.member_name;
              this.idcard = this.form.member_card;
              this.isAuth = true;
              this.isEdit = false;
            } else {
              if (this.form.is_ensure) {
                this.$dialog.alert({ message: response.msg }).then(() => {
                  this.form.is_ensure = false;
                  this.isEnsure = false;
                });
                return;
              }
              Toast(response.msg);
              this.isAuth = false;
            }
          },
          (response) => {
            console.log(response);
            this.isAuth = false;
          }
        )
    },
    // 关闭弹层
    closeInfo() {
        this.isEdit = false;
        this.isEnsure = false;
        this.form.member_name = this.realname;
        this.form.member_card = this.idcard;
    },
    // 打开编辑
    openEdit() {
        this.isEdit = true;
    },
    toCert(){
      $http
        .get('plugin.overseas.frontend.cert.getMemberTempInfo',{}, '')
        .then((response) => {
          if (response.result == 1) {
            this.realname = response.data.realname;
            this.form.member_name = response.data.realname;
            this.idcard = response.data.idcard;
            this.form.member_card = response.data.idcard;
            this.form.member_card = response.data.idcard;
            this.form.is_ensure = true;
            this.isEdit = true;
            this.isEnsure = true;
          } else {
            this.isEdit = true;
            this.isEnsure = false;
          }
        });
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.btn-default {
  height: 2.3rem;
  width: 50%;
  background: #fff;
  border: 0.0625rem solid #f15353;
  text-align: center;
  line-height: 2.3rem;
  color: #f15353;
  border-radius: 0.3rem;
}

// 认证信息显示
.realname-auth__info {
  margin-top: 0.625rem;
  background: #fff;
  .set-address {
    .van-cell {
      padding: 10px 12px;

      .van-cell__title {
        flex: none;
        color: #555;
        text-align: left;
      }

      .van-cell__value {
        input {
          color: #555;
          width: 100%;
        }
      }
    }

    /deep/.van-cell:active {
      background-color: #fff !important;
    }
  }
}

// 未认证提示
.realname-auth__tips {
  margin-top: 0.625rem;
  padding: 20px;
  background: #fff;
  .tips {
    margin-top: 10px;
    font-size: 12px;
    color: #969799;
  }
}

// 编辑认证信息-名字、身份证号
.realname-auto__edit {
  display: flex;
  flex-direction: column;

  .form {
    flex: 1;
    overflow-y: scroll;
  }

  .info_box {
    background: #fff;
    padding-left: 0.875rem;

    .info_list {
      border-bottom: solid 0.0625rem #ebebeb;
      line-height: 2.875rem;
      display: flex;
      align-items: center;
      font-size: 16px;
      text-align: left;

      span {
        display: block;
        width: 6.875rem;
      }
    }

    li:last-child {
      border: none;
    }
  }

  .save__btn {
    width: 90%;
    margin: 1.25rem auto;
    background: #f15353 !important;
    color: #fff !important;
    text-align: center;
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
    border-radius: 0.375rem;
    font-size: 16px;
  }
}

.van-cell {
  padding: 10px 8px;
  font-size: 16px;

  /deep/.van-field__label {
    margin-right: 0;
  }
}
</style>