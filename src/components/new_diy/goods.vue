<template>
  <div :class="className" :style="{ backgroundColor: datas.preview_color }">
    <!-- style -->
    <div v-html="css"></div>

    <!-- 商品组 列表 -->
    <div class="u_goodslist" v-if="datas.preview_color">
      <div class="u_goodslist_two" v-if="datas.sort_style.choose_icon == 1">
        <!-- 大图样式 -->
        <!-- 大图失效的 两种样式 是一样-->
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <div
          class="u_goodslist_two_child big u_goodslist_two_child_only"
          v-for="(item, index) in datas.list.data ? datas.list.data : datas.list"
          :key="index"
          v-if="(item && item.stock_status === 0) || datas.disable_good != 0"
          @click.stop.prevent="gotoDetail(item)"
        >
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
            <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
            <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
            <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
              {{ $i18n.t("不存在") }}
            </div>
          </div>
          <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
          <div
            class="good_Attributes"
            :style="{
              width: datas.good_tag.choose_icon == 7 ? '50px' : '',
              height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
            }"
          >
            <!-- 限时抢购 -->
            <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
            <!-- 包邮 -->
            <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
            <!-- 热销 -->
            <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
            <!-- 新上 -->
            <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
            <!-- 推荐 -->
            <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
            <!-- 自定义 -->
            <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
          </div>
          <div class="twoChild_bottom">
            <div class="Child_title" style="color: #fff;" v-if="datas.content_list.includes('1')">
              {{ item.name | escapeTitle }}
            </div>
            <div class="Child_other">
              <div class="oneChild_sales" style="color: #fff;" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
              <div class="oneChild_activity" style="color: #fff;" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">
                赠送{{ item.point }}{{ integral || "积分" }}
              </div>
              <div
                class="oneChild_activity"
                style="color: #fff;"
                v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))"
              >
                赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
              </div>
            </div>
            <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
              <!--item.notshow 会员中心增加的判断-->
              会员价
              {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
            </div>
            <div class="Child_price">
              <div class="Child_now_price" :style="{ width: datas.button_type == 0 ? '100%' : '70%' }">
                <span
                  :style="{
                    fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                  }"
                  v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
                >
                  <template v-if="!item.point_goods">
                    <em v-if="datas.show_price_text">{{ price_text }}</em
                    ><em>{{ $i18n.t("money") }}</em>
                  </template>
                  {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                  <em v-if="item.point_goods">{{ integral || "积分" }}</em>
                </span>
                <span v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
                  ><em v-if="datas.show_price_text">券后价</em><em>{{ $i18n.t("money") }}</em> {{ item.coupon.deduct_price }}</span
                >
                <em class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods"
                  ><em v-if="datas.show_price_text"> {{ market_price_text }}</em
                  >{{ $i18n.t("money") }}{{ item.priceold }}</em
                >
              </div>
              <div class="Child_buyBtn">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <template v-if="datas.button_type == 1 || datas.button_type == 2">{{ datas.button_title }}</template>
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                </div>
              </div>
            </div>
            <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_three" v-if="datas.sort_style.choose_icon == 2">
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <!-- 双排样式 -->
        <div
          class="u_goodslist_three_child "
          :class="[childComponent == 'tab' ? 'tabMarginSub' : '']"
          v-for="(item, index) in datas.list.data ? datas.list.data : datas.list"
          :key="index"
          v-if="(item && item.stock_status === 0) || datas.disable_good != 0"
          @click.stop.prevent="gotoDetail(item)"
        >
          <div
            class="Failure"
            v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0"
            :class="[datas.disable_good == 1 ? (childComponent == 'tab' ? 'failure_cover_tab' : 'failure_cover') : '']"
          >
            <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
            <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
            <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
              {{ $i18n.t("不存在") }}
            </div>
          </div>
          <div :class="[childComponent == 'tab' && leftShow ? 'threeChild_top_tab' : 'threeChild_top']">
            <div
              class="good_Attributes"
              :style="{
                width: datas.good_tag.choose_icon == 7 ? '35px' : '',
                height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
              }"
            >
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
            </div>
            <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{ item.name | escapeTitle }}
            </div>

            <!-- 海外购 标签-->
            <overseastag :visible="item.overseas" class="goods"/>
            <div class="Child_other">
              <div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
              <div class="oneChild_activity" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">赠送{{ item.point }}{{ integral || "积分" }}</div>
              <div class="oneChild_activity" v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))">
                赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
              </div>
            </div>
            <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
              会员<em style="font-size: 12px;">{{ $i18n.t("money") }}</em>
              {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
            </div>
            <div class="Child_price">
              <div
                class="Child_now_price"
                :style="{
                  width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%',
                  fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                }"
                v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
              >
                <template v-if="!item.point_goods">
                  <em v-if="datas.show_price_text">{{ price_text.substring(0, 1) }}</em
                  ><em>{{ $i18n.t("money") }}</em>
                </template>
                {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                <em v-if="item.point_goods">{{ integral || "积分" }}</em>
              </div>
              <div
                class="Child_now_price"
                :style="{ width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%' }"
                v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
              >
                <em v-if="datas.show_price_text">券</em><em>{{ $i18n.t("money") }}</em> {{ item.coupon.deduct_price }}
              </div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3') && !datas.content_list.includes('8')"></div>
              <div class="Child_buyBtn">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <template v-if="datas.button_type == 1 || datas.button_type == 2">{{ datas.button_title }}</template>
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods">
              <span v-if="datas.show_price_text">{{ market_price_text.substring(0, 1) }}</span
              >{{ $i18n.t("money") }}{{ item.priceold }}
            </div>
            <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_one" v-if="datas.sort_style.choose_icon == 3">
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <!-- 横排样式 -->
        <div
          class="u_goodslist_one_child "
          v-for="(item, index) in datas.list.data ? datas.list.data : datas.list"
          :key="index"
          v-if="(item && item.stock_status === 0) || datas.disable_good != 0"
          @click.stop.prevent="gotoDetail(item)"
        >
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
            <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
            <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
            <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
              {{ $i18n.t("不存在") }}
            </div>
          </div>
          <div class="oneChild_left">
            <div
              class="good_Attributes"
              :style="{
                width: datas.good_tag.choose_icon == 7 ? '30px' : '',
                height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
              }"
            >
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
            </div>
            <img v-lazy="item.img || emptyImage" alt="" />
          </div>
          <div class="oneChild_right">
            <div class="buttons_box">
              <div
                v-if="
                  $store.state.temp.plugin &&
                    $store.state.temp.plugin.goods_show &&
                    $store.state.temp.plugin.goods_show.goods_group &&
                    $store.state.temp.plugin.goods_show.goods_group.includes('collect')
                "
                @click.stop="editFavorite(item.is_favorite, item.id, index)"
              >
                <i class="iconfont " :class="[item.is_favorite == 0 ? 'icon-bc_like_normal' : 'icon-bc_like']"></i>
                <span>收藏</span>
              </div>
              <div
                v-if="
                  $store.state.temp.plugin &&
                    $store.state.temp.plugin.goods_show &&
                    $store.state.temp.plugin.goods_show.goods_group &&
                    $store.state.temp.plugin.goods_show.goods_group.includes('share')
                "
                class="share_buton"
                @click.stop="copyGoodsUrl(item.id)"
              >
                <i class="iconfont icon-fenxiang"></i> <span>分享</span>
              </div>
            </div>
            <div class="oneChild_r_flextop">
              <div class="Child_title" v-if="datas.content_list.includes('1')">
               {{ item.name | escapeTitle }}
              </div>
              <div class="Child_other">
                <div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
                <div class="oneChild_activity" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">赠送{{ item.point }}{{ integral || "积分" }}</div>
                <div class="oneChild_activity" v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))">
                  赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
                </div>
              </div>
            </div>
            <div class="oneChild_r_flexbottom">
              <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
                会员价
                {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
              </div>
              <div class="Child_price">
                <div
                  class="Child_now_price"
                  :style="{
                    width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%',
                    fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                  }"
                  v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
                >
                  <template v-if="!item.point_goods">
                    <em v-if="datas.show_price_text">{{ price_text }}</em
                    ><em>{{ $i18n.t("money") }}</em>
                  </template>
                  {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                  <em v-if="item.point_goods">{{ integral || "积分" }}</em>
                </div>
                <div
                  class="Child_now_price"
                  :style="{ width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%' }"
                  v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
                >
                  <em v-if="datas.show_price_text">券后价</em><em>{{ $i18n.t("money") }}</em>
                  {{ item.coupon.deduct_price }}
                </div>
                <div class="Child_now_price" v-if="!datas.content_list.includes('3') && !datas.content_list.includes('8')"></div>
                <div class="Child_buyBtn">
                  <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                    <template v-if="datas.button_type == 1 || datas.button_type == 2">{{ datas.button_title }}</template>
                    <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                    <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                  </div>
                </div>
              </div>
              <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods">
                <span v-if="datas.show_price_text">{{ market_price_text }}</span
                >{{ $i18n.t("money") }}{{ item.priceold }}
              </div>
              <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
                <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_four" v-if="datas.sort_style.choose_icon == 4" :class="[childComponent == 'tab' ? 'diytab' : '']">
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <!-- 三排排序样式 -->
        <!-- :class="[childComponent == 'tab'?'diytab':'']" -->
        <div
          class="u_goodslist_four_child "
          v-for="(item, index) in datas.list.data ? datas.list.data : datas.list"
          :key="index"
          v-if="(item && item.stock_status === 0) || datas.disable_good != 0"
          @click.stop.prevent="gotoDetail(item)"
          :style="{ width: childComponent == 'tab' ? '31.3% !important' : '' }"
        >
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
            <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
            <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
            <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
              {{ $i18n.t("不存在") }}
            </div>
          </div>
          <div :class="[childComponent == 'tab' && leftShow ? 'threeChild_top_tab' : 'threeChild_top']">
            <div
              class="good_Attributes"
              :style="{
                width: datas.good_tag.choose_icon == 7 ? '25px' : '',
                height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
              }"
            >
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
            </div>
            <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{ item.name | escapeTitle }}
            </div>
            <div class="Child_other">
              <div class="oneChild_sales" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">赠送{{ item.point }}{{ integral || "积分" }}</div>
              <div class="oneChild_sales" v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))">
                赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
              </div>
              <div class="oneChild_activity" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
            </div>
            <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
              会员<em style="font-size: 12px;">{{ $i18n.t("money") }}</em>
              {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
            </div>
            <div class="Child_price">
              <div
                class="Child_now_price"
                :style="{
                  width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%',
                  fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                }"
                v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
              >
                <template v-if="!item.point_goods">
                  <em v-if="datas.show_price_text">{{ price_text.substring(0, 1) }}</em
                  ><em>{{ $i18n.t("money") }}</em>
                </template>
                {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                <em v-if="item.point_goods">{{ integral || "积分" }}</em>
              </div>
              <div
                class="Child_now_price"
                :style="{
                  width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%'
                }"
                v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
              >
                <em v-if="datas.show_price_text">券</em><em>{{ $i18n.t("money") }}</em> {{ item.coupon.deduct_price }}
              </div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3') && !datas.content_list.includes('8')"></div>
              <div class="Child_buyBtn" v-if="datas.button_type != 1 && datas.button_type != 2">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <!-- 三排没有样式1、样式2的购买按钮 -->
                  <!-- <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template> -->
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods">
              <span v-if="datas.show_price_text">{{ market_price_text.substring(0, 1) }}</span
              >{{ $i18n.t("money") }}{{ item.priceold }}
            </div>
            <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_four  u_goodslist_five" v-if="datas.sort_style.choose_icon == 5" @scroll="orderScroll">
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <!-- 三排滑动样式 -->
        <div
          class="u_goodslist_four_child u_goodslist_five_child"
          :class="`u_goodslist_five_child-${id}`"
          v-for="(item, index) in datas.list.data ? datas.list.data : datas.list"
          :key="index"
          v-if="(item && item.stock_status === 0) || datas.disable_good != 0"
          @click.stop.prevent="gotoDetail(item)"
        >
          <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
            <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
            <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
            <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
              {{ $i18n.t("不存在") }}
            </div>
          </div>
          <div :class="[childComponent == 'tab' && leftShow ? 'threeChild_top_tab' : 'threeChild_top']">
            <div
              class="good_Attributes"
              :style="{
                width: datas.good_tag.choose_icon == 7 ? '25px' : '',
                height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
              }"
            >
              <!-- 限时抢购 -->
              <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
              <!-- 包邮 -->
              <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
              <!-- 热销 -->
              <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
              <!-- 新上 -->
              <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
              <!-- 推荐 -->
              <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
              <!-- 自定义 -->
              <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
            </div>
            <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
          </div>
          <div class="threeChild_b">
            <div class="Child_title" v-if="datas.content_list.includes('1')">
              {{ item.name | escapeTitle }}
            </div>
            <div class="Child_other">
              <div class="oneChild_sales" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">赠送{{ item.point }}{{ integral || "积分" }}</div>
              <div class="oneChild_sales" v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))">
                赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
              </div>
              <div class="oneChild_activity" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
            </div>
            <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
              会员<em style="font-size: 12px;">{{ $i18n.t("money") }}</em>
              {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
            </div>
            <div class="Child_price">
              <div
                class="Child_now_price"
                :style="{
                  width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%',
                  fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                }"
                v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
              >
                <template v-if="!item.point_goods">
                  <em v-if="datas.show_price_text">{{ price_text.substring(0, 1) }}</em
                  ><em>{{ $i18n.t("money") }}</em>
                </template>
                {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                <em v-if="item.point_goods">{{ integral || "积分" }}</em>
              </div>
              <div
                class="Child_now_price"
                :style="{
                  width: datas.button_type == 0 || datas.button_type == 1 || datas.button_type == 2 ? '100%' : '75%'
                }"
                v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
              >
                <em v-if="datas.show_price_text">券</em><em>{{ $i18n.t("money") }}</em> {{ item.coupon.deduct_price }}
              </div>
              <div class="Child_now_price" v-if="!datas.content_list.includes('3') && !datas.content_list.includes('8')"></div>
              <div class="Child_buyBtn" v-if="datas.button_type != 1 && datas.button_type != 2">
                <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                  <!-- 三排没有样式1、样式2的购买按钮 -->
                  <!-- <template v-if="datas.button_type == 1||datas.button_type==2">{{datas.button_title}}</template> -->
                  <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                  <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                </div>
              </div>
            </div>
            <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods">
              <span v-if="datas.show_price_text">{{ market_price_text.substring(0, 1) }}</span
              >{{ $i18n.t("money") }}{{ item.priceold }}
            </div>
            <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
              <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="u_goodslist_six" v-if="datas.sort_style.choose_icon == 6">
        <div v-if="(datas.list.data && datas.list.data.length <= 0) || datas.list.length <= 0" style="width: 100%; height: 150px; text-align: center;">
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" />
        </div>
        <!-- 一大两小 -->
        <template v-for="(item, index) in datas.list.data ? datas.list.data : datas.list" v-if="(item && item.stock_status === 0) || datas.disable_good != 0">
          <div class="u_goodslist_two" style="margin: 5px;" v-if="index % 3 == 0" :key="index">
            <!-- 大图样式 -->
            <div class="u_goodslist_two_child" @click.stop.prevent="gotoDetail(item)">
              <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
                <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
                <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
                <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
                  {{ $i18n.t("不存在") }}
                </div>
              </div>
              <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
              <div
                class="good_Attributes"
                :style="{
                  width: datas.good_tag.choose_icon == 7 ? '50px' : '',
                  height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
                }"
              >
                <!-- 限时抢购 -->
                <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
                <!-- 包邮 -->
                <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
                <!-- 热销 -->
                <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
                <!-- 新上 -->
                <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
                <!-- 推荐 -->
                <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
                <!-- 自定义 -->
                <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
              </div>
              <div class="twoChild_bottom">
                <div class="Child_title" style="color: #fff;" v-if="datas.content_list.includes('1')">
                  {{ item.name | escapeTitle }}
                </div>
                <div class="Child_other">
                  <div class="oneChild_sales" style="color: #fff;" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
                  <div class="oneChild_activity" style="color: #fff;" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">
                    赠送{{ item.point }}{{ integral || "积分" }}
                  </div>
                  <div
                    class="oneChild_activity"
                    style="color: #fff;"
                    v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))"
                  >
                    赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
                  </div>
                </div>
                <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
                  会员价
                  {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
                </div>
                <div class="Child_price">
                  <div class="Child_now_price" :style="{ width: datas.button_type == 0 ? '100%' : '70%' }">
                    <span
                      :style="{ fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : '' }"
                      v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
                    >
                      <template v-if="!item.point_goods">
                        <em v-if="datas.show_price_text">{{ price_text }}</em
                        ><em>{{ $i18n.t("money") }}</em>
                      </template>
                      {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                      <em v-if="item.point_goods">{{ integral || "积分" }}</em>
                    </span>
                    <span v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
                      ><em v-if="datas.show_price_text">券后价</em><em>{{ $i18n.t("money") }}</em> {{ item.coupon.deduct_price }}</span
                    >
                    <em class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods"
                      ><em v-if="datas.show_price_text"> {{ market_price_text }}</em
                      >{{ $i18n.t("money") }}{{ item.priceold }}</em
                    >
                  </div>
                  <div class="Child_buyBtn">
                    <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                      <template v-if="datas.button_type == 1 || datas.button_type == 2">{{ datas.button_title }}</template>
                      <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                      <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                    </div>
                  </div>
                </div>
                <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
                  <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="u_goodslist_three" v-if="index % 3 != 0" :key="index">
            <!-- 双排样式 -->
            <div class="u_goodslist_three_child" @click.stop.prevent="gotoDetail(item)">
              <div class="Failure" v-if="datas.disable_good != 0 && item.stock_status && item.stock_status != 0" :class="[datas.disable_good == 1 ? 'failure_cover' : '']">
                <div v-if="item.stock_status == 1" class="Failure_text">{{ $i18n.t("售罄") }}</div>
                <div v-if="item.stock_status == 2" class="Failure_text">{{ $i18n.t("已下架") }}</div>
                <div v-if="item.stock_status == 3 || item.stock_status == 4" class="Failure_text">
                  {{ $i18n.t("不存在") }}
                </div>
              </div>
              <div :class="[childComponent == 'tab' && leftShow ? 'threeChild_top_tab' : 'threeChild_top']">
                <div
                  class="good_Attributes"
                  :style="{
                    width: datas.good_tag.choose_icon == 7 ? '35px' : '',
                    height: datas.good_tag.choose_icon == 7 ? 'auto' : ''
                  }"
                >
                  <!-- 限时抢购 -->
                  <img src="../../assets/images/new_diy/xianshiqianggou@2x.png" v-if="datas.good_tag.choose_icon == 5" alt="" />
                  <!-- 包邮 -->
                  <img src="../../assets/images/new_diy/baoyou@2x.png" v-if="datas.good_tag.choose_icon == 4" alt="" />
                  <!-- 热销 -->
                  <img src="../../assets/images/new_diy/hot@2x.png" v-if="datas.good_tag.choose_icon == 2" alt="" />
                  <!-- 新上 -->
                  <img src="../../assets/images/new_diy/new@2x.png" v-if="datas.good_tag.choose_icon == 3" alt="" />
                  <!-- 推荐 -->
                  <img src="../../assets/images/new_diy/recommend@2x.png" v-if="datas.good_tag.choose_icon == 1" alt="" />
                  <!-- 自定义 -->
                  <img :src="datas.good_tag.image" style="width: 100%;" v-if="datas.good_tag.choose_icon == 7" alt="" />
                </div>
                <img v-lazy="item.img || emptyImage" alt="" class="goodsImg" />
              </div>
              <div class="threeChild_b">
                <div class="Child_title" v-if="datas.content_list.includes('1')">
                  {{ item.name | escapeTitle }}
                </div>
                <div class="Child_other">
                  <div class="oneChild_sales" v-if="datas.content_list.includes('7')">销量 {{ item.sales }}</div>
                  <div class="oneChild_activity" v-if="!datas.content_list.includes('5') && datas.content_list.includes('6') && item.point != 0">赠送{{ item.point }}{{ integral || "积分" }}</div>
                  <div class="oneChild_activity" v-if="datas.content_list.includes('5') && item.award == 1 && (!item.vip_level_status || (item.vip_level_status && item.vip_level_status.status == 0))">
                    赠送{{ item.award_proportion }}{{ item.love_name || "爱心值" }}
                  </div>
                </div>
                <div class="Child_member_price" v-if="datas.content_list.includes('4') && !item.point_goods && !item.notshow">
                  会员<em style="font-size: 12px;">{{ $i18n.t("money") }}</em>
                  {{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price_level == 1 ? item.vip_price : item.vip_next_price }}
                </div>
                <div class="Child_price">
                  <div
                    class="Child_now_price"
                    :style="{
                      width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%',
                      fontSize: item.vip_level_status && item.vip_level_status.status == 1 ? '12px' : ''
                    }"
                    v-if="(datas.content_list.includes('3') && !datas.content_list.includes('8')) || (datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method === 0)"
                  >
                    <template v-if="!item.point_goods">
                      <em v-if="datas.show_price_text">{{ price_text.substring(0, 1) }}</em
                      ><em>{{ $i18n.t("money") }}</em>
                    </template>
                    {{ item.point_goods ? item.point_goods.min_point : item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.pricenow }}
                    <em v-if="item.point_goods">{{ integral || "积分" }}</em>
                  </div>
                  <div
                    class="Child_now_price"
                    :style="{ width: datas.button_type == 1 || datas.button_type == 2 ? '50%' : '80%' }"
                    v-if="datas.content_list.includes('8') && item.coupon && item.coupon.coupon_method !== 0"
                  >
                    <em v-if="datas.show_price_text">券</em><em>{{ $i18n.t("money") }}</em>
                    {{ item.coupon.deduct_price }}
                  </div>
                  <div class="Child_now_price" v-if="!datas.content_list.includes('3') && !datas.content_list.includes('8')"></div>
                  <div class="Child_buyBtn">
                    <div class="buyBtn" :class="`buyBtn_${datas.button_type}`">
                      <template v-if="datas.button_type == 1 || datas.button_type == 2">{{ datas.button_title }}</template>
                      <i class="iconfont icon-gaiicon-" v-if="datas.button_type == 3 || datas.button_type == 4"></i>
                      <i class="iconfont icon-life-game-plus" v-if="datas.button_type == 5 || datas.button_type == 6"></i>
                    </div>
                  </div>
                </div>
                <div class="oneChild_original_price" v-if="datas.content_list.includes('2') && item.priceold != 0 && item.priceold != item.pricenow && !item.point_goods">
                  <span v-if="datas.show_price_text">{{ market_price_text.substring(0, 1) }}</span
                  >{{ $i18n.t("money") }}{{ item.priceold }}
                </div>
                <div class="show_price_box" v-if="!fun.isTextEmpty(item.goods_show)">
                  <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(items, i) in item.goods_show" :key="i">{{ items.name }}:{{ items.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div style="clear: both;"></div>
    </div>
    <div :style="{ backgroundColor: datas.preview_color }" v-if="datas.sort_style.choose_icon != 5 && !childComponent">
      <div class="loadMore" v-if="isLoadMore" @click="getMoreData">
        {{ $i18n.t("加载更多") }}
      </div>
      <div class="loadMore" v-if="lastIndex == index && allLoaded">{{ $i18n.t("没有更多了") }}~~</div>
    </div>
    <div class="tabMoreBox" v-if="childComponent == 'tab'">
      <div v-if="total_page > page" class="tabMore" :style="{ backgroundColor: childStyle.check_more_bg_color, color: childStyle.check_more_color }" @click="getMoreDataTest">查看更多</div>
      <!-- <div v-if="total_page <= page" class="tabMore" :style="{ backgroundColor: childStyle.check_more_bg_color ,color:childStyle.check_more_color }">没有更多了</div> -->
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import emptyImage from "@/assets/images/new_diy/image.png";
import overseastag from '../overseas/tag.vue';
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    const { preview_color, padding_top, padding_bottom, padding_left, padding_right, item_radius, show_shadow, show_border, border_color, button_bg_color, button_color } = this.datas;

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
            border: ${show_border ? "1" : "0"}px solid ${border_color};
            box-shadow: ${show_shadow ? "1" : "0"}px ${show_shadow ? "1" : "0"}px ${show_shadow ? "5" : "0"}px ${border_color};
        }

        .component-${this.id} .u_goodslist_one_child .oneChild_right {
            border-radius: 0 ${item_radius}px ${item_radius}px 0;
        }
    `;
  }
};

export default {
  data() {
    return {
      emptyImage,
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,
      allLoaded: false, // 全部数据已经加载完成
      alreadyHandleArray: [],
      arrIndex: 1,
      integral: "",
      per_page: 12,

      clientWidth: "375",
      fatherTitleNew:""
    };
  },
  components: {
    overseastag
  },
  props: ["isBottom", "lastIndex", "index", "page_id", "id", "datas", "component_key", "tabcontrol", "isLast", "plugin_active", "childComponent", "childStyle", "leftShow", "fatherTitle"],
  // plugin_active是会员中心用的
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
    market_price_text() {
      if (this.$store.state.shopLanguage.goods) {
        // 原价  系统自定义
        return this.$store.state.shopLanguage.goods.market_price || "原价";
      } else {
        return "原价";
      }
    },
    price_text() {
      if (this.$store.state.shopLanguage.goods) {
        // 现价  系统自定义
        return this.$store.state.shopLanguage.goods.price || "现价";
      } else {
        return "现价";
      }
    }
  },
  watch: {
    "datas.list.current_page"(newValue, oldValue) {
      if (this.childComponent == "tab") {
        this.total_page = this.datas.list.last_page;
        this.page = this.datas.list.current_page;
      }
    },
    isBottom: function(newVal, oldVal) {
      console.log(this.lastIndex, "lastIndex");
      if (this.tabcontrol) {
        // 选项卡this.isLast判断商品列表是最后一个组件
        if (newVal && this.isLast && this.datas.sort_style.choose_icon != 5 && this.isLoadMore) {
          this.getMoreData();
        } else if (this.page >= this.total_page) {
          if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0) {
            this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
            this.arrIndex = this.arrIndex + 1;
          }
        }
      } else {
        // this.lastIndex == this.index判断商品列表是最后一个组件
        if (newVal && this.lastIndex == this.index && this.datas.sort_style.choose_icon != 5 && this.isLoadMore) {
          this.getMoreData();
        } else if (this.page >= this.total_page) {
          if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0) {
            this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
            this.arrIndex = this.arrIndex + 1;
          }
        }
      }
    },
    fatherTitle:function(newValue,oldValue) {
      this.fatherTitle = newValue;
    }
  },
  activated() {
    if (this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    } else {
      this.clientWidth = document.body.clientWidth;
    }
  },
  mounted() {
    if (this.fun.getPhoneEnv() == 3) {
      this.clientWidth = 375;
    } else {
      this.clientWidth = document.body.clientWidth;
    }

    this.integral = window.localStorage.getItem("integral");

    if (this.datas.list.data) {
      this.total_page = this.datas.list.last_page;
      this.per_page = this.datas.list.per_page || 12;
      this.page = this.datas.list.current_page;
      if (this.total_page <= this.page && this.datas.list.data.length <= this.per_page) {
        this.isLoadMore = false;
        this.allLoaded = true;
      }
      this.alreadyHandleArray = this.datas.list.data;
      this.datas.list.data = this.datas.list.data.slice(0, this.per_page);

      // this.datas.get_number 限制数量
      if (!this.fun.isTextEmpty(this.datas.get_number) && this.datas.get_number <= this.per_page) {
        this.datas.list.data = this.datas.list.data.slice(0, this.datas.get_number);
        this.isLoadMore = false;
        this.allLoaded = true;
      }
    } else {
      // if(this.datas.list.length <= 0) {
      this.isLoadMore = false;
      this.allLoaded = true;
      // }
    }
  },
  methods: {
    getMoreDataTest(e) {
      this.$emit("formSubmit");
    },
    //复制商品链接
    copyGoodsUrl(id) {
      let _link = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/goods/" + id + "?i=" + this.fun.getKeyByI();
      _link = this.fun.isMid(_link, this.fun.getKeyByMid());

      let message = "分享一个商品" + _link;
      this.$copyText(message).then(
        function(e) {
          Toast("复制成功");
          // console.log('复制成功', e)
        },
        function(e) {
          Toast("复制失败");
          // console.log(e)
        }
      );
    },
    editFavorite(status, gid, index) {
      // 商品收藏与取消收藏
      let that = this;
      let changes = status == 1 ? 0 : 1;
      let _url = status == 1 ? "member.member-favorite.destroy" : "member.member-favorite.store";
      $http.get(_url, { goods_id: gid }, "处理中...").then(
        function(response) {
          Toast(response.msg);
          if (response.result == 1) {
            if (that.datas.list.data) {
              that.$set(that.datas.list.data[index], "is_favorite", changes);
            } else {
              that.$set(that.datas.list[index], "is_favorite", changes);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //商品跳转
    gotoDetail(good) {
      let url = "";
      let params = { id: good.id };
      switch (good.plugin_id) {
        case 69:
          url = "grab_group"; //抢团
          break;
        case 78:
          params.mode = 1;
          url = "newRetailSalesGood"; //新零售
          break;
        default:
          url = "goods";
          break;
      }
      if (good.category_option_id) {
        // 如果有默认规格id，则路由携带到详情页面
        params.coid = good.category_option_id;
      }
      console.log(this.fatherTitle);
      //console.log(good);
      zhuge.track(this.fatherTitle+'-点击商品',{
          '商品名称':good.name,
          '商品id':''+good.id,
          '商品价格':good.vip_price
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
      if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length >= this.per_page) {
        // 一页的数据超过per_page不另外请求接口
        this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
        this.arrIndex = this.arrIndex + 1;

        if (!this.fun.isTextEmpty(this.datas.get_number) && this.datas.list.data.length > this.datas.get_number) {
          this.datas.list.data = this.datas.list.data.slice(0, this.datas.get_number);
          this.isLoadMore = false;
          this.allLoaded = true;
        }
        return;
      } else if (this.page >= this.total_page && this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0) {
        // 最后一页剩余的数据加载
        this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1)));
        if (!this.fun.isTextEmpty(this.datas.get_number) && this.datas.list.data.length > this.datas.get_number) {
          this.datas.list.data = this.datas.list.data.slice(0, this.datas.get_number);
        }

        this.isLoadMore = false;
        this.allLoaded = true;

        return;
      }
      this.isLoadMore = false;
      if (this.page >= this.total_page) {
        if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0) {
          // 最后一页剩余的数据加载
          this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1)));
          if (!this.fun.isTextEmpty(this.datas.get_number) && this.datas.list.data.length > this.datas.get_number) {
            this.datas.list.data = this.datas.list.data.slice(0, this.datas.get_number);
          }

          this.isLoadMore = false;
          this.allLoaded = true;
        }
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
        $http.get("home-page.get-decorate-page", json, "loading").then(
          response => {
            if (response.result === 1) {
              if (this.tabcontrol) {
                let data = response.data[0].remote_data.list;
                this.page = data.current_page || this.page;
                this.alreadyHandleArray = this.alreadyHandleArray.concat(data.data);
                this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
                this.arrIndex = this.arrIndex + 1;
                if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0 || this.page < this.total_page) {
                  this.isLoadMore = true;
                } else {
                  this.allLoaded = true;
                }
              } else {
                this.page = response.data.current_page || this.page;
                this.alreadyHandleArray = this.alreadyHandleArray.concat(response.data.data);
                this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
                this.arrIndex = this.arrIndex + 1;
                if (this.alreadyHandleArray.slice(this.per_page * this.arrIndex).length > 0 || this.page < this.total_page) {
                  // 判断是否最后一页  和 是否数据都加载完
                  this.isLoadMore = true;
                } else {
                  this.allLoaded = true;
                }
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
          code: this.plugin_active
        };
        $http.get("member.member.plugin-data", json, "loading").then(
          response => {
            if (response.result === 1) {
              let data = response.data.data;
              if (data.current_page) {
                this.page = data.current_page;
              }
              this.alreadyHandleArray = this.alreadyHandleArray.concat(data.data);
              this.datas.list.data = this.datas.list.data.concat(this.alreadyHandleArray.slice(this.per_page * this.arrIndex, this.per_page * (this.arrIndex + 1))); //数组拼接
              this.arrIndex = this.arrIndex + 1;
              if (this.page < this.total_page) {
                this.isLoadMore = true;
              } else {
                this.allLoaded = true;
              }
              this.$emit("setLoadMore", this.isLoadMore);
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
    }
  }
};
</script>

<style lang="scss" scoped>
// 默认
.component-wrapper {
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
  .icon-bc_like {
    color: rgb(255, 150, 1);
  }

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
        }

        .oneChild_r_flexbottom {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          margin-bottom: 4px;
        }
      }

      &:last-child {
        margin-bottom: 0;
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

    // padding:5px 5px;

    .u_goodslist_three_child,
    .u_goodslist_four_child {
      width: 46.5%;
      // width: 49%;
      height: 50%;

      /* padding: 0 5px; */
      margin: 5px;
      overflow: hidden;
      position: relative;

      .threeChild_top {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;

        .goodsImg {
          width: 100%;
          right: 0;
          height: 100%;
          position: absolute;
        }
      }
      // 左边导航隐藏的时候的样式
      .threeChild_top_tab {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;

        .goodsImg {
          width: 100%;
          right: 0;
          height: 100%;
          position: absolute;
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

    //修改中间太宽
    .u_goodslist_three_child {
      width: 49%;
      margin: 5px 0;
    }
    .u_goodslist_three_child .failure_cover {
      height: 11rem;
      width: 100%;
      /* margin: 0 5px; */
    }

    .u_goodslist_three_child .failure_cover_tab {
      height: 9rem;
      width: 100%;
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
    margin-right: 0 !important;
  }

  .diytab {
    .u_goodslist_four_child:nth-child(2n) {
      margin-left: 1%;
      margin-right: 1%;
    }

    .u_goodslist_four_child:nth-child(3n + 1) {
      margin-left: 0 !important;
    }
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

  .Child_member_price {
    color: #ff2c29;

    /* height: 12px; */
    line-height: 12px;
    font-size: 12px;
  }

  .good_Attributes {
    position: absolute;
    top: 4px;
    left: 4px;
    display: flex;
    z-index: 999;
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
    font-weight: bold;

    /* height: 18px; */
    word-break: break-all;
    font-size: 14px;
  }

  .Child_price {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // height: 26px;
    line-height: 26px;

    .Child_now_price {
      color: #ff2c29;
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
      display: flex;
      align-items: center;
      justify-content: center;
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

  .u_goodslist_six {
    .u_goodslist_two {
      clear: both;
    }

    .u_goodslist_three {
      display: block;
      // width: 50%;
      float: left;

      //修改中间距离太宽
      width: 48%;
      margin-left: 5px;
    }

    .u_goodslist_three_child {
      // width: 94%;
      width: 99%;
      margin: 0 0 5px;
    }

    .threeChild_b {
      .Child_title {
        min-height: 37px;
      }
    }
  }
}

.loadMore {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  clear: both;
}

/* 门店拼团 */
.show_price_box {
  display: flex;
  flex-wrap: wrap;
}

.show_price {
  font-size: 12px;
  color: #ff2c29;
  border: solid #ff2c29 1px;
  padding: 1px 4px;
  margin-top: 5px;
}

.red_white {
  color: #fff;
  background: #ff2c29;
  margin-right: 5px;
}

.white_red {
  color: #ff2c29;
  background: #fff;
}

.buttons_box {
  display: flex;
  justify-content: flex-end;

  div {
    display: flex;
  }

  .share_buton {
    margin-left: 10px;
  }
}

/* 门店拼团 */
// 多项选项卡
.tabMoreBox {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-top: 0.15rem;
}

.tabMore {
  width: 16.88rem;
  height: 2.19rem;
  border-radius: 0.25rem;
  font-size: 0.81rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.35rem;
}

.tabMarginSub {
  width: 48.5% !important;
  margin: 0 !important;
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
</style>
