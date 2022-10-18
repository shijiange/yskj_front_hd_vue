<template>
  <div class="list">
    <template v-for="item in list">
      <div class="item" :key="item.id" @click="linkto(item.id)">
        <div style="display: flex;">
          <div class="icon">
            <i class="iconfont icon-fontclass-jilu31" style="color: #3a75f4;"></i>
          </div>
          <div style="flex: 1;">
            <div class="tit" v-html="item.article_name || '文章'"></div>
            <div class="info">
              <div class="creater">
                <div class="author">{{item.creater_name}}</div>
                <div class="by">发布于</div>
                <div class="contract_name">{{item.base_name}}</div>
              </div>
              <div class="time">{{item.created_at}}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["list",],
  methods: {
    linkto(id) {
      this.$router.push(this.fun.getUrl("knowledgeDetail", { articleId: id }));
    },
  }

};
</script>

<style lang="scss" scoped>
  .list {
    background-color: #fff;
    border-radius: 10px;
    margin: 10px;

    .icon {
      width: 20px;
      min-width: 20px;
    }

    .item {
      border-bottom: 1px solid #efefef;
      padding: 0.8rem 0.5rem;
    }

    .tit {
      width: 100%;
      display: flex;
      font-size: 14px;
      color: #272727;
      font-weight: 600;
    }

    .info {
      display: flex;
      width: 100%;
      margin-top: 0.3rem;
      color: #7a7a7a;
      font-size: 12px;
      font-weight: normal;
      flex-wrap: nowrap;
      position: relative;

      .author {
        max-width: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .by {
        padding: 0 0.3rem;
        white-space: nowrap;
      }

      .contract_name {
        color: #29ba9c;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .creater {
        flex: 1;
        max-width: 11rem;
        display: flex;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .time {
        position: absolute;
        right: 0;
      }
    }
  }
</style>
