<template>
  <div id="change-site">
    <c-title :hide="false" :text="isNew ? '新建站点' : '绑定站点'">
    </c-title>

    <div class="content">
      <van-form>
        <van-field v-if="isNew"
          v-model.trim="form.name"
          name="公司/个人名称"
          label="公司/个人名称"
          placeholder="请填写公司/个人名称"
          :rules="[{ required: true, message: '请填写公司/个人名称' }]"
        />
        <van-field
          v-model.trim="form.domain"
          name="域名"
          label="域名"
          placeholder="请填写域名"
          :rules="[{ required: true, message: '请填写域名' }]"
        />
        <p class="tips">已部署的当前商城系统域名，如：{{domain}}</p>
        <p class="tips red">注：您只能绑定一个站点，请勿绑定他人站点！</p>
        <van-field
          v-model.trim="form.mobile"
          name="手机号"
          label="手机号"
          placeholder="请填写手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field v-model.trim="authcode"
                   center
                   clearable
                   label="短信验证码"
                   placeholder="请输入短信验证码"
        >
          <van-button slot="button" size="small" round plain type="info" @click="sureIdentify" v-show="this.count<= 0">
            获取验证码
          </van-button>
          <van-button slot="button" size="small" round plain type="info" disabled v-show="this.count> 0">
            {{count}}秒后重新获取
          </van-button>
        </van-field>

      </van-form>

      <div class="btn" @click="toSave">{{isNew ? '创建站点' : '保存'}}</div>
      <p class="blue-txt" @click="changeNew">{{isNew ? '绑定已有站点' : '创建新的站点'}}</p>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      isNew: false,
      plugin_id: "",
      domain: document.domain,

      form: {
        name: "",
        domain: "",
        mobile: ""
      },
      authcode: "",
      count: "",
      timer: null
    };
  },
  activated() {
    this.initData();
    this.isNew = this.$route.query.isNew == 1 ? true : false;
    this.plugin_id = this.$route.query.plugin_id;
    this.checkData();
  },
  methods: {
    checkData() {
      let url = "plugin.product-market.api.client.index";
      if(this.plugin_id === 58) {
        url = "plugin.market-sub.api.client.index";
      }
      $http
        .get(
          url,
          {},
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isBinding = false;
          } else {
            // 已经绑定过的不操作
            this.isBinding = true;
            this.$dialog.alert({ message: response.msg})
              .then(() => {

                this.$router.go(-1);
              }).catch(() => {});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.form = {
        name: "",
        domain: "",
        mobile: ""
      };
      this.authcode = '';
      this.count = '';
      if(this.time) {
        clearInterval(this.timer);
      }
    },
    changeNew() {
      this.isNew = !this.isNew;
    },
    sureIdentify() {
      if(!this.form.mobile) {
        Toast("请先填写手机号");
        return;
      }
      let url = "plugin.product-market.api.client.index.send-code";
      if(this.plugin_id === 58) {
        url = "plugin.market-sub.api.client.index.send-code";
      }
      let json = {
        mobile: this.form.mobile
      };
      const TIME_COUNT = 60;
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {
            Toast("已发送");
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        response => {
          this.$dialog.alert({message:response.msg});

        }
        );
    },
    checkDomain() {
      if(this.form.domain.indexOf('https://') > -1 || this.form.domain.indexOf('http://') > -1) {
        return false;
      }
      return true;
    },
    toSave() {
      if(this.isNew && !this.form.name) {
        Toast("请填写公司/个人名称");
        return;
      }

      if (!this.form.domain) {
        Toast("请填写域名");
        return;
      }

      if(!this.checkDomain()) {
        this.$dialog.alert({ message: '域名格式不正确: 请填写没有https://或http:// 格式的域名' });
        return;
      }

      if (!this.form.mobile) {
        Toast("请填写手机号");
        return;
      }

      if(!this.authcode) {
        Toast("请先填写验证码");
        return;
      }

      let url = "";
      let json = {};
      if (this.isNew) {
        url = "plugin.product-market.api.client.index.add";
        if(this.plugin_id === 58) {
          url = "plugin.market-sub.api.client.index.add";
        }
        json = {
          domain: this.form.domain,
          mobile: this.form.mobile,
          code: this.authcode,
          name: this.form.name
        };
      } else {
        url = "plugin.product-market.api.client.index.bind";
        if(this.plugin_id === 58) {
          url = "plugin.market-sub.api.client.index.bind";
        }
        json = {
          domain: this.form.domain,
          mobile: this.form.mobile,
          code: this.authcode,
        };
      }
      $http
        .post(url, json, "...").then(response => {
          if (response.result === 1) {

            this.$dialog.alert({message:response.msg});
            this.gotoOrder();
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        response => {
          this.$dialog.alert({message:response.msg});

        }
        );
    },
    gotoOrder() {
      this.$router.replace(
        this.fun.getUrl("goodsorder", {}, {
          tag: this.$route.params.tag,
          goodsId: this.$route.params.goodsId,
          optionsId: this.$route.params.optionsId,
          total: this.$route.params.total,
          id: this.$route.params.id,
          form_data_id: this.$route.params.form_data_id,
          store_id: this.$route.params.store_id,
          cart_ids: this.$route.params.cart_ids
        })
      );
    }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .btn {
    margin: 40px auto 20px auto;
    color: #fff;
    width: 18.75rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
    border-radius: 20px;
  }

  .blue-txt {
    text-align: center;
    color: #377aff;
  }

  .tips {
    color: #797979;
    font-size: 12px;
    text-align: left;
    padding: 0.5rem 1rem;
    background: #fff;
  }

  .red {
    color: #f14e4e;
  }
</style>
<style lang="scss">
  #change-site .van-field__label {
    width: 7rem;
  }
</style>
