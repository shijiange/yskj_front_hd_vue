<!-- 提交表单 -->
<template>
  <div id="diy-form-prove-submit">
    <c-title :hide="false" text="表单核销"></c-title>

    <template v-if="!loading">
      <diyform :status="status" :field="field" v-on:submit="submit"  :thumb='thumb' :description='description'>
        <van-button disabled style="height: 40px;" size="large" type="danger">已核销</van-button>
      </diyform>
    </template>

  </div>
</template>

<script>
import diyform from "components/ui_components/yz_diyformV2";
export default {
  data() {
    return {
      loading: true,
      status: 0,
      field: {},
      dataId: "", //提交后的表单数据id

      thumb: null,
      description: null
    };
  },

  created() {
    this.getData();
  },

  components: { diyform },

  computed: {},

  mounted() {},
  destroyed() {},
  methods: {
    getData() {
      // 获取表单数据
      if (!this.$route.params.id) {
        return;
      }
      $http
        .get("plugin.diy-form-prove.frontend.controllers.prove.dataLogDetail", { id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            this.loading = false;
            this.status = response.data.form_data.status;
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
