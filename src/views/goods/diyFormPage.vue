<!-- 自定义表单页面  单独页面（已在：分期购车下单页使用   已弃用） -->
<template>
  <div id="diyFormPage">
    <c-form v-if="show"
            :datas="datas"
            v-on:submitSave="saveInfo"
            :tag="1"
            :form_data_id="form_data_id"></c-form>
  </div>
</template>

<script>
import cForm from "components/temp/form";

var self = null;
var tag = null;
var goodsId = null;
var optionsId = null;
var total = null;
var changeSelfCarry = null;
var distributionUserName = null;
var distributionUserMobile = null;

export default {
  data() {
    return {
      datas: {
        params: { bgcolor: "#fff" },
        data: {
          form_id: ""
        }
      },
      form_data_id: null,
      show: false,
      idGo: false,
      onetag: false
    };
  },

  activated() {
    self = this;
    this.datas.data.form_id = this.$route.params.id;
    this.form_data_id = this.$route.params.form_data_id
      ? this.$route.params.form_data_id
      : null;
    console.log("自定义表单", this.datas.data.form_id);
    console.log("表单模板id", this.form_data_id);
    // this.datas = JSON.stringify(this.datas);
    this.show = true;
    this.idGo = false;
    this.onetag = false;

    tag = this.$route.params.tag;
    goodsId = this.$route.params.goodsId;
    optionsId = this.$route.params.optionsId;
    total = this.$route.params.total;

    changeSelfCarry = this.$route.params.changeSelfCarry
      ? this.$route.params.changeSelfCarry
      : "";
    distributionUserName = this.$route.params.distributionUserName
      ? this.$route.params.distributionUserName
      : "";
    distributionUserMobile = this.$route.params.distributionUserMobile
      ? this.$route.params.distributionUserMobile
      : "";
  },
  mounted() {
    self = this;
    this.datas.data.form_id = this.$route.params.id;
    this.form_data_id = this.$route.params.form_data_id
      ? this.$route.params.form_data_id
      : null;

    this.show = true;
    this.idGo = false;
    this.onetag = false;

    tag = this.$route.params.tag;
    goodsId = this.$route.params.goodsId;
    optionsId = this.$route.params.optionsId;
    total = this.$route.params.total;
    changeSelfCarry = this.$route.params.changeSelfCarry
      ? this.$route.params.changeSelfCarry
      : "";
    distributionUserName = this.$route.params.distributionUserName
      ? this.$route.params.distributionUserName
      : "";
    distributionUserMobile = this.$route.params.distributionUserMobile
      ? this.$route.params.distributionUserMobile
      : "";
  },

  components: { cForm },

  computed: {},

  methods: {
    saveInfo(data) {
      let that = this;
      this.idGo = true;
      that.$router.push(
        that.fun.getUrl("goodsorder",{
          changeSelfCarry: changeSelfCarry,
        }, {
          tag: tag,
          goodsId: goodsId,
          optionsId: optionsId,
          total: total,
          form_data_id: data ? data : that.form_data_id,
          distributionUserName: distributionUserName,
          distributionUserMobile: distributionUserMobile
        })
      );
    }
  },
  beforeRouteLeave: function(to, from, next) {
    if (!self.idGo && self.fun.isTextEmpty(self.form_data_id)) {
      self.$dialog.confirm({ message: '您还没保存信息，确认离开?'})
        .then(() => {
          self.idGo = true;
          self.$router.push(
            self.fun.getUrl("goodsorder",{
              changeSelfCarry: changeSelfCarry,
            }, {
              tag: tag,
              goodsId: goodsId,
              optionsId: optionsId,
              total: total,
              form_data_id: "",
              distributionUserName: distributionUserName,
              distributionUserMobile: distributionUserMobile
            })
          );
        }).catch(() => {
          next(false);
        });
    } else if (!self.onetag && !self.fun.isTextEmpty(self.form_data_id)) {
      console.log("这是有模板id的跳转");
      self.onetag = true;
      self.$router.push(
        self.fun.getUrl("goodsorder",{
          changeSelfCarry: changeSelfCarry,
        }, {
          tag: tag,
          goodsId: goodsId,
          optionsId: optionsId,
          total: total,
          form_data_id: self.form_data_id,
          distributionUserName: distributionUserName,
          distributionUserMobile: distributionUserMobile
        })
      );
    } else {
      console.log(
        "这是有模板id的跳转========================================="
      );
      next();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>
