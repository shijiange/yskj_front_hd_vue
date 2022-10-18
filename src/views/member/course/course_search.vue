<template>
  <div id="course"
       style="background-color: white;">
    <c-title :hide="false"
             text="精选推荐课程"></c-title>
    <div class="box01">
      <div class="Search-box"
           :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
        <i slot="icon"
                 class="iconfont icon-sousuo"
                 style="position: absolute; right: 2.25rem; z-index: 8888; font-size: 16px; color: #c9c9c9;"
                 @click="getData"></i>
        <input type="text"
               class="s_input input_enter_placeholder"
               placeholder="搜索课程/讲师"
               v-model="searchVal" />
      </div>
      <ul class="screen" :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
        <li class="whole" :class="[!filter_order?'activeColor':'']" @click="getDataBth('')">全部</li>
        <li class="sales_volume"  @click="getDataBth('sales')">
          <div class="left" :class="[(filter_order==='sales_asc'||filter_order==='sales_desc')?'activeColor':'']">销量</div>
          <div class="right">
            <i class='fa fa-angle-up' :class="[(filter_order==='sales_asc')?'activeColor':'']"></i>
            <i class='fa fa-angle-down' :class="[(filter_order==='sales_desc')?'activeColor':'']"></i>
          </div>
        </li>
        <li class="price" @click="getDataBth('price')">
          <div class="left" :class="[(filter_order==='price_asc'||filter_order==='price_desc')?'activeColor':'']">价格</div>
          <div class="right">
            <i class='fa fa-angle-up' :class="[(filter_order==='price_asc')?'activeColor':'']"></i>
            <i class='fa fa-angle-down' :class="[(filter_order==='price_desc')?'activeColor':'']"></i>
          </div>
        </li>
      </ul>
      <div class="full_video">
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <ul class="full_video_list">
            <li  v-for="(item,i) in goodsList"
                  :key='i'
                  @click="goToDetail(item.goods_id)">
              <div class="full_video_left">
                <img :src="item.thumb"  alt="">
              </div>
              <div class="full_video_right">
                <div class="video_name">{{ item.title }}</div>
                <div class="full_video_bottom">
                  <div class="leftContent">
                    <div class="pitch_number">共{{ item.course_chapter_num }}小节</div>
                    <div class="left" v-if="item.has_one_lecturer"> 讲师：{{ item.has_one_lecturer.real_name }}</div>
                  </div>
                  <div class="price" v-if="item.vip_level_status&&item.vip_level_status.status==1">
                    {{$i18n.t('money')}} <span class="cost2">{{ item.vip_level_status.word }}</span>
                  </div>
                  <div class="price" v-else>{{$i18n.t('money')}} {{ item.price }}</div>
                  <!--                  <div class="gratis">免费</div>-->
                </div>
              </div>
            </li>
          </ul>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import course_search_controller from "./course_search_controller";
export default course_search_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.Search-box {
  width: 100%;
  height: 2.8125rem;
  line-height: 2.8125rem;
  position: fixed;
  background-color: #fff;
  z-index: 98;
}

.screen {
  width: 100%;
  position: fixed;
  top: 5rem;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: solid 0.0625rem #ebebeb;
  z-index: 10;

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    border-right: 1px solid #e5e5e5;
    margin-top: 0.969rem;
    margin-bottom: 0.969rem;
    line-height: 0.844rem;
    height: 0.844rem;
    font-size: 0.875rem;
    color: #666;

    .right {
      padding-left: 0.344rem;
      display: flex;
      align-items: center;
      flex-direction: column;

      i {
        line-height: 0.5rem;
        height: 0.5rem;
        font-size: 0.4rem;
      }
    }
  }

  li:nth-last-of-type(1) {
    border: none;
  }

  .activeColor {
    color: #ff972c;
  }
}

.full_video {
  background: #fff;
  padding-top: 6rem;

  .full_video_list {
    margin-left: 0.781rem;
    margin-right: 0.781rem;

    li {
      padding-left: 0.375rem;
      border-bottom: 1px solid #f2f2f7;
      padding-bottom: 0.906rem;
      margin-bottom: 0.781rem;
      display: flex;

      .full_video_left {
        width: 6.281rem;
        height: 6.281rem;
        margin-right: 1.156rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .full_video_right {
        flex: 1;
        position: relative;
        padding-top: 0.2rem;

        .video_name {
          text-align: left;
          line-height: 1rem;
          height: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 0.25rem;
        }

        .full_video_bottom {
          position: absolute;
          bottom: 0.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .leftContent {
            .pitch_number {
              text-align: left;
              height: 0.9rem;
              line-height: 0.9rem;
              font-size: 0.875rem;
              color: #999;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 8rem;
            }

            .left {
              width: 8rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 0.75rem;
              color: #999;
              text-align: left;
            }
          }

          .price {
            width: 6rem;
            white-space: nowrap;
            overflow: hidden;
            line-height: 0.938rem;
            height: 0.938rem;
            text-overflow: ellipsis;
            font-size: 0.875rem;
            color: #e20606;
            margin-right: 0.563rem;
            text-align: right;

            .cost2 {
              color: #ccc;
              font-size: 0.75rem;
              padding-left: 0.4rem;
            }
          }

          .gratis {
            width: 6rem;
            white-space: nowrap;
            overflow: hidden;
            line-height: 0.938rem;
            height: 0.938rem;
            text-overflow: ellipsis;
            color: #ff9d27;
            font-size: 0.875rem;
            text-align: right;
            margin-right: 0.563rem;
          }
        }
      }
    }
  }

  .video_more {
    font-size: 0.799rem;
    line-height: 0.938rem;
    height: 0.938rem;
    color: #999;
    padding-bottom: 1.531rem;
  }
}

li {
  list-style: none;
}

input {
  border: none;
  width: 90%;
  height: 1.75rem;
  line-height: 1.75rem;
  border-radius: 0.9375rem;
  padding: 0 1.125rem 0 1.125rem;
  margin: 0 auto;
  position: relative;
  top: 0;
  background-color: #fafafa;
}

.Recommend,
.Hot,
.Newest {
  background-color: white;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.touxiang {
  width: 5rem;
  height: 5rem;
  background-color: green;
  float: left;
}

.content {
  padding-top: 0.625rem;
}

.title {
  width: calc(100% - 6.75rem);
  float: left;
  text-align: left;
  margin-left: 0.75rem;
  padding-right: 0.875rem;
}

.title02 {
  color: #999;
  font-size: 12px;
  margin-bottom: 0.125rem;
}

.title01 {
  margin-bottom: 0.5rem;
  font-size: 15px;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.lecturer {
  float: left;
  color: #999;
  font-size: 12px;
}

.cost {
  float: right;
  color: #f15353;
  line-height: 1rem;
  font-size: 14px;
}

.cost1 {
  font-size: 0.75rem;
  background: #f15353;
  color: white;
  padding: 0.2rem 0.5rem;
  border-top-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

#course {
  .course {
    margin-top: 2.5rem;
  }
}
</style>
