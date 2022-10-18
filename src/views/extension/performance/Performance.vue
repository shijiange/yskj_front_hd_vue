<template>
  <div id="performance">
    <c-title
      :hide="false"
      text='营业额'
    ></c-title>
    <div id="content">
      <p class="info_a">今日营业额(万元)</p>
      <p class="info_b">{{today}}</p>
      <ul class="info_c">
        <li>
          <span>本月营业额(万元)</span></br>
          <span>{{month}}</span>
        </li>
        <li>
          <span>总营业额(万元)</span></br>
          <span>{{total}}</span>
        </li>
      </ul>
      <div 
        style="margin-top: 20px; padding-left: 10px; width: 23rem; height: 28.675rem;"
        id="echarts-dom"
      ></div>
    </div>
  </div>
</template>

<script>
import performance_controller from "./performance_controller.js";

export default performance_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#performance {
  #content {
    background: #fff;
    padding: 0.625rem 0;

    .info_a {
      font-size: 14px;
      line-height: 1.875rem;
    }

    .info_b {
      font-size: 32px;
      color: #ff672b;
      line-height: 3rem;
    }

    .info_c {
      display: flex;
      margin-top: 0.625rem;

      li {
        width: 50%;
        line-height: 1.5rem;
        font-size: 14px;
        color: #8c8c8c;

        span:last-child {
          color: #ff672b;
          font-size: 18px;
        }
      }

      li:first-child {
        border-right: solid 0.0625rem #ebebeb;
      }
    }

    .echart {
      // width: 70%;
      // height: 400px;
    }
  }
}
</style>
