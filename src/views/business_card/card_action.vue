<template>
  <div id="card_action">
    <c-title :hide="false" :text="'数据统计'"></c-title>
    <div class="content">
      <div class="nav">
        <van-tabs type="card" v-model="active" @change="chooseTab">
          <van-tab title="名片访问">
            <div class="card_a">
              <div class="card_a_box">
                <div class="title">
                  <div class="block"></div>
                  <span>访客统计</span>
                </div>
                <ul class="info" v-if="visit.statistics">
                  <li>
                    <span>{{ visit.statistics.visitor_num }}</span
                    ><br />
                    <span>累计访问人数</span>
                  </li>
                  <li>
                    <span>{{ visit.statistics.visit_num }}</span
                    ><br />
                    <span>累计访问次数</span>
                  </li>
                  <li>
                    <span>{{ visit.statistics.fans }}</span
                    ><br />
                    <span>累计新增会员</span>
                  </li>
                </ul>
                <!-- 折线图 -->
                <div class="chart1">
                  <div
                    class="img"
                    style="width: 100%; height: 350px;"
                    v-if="visit.diagram.date"
                  >
                    <ECharts
                      :id="'echarts1'"
                      :text="''"
                      :XData="visit.diagram.date"
                      :YData="visit.diagram.num"
                      :right="'6%'"
                      style="height: 350px; width: 22rem;"
                    />
                  </div>
                </div>
              </div>
              <div class="look_box">
                <div class="title">
                  <div class="block"></div>
                  <span>谁看过我</span>
                </div>
                <div class="other_list">
                  <div class="header_box" v-for="(item,i) in visitList" :key='i' @click="toCard(item,'visit')">
                    <div class="header">
                      <img
                        v-if="item.visitor_card"
                        :src="item.visitor_card.card_avatar"
                      />
                      <img
                        v-if="!item.visitor_card  && item.visitor_member"
                        :src="item.visitor_member.avatar_image"
                      />
                    </div>
                    <ul class="text">
                      <li class="name">
                        <span v-if="item.visitor_card">{{
                          item.visitor_card.card_name
                        }}</span>
                        <span v-if="!item.visitor_card  && item.visitor_member">{{
                          item.visitor_member.nickname
                        }}</span>
                        <i
                          v-if="item.is_child"
                          class="iconfont icon-card_relation"
                          style="color: #f66747;"
                        ></i>
                        <i
                          v-if="item.is_new"
                          class="iconfont icon-card_new"
                          style="color: #f6c347;"
                        ></i>
                        <button v-if="item.mutual_save" type="button">
                          互存名片
                        </button>
                      </li>
                      <li
                        v-if="item.visitor_member && item.visitor_member.yz_member.level"
                        class="grade"
                      >
                        {{ item.visitor_member.yz_member.level.level_name }}
                      </li>
                    </ul>
                    <div class="icon_right" v-if="item.visitor_card && (item.visitor_card.card_wechat || item.visitor_card.card_mobile)">
                      <i
                        @click="showMore(item.id)"
                        class="iconfont icon-more"
                      ></i>
                    </div>
                    <div
                      class="more_box"
                      v-if="item.visitor_card && item.id === showID"
                    >
                      <ul class="list">
                        <li
                          @click="showWeChat(item, '微信')"
                          v-if="item.visitor_card.card_wechat"
                        >
                          <i class="iconfont icon-card_weixin1"></i>
                          <span>微信</span>
                        </li>
                        <li
                          @click.stop="showWeChat(item, '电话')"
                          v-if="item.visitor_card.card_mobile"
                        >
                          <i class="iconfont icon-card_phone"></i>
                          <span>电话</span>
                        </li>
                      </ul>
                      <i
                        @click="showMore(item.id)"
                        class="iconfont icon-up"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="名片动作">
            <div class="card_b">
              <div class="card_a_box" v-if="share.diagram">
                <div class="title">
                  <div class="block"></div>
                  <span>分享次数：{{ share.statistics }}次</span>
                </div>
                <!-- 折线图 -->
                <div class="chart1" v-if="share.diagram.date">
                  <div class="img" style="width: 100%; height: 350px;">
                    <ECharts
                      :id="'echarts2'"
                      :text="''"
                      :XData="share.diagram.date"
                      :YData="share.diagram.num"
                      :right="'6%'"
                      style="height: 350px; width: 22rem;"
                    />
                  </div>
                </div>
              </div>
              <div class="card_a_box" v-if="save.diagram">
                <div class="title">
                  <div class="block"></div>
                  <span>保存次数：{{ save.statistics }}次</span>
                </div>
                <!-- 折线图 -->
                <div class="chart1">
                  <div class="img" style="width: 100%; height: 350px;">
                    <ECharts
                      :id="'echarts3'"
                      :text="''"
                      :XData="save.diagram.date"
                      :YData="save.diagram.num"
                      :right="'6%'"
                      style="height: 350px; width: 22rem;"
                    />
                  </div>
                </div>
              </div>
              <div class="card_a_box" v-if="reliable.diagram">
                <div class="title">
                  <div class="block"></div>
                  <span>靠谱次数：{{ reliable.statistics }}次</span>
                </div>
                <!-- 折线图 -->
                <div class="chart1">
                  <div
                    class="img"
                    style="width: 100%; height: 350px;"
                    v-if="reliable.diagram.date"
                  >
                    <ECharts
                      :id="'echarts4'"
                      :text="''"
                      :XData="reliable.diagram.date"
                      :YData="reliable.diagram.num"
                      :right="'6%'"
                      style="height: 350px; width: 22rem;"
                    />
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="收藏我的">
            <div class="card_c">
              <div class="card_a_box">
                <div class="title">
                  <div class="block"></div>
                  <span>收藏我的名片次数:{{ collect.statistics }}次</span>
                </div>
                <!-- 折线图 -->
                <div class="chart1">
                  <div
                    class="img"
                    style="width: 100%; height: 350px;"
                    v-if="collect.diagram.date"
                  >
                    <ECharts
                      :id="'echarts5'"
                      :text="''"
                      :XData="collect.diagram.date"
                      :YData="collect.diagram.num"
                      :right="'6%'"
                      style="height: 350px; width: 22rem;"
                    />
                  </div>
                </div>
              </div>
              <div class="look_box">
                <div class="title">
                  <div class="block"></div>
                  <span>收藏我的名片会员</span>
                </div>
                <div class="other_list">
                  <div class="header_box" v-for="(item,i) in collectList" :key='i' @click="toCard(item,'collect')">
                    <div class="header">
                      <img
                        v-if="item.collect_card"
                        :src="item.collect_card.card_avatar"
                      />
                      <img
                        v-if="!item.collect_card && item.collect_member"
                        :src="item.collect_member.avatar_image"
                      />
                    </div>
                    <ul class="text">
                      <li class="name">
                        <span v-if="item.collect_card">{{
                          item.collect_card.card_name
                        }}</span>
                        <span v-if="!item.collect_card && item.collect_member">{{
                          item.collect_member.nickname
                        }}</span>
                        <i
                          v-if="item.is_child"
                          class="iconfont icon-card_relation"
                          style="color: #f66747;"
                        ></i>
                        <i
                          v-if="item.is_new"
                          class="iconfont icon-card_new"
                          style="color: #f6c347;"
                        ></i>
                        <button v-if="item.mutual_save" type="button">
                          互存名片
                        </button>
                      </li>
                      <li
                        v-if="item.collect_member && item.collect_member.yz_member.level"
                        class="grade"
                      >
                        {{ item.collect_member.yz_member.level.level_name }}
                      </li>
                    </ul>
                    <div class="icon_right" v-if="item.collect_card && (item.collect_card.card_wechat || item.collect_card.card_mobile)">
                      <i
                        @click="showMore(item.id)"
                        class="iconfont icon-more"
                      ></i>
                    </div>
                    <div
                      class="more_box"
                      v-if="item.collect_card && item.id === showID"
                    >
                      <ul class="list">
                        <li
                          @click="showWeChat(item, '微信', 'collect')"
                          v-if="item.collect_card.card_wechat"
                        >
                          <i class="iconfont icon-card_weixin1"></i>
                          <span>微信</span>
                        </li>
                        <li
                          @click="showWeChat(item, '电话', 'collect')"
                          v-if="item.collect_card.card_mobile"
                        >
                          <i class="iconfont icon-card_phone"></i>
                          <span>电话</span>
                        </li>
                      </ul>
                      <i
                        @click="showMore(item.id)"
                        class="iconfont icon-up"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>

    <van-popup v-model="show" style="width: 80%; height: 5rem;">
      <div class="popup">
        <i v-show="showTitle === '微信'" class="iconfont icon-card_weixin1"></i>
        <i v-show="showTitle === '电话'" class="iconfont icon-card_phone"></i>
        {{ showTitle }}：{{ showContent }}
      </div>
    </van-popup>
  </div>
</template>

<script>
import card_action_controller from "./card_action_controller";

export default card_action_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_action {
  .popup {
    line-height: 4.9rem;
    text-align: center;
    border-radius: 10px;
    font-size: 18px;

    .iconfont {
      font-size: 30px;
      vertical-align: middle;
    }
  }

  .content {
    .nav {
      padding: 0.625rem 0;

      .card_a,
      .card_b,
      .card_c {
        margin-top: 0.625rem;

        .card_a_box {
          padding: 0.625rem 0.875rem;
          background: #fff;

          .title {
            height: 2.5rem;
            line-height: 2.5rem;
            display: flex;
            align-items: center;

            .block {
              width: 0.25rem;
              height: 1rem;
              background: #50a6f9;
              border-radius: 0.0625rem;
              margin-right: 0.375rem;
            }

            span {
              font-weight: bold;
              font-size: 16px;
            }
          }

          .info {
            background: #fafafa;
            border-radius: 0.375rem;
            padding: 0.625rem 0;
            display: flex;
            justify-content: space-around;

            li {
              line-height: 1.625rem;

              span:first-child {
                font-size: 16px;
              }

              span:last-child {
                color: #8c8c8c;
                font-size: 12px;
              }
            }
          }

          .chart1 {
            margin-top: 0.625rem;

            .img {
              margin: 0 auto;
              background: #fff;
            }

            span {
              font-size: 14px;
              line-height: 1.875rem;
              display: block;
            }
          }
        }

        .look_box {
          background: #fff;
          margin-top: 0.625rem;
          padding: 0.625rem 0.875rem;

          /* overflow: -webkit-paged-y; */
          .title {
            height: 2.5rem;
            line-height: 2.5rem;
            display: flex;
            align-items: center;

            .block {
              width: 0.25rem;
              height: 1rem;
              background: #50a6f9;
              border-radius: 0.0625rem;
              margin-right: 0.375rem;
            }

            span {
              font-weight: bold;
              font-size: 16px;
            }
          }

          .other_list {
            .header_box {
              display: flex;
              align-items: center;
              padding: 1rem 0;
              border-bottom: solid 0.0625rem #ebebeb;
              position: relative;

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

                .name {
                  display: flex;
                  align-items: center;
                  line-height: 1.5rem;

                  span {
                    font-size: 15px;
                    margin-right: 0.25rem;
                    max-width: 7.25rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

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

              .icon_right {
                position: absolute;
                right: 0;

                .iconfont {
                  display: block;
                  width: 2.5rem;
                  height: 2.5rem;
                  line-height: 2.5rem;
                  font-size: 18px;
                  color: #999;
                }
              }

              .more_box {
                position: absolute;
                right: 0;
                top: 3.125rem;
                background: rgba(51, 51, 51, 0.8);
                border-radius: 0.25rem;
                z-index: 10;

                .list {
                  display: flex;

                  li {
                    padding: 0.125rem 0.625rem;

                    span {
                      display: block;
                      font-size: 12px;
                      color: #fff;
                    }

                    .iconfont {
                      font-size: 1.25rem;
                      color: #fff;
                    }
                  }
                }

                .icon-up {
                  color: rgba(51, 51, 51, 0.8);
                  font-size: 1.25rem;
                  position: absolute;
                  top: -0.875rem;
                  right: 0.625rem;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
