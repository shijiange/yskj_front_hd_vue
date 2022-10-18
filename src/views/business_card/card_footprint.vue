<template>
  <div id="card_footprint">
    <c-title :hide="false" :text="'名片足迹'"></c-title>
    <div class="content">
      <div class="box_a">
        <!--<h1>2019-03-27</h1>-->
        <div class="goods_list">
          <div class="goods_box" v-for="(item,i) in list" :key='i'>
            <ul class="goods_left">
              <li class="header">
                <div class="img">
                  <img v-if="item.card" :src="item.card.card_avatar" />
                  <img v-if="!item.card" :src="item.member.avatar_image" />
                </div>
                <span v-if="item.card" class="name">
                  {{item.card.card_name}}</span>
                <span v-if="!item.card" class="name">
                  {{item.member.nickname}}</span>
                <span class="time">{{ item.created_at }}</span>
              </li>
              <li class="look_number">
                <span>第{{ item.num }}次查看</span>
                {{ item.goods.title }}
              </li>
            </ul>
            <div class="goods_img" @click="toGood(item.goods_id)">
              <img :src="item.goods.goods_thumb" />
            </div>
          </div>
          <div class="blank" v-if="list.length <= 0">
            <img src="../../assets/images/blank.png">
            <span>还没有记录哦</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card_footprint_controller from "./card_footprint_controller";

export default card_footprint_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_footprint {
  .content {
    .box_a {
      h1 {
        font-size: 15px;
        font-weight: normal;
        line-height: 2.5rem;
        text-align: left;
        padding: 0 0.875rem;
        color: #666;
      }

      .goods_list {
        background: #fff;
        padding: 0.9375rem;

        .goods_box {
          display: flex;
          background: #fafafa;
          padding: 0.625rem;
          margin-bottom: 0.625rem;

          .goods_left {
            width: 15.6875rem;
            margin-right: 0.625rem;

            .header {
              display: flex;
              height: 2rem;
              line-height: 2rem;
              align-items: center;
              position: relative;

              .img {
                background: #f2f2f2;
                width: 2rem;
                height: 2rem;
                border-radius: 1.875rem;
                overflow: hidden;
                margin-right: 0.625rem;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .name {
                max-width: 6rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 15px;
              }

              .time {
                position: absolute;
                right: 0;
                color: #8c8c8c;
                font-size: 12px;
              }
            }

            .look_number {
              line-height: 1.5rem;
              text-align: left;
              font-size: 13px;
              margin-top: 0.375rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              span {
                color: #8c8c8c;
              }
            }
          }

          .goods_img {
            width: 4rem;
            height: 4rem;
            background: #f2f2f2;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
