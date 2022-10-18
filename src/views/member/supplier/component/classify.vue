<template>
  <div class="box">
    <div class="leftBox">
      <div class="leftList" @click="tapOneClass(index)" v-for="(item, index) in categoryInfo" :key="index" :class="index == firstClass ? 'firtClassRd' : ''">{{ item.name }}</div>
      <div class="leftList" @click="getMoreCategoryNew" v-if="current_page_first < last_page_first">加载更多</div>
    </div>
    <div class="rightBox">
      <div class="twoClass" v-if="cat_level == '3'">
        <template v-for="(item, ind) in categoryInfo_two">
          <div @click="tapRightTwo" class="twoClass_li" :key="ind" :class="ind == twoClass ? 'tapClassRd' : ''">{{ item.name }}</div>
        </template>
        <div class="twoClass_li" v-if="categoryInfo_two && current_page_two < last_page_two" @click="getMoreCategoryNew_two">加载更多</div>
      </div>
      <div class="classTab" v-if="categoryInfo.length > 0">
        <div class="ul" v-if="cat_level == '2' && categoryInfo_two.length > 0">
          <template v-for="(item, index) in categoryInfo_two">
            <div class="li" @click="toSearch(item.id)" :key="index">
              <div class="liImg">
                <img :src="item.thumb" />
              </div>
              <div class="txt">{{item.name}}</div>
            </div>
          </template>
        </div>
        <template v-if="cat_level == '3'">
          <div v-for="(item, index) in categoryInfo_two" :key="index">
            <div class="threeClass">{{ item.name }}</div>
            <div class="ul">
              <template v-for="(itemK, ind) in item.category_3">
                <div class="li" @click="toSearch(item.id)" :key="ind">
                  <div class="liImg">
                    <img :src="itemK.thumb" />
                  </div>
                  <div class="txt">{{ itemK.name }}</div>
                </div>
              </template>
            </div>
          </div>
          <div v-if="categoryInfo_two && current_page_two < last_page_two" @click="getMoreCategoryNew_two">加载更多</div>
          <div v-if="categoryInfo_two && current_page_two >= last_page_two" @click="getMoreCategoryNew_two">没有更多了</div>
        </template>
      </div>
      <div class="imgage" v-if="categoryInfo.length == 0">
        <img style="width: 6rem" src="@/assets/images/no-more-product.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  props: ["sid"],
  data() {
    return {
      // 所选一级
      firstClass: 0,
      // 所选二级
      twoClass: 0,
      // 一级分类
      categoryInfo: [],
      onePage: 1,
      current_page_first: 1,
      last_page_first: 1,
      // 二级分类
      categoryInfo_two: [],
      twoPage: 1,
      current_page_two: 1,
      last_page_two: 1,

      keyInto: "",
      cat_level: "2",
      loading: false,
      finishedTwo: false
    };
  },
  computed: {},
  methods: {
    refShow() {
      this.getClass();
    },
    twoClasss() {},
    toSearch(id){
      this.$router.push(this.fun.getUrl("SupplierSearch", { sid: this.sid,cid:id}));
    },
    getMoreCategoryNew_two(e) {
      if (this.current_page_two >= this.last_page_two) {
        this.finishedTwo = false;
        return;
      } else {
        let loadPage_two = this.twoPage + 1;
        this.getClassTwo(this.categoryInfo[this.firstClass].id, true, loadPage_two);
      }
    },
    getMoreCategoryNew(e) {
      if (this.current_page_first >= this.last_page_first) {
        return;
      } else {
        this.onePage = this.onePage + 1;
      }
      this.getClass(true);
    },
    tapOneClass(ind) {
      this.firstClass = ind;
      this.init();
      this.getClass();
    },
    init() {
      this.onePage = 1;
      this.current_page_first = 1;
      this.last_page_first = 1;
      this.twoPage = 1;
      this.current_page_two = 1;
      this.last_page_two = 1;
      this.twoClass = 0;
    },
    tapRightTwo() {},
    getClass(loadMore = false) {
      $http.post("plugin.supplier.frontend.shop.index.getParendCategory", { sid: this.sid, paginate: 100, page: this.onePage }, "加载中...").then(res => {
        if (res.result == 1) {
          this.cat_level = res.data.cat_level;
          if (!loadMore) {
            this.categoryInfo = res.data.data;
            this.current_page_first = res.data.current_page;
            this.last_page_first = res.data.current_page;
            if(this.categoryInfo[this.firstClass]){
              this.getClassTwo(this.categoryInfo[this.firstClass].id);
            }
          } else {
            this.categoryInfo = this.categoryInfo.concat(res.data.data);
            this.current_page_first = res.data.current_page;
            this.last_page_first = res.data.current_page;
          }
        } else {
          Toast(res.msg);
        }
      });
    },
    getClassTwo(child, loadMore = false, pageTwo) {
      $http.post("plugin.supplier.frontend.shop.index.getChildrenCategory", { sid: this.sid, paginate: 15, category_id: child, page: this.twoPage }, "加载中...").then(res => {
        if (res.result == 1) {
          if (loadMore) {
            this.getClassThr(child, res.data.category_2.data[this.twoClass].level, true, pageTwo);
          } else {
            // 初始进入取二级分类只开了二级分类
            if (this.cat_level == "2") {
              this.categoryInfo_two = res.data.categorys.data;
              this.current_page_two = res.data.categorys.current_page;
              this.last_page_two = res.data.categorys.last_page;
            } else {
              // 开启了三级分类
              this.getClassThr(child, res.data.category_2.data[this.twoClass].level);
            }
          }
        }else{
          Toast(res.msg);
        }
      });
    },
    getClassThr(child, leve, loadMore = false, pageTwo = null) {
      if (loadMore && pageTwo) {
        this.twoPage = pageTwo;
      }
      // 取三级分类
      $http.post("plugin.supplier.frontend.shop.index.getChildrenCategory", { sid: this.sid, paginate: 15, category_id: child, page: this.twoPage, level: leve }, "加载中...").then(res => {
        if (res.result == 1) {
          console.log("三级分类sssss", res);
          if (loadMore) {
            this.categoryInfo_two = this.categoryInfo_two.concat(res.data.category_2.data);
            this.current_page_two = res.data.category_2.current_page;
            this.last_page_two = res.data.category_2.last_page;
            return;
          } else {
            this.categoryInfo_two = res.data.category_2.data;
            this.current_page_two = res.data.category_2.current_page;
            this.last_page_two = res.data.category_2.last_page;
            console.log("三级分类sssss", this.categoryInfo_two);
          }
        }else{
          Toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.box {
  background: #f6f6f6;
  display: flex;
  justify-content: space-between;
  .rightBox {
    flex: 1;
    padding: 0.94rem 0.84rem;
    overflow: hidden;
    .classTab {
      height: 50vh;
      overflow-y: scroll;
    }
    .ul {
      display: flex;
      flex-wrap: wrap;
      .li:nth-child(3n) {
        margin-right: 0;
      }
      .li {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 0.91rem;
        margin-right: 0.55rem;
      }
      .liImg {
        width: 5.13rem;
        height: 5.13rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .txt {
        width: 100%;
        text-align: center;
        color: #333333;
        font-size: 0.81rem;
      }
    }
    .twoClass {
      display: flex;
      align-items: center;
      overflow-x: scroll;
      .van-list {
        display: flex;
        flex-shrink: 0;
      }
      .twoClass_li:nth-child(1n) {
        margin-right: 0.75rem;
        margin-bottom: 1.22rem;
      }
      .twoClass_li {
        flex-shrink: 0;
        padding: 0.38rem 0.88rem;
        text-align: center;
        border-radius: 0.19rem;
        border: solid 0.12rem #bfbfbf;
        font-size: 0.75rem;
      }
    }
  }
  .leftBox {
    width: 5.22rem;
    height: 73vh;
    background-color: #ffffff;
    padding-left: 0.69rem;
    padding-right: 0.69rem;
    box-sizing: border-box;
    overflow-y: scroll;
    flex-shrink: 0;
    .leftList:first-child {
      padding-top: 1.38rem;
    }
    .leftList {
      padding-bottom: 1.124rem;
      padding-top: 1.24rem;
      text-align: left;
      font-size: 0.88rem;
      color: #666666;
    }
  }
}
.firtClassRd {
  font-size: 0.94rem;
  color: #f15353 !important;
}
.tapClassRd {
  color: #f15353;
  font-size: 0.75rem;
  border: solid 0.12rem #f15353 !important;
}
.threeClass {
  font-size: 0.9375rem;
  color: #212121;
  font-weight: bold;
  margin-top: 0.5938rem;
  margin-bottom: 0.625rem;
  text-align: left;
}
</style>