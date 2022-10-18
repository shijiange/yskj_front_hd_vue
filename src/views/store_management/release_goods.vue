<template>
  <div class="release-goods">
    <c-title :hide="false" :text="title"></c-title>
    <van-sticky :offset-top="40" class="sticky-box">
      <van-tabs v-model="active" class="tabs">
        <van-tab :name="0" title="基本信息"></van-tab>
        <van-tab :name="1" title="权限"></van-tab>
        <van-tab :name="2" title="折扣"></van-tab>
      </van-tabs>
    </van-sticky>
    <!-- 分割线 -->
    <van-divider style="margin: 0"></van-divider>
    <div v-if="isFinished">
      <base-set
        v-show="active == 0"
        ref="refBaseSet"
        :goodsInfo="goodsInfo"
        :categoryMenus="categoryMenus"
        :dispatchTemplates="dispatchTemplates"
        :dispatchTypes="dispatchTypes"
      ></base-set>
      <permissions
        v-show="active == 1"
        ref="refPermissions"
        :levelList="levelList"
        :groupsList="groupsList"
        :widgetsInfo="widgetsInfo"
      ></permissions>
      <discount
        v-show="active == 2"
        ref="refDiscount"
        :levelList="discountValues"
        :widgetsInfo="widgetsInfo"
      ></discount>
    </div>
    <div class="btn-confirm" @click="releaseGoods">{{goodsId? '确认修改':'确认发布'}}</div>
  </div>
</template>

<script>
import releaseGoods from "./release_goods_controller";
export default releaseGoods;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.release-goods {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 3rem;
  background-color: #f6f6f6;
  .sticky-box {
    background: #fff;
    padding-bottom: 0.3rem;
    /deep/ .van-sticky {
      overflow: hidden;
      background-color: rgb(246, 246, 246);
    }
  }
  .tabs {
    width: 100%;
    margin-top: 4px;
  }
  .btn-confirm {
    max-width: 350px;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 95%;
    height: 2.31rem;
    padding: 0.5rem;
    border-radius: 1.16rem;
    color: #ffffff;
    background-color: #f15353;
  }

}
</style>