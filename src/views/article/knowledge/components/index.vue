<template>
  <div class="tree-box">
    <!--<van-collapse v-model="activeNames" :border="false" style="background-color: #fff;" @change="linkto($event,'title')">-->
      <!--<template v-for="(item) in list">-->
        <!--&lt;!&ndash;一级&ndash;&gt;-->
        <!--<van-collapse-item style="font-size: 20px;" v-if="item.child.length>0" :name="item.id" :key="item.id"-->
                           <!--:title="item.article_name">-->
          <!--<template v-for="(child) in item.child">-->
            <!--&lt;!&ndash;二级&ndash;&gt;-->
            <!--<van-collapse-item v-if="child.child.length>0" :name="child.id" :key="child.id" :title="child.article_name">-->
              <!--<template v-for="it in child.child" @toggle="linkto(child.id)">-->
                <!--&lt;!&ndash;三级&ndash;&gt;-->
                <!--<van-collapse-item v-if="it.child.length>0" :name="it.id" :key="it.id" :title="it.article_name" @toggle="linkto(it.id)">-->
                  <!--&lt;!&ndash;四级&ndash;&gt;-->
                  <!--<div v-for="text in it.child" @click.stop='linkto(text.id)' :key="text.id" class="routes">{{text.article_name || '文章'}}-->
                  <!--</div>-->
                <!--</van-collapse-item>-->
                <!--<div v-else @click.stop='linkto(it.id)' :key="it.id" class="routes">{{it.article_name || '文章'}}-->
                <!--</div>-->
              <!--</template>-->
            <!--</van-collapse-item>-->
            <!--<div v-else @click.stop='linkto(child.id)' :key="child.id" class="routes">-->
              <!--{{child.article_name || '文章'}}-->
            <!--</div>-->
          <!--</template>-->
        <!--</van-collapse-item>-->

        <!--<div v-else @click.stop='linkto(item.id)' :key="item.id" class="routes">-->
          <!--{{item.article_name || '文章'}}-->
        <!--</div>-->
      <!--</template>-->
    <!--</van-collapse>-->

    <el-tree ref=slotTree
             highlight-current
             :node-key="NODE_KEY"
             :data="list"
             :props="catalogueProps"
             :default-expand-all="true"
             :expand-on-click-node="false"
             :current-node-key="article_id"
             @node-click="handleNodeClick"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  props: ["base_id", "list"],
  data() {
    return {
      // 树节点参数
      NODE_KEY: 'id',
      catalogueProps: {
        label: "article_name",
        children: "child",
      },
      article_id: "", // 文章id
      activeNames: []
    };
  },
  mounted() {
    this.$nextTick(()=>{
      this.$refs.slotTree.setCurrentKey(this.$route.params.articleId);
      setTimeout(()=>{
        let dom = document.querySelector(".is-current");
        if(!dom) return;
        let top = dom.getBoundingClientRect().top - window.innerHeight/2;
        document.querySelector(".van-popup").scrollTo(0,top);
      },0)
    })
    this.activeNames = [];
    if(this.list && this.list.length>0) {
      this.list.map((item)=> {
        this.activeNames.push(item.id);
      });
    }
  },
  methods: {
    // 点击
    handleNodeClick(e) {
      this.article_id = e.id;
      this.$router.push(this.fun.getUrl("knowledgeDetail", { articleId: this.article_id }, {base_id: this.base_id}));
    },
    linkto(id,flag) {
      let articleId = "";
      if(flag==='title') {
        this.activeNames.map((item)=> {
          if(id.indexOf(item)==-1) {
            articleId = item;
          }
        });

        if(!articleId) {
          id.map((item)=> {
            if(this.activeNames.indexOf(item)==-1) {
              articleId = item;
            }
          });
        }
      }else {
        articleId = id;
      }
      this.$router.push(this.fun.getUrl("knowledgeDetail", { articleId: articleId }, {base_id: this.base_id}));
    },
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /deep/ .is-current{color: #3aa98b; .el-tree-node__children{color: #606266;}}
  .tree-box {
    min-height: 60vh;
    // padding: 0.5rem 0;
    padding: 0.5rem 0.5rem 0 0;
    margin: 0 0 1rem;
    border-radius: 5px;
    background-color: #fff;

    /deep/.van-collapse-item--border::after {
      border: none;
    }

    /deep/.van-cell::after {
      border: none;
    }

    /deep/.el-tree-node__content {
      min-height: 20px;
      height: auto;
    }
    /deep/.el-tree-node__expand-icon.is-leaf {
      font-size: 16px;
    }

    /deep/.el-tree-node__label {
      white-space: normal;
      text-indent: -28px;
      /*white-space: nowrap;*/
      /*overflow: hidden;*/
      /*text-overflow: ellipsis;*/
    }

    /deep/.el-tree-node__expand-icon {
      font-size: 24px;
      margin-right: 25px;
    }

    /deep/.el-tree {
      border-radius: 5px;
    }
  }

  .routes {
    font-size: 14px;
    line-height: 1.5;
    padding: 12px 16px;
    color: #323233;
  }
</style>
