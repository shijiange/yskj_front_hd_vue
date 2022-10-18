<template>
  <div id="case-category-pc">
    <navigation></navigation>
    <div class="all">
      <div class="nav">
        <span class="home" @click="gotoHome">首页</span> >
        <span class="case">案例分类</span>
      </div>
      <div class="category">
        <div class="box">
          <div class="one">
            <div
              class="li"
              v-for="(item, index) in firstCategory"
              :key="index"
              :class="{ 'li-selected': item.id == pid }"
              @click="getSecond(item.id)"
            >
              <div class="text">{{ item.category_name }}</div>
              <div class="border"></div>
            </div>
          </div>
          <div class="two" v-if="secondCategory.length > 0">
            <div
              class="li"
              v-for="(item, index) in secondCategory"
              :key="index"
              :class="{ 'li-selected': item.id == cid }"
              @click="getSecondList(item.id)"
            >
              {{ item.category_name }}
            </div>
          </div>
        </div>
      </div>
      <div class="select">
        <div class="text1" :class="{'color':order_by=='new'}" @click="changeType('new')">按最新</div>
        <div class="text2">|</div>
        <div class="text1" :class="{'color':order_by=='hot'}" @click="changeType('hot')">按最热</div>
      </div>
      <div class="content">
        <caseTemplate :datas="list"></caseTemplate>
      </div>
      <div v-if="list.length <= 0">暂无更多~</div>
      <div class="page">
        <el-pagination
          v-if="list.length > 0"
          background
          @current-change="currentChange"
          :current-page="current_page"
          :page-size="per_page"
          layout="prev, pager, next, jumper"
          :total="total"
          style="text-align: center;"
        >
        </el-pagination>
      </div>
    </div>
    <bottomAdv></bottomAdv>
    <div class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </div>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import case_category_pc_controller from './case_category_pc_controller';

export default case_category_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-category-pc {
  background: #fff;
  min-height: 100vh;

  .all {
    width: 1200px;
    margin: 0 auto;
    text-align: left;

    .nav {
      margin: 30px 0;

      .home {
        font-size: 14px;
        color: #333;
      }

      .home:hover {
        color: $orange;
        cursor: pointer;
      }

      .case {
        color: $orange;
      }
    }

    .category {
      box-shadow: 1px 2px 10px #eee;

      .box {
        margin: 0 30px;

        .one {
          padding: 9px 0;
          display: flex;
          // width: 100%;
          flex-wrap: nowrap;
          overflow: auto;
          align-items: center;

          .li {
            min-width: 50px;
            margin-right: 48px;
            cursor: pointer;
            overflow: hidden;
            flex-direction: column;
            align-items: center;
            display: table;
            text-align: center;

            .text {
              font-size: 18px;
              line-height: 36px;
              color: #333;
              height: 42px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: center;
            }

            .border {
              width: 70%;
              text-align: center;
              height: 3px;
              background: transparent;
              margin: 0 auto;
            }
          }

          .li:hover {
            .text {
              color: $orange;
            }

            .border {
              background: $orange;
            }
          }

          .li-selected {
            .text {
              color: $orange;
            }

            .border {
              background: $orange;
            }
          }
        }

        .two {
          margin-top: 15px;
          height: 62px;
          line-height: 62px;
          display: flex;
          border-top: 1px solid #edeff6;
          box-sizing: border-box;
          overflow-x: auto;
          overflow-y: hidden;

          .li {
            cursor: pointer;
            margin-right: 48px;
            min-width: 30px;
            font-size: 14px;
            color: #333;
            display: table;
            white-space: nowrap;
          }

          .li:hover {
            color: $orange;
          }

          .li-selected {
            color: $orange;
          }
        }
      }
    }

    .select {
      display: flex;
      text-align: right;
      width: 100%;
      margin: 28px 0 41px 0;
      justify-content: flex-end;
      color: #666;
      font-size: 14px;

      .text1 {
        cursor: pointer;
      }

      .text1:hover {
        color: $orange;
      }

      .text2 {
        margin: 0 15px;
      }
    }

    .page {
      margin: 60px;
    }
  }

  .color {
    color: $orange;
  }
}
</style>
