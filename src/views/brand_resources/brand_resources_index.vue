<template>
  <div class="page">
    <c-title text="品牌资源"></c-title>

    <div class="brand" v-if="banner.length > 0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, key) in banner" :key="key">
          <a v-if="item.h5_url" :href="item.h5_url">
            <img :src="item.image_url" alt="" />
          </a>
          <img v-else :src="item.image_url" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="recommend" v-if="recommend.length > 0">
        <div class="recommend-title">
            <i class="iconfont icon-fontclass-tuijian1"></i>
            <span class="text">推荐商品</span>
        </div>
        <div class="recommend-goods">
            <div class="recommend-good" v-for="item in recommend" :key="item.id" @click="toGood(item.id)">
                <div class="good-face">
                    <img :src="item.thumb" :alt="item.title">
                </div>
                <div class="good-title">
                    {{item.title}}
                </div>
                <div class="good-prices">
                    <div class="present-price">{{ $i18n.t('money') }}{{item.price}}</div>
                    <div class="original-price">{{ $i18n.t('money') }}{{item.market_price}}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="category">
        <van-tabs v-model="activeName" scrollspy sticky>
            <van-tab :name="cate.id" v-for="cate in category" :key="cate.id" :title="cate.name">
              <div class="category-container">
                <div class="category-title">{{cate.name}}</div>
                <div class="category-list">
                  <div class="category-item" v-for="item in cate.children" :key="item.id" @click="toCate(item.id)">
                    <div class="category-cover">
                      <img :src="item.thumb" alt="">
                    </div>
                    <div class="category-text">{{item.name}}</div>
                  </div>
                </div>
              </div>
            </van-tab>
        </van-tabs>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      banner: [],
      recommend: [],
      category: [],
      activeName:"0"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    toGood(id) {
      this.$router.push(this.fun.getUrl('goods', { id: id }));
    },
    toCate(id) {
      this.$router.push(this.fun.getUrl('search', { id, fromHome: 1 },{cate_id:id}));
    },
    getData() {
      $http.get("plugin.yz-supply-camilo-resources.frontend.index.index").then(
        (response)=> {
          if (response.result == 1) {
            this.banner = response.data.banner || [];
            this.recommend = response.data.recommend || [];
            this.category.push({
              id: 0,
              name: '推荐分类',
              children: response.data.category.recommand_category
            });
            this.category = this.category.concat(response.data.category.categorys);
          } else {
            this.$toast(response.msg);
          }
        }
      );
    },
  }
};
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background-color: rgb(249, 249, 249);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.brand {
  width: 100%;
  height: 8.625rem;
  padding-top: 0.625rem;
  background: #fff;
  box-sizing: content-box;
  .my-swipe .van-swipe-item {
    padding: 0 0.906rem;
    height: 9.5rem;
    background-color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;

    img {
      width: 21.563rem;
      height: 8.625rem;
      background-color: #a5a5a5;
      border-radius: 0.469rem;
    }
  }
}

.recommend{
    padding: 1.281rem 0.906rem 0.813rem;
    background: #fff;
    .recommend-title{
        display: flex;
        align-items: center;
        .icon-fontclass-tuijian1{
            font-size: 22px;
            color: #ffa846;
        }
        .text{
            margin-left: 0.344rem;
            font-size: 1.188rem;
            color: #2c2c2c;
            font-weight: bold;
        }
    }
    .recommend-goods{
        display: flex;
        padding-top:0.844rem;
        flex-wrap: nowrap;
        overflow: auto;
        .recommend-good{
            width: 6.875rem;
            margin-right: 0.781rem;
            &:last-child{
                margin-right: 0;
            }
            .good-face{
                width: 6.875rem;
                height: 6.875rem;
                background-color: #9d9d9d;
                border-radius: 0.313rem;
                img{
                    width: 6.875rem;
                    height: 6.875rem;
                    background-color: #9d9d9d;
                    border-radius: 0.313rem;
                }
            }
            .good-title{
                margin-top: 8px;
                text-align: left;
                font-size: 12px;
                color: #2c2c2c;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .good-prices{
                display: flex;
                flex-wrap: wrap;
                margin-top:0.5rem;
                text-align: left;
                .present-price{
                    word-break: break-all;
                    font-size: 10px;
                    color: #ff464c;
                    margin-right: 0.5rem;
                }
                .original-price{
                    word-break: break-all;
                    font-size: 10px;
                    color: #979797;
                    text-decoration:line-through;
                }
            }
        }
    }
}

.category{
    margin-top:1.5rem;
    .category-container{
        padding:0.938rem;
      margin-bottom: 10px;
        background: #fff;
        .category-title{
            text-align: left;
            font-size: 0.813rem;
            color: #212121;
        }
        .category-list{
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-row-gap: 1.156rem;
            padding-top:1.156rem;
            .category-item{
                display: flex;
                flex-direction: column;
                align-items: center;
                .category-cover{
                    width: 2.75rem;
                    height: 2.75rem;
                    border-radius: 50%;
                    img{
                        width: 2.75rem;
                        height: 2.75rem;
                        border-radius: 50%;
                    }
                }
                .category-text{
                    margin-top:0.625rem;
                    font-size: 0.75rem;
                    color: #292929;
                }
            }
        }
    }
}




</style>