<template>
  <div :class="className" :style="{'backgroundColor':datas.preview_color}">
    <!-- style -->
    <div v-html="css"></div>
    <!-- 商品组 列表 -->
    <div class="u_goodslist" v-if="datas.preview_color">

      <div class="u_goodslist_two" v-if="datas.sort_style.choose_icon == 1">
        <!-- 大图样式 -->
        <!-- 大图失效的 两种样式 是一样-->
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <div class="u_goodslist_two_child big u_goodslist_two_child_only" v-for="(item, index) in datas.list.data" :key="index" v-if="item && item.stock_status === 0 || datas.disable_good != 0" @click.stop.prevent="gotoDetail(item)">
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
            <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
            <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
            <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
          </div>
          <img :src="item.img || emptyImage" alt="" class="goodsImg">
          <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '50px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
            <!-- 限时抢购 -->
            <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
            <!-- 包邮 -->
            <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
            <!-- 热销 -->
            <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
            <!-- 新上 -->
            <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
            <!-- 推荐 -->
            <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
            <!-- 自定义 -->
            <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
          </div>
          <div class="twoChild_bottom">
            <div class="twoChild_top time-box" v-if="item.start_time || item.end_time">
              <i class="iconfont icon-ht_qd_miaosha" style="margin: 0 5px;" v-if="!checkTime(item.start_time)"></i>
              <span style="display: block;" v-if="checkTime(item.start_time)">距开始</span>
              <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
              <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
            <div class="Child_title" style="color: #fff;" v-if="datas.content_list.includes('1')">
              {{item.name|escapeTitle}}
            </div>
            <div class="twoChild_line">
              <div class="posRed" style="width: 40%;">库存仅剩{{item.stock}}件</div>
            </div>
            <div class="Child_other">
              <!--<div class="oneChild_sales" style="color:#fff;" v-if="datas.content_list.includes('7')">销量 8888</div>-->
              <!--<div class="oneChild_activity" style="color:#fff;"-->
                   <!--v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">赠送xx积分-->
              <!--</div>-->
              <!--<div class="oneChild_activity" style="color:#fff;" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
            </div>
            <!--<div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 XX.00</div>-->
            <div class="Child_price">
              <div class="Child_now_price" :style="{width: datas.button_type == 0 ? '100%' : '70%'}">
                <span v-if="datas.content_list.includes('3')" :style="{fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</span>
                <em class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</em></div>
              <div class="Child_buyBtn">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template>
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_three" v-if="datas.sort_style.choose_icon == 2">
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <!-- 双排样式 -->
        <div class="u_goodslist_three_child " v-for="(item, index) in datas.list.data" :key="index" v-if="item && item.stock_status === 0 || datas.disable_good != 0" @click.stop.prevent="gotoDetail(item)">
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
            <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
            <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
            <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
          </div>
          <div class="threeChild_top">
            <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '35px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
            </div>
            <img :src="item.img || emptyImage" alt="" class="goodsImg">
            <div class="twoChild_topPos time-box" v-if="item.start_time || item.end_time">
              <i class="iconfont icon-ht_qd_miaosha" style="margin: 0 5px;" v-if="!checkTime(item.start_time)"></i>
              <span style="display: block;" v-if="checkTime(item.start_time)">距开始</span>
              <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
              <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{item.name|escapeTitle}}
            </div>
            <div class="Child_other">
              <!--<div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 8888</div>-->
              <div class="twoChild_line">
                <div class="posRed" style="width: 40%;">仅剩{{item.stock}}件</div>
              </div>
              <!--<div class="oneChild_activity"-->
                   <!--v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">赠送xx积分-->
              <!--</div>-->
              <!--<div class="oneChild_activity" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
            </div>
            <!-- <div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div> -->
            <div class="Child_price">
              <div class="Child_now_price" :style="{width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%', fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}" v-if="datas.content_list.includes('3')"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3')"></div>
              <div class="Child_buyBtn">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template>
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_one" v-if="datas.sort_style.choose_icon == 3">
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <!-- 横排样式 -->
        <div class="u_goodslist_one_child " v-for="(item, index) in datas.list.data" :key="index" v-if="item && item.stock_status === 0 || datas.disable_good != 0" @click.stop.prevent="gotoDetail(item)">
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
            <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
            <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
            <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
          </div>
          <div class="oneChild_left">
            <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '30px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
            </div>
            <img :src="item.img || emptyImage" alt="">
            <div class="twoChild_topPos time-box" v-if="item.start_time || item.end_time">
              <i class="iconfont icon-ht_qd_miaosha" style="font-size: 12px;" v-if="!checkTime(item.start_time)"></i>
              <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time" style="width: 15px;">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time" style="width: 15px;">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
              <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time" style="width: 15px;">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time" style="width: 15px;">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="oneChild_right">
            <div class="oneChild_r_flextop">
              <div class="Child_title" v-if="datas.content_list.includes('1')">
                {{item.name|escapeTitle}}
              </div>
              <div class="Child_other">
                <!--<div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 8888</div>-->
                <div class="twoChild_line">
                  <div class="posRed" style="width: 40%;">仅剩{{item.stock}}件</div>
                </div>
                <!--<div class="oneChild_activity"-->
                     <!--v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">赠送xx积分-->
                <!--</div>-->
                <!--<div class="oneChild_activity" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
              </div>
            </div>
            <div class="oneChild_r_flexbottom">
              <!-- <div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div> -->
              <div class="Child_price">
                <div class="Child_now_price" :style="{width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%', fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}" v-if="datas.content_list.includes('3')"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</div>
                <div class="Child_now_price" v-if="!datas.content_list.includes('3')"></div>
                <div class="Child_buyBtn">
                  <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                    <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template>
                    <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                    <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                  </div>
                </div>
              </div>
              <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_four" v-if="datas.sort_style.choose_icon == 4">
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <!-- 三排排序样式 -->
        <div class="u_goodslist_four_child " v-for="(item, index) in datas.list.data" :key="index" v-if="item && item.stock_status === 0 || datas.disable_good != 0" @click.stop.prevent="gotoDetail(item)">
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
            <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
            <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
            <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
          </div>
          <div class="threeChild_top">
            <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '25px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
            </div>
            <img :src="item.img || emptyImage" alt="" class="goodsImg">
            <div class="twoChild_topPosThr time-box" v-if="item.start_time || item.end_time">
              <i class="iconfont icon-ht_qd_miaosha" style="font-size: 12px;" v-if="!checkTime(item.start_time)"></i>
              <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
              <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{item.name|escapeTitle}}
            </div>
            <div class="Child_other">
              <!--<div class="oneChild_sales" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">-->
                <!--赠送xx积分-->
              <!--</div>-->
              <!--<div class="oneChild_sales" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
              <!--<div class="oneChild_activity" v-if="datas.content_list.includes('7')">销量 8888</div>-->
              <div class="twoChild_line">
                <div class="posRed" style="width: 40%; border-radius: 10px;">{{item.stock}}件</div>
              </div>
            </div>
            <!-- <div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div> -->
            <div class="Child_price">
              <div class="Child_now_price" :style="{width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%', fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}" v-if="datas.content_list.includes('3')"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3')"></div>
              <div class="Child_buyBtn" v-if="datas.button_type != 1 && datas.button_type!=2">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <!-- 三排没有样式1、样式2的购买按钮 -->
                  <!-- <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template> -->
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_four  u_goodslist_five" v-if="datas.sort_style.choose_icon == 5" @scroll="orderScroll">
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <!-- 三排滑动样式 -->
        <div class="u_goodslist_four_child u_goodslist_five_child" v-for="(item, index) in datas.list.data" :key="index" v-if="item && item.stock_status === 0 || datas.disable_good != 0" @click.stop.prevent="gotoDetail(item)">
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
            <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
            <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
            <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
          </div>
          <div class="threeChild_top">
            <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '25px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
            </div>
            <img :src="item.img || emptyImage" alt="" class="goodsImg">
            <div class="twoChild_topPosThr time-box" v-if="item.start_time || item.end_time">
              <i class="iconfont icon-ht_qd_miaosha" style="font-size: 12px;" v-if="!checkTime(item.start_time)"></i>
              <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
              <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                <template #default="timeData">
                  <span class="time">{{ timeData.days }}</span>
                  <span class="colon">天</span>
                  <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.minutes }}</span>
                  <span class="colon">:</span>
                  <span class="time">{{ timeData.seconds }}</span>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{item.name|escapeTitle}}
            </div>
            <div class="Child_other">
              <!--<div class="oneChild_sales" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">-->
                <!--赠送xx积分-->
              <!--</div>-->
              <!--<div class="oneChild_sales" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
              <!--<div class="oneChild_activity" v-if="datas.content_list.includes('7')">销量 8888</div>-->
              <div class="twoChild_line">
                <div class="posRed" style="width: 40%; border-radius: 10px;">{{item.stock}}件</div>
              </div>
            </div>
            <!-- <div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div> -->
            <div class="Child_price">
              <div class="Child_now_price" :style="{width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%', fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}" v-if="datas.content_list.includes('3')"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3')"></div>
              <div class="Child_buyBtn" v-if="datas.button_type != 1 && datas.button_type!=2">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <!-- 三排没有样式1、样式2的购买按钮 -->
                  <!-- <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template> -->
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_six" v-if="datas.sort_style.choose_icon == 6">
        <div v-if="datas.list.data.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem 0;"
          />
        </div>
        <!-- 一大两小 -->
        <template v-for="(item, index) in datas.list.data" v-if="item && item.stock_status === 0 || datas.disable_good != 0">
          <div class="u_goodslist_two" style="margin: 5px;" v-if="index % 3 == 0" :key="index">
            <!-- 大图样式 -->
            <div class="u_goodslist_two_child"  @click.stop.prevent="gotoDetail(item)">
              <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
                <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
                <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
                <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
              </div>
              <img :src="item.img || emptyImage" alt="" class="goodsImg">
              <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '50px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
                <!-- 限时抢购 -->
                <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
                <!-- 包邮 -->
                <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
                <!-- 热销 -->
                <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
                <!-- 新上 -->
                <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
                <!-- 推荐 -->
                <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
                <!-- 自定义 -->
                <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">

              </div>
              <div class="twoChild_bottom">
                <div class="twoChild_top time-box" v-if="item.start_time || item.end_time">
                  <i class="iconfont icon-ht_qd_miaosha" style="margin: 0 5px;" v-if="!checkTime(item.start_time)"></i>
                  <span style="display: block;" v-if="checkTime(item.start_time)">距开始</span>
                  <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                    <template #default="timeData">
                      <span class="time">{{ timeData.days }}</span>
                      <span class="colon">天</span>
                      <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.minutes }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.seconds }}</span>
                    </template>
                  </van-count-down>
                  <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                    <template #default="timeData">
                      <span class="time">{{ timeData.days }}</span>
                      <span class="colon">天</span>
                      <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.minutes }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.seconds }}</span>
                    </template>
                  </van-count-down>
                </div>
                <div class="Child_title" style="color: #fff;" v-if="datas.content_list.includes('1')">
                  {{item.name|escapeTitle}}
                </div>
                <div class="Child_other">
                  <!--<div class="oneChild_sales" style="color:#fff;" v-if="datas.content_list.includes('7')">销量 8888</div>-->
                  <div class="twoChild_line">
                    <div class="posRed" style="width: 40%; border-radius: 10px;">库存仅剩{{item.stock}}件</div>
                  </div>
                  <!--<div class="oneChild_activity" style="color:#fff;"-->
                       <!--v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">赠送xx积分-->
                  <!--</div>-->
                  <!--<div class="oneChild_activity" style="color:#fff;" v-if="datas.content_list.includes('5')">赠送xx爱心值-->
                  <!--</div>-->
                </div>
                <!--<div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div>-->
                <div class="Child_price">
                  <div class="Child_now_price" :style="{width: datas.button_type == 0 ? '100%' : '70%'}">
                    <span v-if="datas.content_list.includes('3')" :style="{fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</span>
                    <em class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</em></div>
                  <div class="Child_buyBtn">
                    <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                      <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template>
                      <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                      <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="u_goodslist_three" v-if="index % 3 != 0" :key="index">
            <!-- 双排样式 -->
            <div class="u_goodslist_three_child"  @click.stop.prevent="gotoDetail(item)">
              <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1?'failure_cover':'']">
                <div v-if="item.stock_status==1" class="Failure_text">{{$i18n.t('售罄')}}</div>
                <div v-if="item.stock_status==2" class="Failure_text">{{$i18n.t('已下架')}}</div>
                <div v-if="item.stock_status==3 || item.stock_status==4" class="Failure_text">{{$i18n.t('不存在')}}</div>
              </div>
              <div class="threeChild_top time-box">
                <div class="good_Attributes" :style="{width: datas.good_tag.choose_icon ==7? '35px':'',height: datas.good_tag.choose_icon ==7? 'auto':''}">
                  <!-- 限时抢购 -->
                  <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon ==5" alt="">
                  <!-- 包邮 -->
                  <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon ==4" alt="">
                  <!-- 热销 -->
                  <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon ==2" alt="">
                  <!-- 新上 -->
                  <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon ==3" alt="">
                  <!-- 推荐 -->
                  <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon ==1" alt="">
                  <!-- 自定义 -->
                  <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon ==7" alt="">
                </div>
                <img :src="item.img || emptyImage" alt="" class="goodsImg">
                <div class="twoChild_topPos" v-if="item.start_time || item.end_time">
                  <i class="iconfont icon-ht_qd_miaosha" style="margin: 0 5px;" v-if="!checkTime(item.start_time)"></i>
                  <span style="display: block;" v-if="checkTime(item.start_time)">距开始</span>
                  <van-count-down :time="(item.start_time *1000) - Date.parse(new Date())" v-if="checkTime(item.start_time)">
                    <template #default="timeData">
                      <span class="time">{{ timeData.days }}</span>
                      <span class="colon">天</span>
                      <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.minutes }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.seconds }}</span>
                    </template>
                  </van-count-down>
                  <van-count-down :time="(item.end_time *1000) - Date.parse(new Date())" v-else>
                    <template #default="timeData">
                      <span class="time">{{ timeData.days }}</span>
                      <span class="colon">天</span>
                      <span class="time" style="width: 15px;">{{ timeData.hours }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.minutes }}</span>
                      <span class="colon">:</span>
                      <span class="time">{{ timeData.seconds }}</span>
                    </template>
                  </van-count-down>
                </div>
              </div>
              <div class="threeChild_b">
                <div class="Child_title" v-if="datas.content_list.includes('1')">
                  {{item.name|escapeTitle}}
                </div>
                <div class="Child_other">
                  <!--<div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 8888</div>-->
                  <div class="twoChild_line">
                    <div class="posRed" style="width: 40%; border-radius: 10px;">仅剩{{item.stock}}件</div>
                  </div>
                  <!--<div class="oneChild_activity"-->
                       <!--v-if="!datas.content_list.includes('5') && datas.content_list.includes('6')">赠送xx积分-->
                  <!--</div>-->
                  <!--<div class="oneChild_activity" v-if="datas.content_list.includes('5')">赠送xx爱心值</div>-->
                </div>
                <!-- <div class="Child_member_price" v-if="datas.content_list.includes('4')">会员价 500.00</div> -->
                <div class="Child_price">
                  <div class="Child_now_price" :style="{width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%', fontSize: item.vip_level_status&&item.vip_level_status.status==1 ? '12px': ''}" v-if="datas.content_list.includes('3')"><em>{{$i18n.t('money')}}</em> {{ item.vip_level_status&&item.vip_level_status.status==1?item.vip_level_status.word:item.pricenow }}</div>
                  <div class="Child_now_price" v-if="!datas.content_list.includes('3')"></div>
                  <div class="Child_buyBtn">
                    <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                      <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template>
                      <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3||datas.button_type==4"></i>
                      <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5||datas.button_type==6"></i>
                    </div>
                  </div>
                </div>
                <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold!=item.pricenow">{{$i18n.t('money')}}{{item.priceold}}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div style="clear: both;"></div>

      <div :style="{ backgroundColor: datas.preview_color }" v-if="datas.sort_style.choose_icon != 5">
        <div class="loadMore" v-if="isLoadMore" @click="getMoreData">
          {{ $i18n.t("加载更多") }}
        </div>
        <div class="loadMore" v-if="lastIndex == index && allLoaded">{{ $i18n.t("没有更多了") }}~~</div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";
// 自定义样式
const css = function () {
  if(this.datas.preview_color) {
    const {
      preview_color,
      padding_top,
      padding_bottom,
      padding_left,
      padding_right,
      item_radius,
      show_shadow,
      show_border,
      time_color,
      border_color,
      button_bg_color,
      button_color,
    } = this.datas;

    return `
        .component-${this.id} .u_goodslist{
            background-color: ${preview_color};
            padding-top: ${padding_top}px;
            padding-bottom: ${padding_bottom}px;
            padding-left: ${padding_left}px;
            padding-right: ${padding_right}px;
        }

        .component-${this.id} .u_goodslist .Child_buyBtn {
            color: ${button_color}
        }

        .component-${this.id} .u_goodslist .buyBtn_1 {
            background-color: ${button_bg_color};
        }

        .component-${this.id} .u_goodslist .Child_buyBtn .buyBtn_2, .component-${this.id} .u_goodslist .Child_buyBtn .buyBtn_4, .component-${this.id} .u_goodslist .Child_buyBtn .buyBtn_6 {
            border: solid 0.5px ${button_bg_color};
            color: ${button_bg_color};
        }

        .component-${this.id} .u_goodslist .buyBtn_3, .component-${this.id} .u_goodslist .buyBtn_5 {
            color: ${button_color};
            background-color: ${button_bg_color};
        }

        .component-${this.id} .u_goodslist .buyBtn_4, .component-${this.id} .u_goodslist .buyBtn_6 {
            color: ${button_color};
            border: solid 0.5px ${button_color};
        }

        .component-${this.id} .u_goodslist_two_child, .component-${this.id} .u_goodslist_three_child, .component-${this.id} .u_goodslist_four_child, .component-${this.id} .u_goodslist_one_child {
            border-radius: ${item_radius}px;
        }

        .component-${this.id} .u_goodslist .Failure {
            border-radius: 0;
        }

        .component-${this.id} .u_goodslist_one_child .Failure {
            border-radius: 0;
        }

        .component-${this.id} .u_goodslist_two_child.big, .component-${this.id} .u_goodslist_one_child  {
            border: ${show_border?'1':'0'}px solid ${border_color};
            box-shadow: ${show_shadow?'1':'0'}px ${show_shadow?'1':'0'}px ${show_shadow?'5':'0'}px ${border_color};
        }

        .component-${this.id} .u_goodslist_one_child .oneChild_right {
            border-radius: 0 ${item_radius}px ${item_radius}px 0;
        }

        .component-${this.id} .time-box .time{
            color: ${time_color};
        }
    `;
  }
};

export default {
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
      emptyImage,
      isLoadMore: true
    };
  },
  props: ['id', 'datas', 'styles', 'languages', 'plugin_active','isBottom','lastIndex','index','page_id','component_key','tabcontrol','fatherTitle'],
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    }
  },
  methods: {
    checkTime(start) {
      if(start) {
        // let time = new Date(start.replace(/-/g, "/"));
        // time = time.getTime() / 1000;
        if (new Date().getTime()/1000 < start) {
          return true;
        } else {
          return false;
        }
      }else {
        return false;
      }
    },
    //商品跳转
    gotoDetail(good) {
      let url = '';
      let params = {id: good.id};
      switch (good.plugin_id) {
      case 69:
        url = "grab_group";//抢团
        break;
      case 78:
        params.mode = 1;
        url = "newRetailSalesGood";//新零售
        break;
      default:
        url = "goods";
        break;
      }
      zhuge.track(this.fatherTitle+'-点击商品',{
          '商品名称':good.name,
          '商品id':''+good.id,
          '商品价格':good.pricenow
      });
      this.$router.push(this.fun.getUrl(url, params));
    },
    orderScroll() {
      let fixedDom = document.getElementsByClassName(`u_goodslist_five_child-${this.id}`)[0];
      let list = this.datas.list.data ? this.datas.list.data : this.datas.list;
      if (fixedDom.getClientRects()[0].x - fixedDom.offsetLeft < -(list.length - 5) * (this.clientWidth / 3)) {
        // 加载更多
        if (this.isLoadMore) {
          this.getMoreData();
        }
      }
    },
    // 获取更多数据
    getMoreData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
          decorate_id: this.page_id || this.$store.state.temp.item.id,
          component_id: this.id,
          component_key: this.component_key
        };
        if (this.tabcontrol) {
          json.component_info = JSON.stringify({ list_key: this.index });
        }
        $http.get('home-page.get-decorate-page', json, 'loading').then(
          response => {
            if (response.result === 1) {
              if (this.tabcontrol) {
                let data = response.data[0].remote_data.list;
                this.page = data.current_page;
                this.datas.list.data = this.datas.list.data.concat(data.data);
              } else {
                this.page = response.data.current_page;
                this.datas.list.data = this.datas.list.data.concat(response.data.data); //数组拼接
              }

              if (this.page < this.total_page) {
                this.isLoadMore = true;
              } else {
                this.allLoaded = true;
              }

              if (!this.fun.isTextEmpty(this.datas.get_number) && this.datas.list.data.length > this.datas.get_number) {
                this.datas.list.data = this.datas.list.data.slice(0, this.datas.get_number);
                this.isLoadMore = false;
                this.allLoaded = true;
              }
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              this.allLoaded = true;
            }
          },
          function(response) {
            console.error(response);
            // error callback
          }
        );
      }
    },
    // 会员中心用的
    loadMoreMemberData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
          code: this.plugin_active,
        };
        $http.get('member.member.plugin-data', json, 'loading').then(
          response => {
            if (response.result === 1) {
              let data = response.data.data;
              this.page = data.current_page;
              this.datas.list.data = this.datas.list.data.concat(data.data);
              this.$forceUpdate();
              if (this.page < this.total_page) {
                this.isLoadMore = true;
              } else {
                this.allLoaded = true;
              }
              this.$emit('setLoadMore', this.isLoadMore);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              this.allLoaded = true;
            }
          },
          function(response) {
            console.error(response);
            // error callback
          }
        );
      }
    },
  },

  watch: {
    isBottom: function(newVal, oldVal) {
      // this.lastIndex == this.index判断商品列表是最后一个组件
      if (newVal && this.lastIndex == this.index && this.datas.sort_style.choose_icon != 5 && this.isLoadMore) {
        this.getMoreData();
      }
    }
  },
  mounted() {
    if(this.datas.list.data){
      this.total_page = this.datas.list.last_page;
      this.page = this.datas.list.current_page;
      if (this.total_page <= this.page) {
        this.isLoadMore = false;
        this.allLoaded = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    text-align: left;

    ul {
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      margin: 12/37.5rem 12/37.5rem 3/37.5rem;
      padding: 0;
      width: 100%;
    }
  }

  .u_goodslist {
    /* padding: 0 12px; */
    width: 100%;

    .Failure {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;

      .Failure_text {
        width: 90px;
        height: 90px;
        background-color: #797979;
        border-radius: 100%;
        color: #fff;
        font-size: 20px;
        line-height: 90px;
        text-align: center;
      }
    }

    .u_goodslist_one {
      .u_goodslist_one_child {
        width: 100%;
        padding: 7px 10px;
        display: flex;
        position: relative;
        margin-bottom: 10px;
        background: #fff;

        .failure_cover {
          width: 36%;
        }

        .oneChild_left {
          width: 36%;
          height: 8rem;
          overflow: hidden;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .oneChild_right {
          flex: 1;
          padding-left: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: white;
          padding-right: 4px;

          .oneChild_r_flextop {
            margin-top: 4px;
            margin-bottom: 5px;
          }

          .oneChild_r_flexbottom {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            margin-bottom: 4px;
          }
        }
      }

      .u_goodslist_one_child:last-child {
        margin-bottom: 0;
      }
    }

    .u_goodslist_two {
      .u_goodslist_two_child {
        width: 100%;
        min-height: 300px;
        overflow: hidden;
        position: relative;
        margin: 0 auto 10px;

        .goodsImg {
          width: 100%;

          /* height: 350px; */
          overflow: hidden;
        }

        .twoChild_bottom {
          position: absolute;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          left: 0;
          bottom: 0;
          color: #fff;
          padding: 10px;

          .Child_member_price {
            margin-top: 10px;
          }

          .oneChild_original_price {
            color: #fff;
            font-weight: 400;
          }

          .buyBtn_2,
          .buyBtn_4,
          .buyBtn_6 {
            /* border-color: #fff; */

            /* color: #fff; */
          }

          .twoChild_top {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .time {
              display: inline-block;
              min-width: 19px;
              height: 19px;
              border-radius: 5px;
              background: #fff;
              text-align: center;
              line-height: 19px;
              font-size: 12px;

              /* color: #ff2c29; */
              margin: 3px;
            }
          }
        }
      }

      .u_goodslist_two_child_only:last-child {
        margin: 0 auto;
      }
    }

    .u_goodslist_three {
      justify-content: space-between;
    }

    .u_goodslist_three,
    .u_goodslist_four {
      display: flex;
      flex-wrap: wrap;

      .u_goodslist_three_child,
      .u_goodslist_four_child {
        width: 46.5%;
        height: 50%;

        /* padding: 0 5px; */
        margin: 5px;
        overflow: hidden;
        position: relative;

        .threeChild_top {
          width: 100%;
          height: 11rem;
          overflow: hidden;
          position: relative;

          .goodsImg {
            width: 100%;
            height: 100%;
          }
        }

        .threeChild_b {
          background-color: white;
          padding: 6px 4px;

          .Child_other {
            margin-top: 2px;
            margin-bottom: 8px;
          }
        }
      }

      .u_goodslist_three_child .failure_cover {
        height: 11rem;
        width: 100%;

        /* margin: 0 5px; */
      }

      .u_goodslist_four_child .failure_cover {
        height: 7rem;
        width: 100%;

        /* margin: 0 5px; */

        .Failure_text {
          width: 60px;
          height: 60px;
          font-size: 14px;
          line-height: 60px;
        }
      }

      .u_goodslist_three_child .Failure {
        width: 100%;

        /* margin: 0 5px; */
      }

      .u_goodslist_four_child .Failure {
        width: 100%;

        /* margin: 0 5px; */
      }
    }

    .u_goodslist_four .Child_other {
      margin-bottom: 4px !important;
    }

    .u_goodslist_four_child {
      width: 30.3% !important;

      /* margin-right: 10px; */
      .threeChild_top {
        width: 100% !important;
        height: 7rem !important;
      }

      .Child_price,
      .Child_now_price {
        /* height: 20px; */
        word-break: break-all;
        line-height: 20px;
      }

      .Child_buyBtn {
        .buyBtn {
          height: 20px;
          line-height: 20px;
        }

        .buyBtn_3,
        .buyBtn_4,
        .buyBtn_5,
        .buyBtn_6 {
          width: 20px;
        }
      }
    }

    .u_goodslist_four_child:nth-child(3n) {
      margin-right: 0;
    }

    .u_goodslist_five {
      flex-wrap: nowrap;
      justify-content: flex-start;
      overflow-x: scroll;

      .u_goodslist_five_child {
        flex-shrink: 0;
        position: relative;
      }
    }

    .good_Attributes {
      position: absolute;
      top: 4px;
      left: 4px;
      display: flex;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .Child_title {
      font-size: 14px;
      line-height: 20px;
      height: 40px;
      color: #000;
      font-weight: bold;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .Child_other {
      display: flex;
      flex-direction: column;
      margin-top: 5px;
      margin-bottom: 5px;
      font-size: 12px;
      flex-wrap: wrap;

      .oneChild_sales {
        color: #666;
        margin-right: 14px;
      }

      .oneChild_activity {
        color: #3b3b3b;
      }
    }

    .Child_member_price {
      color: #ff2c29;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
    }

    .Child_price {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      // height: 26px;
      line-height: 26px;

      .Child_now_price {
        color: #ff2c29;
        font-weight: bold;
        font-size: 15px;
        word-break: break-all;

        em {
          font-size: 12px;
        }
      }
    }

    .oneChild_original_price {
      /* height: 12px; */
      text-decoration: line-through;
      color: #999;
      line-height: 12px;
      font-size: 12px;
      word-break: break-all;
    }

    .Child_buyBtn {
      text-align: center;
      font-weight: bold;

      /* color: #fff; */
      .buyBtn {
        height: 26px;
        border-radius: 13.5px;
      }

      .buyBtn_1 {
        width: 76px;

        /* background-color: #3b3b3b; */
      }

      .buyBtn_2 {
        width: 76px;

        /* border: solid 0.5px #363636; */

        /* color: #363636; */
      }

      .buyBtn_3,
      .buyBtn_4,
      .buyBtn_5,
      .buyBtn_6 {
        border-radius: 100%;
        width: 26px;

        i {
          font-size: 12px;
          font-weight: 400;
        }
      }

      .buyBtn_3,
      .buyBtn_5 {
        /* color: #fff; */

        /* background-color: #3b3b3b; */
      }

      .buyBtn_4,
      .buyBtn_6 {
        /* color: #3b3b3b; */

        /* border: solid 0.5px #3b3b3b; */
      }

      .buyBtn_5,
      .buyBtn_6 {
        i {
          font-size: 18px;
        }
      }
    }

    .u_goodslist_one .good_Attributes,
    .u_goodslist_three .good_Attributes {
      width: 60px;
      height: 24px;
    }

    .u_goodslist_two .good_Attributes {
      width: 100px;
      height: 40px;
    }

    .u_goodslist_four .good_Attributes,
    .u_goodslist_five .good_Attributes {
      width: 45px;
      height: 18px;
    }
  }

  .twoChild_line {
    width: 100%;
    height: 18px;
    background-color: #f1f1f1;
    border-radius: 9px;
    margin-top: 8px;
    text-align: left;
    color: #fff;
    line-height: 18px;
    font-size: 10px;
    position: relative;
    text-indent: 5px;

    .posRed {
      word-break: keep-all;
      height: 100%;
      background-color: #ff2c29;
      border-radius: 6px;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
    }
  }

  .twoChild_topPos {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 28px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    display: flex;
    align-items: center;

    /* justify-content: space-around; */
    .time {
      display: inline-block;
      width: 18px;
      height: 18px;
      text-align: center;
      font-size: 12px;
      background-color: #fff;
      border-radius: 5px;
      align-items: center;
      justify-content: center;

      /* color: #ff2c29; */
      margin: 2px;
    }
  }

  .twoChild_topPosThr {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 28px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    display: flex;
    align-items: center;

    /* justify-content: space-around; */
    .time {
      text-align: center;
      display: inline-block;
      width: 15px;
      height: 18px;
      font-size: 11px;
      background-color: #fff;
      border-radius: 5px;
      align-items: center;
      justify-content: center;

      /* color: #ff2c29; */
      margin: 1px;
    }
  }

  .u_goodslist .u_goodslist_six {
    .u_goodslist_two {
      clear: both;
    }

    .u_goodslist_three {
      display: block;
      width: 50%;
      float: left;
    }

    .u_goodslist_three_child {
      width: 94%;
      height: 100%;
    }

    .threeChild_b {
      .Child_title {
        min-height: 37px;
      }
    }
  }

  .colon {
    color: #fff;
  }

  .loadMore {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
  }
</style>
