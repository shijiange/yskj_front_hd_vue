<!-- 提交推荐升级 -->
<template>
  <div id="submitRecommend">
    <c-title :hide="false" text="提交推荐"></c-title>
    <div class="box">
      <div class="left_b">会员ID</div>
      <input type="number" placeholder="输入会员id(必填)" v-model="memberId" />
    </div>
    <div class="box">
      <div class="left_b">选择等级</div>
      <div @click="ishowDropdown" style="display: flex; align-items: center;">
        <div class="dropdown" style="color: #999;" v-show="!select_levelName">选择等级</div>
        <div class="dropdown" v-show="select_levelName">{{ select_levelName }}</div>
        <van-icon name="arrow-down" v-show="showLevel" />
        <van-icon name="arrow-up" v-show="!showLevel" />
      </div>
    </div>
    <div class="level_list" v-if="showLevel">
      <van-radio-group v-model="level_id">
        <van-cell-group>
          <van-cell :title="item.level_name" clickable v-for="(item, index) in level_list" :key="index">
            <template #right-icon>
              <van-radio :name="item.id" @click="selectLevel(item.level_name)" checked-color="#f20f0f" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="box" v-if="is_open_transfer_stock">
      <div class="left_b">转让库存</div>
      <div @click="showGoods = true" style="display: flex; align-items: center;">
        <div class="dropdown" :style="{ color: !fun.isTextEmpty(radio) ? '#333' : '#999' }">
          {{ !fun.isTextEmpty(radio) ? '更换商品' : '选择商品' }}
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="selectGoods" v-if="!fun.isTextEmpty(radio)">
      <div class="goods_list_child">
        <img :src="radio.goods ? radio.goods.thumb : require('../../assets/images/loading.jpg')" alt="" />
        <div class="goods_left">
          <div class="goods_title">{{ radio.goods ? radio.goods.title : '' }}</div>
          <div class="price">{{ $i18n.t('money') }}{{ radio.goods ? radio.goods.price : '' }}</div>
          <div class="stock">库存：{{ radio.stock || '' }}</div>
        </div>
        <van-stepper v-model="value" min="1" :max="radio.stock" />
      </div>
    </div>
    <div class="btn" @click="submit" v-show="!showGoods">提交</div>

    <van-popup v-model="showGoods" position="right" :style="{ height: '100%' }" :overlay="false">
      <div class="goodsList_class set-pc-style">
        <div class="goods_nav">
          <van-nav-bar title="转让库存商品" left-text="返回" left-arrow @click-left="showGoods = false" fixed />
        </div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getMoreData">
          <van-radio-group v-model="radio" class="goods_list">
            <van-radio
              :name="item"
              checked-color="#ff2c29"
              v-for="item in goods_list"
              :key="item.id"
              :disabled="item.stock > 0 ? false : true"
            >
              <div class="goods_list_child">
                <img :src="item.goods ? item.goods.thumb : require('../../assets/images/loading.jpg')" alt="" />
                <div class="goods_left">
                  <div class="goods_title">{{ item.goods ? item.goods.title : '' }}</div>
                  <div class="price">{{ $i18n.t('money') }}{{ item.goods ? item.goods.price : '' }}</div>
                  <div class="stock">库存：{{ item.stock || '' }}</div>
                </div>
              </div>
            </van-radio>
          </van-radio-group>
        </van-list>
        <div class="btn" @click.stop="showGoods = false">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      timer: null,
      memberId: null,
      level_id: '',
      select_levelName: null,
      level_list: [],
      goods_list: [],
      showLevel: false,
      showGoods: false,
      radio: null,
      value: 1,
      is_open_transfer_stock: false,

      loading: false,
      finished: false,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  components: {
    cTitle
  },
  computed: {},
  activated() {
    this.init();
    this.getLevel();
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  methods: {
    init() {
      this.timer = null;
      this.memberId = null;
      this.showGoods = false;
      this.radio = null;
    },
    getLevel() {
      let that = this;
      $http
        .post('plugin.channel.frontend.recommend.handle.index', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.level_list = response.data.levels;
            this.is_open_transfer_stock = response.data.is_open_transfer_stock == 1 ? true : false;
            if (!that.fun.isTextEmpty(response.data.goods_list)) {
              this.goods_list = response.data.goods_list.data;
              this.isLoadMore = true;
              this.total_page = response.data.goods_list.last_page;
              if (!this.total_page) {
                this.total_page = 0;
                this.finished = true;
              }
            }
          } else {
            if (!that.fun.isTextEmpty(response.data)) {
              that.$dialog.confirm({ message: "推荐升级数量不足，是否增加数量?"})
                .then(() => {
                  that.$router.push(that.fun.getUrl('goods', { id: response.data.goods_id }));
                }).catch(() => {
                  that.$router.go(-1);
                });
            } else {
              Toast(response.msg);
              that.$router.go(-1);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectLevel(_name) {
      this.select_levelName = _name;
      this.timer = setTimeout(() => {
        this.showLevel = false;
      }, 500);
    },
    ishowDropdown() {
      this.showLevel = !this.showLevel;
    },
    submit() {
      let that = this;
      if (this.fun.isTextEmpty(this.memberId)) {
        Toast('请填写会员id!');
        return;
      }
      if (this.fun.isTextEmpty(this.level_id)) {
        Toast('请选择会员等级!');
        return;
      }
      if (this.is_open_transfer_stock && this.fun.isTextEmpty(this.radio)) {
        Toast('请选择转让库存商品!');
        return;
      }
      let _json = {
        child_uid: this.memberId,
        level_id: this.level_id,
        num: this.value
      };
      if (this.is_open_transfer_stock && !this.fun.isTextEmpty(this.radio)) {
        _json.lid = this.radio.id;
      }
      $http
        .post('plugin.channel.frontend.recommend.handle.sub', _json, '')
        .then(response => {
          if (response.result === 1) {
            Toast('提交推荐升级成功！');
            if (window.history.length <= 1) {
              that.$router.push(that.fun.getUrl('distributorIndex', {}));
            } else {
              that.$router.go(-1);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      if (!that.isLoadMore) {
        return;
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        that.finished = true;
        return;
      } else {
        // let _url = null;
        that.page = this.page + 1;

        $http.get('plugin.channel.frontend.recommend.handle.index', { page: this.page }, '加载中').then(
          response => {
            that.loading = false;
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.goods_list.data;
              that.goods_list = that.goods_list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#submitRecommend {
  padding: 40px 0;
  padding-top: 0;
  background: #fff;

  .box {
    height: 3rem;
    line-height: 3rem;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    // border-bottom: 0.0625rem solid #e0e0e0;
    font-size: 1.125rem;

    .left_b {
      font-weight: bold;
      color: #000;
    }

    input {
      border: none;
      text-align: right;
    }
  }

  .btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2.75rem;
    line-height: 2.75rem;
    background: #f20f0f;
    text-align: center;
    color: #fff;
    font-size: 1.125rem;
    z-index: 999;
  }

  .level_list {
    text-align: left;
    max-height: 14rem;
    overflow-y: scroll;
  }

  .goodsList_class {
    width: 100vw;

    .goods_list {
      padding: 0.875rem 0.25rem;
      margin-top: 40px;

      .van-radio {
        padding: 0.5rem 0.5rem 0.5rem 0.25rem;
        overflow: hidden;
        border-bottom: 0.0625rem solid #fbfbfb;
      }

      /deep/ .van-radio__label {
        flex: 1;
        overflow: hidden;
      }
    }
  }

  .selectGoods {
    width: 94%;
    padding: 0.5rem;
    border: 1px solid #f1f1f1;
    margin: 1rem auto 0;
    border-radius: 0.5rem;
  }

  .goods_list_child {
    display: flex;
    align-items: flex-end;

    img {
      width: 4rem;
      height: 4rem;
      display: block;
      object-fit: cover;
      border-radius: 0.5rem;
      overflow: hidden;
      margin: 0 0.5rem 0 0;
    }

    .goods_left {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      overflow: hidden;

      .goods_title {
        font-size: 1rem;
        color: #000;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
        margin-bottom: 0.25rem;
      }

      .price {
        color: #ff2c29;
      }

      .stock {
        color: #999;
      }
    }
  }
}
</style>
