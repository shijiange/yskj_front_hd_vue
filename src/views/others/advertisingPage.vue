<template>
  <div id="advertisingPage">

    <!--音乐按钮 分享咨询-->
    <!-- <div class="btn_music xuanzhuan" @click.stop="play()" v-if="!songStop">
			<img src="../../assets/images/music_play.png" alt="">
    </div>-->
    <!-- <div :class="[songStop == false?'xuanzhuan':'']" class="btn_music" @click.stop="play()">
      <img src="../../assets/images/music_play.png" alt />
    </div> -->
    <div class="btn_music xuanzhuan" @click.stop="play()" v-show="!songStop">
      <img src="../../assets/images/music_play.png">

    </div>
    <div class="btn_music" @click.stop="play()" v-show="songStop">
      <img src="../../assets/images/music_stop.png">
    </div>
    <audio
      id="audio"
      ref="audio"
      loop="loop"
      @loadedmetadata="onLoadedmetadata"
      controls="controls"
      autoplay
      preload
      :src="list.audio_link"
      style="display: none;"
    ></audio>
    <div class="btn_contact_box">
      <div class="btn_contact" @click="linkTo()">
        <img src="../../assets/images/btn_contact.png" alt/>
        <span>咨询</span>
      </div>
      <div class="btn_contact" @click="shareWeixin()">
        <img src="../../assets/images/btn_share.png" alt/>
        <span>分享</span>
      </div>
    </div>
    <div class="head">
      <div class="logotag">
        <img :src="list.logo"/>
      </div>
    </div>
    <div class="content">
      <!-- :style="'background:url('+image2+') center no-repeat scroll transparent'" -->
      <div class="list_title">
        <span class="list_title_color">社交电商系统优势</span>
      </div>
      <div class="list_content">
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list1_1@2x.png"/>
            <span>公众号+小程序</span>
          </li>
          <li>
            <img src="../../assets/images/list1_2@2x.png"/>
            <span>分润功能强大</span>
          </li>
          <li>
            <img src="../../assets/images/list1_3@2x.png"/>
            <span>多种促销应用</span>
          </li>
          <li>
            <img src="../../assets/images/list1_4@2x.png"/>
            <span>丰富的引流/种草方案</span>
          </li>
        </ul>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list1_5@2x.png"/>
            <span>O2O多商户</span>
          </li>
          <li>
            <img src="../../assets/images/list1_6@2x.png"/>
            <span>刷脸支付</span>
          </li>
          <li>
            <img src="../../assets/images/list1_7@2x.png"/>
            <span>APP支持</span>
          </li>
          <li>
            <img src="../../assets/images/list1_8@2x.png"/>
            <span>4年产品沉淀</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">交易场景丰富</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>支持多种消费交易场景,适用范围广</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_1@2x.png"/>
            <div class="list2_text">
              <h3>供应商</h3>
              <span>多厂家入驻供货,让您的品类不再单一</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_2@2x.png"/>
            <div class="list2_text">
              <h3>门店</h3>
              <span>多门店o2o,线下线上数据同步、奖励分润同步</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_3@2x.png"/>
            <div class="list2_text">
              <h3>刷脸支付</h3>
              <span>结合门店,微信刷脸支付即会员,广告精准覆盖</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_4@2x.png"/>
            <div class="list2_text">
              <h3>收银一体机</h3>
              <span>结合门店,对接商米D2收银一体机,更深度</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_5@2x.png"/>
            <div class="list2_text">
              <h3>酒店</h3>
              <span>房态管理,o2o周边酒店预订,酒店扫码收银</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_6@2x.png"/>
            <div class="list2_text">
              <h3>租赁</h3>
              <span>按天租赁,支持押金,会元免押免租等从场景</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_7@2x.png"/>
            <div class="list2_text">
              <h3>视频点播</h3>
              <span>在线销售、播放课程、支持会员等级免费观看</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_8@2x.png"/>
            <div class="list2_text">
              <h3>语音商品</h3>
              <span>支持设置会员播放语音权限</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_9@2x.png"/>
            <div class="list2_text">
              <h3>虚拟卡密</h3>
              <span>用户购买自动发送卡密</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_10@2x.png"/>
            <div class="list2_text">
              <h3>区域代理</h3>
              <span>用户下单,有收货地址所在区域代理商最近发货</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_10@2x.png"/>
            <div class="list2_text">
              <h3>分公司</h3>
              <span>结合经销商管理,用户下单,由其关系链上最近的经销商发货</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_11@2x.png"/>
            <div class="list2_text">
              <h3>网约车</h3>
              <span>车辆投资、司机招募、第三方网约车平台流水导入分红</span>
            </div>
          </li>
        </ul>
        <ul class="box list2">
          <li>
            <img src="../../assets/images/list2_12@2x.png"/>
            <div class="list2_text">
              <h3>商品挂单</h3>
              <span>挂售模式,低价买进,高价卖出与分销奖励机制的系统</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list2_13@2x.png"/>
            <div class="list2_text">
              <h3>提货点</h3>
              <span>品牌连锁店提货、快递寄存、社区电商等多种玩法</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">社交分润体系健全</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>涵盖主流电商分润模式,KOL系统打造</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="list3">
          <li>
            <img src="../../assets/images/list3_1@2x.png"/>
            <div class="list2_text">
              <h2>推客</h2>
              <span>直推奖、间推奖两级分销模式，合法合规</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_2@2x.png"/>
            <div class="list2_text">
              <h2>经销商</h2>
              <span>团队极差模式，打造超级战队管理，支持级差奖、平级奖、感恩奖</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_3@2x.png"/>
            <div class="list2_text">
              <h2>股东分红</h2>
              <span>社交电商粉丝到合伙人/股东的成长终极奖励。</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_4@2x.png"/>
            <div class="list2_text">
              <h2>区域代理分红</h2>
              <span>深度结合传统企业经销渠道，省、市、区/县、街道/乡镇代理分红。</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_5@2x.png"/>
            <div class="list2_text">
              <h2>微店</h2>
              <span>我是店主、我的销售我做主。</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_6@2x.png"/>
            <div class="list2_text">
              <h2>MRYT</h2>
              <span>参考每日一淘、小米有品有鱼、未来集市等模式，社交电商综合奖励玩法。</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_7@2x.png"/>
            <div class="list2_text">
              <h2>手动分红</h2>
              <span>指定的会员角色手动分红，更灵活的场景应用。</span>
            </div>
          </li>
          <li>
            <img src="../../assets/images/list3_8@2x.png"/>
            <div class="list2_text">
              <h2>管理奖</h2>
              <span>上级获得直推下级业绩收益的奖励。</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">社交电商引流/种草</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>多种种草、引流玩法，解决电商流量难的问题</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list4">
          <li>
            <img src="../../assets/images/list4_1@2x.png"/>
            <span>海报</span>
          </li>
          <li>
            <img src="../../assets/images/list4_2@2x.png"/>
            <span>文章营销</span>
          </li>
          <li>
            <img src="../../assets/images/list4_3@2x.png"/>
            <span>素材中心</span>
          </li>
          <li>
            <img src="../../assets/images/list4_4@2x.png"/>
            <span>短视频</span>
          </li>
          <li>
            <img src="../../assets/images/list4_5@2x.png"/>
            <span>微社区</span>
          </li>
        </ul>
        <ul class="box list4">
          <li>
            <img src="../../assets/images/list4_6@2x.png"/>
            <span>早起打卡</span>
          </li>
          <li>
            <img src="../../assets/images/list4_7@2x.png"/>
            <span>分享券</span>
          </li>
          <li>
            <img src="../../assets/images/list4_8@2x.png"/>
            <span>拼团活动</span>
          </li>
          <li>
            <img src="../../assets/images/list4_9@2x.png"/>
            <span>拓客活动</span>
          </li>
          <li>
            <img src="../../assets/images/list4_10@2x.png"/>
            <span>一卡通</span>
          </li>
        </ul>
        <ul class="box list4">
          <li>
            <img src="../../assets/images/list4_11@2x.png"/>
            <span>幸运抽奖</span>
          </li>
          <li>
            <img src="../../assets/images/list4_12@2x.png"/>
            <span>积分活动</span>
          </li>
          <li>
            <img src="../../assets/images/list4_13@2x.png"/>
            <span>名片</span>
          </li>
          <li>
            <img src="../../assets/images/list4_14@2x.png"/>
            <span>任务奖励</span>
          </li>
          <li>
            <img src="../../assets/images/list4_15@2x.png"/>
            <span>充值码</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">促销应用</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>各种促销优惠应用玩法，刺激客户购买更多</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list4">
          <li>
            <img src="../../assets/images/list5_1@2x.png"/>
            <span>满减</span>
          </li>
          <li>
            <img src="../../assets/images/list5_2@2x.png"/>
            <span>优惠券</span>
          </li>
          <li>
            <img src="../../assets/images/list5_3@2x.png"/>
            <span>商品套餐</span>
          </li>
          <li>
            <img src="../../assets/images/list5_4@2x.png"/>
            <span>满额赠送</span>
          </li>
          <li>
            <img src="../../assets/images/list5_5@2x.png"/>
            <span>消费赠送</span>
          </li>
        </ul>
        <ul class="box list4">
          <li>
            <img src="../../assets/images/list5_6@2x.png"/>
            <span>会员等级权益</span>
          </li>
          <li>
            <img src="../../assets/images/list5_7@2x.png"/>
            <span>积分</span>
          </li>
          <li>
            <img src="../../assets/images/list5_8@2x.png"/>
            <span>爱心值</span>
          </li>
          <li>
            <img src="../../assets/images/list5_9@2x.png"/>
            <span>共享链</span>
          </li>
          <li>
            <img src="../../assets/images/list5_10@2x.png"/>
            <span>价格权限</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="content">
      <div class="list_title">
        <span class="list_title_color">多门店O2O系统</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>构建新零售体系,支持异业联盟多门店上线下业务数据统一</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list6_1@2x.png"/>
            <span>多门店支持</span>
          </li>
          <li>
            <img src="../../assets/images/list6_2@2x.png"/>
            <span>LBS门店定位</span>
          </li>
          <li>
            <img src="../../assets/images/list6_3@2x.png"/>
            <span>O2O双重流量</span>
          </li>
          <li>
            <img src="../../assets/images/list6_4@2x.png"/>
            <span>门店收银台</span>
          </li>
        </ul>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list6_5@2x.png"/>
            <span>门店收银一体机</span>
          </li>
          <li>
            <img src="../../assets/images/list6_6@2x.png"/>
            <span>到店自提</span>
          </li>
          <li>
            <img src="../../assets/images/list6_7@2x.png"/>
            <span>门店配送</span>
          </li>
          <li>
            <img src="../../assets/images/list6_8@2x.png"/>
            <span>门店商品管理</span>
          </li>
        </ul>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list6_9@2x.png"/>
            <span>门店刷脸支付</span>
          </li>
          <li>
            <img src="../../assets/images/list6_10@2x.png"/>
            <span>一卡通</span>
          </li>
          <li>
            <img src="../../assets/images/list6_11@2x.png"/>
            <span>支持分润/促销多种机制</span>
          </li>
          <li>
            <img src="../../assets/images/list6_12@2x.png"/>
            <span>店长端原生APP</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">会员营销管理</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>完善的会员管理,以及会员营销功能,提高顾客复购率</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list7">
          <li>
            <div class="title7">
              <h3>会员统计</h3>
              <span>多维度记录会员信息，会员数据统计</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_1@2x.png"/>
            </div>
          </li>
          <li>
            <div class="title7">
              <h3>优惠券</h3>
              <span>满减券、打折券、限时券、分享券、周期券，全方位满足运营需要。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_2@2x.png"/>
            </div>
          </li>
        </ul>
        <ul class="box list7">
          <li>
            <div class="title7">
              <h3>会员收入</h3>
              <span>多种收入奖励汇总统计管理，更清晰。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_3@2x.png"/>
            </div>
          </li>
          <li>
            <div class="title7">
              <h3>余额</h3>
              <span>充值、充值活动、转账、支付、奖励等多种余额玩法。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_4@2x.png"/>
            </div>
          </li>
        </ul>
        <ul class="box list7">
          <li>
            <div class="title7">
              <h3>积分</h3>
              <span>购物、推广、签到、任务奖励、抵扣、转让等活动让积分高效运转。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_5@2x.png"/>
            </div>
          </li>
          <li>
            <div class="title7">
              <h3>爱心值</h3>
              <span>充值、推广、转让、抵扣、签到、任务奖励、冻结、返现、提现、交易、分红等更灵活百变。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_6@2x.png"/>
            </div>
          </li>
        </ul>
        <ul class="box list7">
          <li>
            <div class="title7">
              <h3>发券</h3>
              <span>推广送券、商家发券、任务赠券、签到赠券、购物赠券、后台发券、券转赠等多种发券方式。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_7@2x.png"/>
            </div>
          </li>
          <li>
            <div class="title7">
              <h3>等级特权</h3>
              <span>折扣、购买权限、浏览权限、运费减免、租赁免租金/免押金、视频点播权限、微社区发帖权限、短视频发布权限、等级有效期等全覆盖运营支持。</span>
            </div>
            <div class="img7">
              <img src="../../assets/images/list7_8@2x.png"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">多客户端体系</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>支持移动端各种主流交流社交平台,让商品传播更广</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list8">
          <li>
            <img src="../../assets/images/list8_1@2x.png"/>
            <span>微信公众号</span>
          </li>
          <li>
            <img src="../../assets/images/list8_2@2x.png"/>
            <span>微信小程序</span>
          </li>
          <li>
            <img src="../../assets/images/list8_3@2x.png"/>
            <span>APP</span>
          </li>
        </ul>
        <ul class="box list8">
          <li>
            <img src="../../assets/images/list8_4@2x.png"/>
            <span>H5微商城</span>
          </li>
          <li>
            <img src="../../assets/images/list8_5@2x.png"/>
            <span>抖音/头条小程序</span>
          </li>
          <li>
            <img src="../../assets/images/list8_6@2x.png"/>
            <span>支付宝生活号</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="list_title">
        <span class="list_title_color">不止如此</span>
      </div>
      <div class="list_content">
        <div class="list_tab">
          <img src="../../assets/images/list_left@2x.png"/>
          <span>提供多种工具、支付、分账支持,更完善的社交电商</span>
          <img src="../../assets/images/list_right@2x.png"/>
        </div>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list9_1@2x.png"/>
            <span>店铺装修</span>
          </li>
          <li>
            <img src="../../assets/images/list9_2@2x.png"/>
            <span>DIY装修模板</span>
          </li>
          <li>
            <img src="../../assets/images/list9_3@2x.png"/>
            <span>自定义表单</span>
          </li>
          <li>
            <img src="../../assets/images/list9_4@2x.png"/>
            <span>快递助手</span>
          </li>
        </ul>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list9_5@2x.png"/>
            <span>电子面单</span>
          </li>
          <li>
            <img src="../../assets/images/list9_6@2x.png"/>
            <span>商品助手</span>
          </li>
          <li>
            <img src="../../assets/images/list9_7@2x.png"/>
            <span>小票打印</span>
          </li>
          <li>
            <img src="../../assets/images/list9_8@2x.png"/>
            <span>订单导入</span>
          </li>
        </ul>
        <ul class="box list1">
          <li>
            <img src="../../assets/images/list9_9@2x.png"/>
            <span>易宝支付/分账</span>
          </li>
          <li>
            <img src="../../assets/images/list9_10@2x.png"/>
            <span>汇聚支付/代付</span>
          </li>
          <li>
            <img src="../../assets/images/list9_11@2x.png"/>
            <span>提现免审核</span>
          </li>
          <li>
            <img src="../../assets/images/list9_12@2x.png"/>
            <span>发薪平台</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content" style="padding-bottom: 5rem;">
      <img
        src="../../assets/images/h5_case@2x.png"
        style="display: inline-block; height: auto; max-width: 100%;"
      />
    </div>
    <van-popup v-model="show">
      <div class="popbox">
        <div class="popup-content">
          <div class="popup-head">
            <!--<p>在线客服：悠悠我心</p>-->
            <a :href="'tel:' + list.service_mobile">
              <div class="green">
                <img src="../../assets/images/phone@2x.png" alt=""/>
                <span>一键拨打</span>
              </div>
            </a>
          </div>
          <div class="qr">
            <img class="code" :src="list.service_qr" alt=""/>
            <span>长按识别 二维码联系我们</span>
          </div>
        </div>
        <div class="close" @click="show = false">
          <img src="../../assets/images/close@2x.png" alt=""/>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import advertisingPage_controller from "./advertisingPage_controller";

export default advertisingPage_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #advertisingPage {
    background: #0ccb96;
    font-size: 0.8125rem;
  }

  .logotag {
    position: absolute;
    top: 14%;
    left: 34%;
    width: 33%;
    height: 17.5%;
  }

  .van-popup {
    border-radius: 10px;
    background: transparent;
  }

  .popbox {
    width: 20rem;
    height: 26rem;
    margin: 0 auto;
    border-radius: 10px;

    .popup-content {
      background: #fff;
      width: 20rem;
      height: 22rem;
      border-radius: 10px;
    }

    .popup-head {
      padding: 1rem 0;
      border-bottom: 1px dashed #ebebeb;

      p {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .green {
      background: #37ce50;
      color: #fff;
      width: 7rem;
      height: 2rem;
      margin: 0 auto;
      border-radius: 1rem;
      line-height: 2rem;
      display: flex;
      padding: 0 0.5rem;
      margin-top: 1.5rem;

      img {
        width: 1.2rem;
        height: 1.2rem;
        flex: 0 0 1.5rem;
        margin-right: 0.2rem;
      }

      span {
        flex: 1;
      }
    }

    .qr {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;

      img {
        width: 11rem;
        height: 11rem;
      }

      span {
        color: #999;
      }
    }

    .close {
      position: absolute;
      bottom: 0;
      left: calc(50% - 1rem);

      img {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  .popimg {
    width: 50%;
    height: 50%;
  }

  .xuanzhuan {
    animation: xz 2s linear infinite;
  }

  @keyframes xz {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* 按钮 */
  .btn_music {
    position: fixed;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1;
  }

  .btn_music img {
    width: 2rem;
    height: 2rem;
  }

  .btn_contact_box {
    position: fixed;
    bottom: 8rem;
    right: 0;
  }

  .btn_contact_box .btn_contact {
    margin-bottom: 1rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border-bottom-left-radius: 2rem;
    border-top-left-radius: 2rem;
    padding: 0.2rem;
    font-size: 1rem;
  }

  .btn_contact_box .btn_contact img {
    width: 2rem;
    height: 2rem;
  }

  .head {
    height: 13.75rem;
    background: url(../../assets/images/h5_top_bg@2x.png) center no-repeat scroll transparent;
    background-size: cover;
    background-position: top center;
    display: flex;
    display: -webkit-flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    align-items: flex-start;
    position: relative;
  }

  .head img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .content {
    padding: 0 0.625rem;
    margin: 0.9375rem 0;
  }

  .content .list_title {
    background: url(../../assets/images/list_title_bg@2x.png) center no-repeat scroll transparent;
    background-size: 100% 100%;
    background-position: top center;
    height: 3.375rem;
  }

  .content .list_title .list_title_color {
    color: #fff;
    font-size: 1.125rem;
    font-weight: bold;
    display: block;
    text-align: center;
    padding: 0.875rem;
  }

  .content .list_content {
    background: #fff;
    padding: 1.25rem 0.25rem;
    margin-top: -0.1rem;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    img {
      margin: 0;
    }
  }

  .box {
    display: -webkit-flex;
    display: flex;
    width: 100%;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }

  .list1 li {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    text-align: center;
    width: 23%;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0.5rem 0;
  }

  .list1 li img {
    width: 50%;
  }

  .list1 li span {
    padding: 0.5rem 0;
  }

  .list_content .list_tab {
    display: -webkit-flex;
    display: flex;
    width: 100%;
    -webkit-justify-content: center;
    justify-content: center;
    padding-bottom: 0.625rem;
  }

  .list_content .list_tab img {
    width: 0.96875rem;
    height: 1.09375rem;
  }

  .list_content .list_tab span {
    text-align: center;
    color: #666;
    padding: 0.1rem;
    font-size: 0.75rem;
  }

  .list_content .list2 li {
    padding: 1rem 0.4rem;
    text-align: left;
    width: 50%;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: flex-start;
  }

  .list_content .list2 img {
    width: 25%;
  }

  .list_content .list2 div {
    width: 75%;
    padding-left: 0.5rem;
  }

  .list_content .list2 div span {
    color: #999;
    font-size: 0.7rem;
  }

  .list_content .list3 li {
    text-align: left;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    padding: 0.8rem 1rem;
    align-items: flex-start;
  }

  .list_content .list3 img {
    width: 15%;
  }

  .list_content .list3 div {
    width: 80%;
    padding-left: 1rem;
  }

  .list_content .list3 div span {
    color: #999;
    font-size: 0.8rem;
    display: block;
    padding: 0.8rem 0;
  }

  .list_content .list4 li {
    display: flex;
    width: 20%;
    text-align: center;
    flex-direction: column;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: center;
    padding: 0.8rem 0;
  }

  .list_content .list4 li img {
    width: 50%;
  }

  .list_content .list4 li span {
    font-size: 0.8125rem;
    padding-top: 0.8rem;
  }

  .list_content .list7 li {
    text-align: left;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    width: 50%;
    margin: 0.8rem 0.5rem;
    box-shadow: 0 0 10px rgba(12, 203, 105, 0.4);
    align-items: center;
    padding: 1rem 0.2rem;
  }

  .list7 li .title7 {
    width: 75%;
    padding: 0.1rem 0.2rem;
    color: #666;
  }

  .list7 li .title7 span {
    padding-top: 0.5rem;
    display: block;
    font-size: 0.5625rem;
  }

  .list7 li .img7 {
    width: 22%;
    padding-right: 0.1rem;
  }

  .list7 li .img7 img {
    width: 80%;
  }

  .list_content .list8 li {
    text-align: left;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    margin: 1rem 0.5rem;
    box-shadow: 0 0 10px rgba(12, 203, 105, 0.4);
    align-items: center;
    padding: 1rem 0;
    flex-direction: column;
    width: 30%;
  }

  .list_content .list8 li img {
    width: 50%;
  }

  .list_content .list8 li span {
    padding: 1rem 0;
  }
</style>