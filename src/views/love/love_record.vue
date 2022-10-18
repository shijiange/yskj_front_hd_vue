<template>
  <div id="love_record">
    <c-title :hide="false" :text="love_name + '激活记录'"></c-title>

    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div id="tbsd">
        <div class="tbs" v-for="(list,i) in listData" :key='i' @click="goDetailed(list.id)">
          <div class="left">
            <span>激活ID:{{ list.id }}</span>
            <br />
            <p style="color: #8c8c8c;">
              <span>{{ list.created_at }}</span>
            </p>
          </div>
          <div class="right">
            <p>
              +{{ list.actual_activation_love }}
              <small></small>
            </p>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import love_record_controller from "./love_record_controller";

export default love_record_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_record {
  #money {
    color: #f15353;
    font-size: 32px;
    line-height: 4.5rem;
  }

  #dingjing {
    border: 0.0625rem solid #ccc;
    padding: 0.3125rem 0.625rem;
    width: 3.125rem;
    border-radius: 0.625rem;
    margin: 0 auto;
    margin-bottom: 0.9375rem;
  }

  #tbsd {
    border-bottom: 0.0625rem solid #ebebeb;
    margin-top: -0.0625rem;
  }

  .tbs {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0.625rem 0.75rem;
    flex-flow: row wrap;
    border-top: #ebebeb 0.0625rem solid;
    box-sizing: border-box;
    font-size: 14px;

    .left {
      flex: 70%;
      text-align: left;

      span {
        line-height: 1.5rem;
        display: inline-block;
      }

      p {
        line-height: 1.5rem;
      }
    }

    .right {
      flex: 30%;
      text-align: right;

      p {
        color: #f15353;
        font-size: 16px;
      }
    }
  }
}
</style>
