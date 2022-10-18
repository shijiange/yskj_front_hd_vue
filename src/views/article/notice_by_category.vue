<template>
  <div id="notice">
    <c-title :hide="false" :text="title"></c-title>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div class="item" v-for="(item,i) in datas" @click="toNoticeInfo(item)" :key='i'>
        <div class="item_bg">
          <p class="item_title">{{ item.title }}</p>
          <p class="item_time">{{ item.updated_at }}</p>
          <div
            class="item_img_bg"
            @click="toNoticeInfo(item)"
            v-if="item.thumb"
          >
            <img class="item_img" :src="item.thumb" />
          </div>
          <div
            class="item_img_bg"
            @click="toNoticeInfo(item)"
            v-if="!item.thumb"
          >
            <img class="item_img" src="../../assets/images/img_default.png" />
          </div>
          <div class="item_desc">{{ item.desc }}</div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import notice_by_category_controller from "./notice_by_category_controller";
export default notice_by_category_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#notice {
  .banner {
    height: auto;
    max-height: 25rem;
    width: 100%;
  }

  .item {
    margin: 0.3125rem;
  }

  .item_lin {
    height: 1.875rem;
    background: #fff;
  }

  .item_bg {
    border: 0.0625rem solid #ddd;
    padding: 0.3125rem;
    background: #fff;
    width: 100%;
    border-radius: 0;
  }

  .item_img_bg {
    width: 100%;
    margin-bottom: 0.625rem;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }

  .item_img {
    width: 100%;
    max-height: 25rem;
  }

  p.item_title {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  p.item_time {
    width: 50%;
    float: left;
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 12px;
    color: #8a8a8a;
  }

  p.item_category {
    width: 50%;
    float: left;
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: right;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 14px;
    color: #f15353;
    font-weight: bold;
  }

  .item_desc {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    font-size: 14px;
    color: #8a8a8a;
  }
}
</style>
