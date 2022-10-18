<template>
  <div id="afterApply">
    <c-title :hide="false" text="售后申请"></c-title>
    <div class="orderIds">
      <span>订单编号：{{ this.$route.query.sn }}</span>
    </div>
    <div class="afterWhyBox">
      <div class="whyTxt" style="margin-bottom: 0.75rem;">售后原因</div>
      <van-field v-model="message" rows="8" type="textarea" placeholder="请输入描述售后原因" />
    </div>
    <div class="uploadImg">
      <div class="imgTxt">上传图片</div>
      <yz_uploader v-model="fileList1"></yz_uploader>
    </div>
    <!-- 按钮 -->
    <div class="posBtn set-pc-styleLeft">
      <div class="btn" @click="sendBtn">提交</div>
    </div>
  </div>
</template>
<script>
import afterApply_controller from "./afterApply_controller";

export default afterApply_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 按钮
.posBtn {
  width: 100%;
  height: 2.75rem;
  position: fixed;
  bottom: 0.91rem;

  .btn {
    width: 21.56rem;
    height: 2.75rem;
    background-color: #f15354;
    border-radius: 0.31rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin: 0 auto;
  }
}

.uploadImg {
  background-color: #fff;
  text-align: left;
  padding: 1.22rem 0;

  .imgTxt {
    font-size: 0.88rem;
    color: #242424;
    font-weight: 600;
    margin-bottom: 0.75rem;
    padding: 0 0.875rem;
  }

  .uploadImgList {
    display: flex;
    flex-wrap: wrap;

    .upload {
      width: 5.28rem;
      height: 5.28rem;
      background-color: #f1f1f1;
      border-radius: 0.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .icon-photobzhaoxiang {
        font-size: 2rem;
        color: #cfcfcf;
      }

      span {
        font-size: 0.81rem;
        color: #999;
      }
    }

    .img {
      width: 5.28rem;
      height: 5.28rem;
      background-color: #f1f1f1;
      border-radius: 0.25rem;
      margin-right: 0.63rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.orderIds {
  padding: 0.94rem 0.94rem;
  color: #333;
  font-size: 0.81rem;
  background-color: #f2f2f2;
  text-align: left;
}

.afterWhyBox {
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  padding: 1.22rem 0.94rem 1.31rem 0.94rem;

  .whyTxt {
    font-size: 0.88rem;
    color: #333;
    text-align: left;
    font-weight: 600;
  }

  .van-cell {
    // padding: 10px 0;
    width: 21.56rem;
    background-color: #f1f1f1;
    border-radius: 0.25rem;
  }
}
</style>
