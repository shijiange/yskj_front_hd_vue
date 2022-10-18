<template>
  <div>
    <c-title :hide="false" :text="'中奖纪录'"> </c-title>
    <div class="title">{{ activity_name }}</div>
    <div class="content">
      <ul>
        <li class="good" v-for="(item,i) in recordsList" :key='i'>
          <div class="left">
            <img :src="item.prize_thumb" alt="图片" />
          </div>
          <div class="right">
            <span class="name" v-if="item.point != 0">
                {{item.point + point_word}}
              </span>
            <span class="name" v-else-if="item.love != 0">
                {{item.love + love_word}}
              </span>
            <span class="name" v-else-if="item.amount != 0">
                {{item.amount + amount_word}}
              </span>
            <span class="name" v-else-if="item.has_one_coupon">
                {{item.has_one_coupon.name}}（优惠券）
              </span>
            <span class="time">{{ item.created_at }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import lottery_record_controller from "./lottery_record_controller";

export default lottery_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.title {
  font-size: 15px;
  font-weight: 700;
  margin: 1rem auto;
}

.content {
  .good {
    margin: 1rem;
    padding: 0.5rem;
    background: #fff;
    display: flex;
    border-radius: 7px;

    .left {
      flex: 0 0 5rem;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      justify-content: space-between;
    }

    .name {
      padding-top: 5px;
    }

    .time {
      padding-bottom: 5px;
    }

    img {
      width: 4rem;
      height: 4rem;
    }

    span {
      line-height: 1rem;
    }
  }
}
</style>
