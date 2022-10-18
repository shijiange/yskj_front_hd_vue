<template>
  <div id="topline_bg" :style="'background:' + datas.params.bgcolor">
    <div id="headline-box" @click="gotoList" v-if="datas.params.shownum == 2">
      <div class="img">
        <img
          :src="datas.params.bgimg ? datas.params.bgimg : require('../assets/images/loading.jpg')"
          style="width: 100%;"
        />
      </div>
      <van-swipe
        :style="'height:3.75rem;width:85%;background:' + datas.params.bgcolor"
        :autoplay="3000"
        vertical
        :touchable="false"
        :show-indicators="false"
        loop
        :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
      >
        <van-swipe-item v-for="(item, i) in listData_2" :key="i">
          <div class="li" v-for="(item_1, i) in item" :key="i" style="display: flex; align-items: center; height: 30px;">
            <span class="left"> 热议</span>
            <span class="right">{{ item_1.title }}</span>
          </div>
        </van-swipe-item>
        <van-swipe-item v-for="(item, i) in listData_2" :key="i" v-show="listData_2.length == 1">
          <div class="li" v-for="(item_1, i) in item" :key="i" style="display: flex; align-items: center; height: 30px;">
            <span class="left"> 热议</span>
            <span class="right">{{ item_1.title }}</span>
          </div>
        </van-swipe-item>
      </van-swipe>

    </div>
    <div id="headline" @click="gotoList" v-if="datas.params.shownum == 1">
      <div class="img">
        <img
          :src="datas.params.bgimg ? datas.params.bgimg : require('../assets/images/loading.jpg')"
          style="max-height: 100%;"
        />
      </div>
      <van-swipe
        :style="'height:1.875rem;width:85%;background:' + datas.params.bgcolor"
        :autoplay="3000"
        loop
        vertical
        :touchable="false"
        :show-indicators="false"
        :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
      >
        <van-swipe-item v-for="(item, i) in listData" :key="i">
          <div class="li" style="display: flex; align-items: center; height: 30px;">
            <span class="left"> 热议</span>
            <span class="right">{{ item.title }}</span>
          </div>
        </van-swipe-item>
        <van-swipe-item v-for="(item, i) in listData" :key="i" v-show="listData.length == 1">
          <div class="li" style="display: flex; align-items: center; height: 30px;">
            <span class="left"> 热议</span>
            <span class="right">{{ item.title }}</span>
          </div>
        </van-swipe-item>
      </van-swipe>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      default: []
    },
    page_id: {
      default: 0
    },
    home: {
      default: false
    }
  },
  data() {
    return {
      listData: [],
      listData_2: [],
      clientWidths: ''
    };
  },
  mounted() {
    this.clientWidths = document.body.clientWidth;

    let strdata = [];
    if (Object.prototype.toString.call(this.datas.data) == '[object Object]') {
      if (this.datas.data) {
        for (let k in this.datas.data) {
          strdata.push(this.datas.data[k]);
        }
        this.listData = strdata;
      }
    } else if (Object.prototype.toString.call(this.datas.data) == '[object Array]') {
      if (this.datas.data) {
        this.listData = this.datas.data;
      }
    }
    if (this.datas.params.shownum == 2) {
      let arr_1 = [];
      for (let i = 0; i < this.listData.length; i += 2) {
        let arr_2 = [];
        if (this.listData[i]) {
          arr_2.push(this.listData[i]);
        }
        if (this.listData[i + 1]) {
          arr_2.push(this.listData[i + 1]);
        }
        arr_1.push(arr_2);
      }
      this.listData_2 = arr_1;
    }
    // console.log("kk:::", this.listData);
    // console.log("kk2:::", this.listData_2);
  },
  computed: {},
  methods: {
    gotoList() {
      window.localStorage.setItem('showheadline', JSON.stringify(this.datas));
      this.$router.push(this.fun.getUrl('ArticleList'));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#topline_bg {
  background-color: #fff;
  overflow: hidden;
}

#headline-box {
  margin-top: 0.0625rem;
  display: flex;
  height: 3.75rem;
  //background-color: #fff;
  .img {
    margin-right: 0.625rem;
    width: 15%;
    padding: 0.375rem;
    display: flex;
    flex-direction: column;

    img {
      max-height: 100%;
      width: 100%;
      display: block;
      margin: 0;
    }
  }

  .more {
    width: 15%;
  }

  .left {
    min-width: 2.375rem;
    font-size: 12px;
    color: #f15353;
    border: solid 0.0625rem #f15353;
    padding: 0 0.25rem;
    border-radius: 0.125rem;
    margin-right: 0.625rem;
  }

  .right {
    text-align: left;
    width: 16.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

#headline {
  margin: 4px 0;
  display: flex;
  height: 30px;
  // background-color: #fff;
  .img {
    width: 15%;
    padding: 0 0.375rem;
    margin-right: 0.625rem;
  }

  .more {
    width: 15%;
  }

  .left {
    min-width: 2.375rem;
    font-size: 12px;
    color: #f15353;
    border: solid 0.0625rem #f15353;
    padding: 0 0.25rem;
    border-radius: 0.125rem;
    margin-right: 0.625rem;
  }

  .right {
    text-align: left;
    width: 16.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
