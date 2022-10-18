<template>
  <div id="circleMyAttention">
    <c-title :hide="false" text="我的关注"> </c-title>
    <d-list @load="loadMyAttentions" :finished="pagination.finished" :loading="pagination.loading">
      <div class="tablis">
        <div class="lis" v-for="(memberItem,itemIndex) in attentions" :key="memberItem.id" @click="accessMemberCard(memberItem.card_open,memberItem.card_id)">
          <div class="circleImg">
            <van-image :src="memberItem.header_img" ></van-image>
          </div>
          <div class="title">{{ memberItem.name }}</div>
          <div class="right" @click.stop="unFollow(itemIndex)">取消关注</div>
        </div>
      </div>
    </d-list>
  </div>
</template>

<script>
import circleMyAttention_controller from "./circleMyAttention_controller";

export default circleMyAttention_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleMyAttention {
  .tablis {
    background: #fff;
    padding: 0.19rem 0.94rem 1.19rem 0.84rem;

    .lis {
      width: 100%;
      height: 4.25rem;
      display: flex;
      align-items: center;
      border-bottom: 0.05rem solid #f2f2f2;
      padding: 0 0.9rem;

      .circleImg {
        width: 2.188rem;
        height: 2.188rem;
        background-color: #cfcfcf;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .title {
        flex: 1;
        padding-left: 0.594rem;
        font-size: 0.938rem;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        color: #202020;
      }

      .right {
        font-size: 0.688rem;
        color: #fff;
        width: 3.75rem;
        height: 1.563rem;
        background-color: #3175fe;
        border-radius: 0.781rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
