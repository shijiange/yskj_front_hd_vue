<template>
  <div>
    <c-title :hide="false" :text="lang.capital_name + '公告'">
    </c-title>

    <div class="content">
      <ul class="sheet">
        <li @click="toNotice(notice)" v-for="(notice,i) in noticeList" :key='i'>
          <p class="title">{{notice.title}}</p>
          <p class="author"><span>作者：{{notice.author}}</span><span>{{notice.created_at}}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import notice_controller from "./notice_controller";

export default notice_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    margin-top: 0.5rem;
    background: #fff;
  }

  .sheet {
    li {
      padding: 0.5rem 1rem;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;
    }

    .title {
      margin-bottom: 0.5rem;
    }

    .author {
      display: flex;
      color: #8c8c8c;

      span:first-child {
        flex: 1;
      }

      span:last-child {
        align-self: center;
        flex: 0 0 9rem;
      }
    }
  }
</style>