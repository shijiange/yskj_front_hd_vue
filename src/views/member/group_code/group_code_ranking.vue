<template>
    <div class="page">
       <c-title text="排行榜"></c-title>

        <div class="ranking">

          <div class="ranking_content" :class="[rankingList.length==2 ? 'ranking_content_length_2' : '']">

              <div class="ranking_item two" @click="gotoGroupCodeLabel(rankingList[1])" v-if="rankingList[1]">
                  <div class="ranking_wrapper">
                      <div class="gold_medal">
                          <i class="iconfont icon-qhm_listbg"></i>
                          <span class="num">2</span>
                      </div>
                      <div>
                          <img v-if="rankingList[1].member_id!=0" class="ranking_face" :src="rankingList[1].has_one_member.avatar_image" />
                          <img v-else :src="shop_log" class="ranking_face" alt="">
                      </div>
                      <span>{{rankingList[1].code_name}}</span>
                  </div>
                  <i class="iconfont icon-jiahao ranking_item_addCode"></i>
              </div>

              <div class="ranking_item" :class="[rankingList.length==3 ? 'one' : 'two']" @click="gotoGroupCodeLabel(rankingList[0])" v-if="rankingList[0]">
                  <div class="ranking_wrapper">
                      <div class="gold_medal">
                          <i class="iconfont icon-qhm_listbg"></i>
                          <span class="num">1</span>
                      </div>
                      <div>
                          <img v-if="rankingList[0].member_id!=0" class="ranking_face" :src="rankingList[0].has_one_member.avatar_image" />
                          <img v-else :src="shop_log" class="ranking_face" alt="">
                      </div>
                      <span>{{rankingList[0].code_name}}</span>
                  </div>
                  <i class="iconfont icon-jiahao ranking_item_addCode"></i>
              </div>

              <div class="ranking_item two" @click="gotoGroupCodeLabel(rankingList[2])"  v-if="rankingList[2]">
                  <div class="ranking_wrapper">
                      <div class="gold_medal">
                          <i class="iconfont icon-qhm_listbg"></i>
                          <span class="num">3</span>
                      </div>
                      <div>
                          <img v-if="rankingList[2].member_id!=0" class="ranking_face" :src="rankingList[2].has_one_member.avatar_image" />
                          <img v-else :src="shop_log" class="ranking_face" alt="">
                      </div>
                      <span>{{rankingList[2].code_name}}</span>
                  </div>
                  <i class="iconfont icon-jiahao ranking_item_addCode"></i>
              </div>

          </div>

        </div>


        <div class="recommend">
                 <c-list-item :listData="listData" :shop_log="shop_log"></c-list-item>
        </div>

          <c-add></c-add>

    </div>
</template>

<script>
import groupCodeRankingController from './group_code_ranking_controller';

export default groupCodeRankingController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: #fff; min-height: 100vh; padding-bottom: 3.0625rem; }

  .ranking {
    margin-top: 1.219rem;

    .ranking_content {
      display: flex;
      justify-content: space-between;
      width: 21.563rem;
      margin-top: 1.25rem;
      height: 8.938rem;
      padding-left: 0.769rem;
      padding-right: 0.863rem;

      &.ranking_content_length_2 {
        flex-direction: row-reverse;
      }

      .ranking_item {
        position: relative;
        margin: 0 0.2rem;

        &.one {
          transform: scale(1.1);
          z-index: 2;
        }

        &.two {
          transform: scale(0.9);
        }

        .ranking_wrapper {
          position: relative;
          width: 6.875rem;
          height: 7.969rem;
          background: #fff;
          box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.05);
          border-radius: 0.469rem;

          .gold_medal {
            position: absolute;
            top: -0.05rem;
            left: 0.531rem;

            .icon-qhm_listbg {
              color: #ffa800;
              width: 0.906rem;
              height: 1.313rem;
            }

            .num {
              position: absolute;
              top: -0.45rem;
              left: 0.261rem;
              color: #fff;
              font-size: 0.75rem;
            }
          }

          .ranking_face {
            margin-top: 1.238rem;
            width: 3.75rem;
            height: 3.75rem;
            border-radius: 50%;
          }

          span {
            margin-top: 0.375rem;
            font-size: 0.875rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0.044rem;
            color: #333;
          }
        }

        .ranking_item_addCode {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #00b075;
        }
      }
    }
  }

  .recommend {
    margin-top: 1.313rem;
  }
</style>
