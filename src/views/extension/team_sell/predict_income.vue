<template>
  <div id="predict_income">
    <c-title :hide="false"
             text="预估收益"></c-title>
    <van-tabs v-model="dividend_type"
    :ellipsis="false"
    @change="handleClick">
       <van-tab :title="item.name"
        v-for="(item,index) in title" :key="index"
     :name="item.dividend_type"></van-tab>
    </van-tabs>
    <div class="content"
        >
      <div class="list-wrap"
           v-if="!fun.isTextEmpty(datas)">
        <div class="list"
             v-for="(item, index) in datas"
             :key="index">
          <div class="list-content"
               >
            <div class="top">
              <span>{{ item.order_sn }}</span>
              <span class="num">+{{ item.dividend_amount }}</span>
            </div>
            <div class="bottom">
              <span>{{ item.created_at }}</span>

            </div>

          </div>

        </div>
      </div>
      <img src="../../../assets/images/blank.png"
           alt=""
           v-if="!loading && fun.isTextEmpty(datas)"
           style="width: 5rem; margin-top: 5rem;" />
    </div>
  </div>
</template>
<script>
import predict_income_controller from './predict_income_controller';
export default predict_income_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#predict_income {
  .list-wrap {
    background-color: #fff;

    .list {
      border-bottom: 2px solid #e2e2e2;

      .list-content {
        padding: 32px 24px;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .num {
            color: #ff2c29;
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}

#predict_income .van-tab {
  flex: 0 0 25% !important;
}
</style>
