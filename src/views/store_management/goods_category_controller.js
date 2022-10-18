import yzBlank from "components/ui_components/yz_blank";
export default {
  data () {
    return {
      optNodePop: false,
      optionNode: {},
      treeData: [],
      maxLevel: 1,
      page: 1,
      loading: false,
      finished: false,
      defaultProps: {
        children: 'has_many_children',
        label: 'name'
      },
      actions: [
        { name: '添加子类', disabled: false },
        { name: '编辑', disabled: false},
        { name: '删除', disabled: false},
        { name: '取消' },
      ], // 面板数据
    };
  },
  computed: {
    nodeTitlCalss () {
      return (level) => {
        if (level == 1) {
          return 'level-1';
        } else if (level == 2) {
          return 'level-2';
        } else {
          return 'level-3';
        }
      };
    }
  },
  activated () {
    this.initData();
    this.getData();
  },
  methods: {
    getData () {
      if (this.loading && this.finished) return false;
      this.loading = true;
      $http.get("plugin.shop-assistant.frontend.category.get-list", {page: this.page}, "loading")
        .then((response) => {
          this.loading = false;
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.maxLevel = response.data.setLevel;
          let list = response.data.list;
          if (list.current_page >= list.last_page && list.data.length < list.per_page) this.finished = true;
          this.page++;
          this.treeData = list.current_page > 1 ? this.treeData.concat(list.data) : list.data;
          // this.setActionsData(this.maxLevel);
        });
    },
    loadMore () {
      this.getData();
    },


    // setActionsData (maxLevel) {
    //   // 最高一级
    //   if (maxLevel == 1) {
    //     this.actions[1].disabled = true;
    //     this.actions[2].disabled = true;
    //   }
    //   // 最高二级
    //   if (maxLevel == 2) {
    //     this.actions[2].disabled = true;
    //   }
    // },

    // 收缩展开
    nodeExpand (data, node) {
      this.$set(node, 'expanded', true);
    },
    nodeCollapse (data, node) {
      this.$set(node, 'expanded', false);
    },

    // 节点操作弹框
    showOptionNode (node, data) {
      let opNodes = [
        { name: '添加子类' },
        { name: '编辑' },
        { name: '删除' },
        { name: '取消' },
      ];
      if (this.maxLevel == 2 && node.level === 2) {
        opNodes.shift();
        // this.actions[0].disabled = node.level === 2 ? true : false;
      } else if (node.level === 3) {
        opNodes.shift();
        // this.actions[0].disabled = true;
      }
      this.optionNode = data;
      this.actions = opNodes;
      this.optNodePop = true;
    },

    select (opt) {
      this.optNodePop = false;
      if (opt.name === "取消") return false;
      this.categoryId = this.optionNode.id;
      if (opt.name === "添加子类") {
        this.toAddCategory(this.categoryId);
      } else if (opt.name === "编辑") {
        this.toDditCategory(this.categoryId);
      } else {
        this.deleteCategory(this.categoryId);
      }
    },

    toDditCategory (id) {
      this.$router.push( this.fun.getUrl("editGoodsCatgory", {id}));
    },
    toAddCategory (id) {
      this.$router.push( this.fun.getUrl("addGoodsCatgory", {parentId: id}));
    },
    // 删除分类
    deleteCategory (id) {
      this.$dialog.confirm({title: "正在删除改分类，请确认操作"})
        .then(()=>{
          $http.post("plugin.shop-assistant.frontend.category.delete", {id}, "loading").then((response) => {
            this.$toast(response.msg);
            if (response.result === 1) {
              this.initData();
              this.getData();
            }
          });
        }).catch(() => {
          this.$toast("您取消了操作");
        });
    },
    initData () {
      this.optNodePop = false;
      this.optionNode = {};
      this.treeData = [];
      this.maxLevel = 1;
      this.page = 1;
      this.loading = false;
      this.finished = false;
    },
  },

  components: {
    yzBlank
  },
};