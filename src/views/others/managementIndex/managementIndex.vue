<template>
  <div id="managementIndex">
    <c-title :hide="false" :text="'厂家管理'"> </c-title>
    <div class="t_box">
      <div class="t_box_top"></div>
      <div class="t_box_img">
        <img :src="producer.logo_url" alt="" />
      </div>
      <div class="t_box_c">
        <span class="storename">{{ producer.producer_name }}</span>
        <div>
          <span class="adress">{{ producer.province_name }} {{ producer.city_name }} {{ producer.district_name }}</span>
          <span class="tell"
            >热销：<em class="tell_i">{{ producer.sell_total }}</em></span
          >
        </div>
        <div class="t_box_c_box">
          <!-- <div class="t_box_c_start" style="margin-right: 0.53rem">
            <van-icon name="star" :style="{ color: tapStart ? '#f14e4e' : '#c8c8c8' }" />
            <span>已收藏</span>
          </div> -->
          <div class="t_box_c_start" @click="showCard = true">
            <i class="iconfont icon-fontclass-zhizhao"></i>
            <span>店铺证照</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 0.63rem;"></div>
    <div class="t_bottom">
      <van-search v-model="value_s" shape="round" placeholder="请输入搜索关键词" @search="onSearch" />
      <div class="lis" v-for="(data, ind) in goods_list" :key="ind">
        <div class="lisLeft">
          <img :src="data.thumb" alt="" />
        </div>
        <div class="lisRight">
          <div class="lisRight_t">
            {{ data.title }}
          </div>
          <!-- <div class="lisrRight_tt"><span>均衡营养</span> | <span>科学配比</span></div> -->
          <div class="lisrRight_m">
            <div class="left_m">
              <div class="left_m_t">
                原价：<span class="left_m_o">{{ $i18n.t('money') }}{{ data.market_price }}</span>
              </div>
              <div class="left_m_t" style="color: #f14e4e; font-size: 0.75rem;">
                现价：<span class="left_m_u">{{ $i18n.t('money') }}{{ data.price }}</span>
              </div>
            </div>
            <div class="right_m" @click="goBuy(data)">立即采购</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="total_page > page" style="margin-bottom: 6rem; color: #666;">上拉加载更多</div>
    <div v-if="!isLoadMore" style="margin-bottom: 6rem; color: #666;">没有更多</div>
    <div class="t_pos set-pc-styleLeft">
      <div class="t_pos_btn" @click="show = true">
        <i class="iconfont icon-fontclass-mendianfenlei"></i>
        商品分类
      </div>
      <div class="t_pos_btn" @click="proclamation(producer.id)">
        <i class="iconfont icon-fontclass-gonggao"></i>
        店铺公告说明
      </div>
    </div>
    <van-popup v-model="show" :style="{ width: '18.78rem', backgroundColor: 'transparent' }">
      <div class="pop">
        <div
          v-for="(item, index) in classify"
          :key="index"
          :class="index === ind ? 'tapPop popbox' : 'popbox'"
          @click="tapNum(index, item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="posPop">
        <i class="iconfont icon-pm_auction_defeat" @click="show = false"></i>
      </div>
    </van-popup>
    <van-popup
      v-model="showCard"
      :style="{ width: '100%', height: '100%', overflow: auto, background: '#f2f2f2' }"
      position="right"
    >
      <van-nav-bar title="厂家店铺" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
      <div class="Cardimg">
        <div style="text-align: left;">营业执照</div>
        <div class="posI" @click="tapshowImg(producer.business_license_url)">
          <div v-for="(item, index) in producer.business_license_url" :key="index">
            <img :src="item" alt="" style="width: 9.63rem; max-height: 14.06rem;" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import managementIndex_controller from './managementIndex_controller';

export default managementIndex_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#managementIndex {
  .Cardimg {
    margin: 1.2rem 1.53rem;
  }

  .posI {
    display: flex;
    margin-top: 0.91rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .pop {
    display: flex;
    flex-wrap: wrap;
    padding: 1.91rem 0.84rem 1.91rem 0.84rem;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 0.63rem;

    .popbox {
      margin-bottom: 1rem;
      padding: 0.34rem 0.78rem;
      font-size: 0.81rem;
      margin-left: 0.4rem;
    }

    .tapPop {
      background: #f14e4e;
      border-radius: 0.19rem;
      color: #fff;
    }
  }

  .posPop {
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 40px;
      color: #fff;
    }
  }

  .t_pos {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.81rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;

    .t_pos_btn {
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        color: #f14e4e;
        margin-right: 0.53rem;
        font-size: 20px;
      }
    }
  }

  .t_box {
    width: 100%;
    height: 12.81rem;
    background: #fff;

    .t_box_top {
      height: 5.09rem;
      width: 100%;
      background-image: linear-gradient(0deg, #f14e4e 0%, #ec5e25 100%);
    }

    .t_box_img {
      width: 4.38rem;
      height: 4.38rem;
      margin: -3.38rem auto;

      img {
        width: 4.38rem;
        height: 4.38rem;
      }
    }

    .t_box_c {
      margin-top: 5rem;
      display: flex;
      flex-direction: column;

      .storename {
        font-size: 1.06rem;
        color: #333;
      }

      .adress {
        font-size: 0.69rem;
        color: #333;
      }

      .tell {
        font-size: 0.69rem;
        color: #333;
        margin-left: 1.31rem;

        .tell_i {
          color: #f14e4e;
        }
      }

      .t_box_c_box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.81rem;

        .t_box_c_start {
          height: 1.44rem;
          border-radius: 0.13rem;
          border: solid 0.03rem #f14e4e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.34rem 0.28rem;

          i {
            color: #f14e4e;
            margin-right: 0.19rem;
            font-size: 20px;
          }
        }
      }
    }
  }

  .t_bottom {
    padding: 0.88rem 0.91rem;
    background: #fff;
    margin-bottom: 1.75rem;

    .lis {
      width: 100%;
      height: 8.88rem;
      border-bottom: 0.03rem solid #f2f2f2;
      display: flex;
      padding: 1.19rem 0 0.94rem 0;

      .lisLeft {
        width: 5.63rem;
        height: 5.63rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .lisRight {
        flex: 1;
        margin-left: 0.59rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .lisRight_t {
          font-size: 0.88rem;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-align: left;
        }

        .lisrRight_tt {
          font-size: 0.75rem;
          color: #f14e4e;
          text-align: left;
          margin: 0.59rem 0 1.25rem 0;
        }

        .lisrRight_m {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .left_m {
            text-align: left;

            .left_m_t {
              font-size: 0.75rem;
              color: #666;

              .left_m_o {
                font-size: 0.75rem;
                color: #666;
                text-decoration: line-through;
              }

              .left_m_u {
                font-size: 0.94rem;
                color: #f14e4e;
              }
            }
          }

          .right_m {
            height: 1.69rem;
            background-color: #f14e4e;
            border-radius: 0.84rem;
            padding: 0.44rem 0.66rem;
            font-size: 0.88rem;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;

            .left_m_t {
              font-size: 0.75rem;
              color: #666;

              .left_m_o {
                font-size: 0.75rem;
                color: #666;
                text-decoration: line-through;
              }
            }
          }
        }
      }
    }
  }
}
</style>
