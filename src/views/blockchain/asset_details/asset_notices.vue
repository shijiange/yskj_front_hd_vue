<template>
  <div id="notices_detail">
    <c-title :hide="false" :text="type"></c-title>
    <div id="content">
      <ul class="detail">
        <li><h1>{{notice.title}}</h1></li>
        <li>
          <span>作者：{{notice.author}}</span>
          <span>{{notice.created_at}}</span>
        </li>
        <p v-html="notice.content">
          <!-- {{notice.content}} -->
        </p>
      </ul>

    </div>
  </div>
</template>

<script>
import detail_notices_controller from "./asset_notices_controller";

export default detail_notices_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #notices_detail {
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