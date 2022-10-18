<!-- 手签协议  -->
<template>
  <div id="handwrittenEsign-esign">
    <c-title :hide="false" text="协议详情"></c-title>
    <div class="content" v-html="content"></div>
    <template v-if="!loading || Object.keys(field).length != 0">
      <diyform :status="fieldStatus" ref="diyform" :field="field" v-on:submit="submit" :thumb="thumb" :description="description">
        <div></div>
      </diyform>
    </template>
    <div class="esign-title">手签协议：</div>
    <template v-if="status == 0">
      <div class="sign-box">
        <vue-esign ref="esign" :height="250" :isCrop="false" lineWidth="2" lineColor="#000000" bgColor="#efefef" />
      </div>
      <div class="button-box">
        <button @click="handleReset">重写</button>
        <button class="button-bg" @click="submitSign">提交</button>
      </div>
    </template>
    <img style="width:100%;padding:0 0.875rem;" v-if="status" :src="resultImg" alt="" />

    <van-popup v-model="showPay" round position="bottom" closeable :style="{}">
      <div class="recharge_way">
        <div class="pay-warn">
          <div style="font-size: 14px;color:#666;">支付金额</div>
          <div class="money-text"><em style="font-size:16px;">￥</em>{{ money }}</div>
        </div>
        <ul class="choose_box">
          <li @click="confirm(btn.value)" v-for="(btn, i) in buttons" :key="i">
            <i class="iconfont" :class="[btnclass(btn.value)]"> </i>
            {{ btn.name }}支付
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import vueEsign from "vue-esign";
import { Toast } from "vant";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
import diyform from "components/ui_components/yz_diyformV2";
export default {
  mixins: [yzPay],
  data() {
    return {
      status: 1, //1||已签名状态
      resultImg: "",
      content: null,
      buttons: [],
      pay_type: null,
      showPay: false,
      money: "",
      ordersn: "",
      loading: true,
      fieldStatus: 0,
      field: [],
      form_data: null,
      thumb: "",
      description: ""
    };
  },
  created() {
    this.getData();
  },

  components: { diyform, vueEsign },

  computed: {},

  mounted() {},

  methods: {
    getData() {
      this.resultImg = null;
      $http
        .get("plugin.hand-sign-protocol.frontend.controllers.protocol.getDetail", { id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result == 1) {
            this.content = response.data.protocol.content;
            this.money = response.data.protocol.amount;
            this.status = response.data.protocol.sign_status;
            if (response.data.protocol.sign_status) {
              this.resultImg = response.data.protocol.img_url;
            }
            this.loading = false;
            this.fieldStatus = response.data.form.status;
            this.field = response.data.form.fields;
            this.thumb = response.data.form.thumb || null;
            this.description = response.data.form.description || null;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPayButton() {
      $http
        .get("plugin.hand-sign-protocol.frontend.controllers.protocol.getButtons", {})
        .then(response => {
          if (response.result == 1) {
            this.buttons = response.data.buttons;
            this.showPay = true;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 20 || type == 22 || type == 48) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10 || type == 49 || type == 52) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },
    // 确认充值
    confirm(type) {
      this.pay_type = type;
      let url = "plugin.hand-sign-protocol.frontend.controllers.protocol.pay";
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      this.showPay = false;
      if (!this.resultImg) {
        this.$toast("您还没签名，请签名后再进行提交");
        return;
      }
      $http.post(url, { pay_type: this.pay_type, img_url: this.resultImg, id: this.$route.params.id, form_data: this.form_data }, "正在充值").then(response => {
        if (response.result == 1) {
          if (type == 3) {
            this.$toast("支付成功");
            this.getData();
            return;
          }
          if (response.data && this.fun.isTextEmpty(response.data.order_sn)) {
            this.$dialog.alert({ message: "参数错误" });
            return false;
          }
          this.ordersn = response.data.order_sn;
          this.rechargePay(this.pay_type, response, this.ordersn, "handSign");
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    handleReset() {
      this.$refs.esign.reset();
    },
    submitSign() {
      if (Object.keys(this.field).length != 0) {
        // 有设置表单，先填写表单
        this.$refs.diyform.submit();
        return;
      }
      this.handleGenerate();
    },
    submit(e) {
      if (e) this.form_data = e;
      this.handleGenerate();
    },
    handleGenerate() {
      this.$refs.esign
        .generate()
        .then(res => {
          if (this.buttons.length > 0 && this.resultImg) {
            this.showPay = true;
            return;
          }
          this.onRead_1(res);
        })
        .catch(err => {
          this.$dialog.alert({ message: "您还没签名，请签名后再进行提交" }); // 画布没有签字时会执行这里 'Not Signned'
        });
    },
    onRead_1(e) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      fd.append("file", fd.append("file", this.dataURItoBlob(e)));

      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          let responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            this.resultImg = responseData.data.img;
            this.getPayButton();
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#handwrittenEsign-esign {
  .content {
    padding: 0.875rem;
  }
  .esign-title {
    text-align: left;
    height: 2rem;
    line-height: 2rem;
    padding: 0 0.875rem;
  }
  .sign-box {
    margin: 0 0.875rem;
    border-radius: 3px;
    background: #efefef;
  }
  .button-box {
    padding: 0.875rem 1rem;
    display: flex;
    justify-content: flex-end;
    button {
      width: 85px;
      height: 25px;
      border-radius: 3px;
      border: solid 1px #f14e4e;
      color: #f14e4e;
      margin-left: 1rem;
    }
    .button-bg {
      background: #f14e4e;
      color: #fff;
    }
  }
  .recharge_way {
    background: #fff;
    margin-top: 0.625rem;
    display: flex;
    flex-direction: column;

    .pay-warn {
      padding: 1rem;
      .money-text {
        font-size: 24px;
        color: rgb(241, 78, 78);
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .choose_box {
      max-height: 24rem;
      overflow: scroll;
    }
    li {
      position: relative;
      display: flex;
      align-items: center;
      line-height: 3.5rem;
      font-size: 16px;
      margin-left: 1.25rem;
      padding-right: 1.25rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .iconfont_bg {
        background: #f15353;
        width: 2.25rem;
        height: 1.5rem;
        border-radius: 0.1875rem;
        display: flex;
        align-items: center;
        margin-right: 0.625rem;
      }

      .icon-balance_d {
        color: #00908c;
      }

      .icon-balance_e {
        color: #64b42e;
      }

      .icon-balance_f {
        color: #fac337;
      }

      .icon-balance_g {
        color: #fac337;
      }

      .icon-balance_h {
        color: #00508e;
      }

      .icon-balance_j {
        color: #29a1f7;
      }

      .icon-balance_i {
        color: #6cbf6a;
      }

      .iconfont {
        font-size: 2rem;
        margin-right: 0.625rem;
      }
    }

    li:last-child {
      border: none;
    }
  }
}
</style>
