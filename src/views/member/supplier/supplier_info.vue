<template>
   <div class="page">
      <c-title text="供应商信息" ></c-title>

      <div class="headeras">
        <div class="c1">
          <div class="face">
            <img :src="supplierInfo.logo" alt="">
          </div>
          <div class="info">
             <div class="desc">{{this.fun.isTextEmpty(supplierInfo.store_name)?supplierInfo.username:supplierInfo.store_name}}</div>
             <div class="goods_num">商品数量:{{infoData.goods_count}}</div>
          </div>
        </div>

        <div class="c2">
          <div class="evaluate">
            <span style="margin-right: 0.2rem;">综合评价:</span>
            <van-rate
              v-model="infoData.average_score"
              :size="18"
              color="#ffba00"
              allow-half
              void-icon="star"
              void-color="#d5d5d5"
              :readonly="true"
              :touchable="false"
            />
          </div>
          <div class="desc">
              由平台根据用户对供应商订单商品评价结果评估，星星越多评价越高
          </div>
        </div>
      </div>

      <div class="cutting"></div>

      <div class="basicInfo">
         <p class="name">基本信息</p>
         <div class="items">
            <div class="item">
               <span class="c1">店铺名称</span>
               <span class="c2">{{infoData.store_name}}</span>
            </div>
            <div class="item">
               <span class="c1">服务电话</span>
               <span class="c2" style="color: #f15353;">{{infoData.mobile}}</span>
            </div>
            <div class="item">
               <span class="c1">所在地</span>
               <span class="c2">{{infoData.address}}</span>
            </div>
            <div class="item">
               <span class="c1">开店时间</span>
               <span class="c2">{{infoData.created_at}}</span>
            </div>
         </div>
         <div class="btns">
            <div class="btn" @click="gotoSupplier">
              <i class="iconfont icon-dianpu"></i>
              <span>进入店铺</span>
            </div>
            <p style="width: 0.031rem; height: 1.594rem; background-color: #dee2ee;"></p>
            <div class="btn" @click="show1=true">
              <i class="iconfont icon-linedesign-20"></i>
              <span>联系客服</span>
            </div>
         </div>
      </div>

      <div class="cutting"></div>

      <div class="qualifi">
          <p class="name">企业资质</p>
          <p class="desc">根据国家工商总局《网络交易管理办法》要求对网店营业执照等信息公示如下</p>
          <div class="img" v-for="(item,ind) in infoData.certificate" :key="ind">
              <img :src="item" alt="">
          </div>
      </div>


      <van-popup v-model="show1" position="center"  round style="width: 80%;">
          <div class="pop-content">
              <div class="pop-top">
                <div class="left" v-if="!fun.isTextEmpty(cservice)">
                  <div class="wrap">
                     <a :href="cservice">
                        <div class="image"><img src="../../../assets/images/kf_online_contect@2x.png"></div>
                     </a>
                     <div>在线联系</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice)&&!fun.isTextEmpty(service_mobile)">
                    <div class="line" ></div>
                </div>
                <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
                    <div class="wrap">
                      <!-- <div class="image"> -->
                          <a :href="`tel:${service_mobile}`">
                              <div class="image"><img src="../../../assets/images/kf_tel_contect@2x.png"></div>
                          </a>
                        <!-- </div> -->

                        <div>{{service_mobile}}</div>
                    </div>
                  </div>
                </div>
                <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
                  <div class="image">
                      <img :src="service_QRcode" style="width: 100%; height: 100%;">
                  </div>
                </div>
                <i class="iconfont icon-close11" @click="show1=false"></i>
          </div>
      </van-popup>


   </div>
</template>

<script>

const INDEX_URL = "plugin.supplier.frontend.shop.index.index";
const SUPPLIER_INFO_URL = "plugin.supplier.frontend.shop.index.getSupplierInfo";

export default {

  data(){
    return {
      show1:false,
      cservice: "",
      service_QRcode:'',
      service_mobile:'',

      indexData: {},
      supplierInfo: {},
      infoData:{},

      activeStar:0,
      quietStar:0
    };
  },
  activated() {
    this.getIndexData();
    this.getSupplierInfo();
  },
  methods:{
    gotoSupplier() {
      if (window.history.length <= 1) {
        this.$router.push(
          this.fun.getUrl('SupplierShop', {
            id: this.$route.params.id,
            fromHome: 1
          })
        );
      } else {
        this.$router.go(-1);
      }
    },
    getIndexData() {
      $http.get(INDEX_URL, { sid: this.$route.params.id }, "加载中...").then(res => {
        if (res.result == 1) {
          this.indexData = res.data;
          this.supplierInfo = res.data.supplier;
          if(this.indexData.hasOwnProperty('cservice')){
            this.cservice=this.indexData.cservice;
          }
          if(!this.indexData.hasOwnProperty('cservice')){
            this.cservice=this.indexData.supplier_link;
          }
          if(this.indexData.hasOwnProperty('service_QRcode')){
            this.service_QRcode=this.indexData.service_QRcode;
          }
          if(this.indexData.hasOwnProperty('service_mobile')){
            this.service_mobile=this.indexData.service_mobile;
          }
          // this.initShare();
          this.fun.wxShare(
            "",
            { },
            {
              title: this.supplierInfo.store_name,
              imgUrl: this.supplierInfo.logo,
            }
          );
          // if(res.data.is_room&&res.data.is_room == 1){
          //   this.is_room = 1;
          //   this.getLiveList(false)
          // }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    async getSupplierInfo(){
      let res = await $http.get(SUPPLIER_INFO_URL, { sid: this.$route.params.id }, "加载中...");

      if(res.result !=1) return;
      this.infoData = res.data;
      console.log(res.data);
    },
    //分享
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android"
          ? window.location.href
          : window.initUrl
      };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        })
        .catch(error => {
        });
    },
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.supplierInfo.store_name)
          ? data.share.title
          : that.supplierInfo.store_name;
        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.supplierInfo.logo)
          ? data.share.icon
          : that.supplierInfo.logo;
        // let desc = '';
        // if(data.shop&&data.shop.share&&data.shop.share.desc) {
        //   desc = data.shop.share.desc;
        // }
        let _desc = that.fun.isTextEmpty(data.shop.share.desc)
          ? ''
          : data.shop.share.desc;

        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: #fff; min-height: 100vh; }

  .headeras {
    padding-top: 0.5rem;
    padding-bottom: 1.344rem;

    .c1 {
      display: flex;
      padding-right: 1.688rem;

      .face {
        padding-left: 1rem;
        padding-right: 1rem;
        width: 6rem;
        height: 4rem;

        img {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        height: 4rem;

        .desc {
          font-size: 0.8rem;
          color: #000;
          letter-spacing: 0.05rem;
          font-weight: bold;
        }

        .goods_num {
          font-size: 0.638rem;
          color: #333;
        }
      }
    }

    .c2 {
      margin-top: 0.59rem;
      padding-left: 0.781rem;
      padding-right: 0.8rem;
      text-align: left;

      .evaluate {
        display: flex;

        span {
          font-size: 0.875rem;
          color: #333;
        }

        .icon-collect-active {
          color: #d5d5d5;
        }

        .active {
          color: #ffba00;
        }
      }

      .desc {
        margin-top: 0.506rem;
        font-size: 0.75rem;
        color: #666;
        line-height: 1.125rem;
      }
    }
  }

  .cutting {
    width: 100%;
    height: 0.625rem;
    background-color: #f6f6f7;
  }

  .basicInfo {
    text-align: left;
    padding: 0 0.75rem;

    .name {
      font-size: 1rem;
      color: #000;
      height: 2.545rem;
      line-height: 2.545rem;
    }

    .items {
      border-bottom: 0.031rem solid #dee2ee;

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 2.231rem;

        .c1 {
          font-size: 0.875rem;
          color: #333;
        }

        .c2 {
          font-size: 0.875rem;
          color: #000;
        }
      }
    }

    .btns {
      display: flex;
      height: 3rem;
      align-items: center;

      .btn {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .iconfont {
          color: #f15353;
        }

        span {
          font-size: 0.875rem;
          margin-left: 0.844rem;
          color: #000;
        }
      }
    }
  }

  .qualifi {
    text-align: left;
    padding: 0 0.75rem;
    padding-bottom: 2rem;

    .name {
      font-size: 1rem;
      color: #000;
      height: 2.545rem;
      line-height: 2.545rem;
    }

    .desc {
      font-size: 0.875rem;
      letter-spacing: 0.044rem;
      color: #333;
      text-indent: 1.75rem;
    }

    .img {
      margin-top: 0.938rem;

      img {
        width: 21.875rem;
      }
    }
  }

  .pop-content {
    width: 100%;
    padding: 3.1875rem 0;
    text-align: center;
    border-radius: 1.1875rem;
    background: #fff;

    .pop-top {
      display: flex;
      align-items: unset;
      justify-content: center;

      .left {
        width: 50%;
        display: flex;
        justify-content: center;

        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;

          .image {
            width: 2.625rem;
            height: 2.625rem;
            margin-bottom: 0.5rem;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .line {
        width: 1px;
        height: 1.625rem;
        background-color: #999;
      }

      .right {
        width: 50%;
        display: flex;
        justify-content: center;

        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;

          .image {
            width: 2.625rem;
            height: 2.625rem;
            margin-bottom: 0.5rem;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .pop-bottom {
      margin-top: 1rem;
      width: 100%;
      display: flex;
      justify-content: center;

      .image {
        width: 50%;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .icon-close11 {
      position: absolute;
      right: 1rem;
      top: 1rem;
      font-size: 18px;
    }
  }
</style>
