<template>
  <div>
    <!-- 父组件控制的变量 storageName  >>> localStorage存储的 key -->
    <div class="search-history" v-if="searchHistoryList.length > 0">
      <div class="tip-words">
          <div class="search-head">
            <h4>搜索历史</h4>
            <van-icon name="delete-o" class="delete" @click="clearHistoryItems"></van-icon>
          </div>
      </div>
      <span class="tag"
          v-for="(item) in searchHistoryList"
          :key="item.key"
          @click="clickTag(item)"
        >
          <span class="text">{{item.name}}</span>
          <i @click.stop="popHistoryItems(item)" class="van-icon van-icon-cross van-tag__close"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    storageName: {
      type: String,
      default: 'searchHistory'
    }
  },
  data() {
    return {
      // 搜索历史
      searchHistoryList: [],
      // 标记显示搜索历史
      showFlag: false,
      loadShow: false,
      page: 0
    };
  },

  activated() {
    this.initKeywords();
    this.showHistory();
  },

  methods: {
    showHistory() {
      if (this.searchHistoryList.length > 0) {
        this.showFlag = true;
      }
    },
    initKeywords () {
      var localStorageobj = window.localStorage.getItem(this.storageName);
      if (localStorageobj) {
        this.searchHistoryList = JSON.parse(localStorageobj);
      } else {
        window.localStorage.setItem(this.storageName, "[]");
      }
    },
    // 清空历史记录
    clearHistoryItems() {
      this.$emit("popTag");
      localStorage.removeItem(this.storageName);
      this.searchHistoryList = [];
      this.showFlag = false;
    },

    // 删除一项历史记录
    popHistoryItems(value) {
      let index = this.searchHistoryList.findIndex((item) => item.name == value.name);
      if (value !== "" && index >= 0) {
        this.$emit("popTag");
        this.searchHistoryList.splice(index, 1);
        window.localStorage.setItem(this.storageName, JSON.stringify(this.searchHistoryList));
      }
    },


    appendKeywords(value) {
      var appendFlag = true;
      value = value.trim();
      if (this.searchHistoryList && this.searchHistoryList.length > 0) {
        this.searchHistoryList.forEach((item, index) => {
          if (item.name === value) {
            appendFlag = false;
            return;
          }
        });
      }

      if (appendFlag && value !== '') {
        let len = this.searchHistoryList.length;
        if (len >= 10) {
          this.searchHistoryList.pop();
        }
        let timer = Date.parse(new Date());
        this.searchHistoryList.unshift({name: value, key: timer});
        window.localStorage.setItem(this.storageName, JSON.stringify(this.searchHistoryList));
      }
    },

    clickTag (item) {
      this.$emit("clickTag",item.name);
    }

  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search-history {
  margin: 0.5rem 1rem;
  text-align: left;

  .search-head {
    display: flex;
    justify-content: space-between;
  }

  .tag {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    margin: 0.2rem;
    padding: 0.3rem 0.4rem;
    font-size: 12px;
    line-height: 16px;
    background-color: #f2f2f2;
    color: #4e4e4e;
    border-radius: 999px;

    .text {
      display: inline-block;
      margin-right: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
  }

  .delete {
    font-size: 18px;
  }
}
</style>
