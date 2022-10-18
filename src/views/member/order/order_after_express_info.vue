<template>
  <div>
    <div style="height: 0.625rem;"></div>
    <div class="my-value">
      <van-cell-group>
        <van-field
          style="border: 1px solid #bfcbd9;"
          v-model="expressName"
          placeholder="请选择快递公司"
          readonly
          @click.native="companyShow = true"
        />
      </van-cell-group>
    </div>
    <div style="height: 10px;"></div>
    <van-cell-group>
      <van-field style="border: 1px solid #bfcbd9;" v-model="form.express_sn" placeholder="请输入快递单号" />
    </van-cell-group>

    <div class="explain" style="margin-top:10px;padding-top:10px;background:#fff;text-align:left;">
      <span style="padding-left:0.8rem;">拍照上传快递单</span>
      <yz_uploader @imgFileEvent="upExpress" @input="upExpressImage" :max_count="1" />
    </div>

    <div style="height: 40px;"></div>
    <van-button type="default" size="large" style="width: 100%; background: #20a0ff; color: #fff;" @click="submitInfo"
      >提交信息</van-button
    >
    <van-popup v-model="companyShow" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="选择快递">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="companyShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:40px;"></div> -->
      <van-cell
        :border="false"
        is-link
        v-for="(item, i) in express"
        :key="i"
        @click.native="companyConfirm(item)"
        title-style="text-align:left"
      >
        <span slot="title">{{ item.name }}</span>
      </van-cell>
    </van-popup>
  </div>
</template>
<script>
import order_after_express_info_controller from './order_after_express_info_controller';
export default order_after_express_info_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#refund {
  text-align: left;

  font {
    background: #fff;
    display: block;
    color: #f15353;
    line-height: 2rem;
    padding: 0 0.625rem;
    font-size: 12px;
  }

  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;
    align-items: center;

    span {
      width: 6.5625rem;
      flex: none;
      font-size: 16px;
      line-height: 1;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }

    .mint-popup {
      width: 100%;
    }
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
