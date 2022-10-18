<template>
  <div id="myrelationship-detail">
    <c-title :hide="false" :text="title_name"></c-title>
    <div class="tab">
      <div class="tabul">
        <div class="tabli" v-for="(item, index) in levelList" :key="index" @click="chooseLevel(item.id, index)" :class="{ 'tabli-ed': level_index == index }">
          <div class="btn">
            <div class="name">{{ item.level_name }}</div>
            <div class="num">{{ item.yz_member_count }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ul">
      <div v-for="(item, index) in projectList" :key="index">
        <div class="list" v-if="!fun.isTextEmpty(item.member)" @click="gotoDetail(item.member.uid)">
          <div class="img">
            <img :src="item.member.avatar_image" alt="" />
          </div>
          <div class="content">
            <div class="info">
              <div class="nickname">{{ item.member.nickname }}</div>
              <div class="level">
                <span v-if="!fun.isTextEmpty(item.level)">{{ item.level.level_name }}</span>
                <span v-else>{{ default_level_name }}</span>
              </div>
            </div>
            <div class="mobile" v-if="!fun.isTextEmpty(item.member) && !fun.isTextEmpty(item.member.mobile)">
              <span>手机号：</span>
              <span>{{ item.member.mobile }}</span>
            </div>
            <div class="mobile">
              <span>注册时间：</span>
              <span>{{ item.created_at }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="allLoad && projectList.length > 0" style="text-align: center;">没有更多了~</div>

    <div class="blank" v-if="projectList.length <= 0" style="text-align: center;">
      <img src="../../../assets/images/blank.png" />
      <span>暂无数据</span>
    </div>
  </div>
</template>
<script>
import my_relationship_amount_controller from "./my_relationship_amount_controller";

export default my_relationship_amount_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#myrelationship-detail {
  text-align: left;

  .tab {
    margin: 0.9375rem 0;

    .tabul {
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      width: 100%;

      .tabli {
        white-space: nowrap;
        text-align: center;
        margin-left: 0.9375rem;
        border-radius: 0.25rem;
        background: #e7e7e7;
        color: #959595;
        padding: 0.25rem 0.5rem;

        .btn {
          .text {
            font-size: 0.8125rem;
          }

          .num {
            font-size: 0.75rem;
          }
        }
      }

      .tabli-ed {
        background: #fe5e56;
        color: #fff;
      }
    }
  }

  .ul {
    padding: 0 0.9375rem;

    .list {
      margin-bottom: 0.625rem;
      background: #fff;
      border-radius: 0.625rem;
      padding: 0.875rem;
      width: 100%;
      display: flex;

      .img {
        width: 2.1875rem;
        height: 2.1875rem;
        border-radius: 50%;
        min-width: 2.1875rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .content {
        margin-left: 0.625rem;
        overflow: hidden;

        .info {
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-bottom: 0.675rem;

          .nickname {
            color: #202020;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.9375rem;
            font-weight: 600;
          }

          .level {
            flex: 1;
            margin-left: 0.8125rem;
            white-space: nowrap;

            span {
              padding: 0.15rem;
              background: #feebea;
              color: #fe5e56;
              font-size: 0.75rem;
              border-radius: 2px;
            }
          }
        }

        .mobile {
          color: #666;
          font-weight: 500;
          font-size: 0.75rem;
          line-height: 1rem;
          padding-top: 0.25rem;
        }
      }
    }
  }
}
</style>
