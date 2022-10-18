import cTitle from "components/title";
export default {
  components: { cTitle },
  data() {
    return {
      classify_data: []
    };
  },
  activated() {
    this.getJson();
    this.emptyMore();
  },
  methods: {
    goback(){
      this.$router.replace({path:"/o2o/store_manage",query:this.$route.query})
    },
    getJson() {
      var that = this;
      console.log("--params---", that.$route.params);
      let json = { store_id: parseInt(that.$route.params.store_id) };
      $http
        .post(
          "plugin.store-cashier.frontend.store.goods-category.get-category-by-store-id",
          json
        )
        .then(
          function(response) {
            console.log("显示classify", response);
            if (response.result == 1) {
              that.classify_data = [];
              for (var i = 0; i < response.data.list.length; i++) {
                response.data.list[i].btn_active = false;
                response.data.list[i].level_active = false;
                for (
                  var k = 0;
                  k < response.data.list[i].childrens.length;
                  k++
                ) {
                  response.data.list[i].childrens[k].btn_active = false;
                  response.data.list[i].childrens[k].level_active = false;
                  // for(var s=0;s<response.data.list[i].childrens[k].thirds.length;s++){
                  //     response.data.list[i].childrens[k].thirds[s].btn_active = false;
                  //     response.data.list[i].childrens[k].thirds[s].level_active = false;
                  // }
                }
              }
              that.classify_data = response.data.list;
              console.log(that.classify_data);
            } else {
              // 判断权限
              if (response.data.url) {
                that.$notify(response.msg);
                window.location.href = response.data.url;
                return 0;
              } else {
                // that.$message.error(response.msg);
                // that.$message.error("暂无商品分类,请添加分类");
                that.$notify("暂无商品分类,请添加分类");
              }
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    classifyRoute(params, level, index, index2, index3) {
      if (params == 1) {
        if (level == 2) {
          this.$router.push(
            this.fun.getUrl("AddClassify", {
              store_id: this.$route.params.store_id,
              classify_id: this.classify_data[index].id,
              level: level
            })
          );
        } else if (level == 3) {
          this.$router.push(
            this.fun.getUrl("AddClassify", {
              store_id: this.$route.params.store_id,
              classify_id: this.classify_data[index].childrens[index2].id,
              level: level
            })
          );
        }
      } else if (params == 2) {
        if (level == 1) {
          this.$router.push(
            this.fun.getUrl("FirstEdit", {
              store_id: this.$route.params.store_id,
              classify_id: this.classify_data[index].id,
              level: level
            })
          );
        } else if (level == 2) {
          this.$router.push(
            this.fun.getUrl("FirstEdit", {
              store_id: this.$route.params.store_id,
              classify_id: this.classify_data[index].childrens[index2].id,
              level: level
            })
          );
        } else if (level == 3) {
          this.$router.push(
            this.fun.getUrl("FirstEdit", {
              store_id: this.$route.params.store_id,
              classify_id: this.classify_data[index].childrens[index2].thirds[
                index3
              ].id,
              level: level
            })
          );
        }
      }
    },
    addClassify() {
      console.log("uiiooo");
      this.$router.push(
        this.fun.getUrl("AddClassify", {
          store_id: this.$route.params.store_id,
          classify_id: "add",
          level: 1
        })
      );
    },
    //展开
    oneLevel(level, index, index2) {
      if (level == 1) {
        if (this.classify_data[index].level_active == true) {
          this.emptyMore();
          // this.classify_data[index].level_active = false;
        } else {
          if (this.classify_data[index].childrens.length != 0) {
            this.emptyMore();
            this.classify_data[index].level_active = true;
          } else {
            // this.$message({
            //     message: '此类暂无数据',
            //     type: 'error'
            // });
            this.$notify("此类暂无数据");
          }
        }
      } else if (level == 2) {
        if (this.classify_data[index].childrens[index2].level_active == true) {
          this.emptyMore();
          this.classify_data[index].level_active = true;
          // this.classify_data[index].childrens[index2].level_active = false;
        } else {
          if (this.classify_data[index].childrens[index2].thirds.length != 0) {
            this.emptyMore();
            this.classify_data[index].level_active = true;
            this.classify_data[index].childrens[index2].level_active = true;
          } else {
            this.$notify("此类暂无数据");
            // this.$message({
            //     message: '此类暂无数据',
            //     type: 'error'
            // });
          }
        }
      }
    },
    //更多
    levelMore(level, index, index2, index3) {
      if (level == 1) {
        if (this.classify_data[index].btn_active == true) {
          this.emptyMore();
          // this.classify_data[index].btn_active = false;
        } else {
          this.emptyMore();
          this.classify_data[index].btn_active = true;
        }
      } else if (level == 2) {
        if (this.classify_data[index].childrens[index2].btn_active == true) {
          this.emptyMore();
          this.classify_data[index].level_active = true;
          // this.classify_data[index].childrens[index2].btn_active = false;
        } else {
          this.emptyMore();
          this.classify_data[index].level_active = true;
          this.classify_data[index].childrens[index2].btn_active = true;
        }
      } else if (level == 3) {
        if (
          this.classify_data[index].childrens[index2].thirds[index3]
            .btn_active == true
        ) {
          this.emptyMore();
          this.classify_data[index].level_active = true;
          this.classify_data[index].childrens[index2].level_active = true;
          // this.classify_data[index].childrens[index2].thirds[index3].btn_active = false;
        } else {
          this.emptyMore();
          this.classify_data[index].level_active = true;
          this.classify_data[index].childrens[index2].level_active = true;
          this.classify_data[index].childrens[index2].thirds[
            index3
          ].btn_active = true;
        }
      }
    },
    //清空
    emptyMore() {
      for (var i = 0; i < this.classify_data.length; i++) {
        this.classify_data[i].btn_active = false;
        this.classify_data[i].level_active = false;
        for (var k = 0; k < this.classify_data[i].childrens.length; k++) {
          this.classify_data[i].childrens[k].btn_active = false;
          this.classify_data[i].childrens[k].level_active = false;
          // for(var s=0;s<this.classify_data[i].childrens[k].thirds.length;s++){
          //     this.classify_data[i].childrens[k].thirds[s].btn_active = false;
          //     this.classify_data[i].childrens[k].thirds[s].level_active = false;
          // }
        }
      }
    },
    //删除
    deleteClassify(params, index, index2, index3) {
      var that = this;
      this.$dialog.confirm({
        title: "提示",
        message: "此操作将永久删除该分类, 是否继续?",
      }).then(() => {

        let deleteId = "";
        if (params == 1) {
          deleteId = that.classify_data[index].id;
          if (that.classify_data[index].childrens.length != 0) {
            that.$notify("先清空二级分类");
            return;
          }
        } else if (params == 2) {
          deleteId = that.classify_data[index].childrens[index2].id;
        } else if (params == 3) {
          deleteId =
            that.classify_data[index].childrens[index2].thirds[index3].id;
        }
        // console.log(params,index,index2,index3,deleteId);

        let json = { id: deleteId };
        $http
          .post(
            "plugin.store-cashier.frontend.store.goods-category.del-category",
            json
          )
          .then(
            function(response) {
              console.log("显示delete", response);
              if (response.result == 1) {
                if (params == 1) {
                  that.classify_data.splice(index, 1);
                } else if (params == 2) {
                  that.classify_data[index].childrens.splice(index2, 1);
                } else if (params == 3) {
                  that.classify_data[index].childrens[
                    index2
                  ].thirds.splice(index3, 1);
                }
                // that.$message({
                //     message: '删除成功',
                //     type: 'success'
                // });
                that.$notify({
                  background: "#f0f9eb",
                  message: "删除成功",
                  color: "#67c23a"
                });
              } else {
                // that.$message.error(response.msg);
                that.$notify(response.msg);
              }
            },
            function(response) {
              console.log(response);
            }
          );
      }).catch(() => {
        // on cancel
        that.$notify({
          background: '#edf2fc',
          message: '已取消删除',
          color: '#909399'
        });
      });
    }
  }
};
