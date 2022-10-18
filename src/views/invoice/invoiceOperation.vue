<template>
  <div class="invoiceOperation">
    <c-title :hide="false" :text="titleName"></c-title>
    <div class="content">
      <ul>
        <li>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label">普通发票抬头</div>
            <van-radio-group v-model="data.type" direction="horizontal">
              <van-radio :name="0" icon-size="1rem">个人</van-radio>
              <van-radio :name="1" icon-size="1rem">单位</van-radio>
            </van-radio-group>
          </div>
        </li>
        <li v-for="(item, i) in list" style="margin: .35rem 0;">
          <van-field  v-model.trim="data[item.model]" :label="item.label"  :placeholder="item.p" :style="{ borderBottom: i == 1 ? 'solid #efefef .03rem' : '' }"/>
        </li>
      </ul>
      <ul>
        <li>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label">是否默认</div>
            <van-switch v-model="data.is_default" active-color="#f15353" inactive-color="#d4d4d4" :active-value="1" :inactive-value="0" size="1rem"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="addInvoice" :class="fun.getPhoneEnv() == 3 ? 'pcStyle' : ''">
      <div class="addInvoice-item" @click="preservation">保存</div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      data: {
        type:0,
        is_default:"0"
      },
      titleName: "编辑发票抬头",
      id:null
    }
  },
  computed: {
    list() {
      return this.listFun(this.radio);
    }
  },
  created() {
    let id = this.$route.query.id;
    if (id >= 0) {
      this.titleName = "编辑发票抬头";
      this.id = id;
      this.getData(id);
    } else this.titleName = "添加发票抬头";
  },
  methods: {
    getData(id) {
      $http.get("plugin.invoice.frontend.rise.edit", {id},"正在加载中").then(({result,msg,data}) => {
        if(result == 1){
          this.data = data;
        }else Toast.fail(msg);
        // this.goBack();
      })
    },
    listFun() {
      if(this.data.type == 0){
        return [{ p: "请填写需要开具发票的姓名", label: "发票抬头", model: "collect_name" }]
      }else{
        return [
          { p: "请填写单位名称", label: "单位", model: "collect_name" },
          { p: "请填写纳税人识别号", label: "税号", model: "tax_num" },
          { p: "请填写单位开户银行（选填）", label: "开户银行", model: "bank" },
          { p: "请填写单位银行账号（选填）", label: "银行账号", model: "bank_admin" },
          { p: "请填写注册地址（选填）", label: "注册地址", model: "address" },
          { p: "请填写注册电话（选填）", label: "注册电话", model: "mobile" }
        ]
      }
    },
    goBack() {
      history.go(-1);
    },
    preservation() {
      let data = this.data;
      if(data.collect_name==="" || data.collect_name===undefined) return Toast(data.type==0?"发票抬头不能为空":"单位名称不能为空")
      if(data.type==1){
        if(data.tax_num==="" || data.tax_num===undefined) return Toast("纳税人识别号不能为空")
      }
      let url = "plugin.invoice.frontend.rise.store";
      let json = {data:data};
      let message = "正在添加中";
      if(this.titleName == "编辑发票抬头"){
        url = "plugin.invoice.frontend.rise.edit";
        message = "正在修改中";
        json.id = this.id;
      }
      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message,
      });
      $http.post(url,json).then(({result,msg})=>{
        Toast.clear();
        let key = result==1?"success":"fail";
        Toast[key](msg);
        this.goBack()
      })
    }
  }
}

</script>
<style lang="scss" scoped>
@import "./component/fixed.scss";
.invoiceOperation {
  text-align: left;
  ::v-deep .van-field__label {
    flex: 1;
  }
  ::v-deep .van-radio__icon--checked .van-icon {
    background-color: #f15353;
    border-color: #f15353;
  }
  ::v-deep .van-field__control {
    text-align: right;
  }
  ::v-deep .van-field__body {
    width: 13rem;
  }
  .content {
    padding: 1rem 0;
    > ul {
      width: 22.19rem;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 0.31rem;
      margin-bottom: 1rem;
      li {
        display: flex;
        height: 2.65rem;
        align-items: center;
        padding: 0 0.5rem;
      }
    }
  }
}
</style>