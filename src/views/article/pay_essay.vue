<template>
  <div id="pay_essay">
    <c-title :hide="false" text="已付费文章"></c-title>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop">
        <div class="list" v-for="(item, index) in datas" :key="index" @click="toNoticeInfo(item)">
          <div class="left">
            <div class="title">{{ item.title }}</div>
            <div class="author">
              <span>{{ item.author }}</span>
              <span>{{ item.virtual_at }}</span>
            </div>
          </div>
          <div class="image">
            <img :src="item.thumb" v-if="item.thumb" />
            <img src="../../assets/images/img_default.png" v-if="!item.thumb" />
          </div>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import pay_essay_controller from './pay_essay_controller';
export default pay_essay_controller;
</script>
  <style lang="scss" rel="stylesheet/scss" scoped>
#pay_essay {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;

    .list {
      padding: 1.375rem 0;
      display: flex;
      border-bottom: solid 1px #ececec;

      .image {
        width: 7.125rem;
        height: 5.5625rem;
        box-sizing: border-box;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-right: 1rem;
        justify-content: space-between;

        .title {
          color: #333;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .author {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          text-align: left;
          align-items: center;
        }
      }
    }
  }
}
</style>
