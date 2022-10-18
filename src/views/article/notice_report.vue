<template>
  <div id="notice">
    <c-title :hide="false" text="举报"></c-title>
    <van-cell-group>
      <van-cell>
        <van-field
            v-model="report_desc"
            rows="2"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入您的举报内容"
            show-word-limit
          />
      </van-cell>
    </van-cell-group>
    <div class="van-button-group">
      <van-button size="large" style="height: 45px;" @click.native="report" type="danger"
        >举报
      </van-button>
    </div>
  </div>
</template>
<script>
import notice_report_controller from "./notice_report_controller";
export default notice_report_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.van-button-group {
  padding-top: 15px;
  padding-left: 12px;
  padding-right: 12px;
}

#notice {
  .banner {
    height: auto;
    max-height: 9.375rem;
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
    height: auto;
    border: 0.0625rem solid #ddd;
    padding: 0.3125rem;
    background: #fff;
    width: 100%;
    border-radius: 0;
  }

  .item_img_bg {
    width: 100%;
    height: 8.125rem;
    margin-bottom: 0.625rem;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }

  .item_img {
    float: right;
    width: 100%;
    height: 7.5rem;
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
