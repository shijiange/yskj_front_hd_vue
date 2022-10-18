<template>
  <div class="page" id="signLunch">
    <c-title text="发起签署"></c-title>

    <div class="container templateInfo" style="margin-top: 0.625rem;">
      <div class="container-title">{{Data.name}}合同文本填充</div>

      <div class="templateInfo-item" v-for="item in commonStructsList" :key="item.id">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao" v-if="item.is_require"></i>
          <span>{{item.form_name}}</span>
        </div>
        <div class="input">
          <input type="text" v-model="item.form_value" :placeholder="`请输入${item.form_name}`" />
        </div>
      </div>
    </div>

    <div style="height: 4.5rem;"></div>
    <div class="confirm-btns">
      <div class="button confirm-btn pre" @click="postSignData('2')">保存</div>
      <div class="button confirm-btn send" @click="postSignData('1')">签署</div>
    </div>
  </div>
</template>

<script>
import ContractFillingController from "./contract_filling_controller";

export default ContractFillingController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./common.scss";

.confirm-btns {
  position: fixed;
  bottom: 0;
  left: 50%;
  display: flex;
  justify-content: space-between;
  transform: translateX(-50%);
  width: 21.563rem;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
  background: #f9fbfc;

  .confirm-btn {
    height: 2.656rem;
    font-size: 0.938rem;
    border-radius: 0.469rem;
  }

  .pre {
    color: #fa761d;
    width: 5.625rem;
    background: #fff;
    border: solid 0.063rem #fa761d;
  }

  .send {
    color: #fff;
    width: 14.313rem;
    background-color: #198bfb;
  }
}
</style>
