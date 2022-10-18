<template>
  <div id="edit-class">
    <c-title :hide="false" text="商品分类"></c-title>

    <div class="parent" v-if="parentId && parentData.level >= 1">
      <van-field v-model="parentData.name" label="上级分类：" readonly ></van-field>
    </div>
    <div class="cell" v-if="categoryData.url">
      <van-field label="分类链接：">
        <template #input>
          <div class="copy-btn"
            v-clipboard:copy="categoryData.url"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
          >复制</div>
        </template>
      </van-field>
    </div>
    <div class="cell">
      <van-field v-model="categoryData.display_order" label="排序："></van-field>
    </div>
    <div class="cell">
      <van-field v-model="categoryData.name" required label="分类名称：" placeholder="请输入分类名称"></van-field>
      <div class="upload-img">
        <p>分类图片：</p>
        <van-uploader style="margin:1rem 0" :after-read="(e, flag) => multipleMethod_1(e, flag, 'goods-img')" :deletable="false">
          <img v-if="categoryData.thumb_src" :src="categoryData.thumb_src" class="imgs" alt="" />
          <div v-else class="uploader-icon">
            <img :src="require('../../assets/images/up_icon.png')" />
          </div>
        </van-uploader>
        <div class="tip">建议尺寸：100*100px,或者正方形图片</div>
      </div>
    </div>
    <div class="cell">
      <van-field label="是否推荐：">
        <template #button>
          <van-switch v-model="categoryData.is_home"
          :active-value="1" :inactive-value="0" inactive-color="#bebebe" size="18px"></van-switch>
        </template>
      </van-field>
      <van-field label="是否显示：">
        <template #button>
          <van-switch v-model="categoryData.enabled"
          :active-value="1" :inactive-value="0" inactive-color="#bebebe" size="18px"></van-switch>
        </template>
      </van-field>
    </div>
    <div class="btn-confirm">
      <div @click="sureEdit">确认</div>
    </div>
  </div>
</template>

<script>
import editCategory from "./edit_category_controller";
export default editCategory;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
}

#edit-class {
  background-color: #f6f6f6;
  /deep/ .cell {
    margin-bottom: 0.65rem;
    text-align: left;
    background-color: #ffffff;
    white-space: nowrap;
    .van-cell__title {
      color: #323232;
      width: auto;
      font-size: 0.88rem;
    }
  }
  .parent {
    background-color: transparent !important;
    .van-cell {
      background: transparent !important;
    }
  }
  .copy-btn {
    padding: 0 1rem;
    color: #ffffff;
    background-color: #f15353;
    border-radius: 0.13rem;
  }
  .upload-img {
    padding: 10px 16px;
    .imgs {
      display: inline-block;
      margin-right: 0.5rem;
      width: 80px;
      height: 80px;
      vertical-align: bottom;
    }
    .uploader-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.2rem;
      width: 80px;
      height: 80px;
      border: 1px dashed #c0ccda;
      margin: 0 auto;
      img {
        width: 80%;
        height: 80%;
      }
    }
    .tip {
      font-size: 0.75rem;
      color: #a8a8a8;
    }

  }
    .btn-confirm {
      width: 100%;
      max-width: 350px;
      position: fixed;
      bottom: 0;
      padding: 0 0.875rem;
      font-size: 16px;
      div {
        color: #fff;
        width: 80%;
        padding: 0.5rem;
        border-radius: 1.16rem;
        background-color: #f15353;
        border: none;
        margin: 0.375rem auto;
      }
    }
}
</style>
