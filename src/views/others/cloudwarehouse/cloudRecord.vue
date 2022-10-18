<template>
  <div id="cloudOrderDetail">
    <c-title :hide="false" :text="'解冻记录'"> </c-title>
    <div class="box" v-for="(item,index) in info" :key="index">
      <div class="img">
        <img :src="item.goods.thumb" alt="" />
      </div>
      <div class="right" >
        <div class="title">{{item.goods.title}}</div>
        <div class="bottom">
          <div style="font-size: 0.75rem; color: #333;">库存{{item.unblock_sum}}</div>
          <div style="font-size: 0.75rem; color: #666;">{{item.created_at}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloudRecord_controller from './cloudRecord_controller';

export default cloudRecord_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.box {
  margin: 0.625rem 0.938rem;
  height: 6.5rem;
  background: #fff;
  border-radius: 0.625rem;
  padding: 1.063rem 0.625rem 1.063rem 0.625rem;
  display: flex;
  align-items: center;

  .img {
    width: 4.375rem;
    height: 4.375rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    flex: 1;
    margin-left: 0.656rem;
    text-align: left;
    height: 4.375rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      font-size: 0.875rem;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>