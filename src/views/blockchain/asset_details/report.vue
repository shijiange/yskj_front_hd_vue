<template>
  <div id="report">
    <c-title :hide="false" :text="'财务报告'"></c-title>
    <div id="content">
      <ul class="detail">
        <li><h1>{{finance_del.title}}</h1></li>
        <li>
          <span>作者：{{finance_del.author}}</span>
          <span>{{finance_del.reported_at}}</span>
        </li>
        <p>{{finance_del.content}}</p>
      </ul>

    </div>
  </div>
</template>

<script>
import report_controller from "./report_controller";

export default report_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #report {
    background: #fff;

    #content {
      min-height: 37.5rem;

      .detail {
        padding: 0 0.875rem;

        h1 {
          font-size: 18px;
          text-align: left;
          padding: 0.625rem 0;
        }

        li:nth-child(2) {
          display: flex;
          justify-content: space-between;
          color: #8c8c8c;
          font-size: 14px;
          line-height: 1.875rem;
        }

        p {
          margin-top: 0.625rem;
          text-align: left;
        }
      }
    }
  }
</style>