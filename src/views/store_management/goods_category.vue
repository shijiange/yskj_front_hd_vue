<template>
  <div class="goods-catgory">
    <c-title :hide="false" text="商品分类"></c-title>
    <div class="catgory-list" v-if="treeData.length > 0">
      <el-tree
        :data="treeData"
        :indent="0"
        :props="defaultProps"
        class="custom-tree"
        :expand-on-click-node="true"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
        <div :class="['custom-tree-node', nodeTitlCalss(node.level)]" slot-scope="{ node, data }">
          <span
            class="node-title"
          >{{node.label}}</span>
          <div class="node-opt-icons">
            <van-icon class="ellipsis" name="ellipsis" @click.stop="showOptionNode(node, data)"></van-icon>
            <van-icon class="arrow" v-if="!node.expanded" name="arrow"></van-icon>
            <van-icon class="arrow" v-else name="arrow-up"></van-icon>
          </div>
        </div>
      </el-tree>
      <div class="load-more" @click="loadMore" v-if="!finished">
        <span>点击加载更多</span>
        <van-icon name="arrow-down"></van-icon>
      </div>
      <div class="not-more" v-else>
        <span>没有更多了</span>
      </div>
    </div>
    <yz-blank :datas="treeData" text="空空如也"></yz-blank>
    <div class="bottom-btn">
      <div class="btn-add-category" @click="toAddCategory(0)">创建分类</div>
    </div>

    <van-action-sheet v-model="optNodePop" :actions="actions" @select="select"></van-action-sheet>
  </div>
</template>

<script>
import goodsCategory from "./goods_category_controller";
export default goodsCategory;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.goods-catgory {
  position: relative;
  height: 100vh;
  background-color: #f6f6f6;
  padding-bottom:  2.3rem;
  .catgory-list {
    overflow-y: auto;
    padding-bottom: 2rem;
  }
  .load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2rem 0;
    color: #f15353;
  }
  .not-more {
    margin: 3rem 0;
    color: #a0a0a0;
  }
  /deep/ .custom-tree {
    overflow-y: auto;
    .el-icon-caret-right {
      display: none;
    }
    .el-tree-node__content {
      height: auto;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      .node-title {
        flex: 1;
        text-align: left;
      }
      .node-opt-icons {
        width: 3rem;
        display: flex;
        justify-content: space-between;
        color: #a0a0a0;
        .van-icon-weapp-nav {
          margin-right: 1rem;
        }
        .ellipsis {
          font-size: 1.2rem;
        }
      }
    }
      .level-1 {
        .node-title {
          color: #1e1e1e;
          font-size: 15px;
        }
        .arrow  {
          font-size: 1rem;
        }
      }
      .level-2 {
        background-color: #fbfbfb;
        .node-title {
          color: #373737;
          font-size: 13px;
        }
        .arrow  {
          font-size: 0.825rem;
        }
      }
      .level-3 {
        position: relative;
        .node-title {
          color: #686868;
          font-size: 12px;
        }
        .arrow  {
          font-size: 0.625rem;
        }
      }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 350px;
    height: 2.3rem;
    background-color: #f6f6f6;
    text-align: center;
    .btn-add-category {
      width: 80%;
      margin: 0 auto;
      color: #ffffff;
      background-color: #f15353;
      border-radius: 1.156rem;
      padding: 0.5rem;
    }
  }

}
</style>