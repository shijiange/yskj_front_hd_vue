<template>
  <div>
    <c-title :hide="false" :text="memberInfo.plugin_name" :url="'member'"> </c-title>

    <div class="search" v-if="uids.length > 0">
      <div style="width: 6rem; height: 2.5rem;">
        <div class="back">
          <div class="up">
            <i @click="upToTop" class="iconfont icon-top_place"></i>
            <span>最上级</span>
          </div>
          <div class="up">
            <i @click="goback" class="iconfont icon-left_place"></i>
            <span>上一级</span>
          </div>
        </div>
      </div>
      <div class="searchBox">
        <form @submit.prevent action="#">
          <input
            type="search"
            @keypress="enterSearch"
            placeholder="搜索ID"
            v-model="inputs"
          />
        </form>
      </div>
      <div class="search_icon">
        <i class="iconfont icon-sousuo1"></i>
      </div>
      <div class="search_bth" @click="gotoSearch">
        <span>搜索</span>
      </div>
    </div>

    <div class="search" v-if="uids.length === 0">
      <div class="searchBox">
        <form @submit.prevent action="#">
          <input
            style="width: 19rem; margin-left: 1rem;"
            type="search"
            @keypress="enterSearch"
            placeholder="搜索ID"
            v-model="inputs"
          />
        </form>
      </div>
      <div class="search_icon2">
        <i class="iconfont icon-sousuo1"></i>
      </div>
      <div class="search_bth" @click="gotoSearch">
        <span>搜索</span>
      </div>
    </div>

    <div class="content">
      <div
        class="top"
        v-if="memberInfo.first"
        @click="toNext(memberInfo.first.uid)"
      >
        <p class="title">
          {{ memberInfo.first.nickname }}（ID{{ memberInfo.first.uid }}）
        </p>
        <p class="title">{{ memberInfo.first.agentLevel }}</p>
        <p class="flex-box">
          <span>分销订单数</span><span>{{ memberInfo.first.allorder }}</span>
        </p>
        <p class="flex-box">
          <span>分销订单业绩</span
          ><span>{{ memberInfo.first.allprice }}元</span>
        </p>
        <p class="flex-box">
          <span>团队人数</span><span>{{ memberInfo.first.agentNum }}人</span>
        </p>
        <p class="flex-box">
          <span>团队分销订单业绩</span
          ><span>{{ memberInfo.first.teamOrderPrice }}元</span>
        </p>
      </div>
      <div class="middle">
        <div
          class="second"
          v-if="memberInfo.oneLevelOne"
          @click="toNext(memberInfo.oneLevelOne.uid)"
        >
          <p class="title">
            {{ memberInfo.oneLevelOne.nickname }}
            （ID{{ memberInfo.oneLevelOne.uid }}）
          </p>
          <p class="title">{{ memberInfo.oneLevelOne.agentLevel }}</p>
          <p class="flex-box">
            <span>分销订单数</span
            ><span>{{ memberInfo.oneLevelOne.allorder }}</span>
          </p>
          <p class="flex-box">
            <span>分销订单额</span
            ><span>{{ memberInfo.oneLevelOne.allprice }}元</span>
          </p>
          <p class="flex-box">
            <span>团队人数</span
            ><span>{{ memberInfo.oneLevelOne.agentNum }}人</span>
          </p>
          <p class="flex-box">
            <span>团队分销订单额</span
            ><span>{{ memberInfo.oneLevelOne.teamOrderPrice }}元</span>
          </p>
        </div>
        <div
          class="second"
          v-if="memberInfo.oneLevelTwo"
          @click="toNext(memberInfo.oneLevelTwo.uid)"
        >
          <p class="title">
            {{ memberInfo.oneLevelTwo.nickname }}
            （ID{{ memberInfo.oneLevelTwo.uid }}）
          </p>
          <p class="title">{{ memberInfo.oneLevelTwo.agentLevel }}</p>
          <p class="flex-box">
            <span>分销订单数</span
            ><span>{{ memberInfo.oneLevelTwo.allorder }}</span>
          </p>
          <p class="flex-box">
            <span>分销订单额</span
            ><span>{{ memberInfo.oneLevelTwo.allprice }}元</span>
          </p>
          <p class="flex-box">
            <span>团队人数</span
            ><span>{{ memberInfo.oneLevelTwo.agentNum }}人</span>
          </p>
          <p class="flex-box">
            <span>团队分销订单额</span
            ><span>{{ memberInfo.oneLevelTwo.teamOrderPrice }}元</span>
          </p>
        </div>
      </div>
      <div class="down">
        <div
          class="four"
          v-if="memberInfo.twoLevelOne"
          @click="toNext(memberInfo.twoLevelOne.uid)"
        >
          <p>{{ memberInfo.twoLevelOne.nickname }}</p>
          <p>ID{{ memberInfo.twoLevelOne.uid }}</p>
          <p>{{ memberInfo.twoLevelOne.agentLevel }}</p>
          <p class="gray">团队人数</p>
          <p>{{ memberInfo.twoLevelOne.agentNum }}人</p>
        </div>
        <div
          class="four"
          v-if="memberInfo.twoLevelTwo"
          @click="toNext(memberInfo.twoLevelTwo.uid)"
        >
          <p>{{ memberInfo.twoLevelTwo.nickname }}</p>
          <p>ID{{ memberInfo.twoLevelTwo.uid }}</p>
          <p>{{ memberInfo.twoLevelTwo.agentLevel }}</p>
          <p class="gray">团队人数</p>
          <p>{{ memberInfo.twoLevelTwo.agentNum }}人</p>
        </div>
        <div
          class="four"
          v-if="memberInfo.twoLevelThree"
          @click="toNext(memberInfo.twoLevelThree.uid)"
        >
          <p>{{ memberInfo.twoLevelThree.nickname }}</p>
          <p>ID{{ memberInfo.twoLevelThree.uid }}</p>
          <p>{{ memberInfo.twoLevelThree.agentLevel }}</p>
          <p class="gray">团队人数</p>
          <p>{{ memberInfo.twoLevelThree.agentNum }}人</p>
        </div>
        <div
          class="four"
          v-if="memberInfo.twoLevelFour"
          @click="toNext(memberInfo.twoLevelFour.uid)"
        >
          <p>{{ memberInfo.twoLevelFour.nickname }}</p>
          <p>ID{{ memberInfo.twoLevelFour.uid }}</p>
          <p>{{ memberInfo.twoLevelFour.agentLevel }}</p>
          <p class="gray">团队人数</p>
          <p>{{ memberInfo.twoLevelFour.agentNum }}人</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import distribution_orders_controller from "./distribution_orders_controller";

export default distribution_orders_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search {
  .back {
    width: 6rem;
    display: flex;
    color: #666;

    i {
      display: inline-block;
      line-height: 1.7rem;
      font-size: 1.4rem;
    }
  }

  .up {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;

    span {
      font-size: 10px;
    }
  }

  overflow: hidden;
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;
  display: flex;
  width: 100%;

  .mint-button.mint-button--default {
    border: none;
    padding-top: 0.4rem;
    box-shadow: none;
  }

  .el-input.el-input-group.el-input-group--append {
    float: left;
    width: 80%;
    margin-left: 2%;
    height: 2.8125rem;
  }

  .el-input-group__append .el-button.el-button--default {
    background: #f2f2f2;
    padding-top: 9px;
    height: 1.875rem;
    font-size: 16px;
    padding-right: 1.8125rem;
    border-radius: 0 0.9375rem 0.9375rem 0;
  }

  .el-input.el-input-group.el-input-group--append .el-input-group__append {
    background: #f2f2f2;
  }

  .el-col-1 {
    margin: 0.75rem 0;
    color: #666;
    font-size: 16px;
  }

  .searchBox {
    position: relative;
    font-size: 14px;
    display: inline-table;

    /* width: 75%; */
    height: 2.8125rem;

    input {
      vertical-align: middle;
      border: none;
      background: #f2f2f2 none;
      box-sizing: border-box;
      outline: 0;
      padding: 0.1875rem 0.625rem 0.1875rem 2rem;
      height: 1.875rem;
      line-height: 1.875rem;
      margin-top: 0.5rem;
      color: #8c8c8c;
      font-size: 14px;
      width: 14rem;
      border-radius: 0.9375rem;
      z-index: 10;
    }
  }

  .search_bth {
    margin-right: 0.625rem;
    width: 2.8125rem;
    height: 2.8125rem;
    line-height: 2.8125rem;

    span {
      font-size: 16px;
      color: #333;
    }
  }

  .search_icon {
    position: absolute;
    left: 6rem;
    width: 2rem;
    height: 2.8125rem;

    i {
      line-height: 2.8125rem;
      color: #999;
      font-size: 1rem;
    }
  }

  .search_icon2 {
    position: absolute;
    left: 1rem;
    width: 2rem;
    height: 2.8125rem;

    i {
      line-height: 2.8125rem;
      color: #999;
      font-size: 1rem;
    }
  }
}

.content {
  width: 95%;
  margin: 1rem auto;
}

.top {
  height: 12rem;
  background-color: #fff;
  border-radius: 4px;
  border: solid 2px #eeb49a;
  padding: 1rem 0;
}

.middle,
.down {
  display: flex;
  margin-top: 0.5rem;
}

.second {
  flex: 1;
  width: 50%;
  min-height: 11rem;
  background-color: #fff;
  border-radius: 4px;
  border: solid 2px #90c5ed;
  padding: 1rem 0;
}

.second:last-child {
  margin-left: 0.5rem;
}

.second:first-child {
  margin-left: 0;
}

.four {
  flex: 1;
  min-height: 8rem;
  background-color: #fff;
  border-radius: 3px;
  border: solid 2px #a596d3;
  margin-right: 0.3rem;
  font-size: 12px;
  padding: 1rem 0;
}

.four:last-child {
  margin-right: 0;
}

.four:first-child {
  margin-left: 0;
}

.flex-box {
  display: flex;
  padding: 0.3rem 0.5rem;

  span {
    flex: 1;
  }

  span:first-child {
    flex: 2;
    color: #8c8c8c;
    text-align: left;
  }

  span:last-child {
    text-align: right;
  }
}

.title {
  line-height: 1.5rem;
}

.gray {
  margin-top: 0.5rem;
  color: #8c8c8c;
}
</style>
