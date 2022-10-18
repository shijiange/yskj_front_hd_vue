<template>
  <div id="case-category-pc">
    <navigation></navigation>
    <div class="all">
      <div class="nav">
        <span class="home" @click="gotoHome">首页</span> >
        <span class="case" v-if="type_name == 'caseLibraryMypublish'">我的发布</span>
        <span class="case" v-else>{{label.label_name}}</span>
      </div>

      <div class="content" v-if="total>0">
        <caseTemplate :datas="list"></caseTemplate>
      </div>
      <div v-else>暂无更多~</div>
      <div class="page" v-if="total>0">
        <el-pagination
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
      <caseBottom></caseBottom>
    </div>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import case_label_pc_controller from './case_label_pc_controller';

export default case_label_pc_controller;
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
