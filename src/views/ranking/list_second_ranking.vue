<template>
  <div id="commission">
    <c-title :hide="false" :text="title"></c-title>
    <template>
      <van-cell-group :border="false">
        <van-cell
          :border="false"
          center
          is-link
          :key="i"
          v-for="(item, i) in datas"
          :to="fun.getUrl('rankingListFirst', { action: nextAction, key: item.key, title: title })"
          title-style="text-algin:left"
        >
          <span slot="title">{{ item.name }}</span>
          <span slot="detail"></span>
        </van-cell>
      </van-cell-group>
    </template>
  </div>
</template>
<script>
import list_second_ranking_controller from "./list_second_ranking_controller";

export default list_second_ranking_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #commission {
    .times {
      text-align: left;
      text-indent: 0.625rem;
      line-height: 2rem;
      background: #ddd;
    }

    .tbs {
      background: #fff;
      overflow: hidden;
      height: 3.125rem;
      display: flex;
      align-items: center;
      padding: 0.625rem 0 0.625rem;
      border-bottom: 0.0625rem solid #d9d9d9;

      .item1 {
        color: #000;
        flex: 50%;
        width: 100%;
        height: 3.125rem;
        line-height: 3.125rem;
        text-align: left;
        font-size: 14px;
        padding-left: 0.9375rem;
      }

      .item2 {
        flex: 50%;
        text-align: right;
        color: #a79d9d;
        padding-right: 0.9375rem;

        .reg {
          color: #259b24;
        }

        .unreg {
          color: #d9d9d9;
        }
      }
    }

    /deep/ .van-cell--clickable:active {
      background-color: #fff;
    }
  }
</style>
