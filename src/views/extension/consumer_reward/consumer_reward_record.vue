<template>
    <div class="page">
        <c-title :hide="false" text="领取记录"></c-title>

        <div class="listItems">
          <div class="item" v-for="(item,key) in listData" :key="key">
            <div class="time">{{item.created_at}}</div>
            <div class="price">{{item.reward_amount}}</div>
          </div>
        </div>



    </div>
</template>

<script>
import record_controller from "./consumer_reward_record_controller";

export default record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.page { background: #fff; min-height: 100vh; }

.listItems {
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.2rem;
    padding: 0 0.969rem;
    border-bottom: 0.04rem solid #f2f2f2;

    .time {
      font-size: 0.938rem;
      color: #333;
    }

    .price {
      font-size: 0.938rem;
      color: #f15353;
    }
  }
}

</style>