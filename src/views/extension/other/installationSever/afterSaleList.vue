<template>
  <div id="afterSaleList">
    <c-title :hide="false" :text="another_name.plugin_name"></c-title>
    <div class="saleList" v-for="item in listData" :key="item.id">
      <div class="timeStatus">
        <span>申请时间：{{ item.apply_time }}</span>
        <span style="color: #f15354;">{{ item.state_name }}</span>
      </div>
      <div class="shopBox">
        <div class="shopimg">
          <img :src="item.goods_thumb" alt="" />
        </div>
        <div class="shopTitle">{{ item.title }}</div>
      </div>
      <div class="afterWhyTxt">售后原因</div>
      <div class="afterWhy">{{ item.refund_reason }}</div>
      <div class="afterImgList">
        <div class="img" v-for="(img, ind) in item.refund_image" :key="ind" @click="imgPreview(item.refund_image)">
          <img :src="img" alt="" />
        </div>
      </div>
      <template v-if="item.state_name == '售后驳回'">
        <div class="afterWhyTxt" style="margin-top: 0;">驳回原因</div>
        <div class="afterWhy">{{ item.refuse_reason }}</div>
      </template>
      <div class="afterWhy" v-if="item.worker_name">{{ another_name.worker_name }}：{{ item.worker_name }}</div>
      <div class="afterWhy" v-if="item.worker_mobile">联系电话：{{ item.worker_mobile }}</div>
      <div class="afterBtn">
        <div class="btn" v-for="btn in item.button_group" :key="btn.code" @click.stop="clickBotton(btn, item.id)">{{ btn.name }}</div>
      </div>
    </div>
    <yz-blank :datas="listData"></yz-blank>
  </div>
</template>
<script>
import afterSaleList_controller from "./afterSaleList_controller";

export default afterSaleList_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#afterSaleList {
  .saleList {
    background: #fff;
    margin-bottom: 0.63rem;
    padding: 0.94rem 1rem;

    .afterBtn {
      display: flex;
      justify-content: flex-end;

      .btn {
        width: 4.06rem;
        height: 1.88rem;
        border-radius: 0.31rem;
        border: solid 0.03rem #f15354;
        font-size: 0.81rem;
        color: #f15354;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .afterImgList {
      display: flex;
      flex-wrap: wrap;
      padding-top: 0.78rem;

      .img:nth-child(6n) {
        margin-right: 0;
      }

      .img {
        width: 3.13rem;
        height: 3.13rem;
        background-color: #929292;
        border-radius: 0.31rem;
        margin-right: 0.5rem;
        margin-bottom: 0.63rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .timeStatus {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .afterWhyTxt {
      font-size: 0.94rem;
      color: #333;
      margin-top: 0.91rem;
      margin-bottom: 0.78rem;
      text-align: left;
      font-weight: 600;
    }

    .afterWhy {
      color: #666;
      font-size: 0.75rem;
      text-align: left;
    }

    .shopBox {
      width: 21.56rem;
      height: 3.75rem;
      background-color: #f5f5f5;
      border-radius: 0.31rem;
      margin-top: 0.72rem;
      display: flex;
      align-items: center;
      padding-right: 1.28rem;
      padding-left: 0.5rem;

      .shopimg {
        width: 2.81rem;
        height: 2.81rem;
        background-color: #c3c3c3;
        border-radius: 0.31rem;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .shopTitle {
        flex: 1;
        font-size: 0.88rem;
        color: #202020;
        text-align: left;
        display: -webkit-box; /* 将对象转为弹性盒模型展示 */
        -webkit-box-orient: vertical; /* 设置弹性盒模型子元素的排列方式 */
        -webkit-line-clamp: 2; /* 限制文本行数 */
        overflow: hidden;
      }
    }
  }
}
</style>
