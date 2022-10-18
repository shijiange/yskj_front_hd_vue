<template>
  <div id="card_ranking">
    <c-title :hide="false" :text="'名片排行'"></c-title>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div class="content">
        <van-tabs type="card" v-model="active" @click="chooseType">
          <van-tab title="访问排名">
            <div class="header_list">
              <div
                class="header_box"
                v-for="(item, index) in list"
                @click.stop="toCard(item)" :key='index'
              >
                <div class="order">{{ index + 1 }}、</div>
                <div class="header_name" v-if="item.card">
                  <div class="header">
                    <img :src="item.card.card_avatar" />
                  </div>
                  <ul class="text">
                    <li class="name">{{ item.card.card_name }}</li>
                    <li class="grade" v-if="item.card.yz_member">
                      {{ item.card.yz_member.level.level_name }}
                    </li>
                  </ul>
                </div>
                <div class="number">{{ item.visit }}</div>
              </div>
            </div>
          </van-tab>
          <van-tab title="收藏排名">
            <div class="header_list">
              <div
                class="header_box"
                v-for="(item, index) in list" :key='index'
                @click.stop="toCard(item)"
              >
                <div class="order">{{ index + 1 }}、</div>
                <div class="header_name" v-if="item.card">
                  <div class="header">
                    <img :src="item.card.card_avatar" />
                  </div>
                  <ul class="text">
                    <li class="name">{{ item.card.card_name }}</li>
                    <li class="grade" v-if="item.card.yz_member">
                      {{ item.card.yz_member.level.level_name }}
                    </li>
                  </ul>
                </div>
                <div class="number">{{ item.collection }}</div>
              </div>
            </div>
          </van-tab>
          <van-tab title="靠谱排行">
            <div class="header_list">
              <div
                class="header_box" 
                v-for="(item, index) in list" :key='index'
                @click.stop="toCard(item)"
              >
                <div class="order">{{ index + 1 }}、</div>
                <div class="header_name" v-if="item.card">
                  <div class="header">
                    <img :src="item.card.card_avatar" />
                  </div>
                  <ul class="text">
                    <li class="name">{{ item.card.card_name }}</li>
                    <li class="grade" v-if="item.card.yz_member">
                      {{ item.card.yz_member.level.level_name }}
                    </li>
                  </ul>
                </div>
                <div class="number">{{ item.reliable }}</div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import card_ranking_controller from "./card_ranking_controller";

export default card_ranking_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_ranking {
  .content {
    padding: 0.625rem 0;
    background: #fff;

    .header_list {
      padding: 0 0.875rem;
      margin-top: 0.625rem;

      .header_box {
        display: flex;
        align-items: center;
        position: relative;
        padding: 1rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        .order {
          font-size: 16px;
          width: 2rem;
        }

        .header_name {
          display: flex;

          .header {
            width: 3rem;
            height: 3rem;
            border-radius: 3rem;
            background: #f2f2f2;
            overflow: hidden;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .text {
            text-align: left;
            width: 11.25rem;

            .name {
              line-height: 1.5rem;
              width: 100%;
              font-size: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              .iconfont {
                font-size: 1.5rem;
                margin-right: 0.25rem;
              }

              button {
                border: solid 0.0625rem #50a6f9;
                font-size: 12px;
                color: #50a6f9;
                border-radius: 0.1875rem;
                padding: 0.0625rem 0.375rem;
              }
            }

            .grade {
              line-height: 1.5rem;
              color: #8c8c8c;
              font-size: 13px;
            }
          }
        }

        .number {
          font-size: 16px;
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>
