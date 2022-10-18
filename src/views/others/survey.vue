<template>
  <div id="survey">
    <c-title :hide="false" :text="'调查表'"></c-title>
    <div class="text_one">满意度调查</div>
    <div class="text_two">感谢您对本次消费进行评价：</div>
    <div class="text_thr">
      <ul>
        <li v-for="(item,index) in info" :key="index">
          <div class="niuText">{{item.name}}</div>
          <van-radio-group v-model="item.radio" class="niucel">
            <van-radio name="1">非常满意</van-radio>
            <van-radio name="2">满意</van-radio>
            <van-radio name="3">一般</van-radio>
            <van-radio name="4">不满意</van-radio>
            <van-radio name="5">不满意</van-radio>
          </van-radio-group>
        </li>
      </ul>
    </div>
    <div class="btn" @click="tapIn">提交</div>
  </div>
</template>

<script>
import survey_controller from "./survey_controller";
export default survey_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#app {
  height: 100%;
  background-color: #fff;
}

#survey {
  background-color: #fff;
  padding: 5px 0;

  .text_one {
    color: rgba(49, 51, 50, 1);
    font-size: 1.25rem;
    margin-top: 70px;
  }

  .btn {
    width: 100%;
    height: 2.44rem;
    background-color: rgba(39, 121, 194, 1);
    font-size: 0.94rem;
    color: rgba(255, 255, 255, 1);
    line-height: 2.44rem;
    position: fixed;
    bottom: 0;
  }

  .text_two {
    height: 1rem;
    font-size: 0.75rem;
    letter-spacing: 0;
    color: rgba(49, 51, 50, 1);
    text-align: left;
    margin-left: 1.41rem;
    margin-top: 2.66rem;
  }

  .text_thr ul li {
    margin: 0 1.31rem;
    padding-top: 1.84rem;
  }

  .text_thr ul li .niuText {
    text-align: left;
  }

  .text_thr ul li .niucel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 0.69rem;
    color: rgba(49, 51, 50, 1);
    margin-top: 0.69rem;
  }
}
</style>
