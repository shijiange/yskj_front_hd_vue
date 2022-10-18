<template>
  <div id="myrelationship-detail">
    <c-title :hide="false" :text="'会员概况'"></c-title>
    <div class="ul">
      <div class="list">
        <div class="row1">
          <div class="img">
            <img :src="member.avatar" alt="" />
          </div>
          <div class="title">Ta的业绩</div>
        </div>
        <div class="row2">
          <div class="li">
            <div class="num">{{ orderCount }}</div>
            <div class="text">销售额</div>
          </div>
          <div class="li">
            <div class="num">{{ orderNum }}</div>
            <div class="text">销售笔数</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ul">
      <div class="list">
        <div class="row1">
          <div class="img">
            <img :src="member.avatar" alt="" />
          </div>
          <div class="title">Ta的直推</div>
        </div>
        <div class="row3">
          <div class="li">
            <div class="num">{{ count }}</div>
            <div class="text">全部</div>
          </div>
          <div class="li" v-for="(item, index) in levelList" :key="index">
            <div class="num">{{ item.yz_member_count }}</div>
            <div class="text">{{ item.level_name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import my_relationship_detail_controller from "./my_relationship_detail_controller";

export default my_relationship_detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#myrelationship-detail {
  text-align: left;

  .ul {
    padding: 0 0.9375rem;

    .list {
      margin-top: 2.125rem;
      background: #fff;
      border-radius: 0.625rem;
      padding: 0 0 0.8125rem 1.125rem;

      .row1 {
        display: flex;

        .img {
          width: 3.125rem;
          height: 3.125rem;
          border-radius: 50%;
          transform: translateY(-50%);

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .title {
          padding-top: 0.8125rem;
          color: #202020;
          font-size: 1rem;
          margin-left: 0.625rem;
          font-weight: 600;
        }
      }

      .row2 {
        display: flex;
        width: 100%;
        justify-content: center;
        padding-top: 0.5rem;

        .li {
          flex: 1;
          text-align: center;

          .num {
            color: #202020;
            font-size: 1rem;
            font-weight: 600;
            padding-top: 0.15rem;
          }

          .text {
            color: #666;
            padding-top: 0.15rem;
          }
        }
      }

      .row3 {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .li {
          width: 33.3%;
          min-width: 33.3%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
          padding: 1rem 0.625rem;

          .num {
            color: #202020;
            font-size: 1rem;
            font-weight: 600;
            padding-top: 0.15rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .text {
            color: #666;
            padding-top: 0.15rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
