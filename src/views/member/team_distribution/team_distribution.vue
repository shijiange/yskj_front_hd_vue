<template>
  <div>
    <c-title :hide="false" :text="'团队分销商统计'">
    </c-title>

    <div>
      <div class="bg"><img src="../../../assets/images/team_bg.png" alt=""></div>

      <div class="header" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="part-top">
          <div class="left">
            <img :src="member.avatar_image" alt="">
          </div>
          <div class="right">
            <div class="member-top">
              <div class="name">{{member.nickname}}</div>
              <!--<div class="member-id">{{member.uid}}</div>-->
            </div>
            <div class="member-bottom" v-if="member.has_one_agent && member.has_one_agent.agent_level">{{member.has_one_agent.agent_level.name}}</div>
          </div>
        </div>
        <div class="part-bottom">
          <div>分销商人数</div>
          <div>{{total}}人</div>
        </div>
      </div>

      <div class="content">
        <div class="search">
          <div class="search-box">
            <form @submit.prevent action="#">
              <input
                type="search"
                ref="search_input"
                placeholder="搜索会员ID/昵称"
                @keypress="enterSearch"
                v-model.trim="inputs"
              />
            </form>
            <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="getData"></i>
          </div>
        </div>

        <div class="data-box">
          <div v-if="recordsList.length <= 0">
            <img
              src="../../../assets/images/blank.png"
              alt=""
              style="width: 5rem; margin: 2rem 0;"
            />
          </div>
          <div class="data-item" v-for="(item,index) in recordsList" :key="index">
            <div class="data-top">
              <div class="left">
                <img :src="item.member.avatar_image" alt="">
              </div>
              <div class="right">
                <div class="member-top">
                  <div class="name" v-if="item.member">{{item.member.nickname}}</div>
                  <!--<div class="member-id">{{item.member_id}}</div>-->
                </div>
                <div class="member-bottom">
                  <div class="title">{{item.agent_level ? item.agent_level.name: '默认等级'}}</div>
                  <div class="time">{{item.created_at}}</div>
                </div>
              </div>
            </div>

            <div class="data-bottom">
              <div class="num">订单数量： <span class="red">{{item.order[0] ? item.order[0].count : 0}}</span>个</div>
              <div class="num">订单金额： <span class="red">{{item.order[0]? item.order[0].sumPrice : 0}}</span>元</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import team_distribution_controller from "./team_distribution_controller";

export default team_distribution_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bg {
    width: 100%;
    height: 5rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .header {
    position: absolute;
    top: 5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0.16rem 0.31rem 0 rgba(0, 0, 0, 0.1);
    border-radius: 0.63rem;
    background: #fff;
    padding: 0.8rem;

    .part-top {
      display: flex;

      .left {
        flex: 0 0 3.15rem;

        img {
          width: 3.15rem;
          height: 3.15rem;
          border-radius: 50%;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.3rem;
      }

      .member-top {
        display: flex;

        .name {
          font-weight: bold;
          margin-right: 0.5rem;
          max-width: 10rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-id {
          color: white;
          padding: 0.2rem 0.6rem;
          background-image:
            linear-gradient(
              90deg,
              #fccc9b 0%,
              #ae7741 100%
            ),
            linear-gradient(
              #32374a,
              #32374a
            );
          background-blend-mode:
            normal,
            normal;
          border-radius: 0.8rem;
        }
      }

      .member-bottom {
        text-align: left;
        color: #999;
      }
    }

    .part-bottom {
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
    }
  }

  .pcStyle {
    width: 340px;
  }

  .content {
    width: 90%;
    margin: 5.5rem auto 1rem auto;
    box-shadow: 0 0.16rem 0.31rem 0 rgba(0, 0, 0, 0.1);
    border-radius: 0.63rem;
    background: #fff;
  }

  .data-box {
    padding: 0.5rem;
  }

  .data-item {
    padding: 1rem 0;
    border-bottom: 0.0625rem solid #f5f5f5;

    .data-top {
      display: flex;

      .left {
        flex: 0 0 3.15rem;

        img {
          width: 3.15rem;
          height: 3.15rem;
          border-radius: 50%;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.3rem;
      }

      .member-top {
        display: flex;

        .name {
          font-weight: bold;
          margin-right: 0.5rem;
          max-width: 10rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .member-id {
          color: white;
          padding: 0.2rem 0.6rem;
          background-image:
            linear-gradient(
              90deg,
              #fccc9b 0%,
              #ae7741 100%
            ),
            linear-gradient(
              #32374a,
              #32374a
            );
          background-blend-mode:
            normal,
            normal;
          border-radius: 0.8rem;
        }
      }

      .member-bottom {
        text-align: left;
        display: flex;
        line-height: 1;
        font-size: 12px;

        .title {
          color: #333;
          margin-right: 0.5rem;
        }

        .time {
          color: #999;
          width: 10rem;
        }
      }
    }

    .data-bottom {
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;

      .num {
        flex: 1;
      }

      .red {
        color: #f14e4e;
      }
    }
  }

  .search {
    border-radius: 0.63rem;
    height: 2.8125rem;
    line-height: 2.8125rem;
    position: relative;
    display: flex;
    overflow: hidden;
    background: #fff;
    border-bottom: 0.0625rem solid #f5f5f5;
    justify-content: center;

    .search-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 85%;
      margin-top: 0.5rem;
      padding: 0 0.625rem;
      background-color: #f2f2f2;
      height: 1.75rem;
      line-height: 1.75rem;
      border-radius: 0.875rem;

      input {
        flex: 1;
        line-height: 1.75rem;
        border: none;
        color: #333;
      }

      i {
        position: absolute;
        right: 1rem;
        flex: 0 0 1.5rem;
      }
    }
  }
</style>
