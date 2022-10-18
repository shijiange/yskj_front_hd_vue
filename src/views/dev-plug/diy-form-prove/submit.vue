<!-- 提交表单 -->
<template>
  <div id="diy-form-prove-submit">
    <c-title :hide="false" text="表单核销"></c-title>
    <div style="height: 0.005rem; clear: both;"></div>
    <template v-if="!loading">
      <diyform :status="status" :field="field" v-on:submit="submit" :thumb='thumb' :description='description'>
        <van-button v-if="pageMode == 'prove'" :disabled="isProve" style="height: 40px;" size="large" @click.native="proveForm" :type="!isProve ? 'primary' : 'danger'">{{
          isProve ? "已确认" : "确认"
        }}</van-button>
      </diyform>
    </template>

    <van-popup v-model="showCode" :close-on-click-overlay="false" round :style="{ width: '18rem' }">
      <div class="code-box">
        <img v-if="code_url" :src="code_url" alt="" />
        请联系工作人员扫码<br /><em v-if="!finish" style="font-size:14px;display: flex;justify-content: center;padding-top:0.5rem;"
          >有效期2分钟,剩余:<van-count-down ref="countDown" time="120000" format="mm:ss" @finish="finishTimer"
        /></em>
        <em v-else style="font-size:14px;padding-top:0.5rem;color: #f15353;">二维码已失效</em>
        <div class="icon-clone"><i class="iconfont icon-guanbi" @click.stop="close"></i></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import diyform from "components/ui_components/yz_diyformV2";
export default {
  data() {
    return {
      isProve: false, //是否已核销成功
      pageMode: null, //页面类型。提交还是核销
      loading: true,
      showCode: false, //核销码弹窗
      finish: false, //倒计时已结束
      status: 0,
      field: {},
      code_url: "", //核销码图片地址
      dataId: "", //提交后的表单数据id
      timer: null,

      thumb: null,
      description: null
    };
  },

  created() {
    if (this.$route.params.mode == "submit") {
      // 会员提交表单
      this.getData();
    } else if (this.$route.params.mode == "prove") {
      this.pageMode = "prove";
      this.getProveData();
    }
  },

  components: { diyform },

  computed: {},

  mounted() {},
  destroyed() {
    if (this.timer) clearTimeout(this.timer); //清理定时任务
  },
  methods: {
    getData() {
      // 获取表单数据
      if (!this.$route.params.id) {
        return;
      }
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.formDetail", { id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            // if (response.data.form_data.is_prove == 0 && response.data.form_data.data_id) {
            //   // 场景：1.已提交但是一直没核销成功，手动删除。2.手动刷新页面
            //   this.dataId = response.data.form_data.data_id;
            //   this.delForm();
            //   return;
            // }
            this.loading = false;
            // this.status = response.data.form_data.status;
            this.status = 0;
            this.field = response.data.form_data.fields;
            this.thumb = response.data.form_data.thumb || null;
            this.description = response.data.form_data.description || null;
            this.fun.wxShare(
              "",
              {},
              {
                title: response.data.form_data.title,
                imgUrl: this.thumb,
                description: this.description
              }
            );
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit(e) {
      // 提交表单数据，提交后需要核销员核销
      $http
        .post(
          "plugin.diy-form-prove.frontend.controllers.prove.saveData",
          {
            form_data: e,
            form_id: this.$route.params.id
          },
          "."
        )
        .then(
          response => {
            if (response.result == 1) {
              this.dataId = response.data.id;
              this.getEwmImg(response.data.id);
            } else {
              this.$toast(response.msg);
            }
          },
          function(response) {
            console.log("fail");
          }
        );
    },
    getEwmImg(_id) {
      // 弹窗显示后，需要进行核销，轮询查询核销结果
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.proveCode", { data_id: _id }, ".")
        .then(response => {
          this.code_url = null;
          if (response.result === 1) {
            this.code_url = `${response.data.code_url}?${Date.now()}`;
            this.showCode = true;
            this.finish = false;
            this.pollTimers(); //轮询
            this.$nextTick(() => {
              this.$refs.countDown.reset();
            });
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    pollTimers() {
      if (this.finish) {
        // 超过2分钟有效期
        return;
      }
      let that = this;
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.checkProve", { id: this.dataId }, ".")
        .then(response => {
          if (response.result === 1) {
            if (response.data.status == 0) {
              this.timer = setTimeout(() => {
                that.pollTimers();
              }, 3000);
            } else {
              this.$toast("核销成功");
              this.status = 1;
              this.initForm();
            }
          } else {
            clearTimeout(this.timer); //清理定时任务
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      let _text = this.finish ? "二维码链接已失效，请重新提交" : "关闭后数据需要重新提交，是否确认关闭";
      this.$dialog
        .confirm({
          title: "提示",
          message: _text
        })
        .then(() => {
          this.delForm();
          this.initForm();
        })
        .catch(() => {});
    },
    delForm() {
      // 删除表单记录
      // data_id为提交后的表单数据id
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.delProve", { data_id: this.dataId })
        .then(response => {
          if (response.result === 1) {
            this.getData();
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    finishTimer() {
      this.finish = true;
      this.delForm();
      this.initForm();
    },
    initForm() {
      if (this.timer) clearTimeout(this.timer); //清理定时任务
      this.code_url = null;
      this.showCode = false;
      this.dataId = null;
    },

    // 核销 =======
    getProveData() {
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.dataDetail", { id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            this.field = response.data.form_data.fields;
            this.status = 1;
            this.loading = false;
            if (response.data.form_data.is_prove) this.isProve = true;
            this.thumb = response.data.form_data.thumb || null;
            this.description = response.data.form_data.description || null;
          } else {
            this.$dialog
              .alert({
                title: "提示",
                message: response.msg
              })
              .then(() => {
                // on close
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    proveForm() {
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.submitProve", { data_id: this.$route.params.id }, ".")
        .then(response => {
          this.$toast(response.msg);
          if (response.result === 1) {
            this.isProve = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#diy-form-prove-submit {
  .code-box {
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
    font-weight: 600;
    font-size: 16px;
    img {
      width: 10rem;
      height: 10rem;
      object-fit: contain;
      margin-bottom: 1rem;
    }
    .icon-clone {
      position: absolute;
      top: 16px;
      right: 0px;
      i {
        padding: 0.875rem;
      }
    }
  }
  .top-thumb {
    img {
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
