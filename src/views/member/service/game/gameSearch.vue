<template>
    <div id="city">
        <c-title :hide="false" text='城市' tolink='gameIsPay' totext='充值记录'></c-title>
        <div class="input">
            <i class="iconfont icon-sousuo1"></i>
            <input type="text" placeholder="中文/拼音/首字母" />
        </div>
        <!-- tab-container -->
        <div>
        <!-- <mt-tab-container v-model="selected"> -->
            <div v-if="selected==1">
            <!-- <mt-tab-container-item id="1"> -->
                <!-- right fixed -->
                <ul class="innerRig">
                    <li class="quickLocation">定位</li><li class="letter" data-id="1">A</li><li class="letter" data-id="2">B</li><li class="letter" data-id="3">C</li><li class="letter" data-id="4">D</li><li class="letter" data-id="5">E</li><li class="letter" data-id="6">F</li><li class="letter" data-id="7">G</li><li class="letter" data-id="8">H</li><li class="letter" data-id="9">J</li><li class="letter" data-id="10">K</li><li class="letter" data-id="11">L</li><li class="letter" data-id="12">M</li><li class="letter" data-id="13">N</li><li class="letter" data-id="14">P</li><li class="letter" data-id="15">Q</li><li class="letter" data-id="16">R</li><li class="letter" data-id="17">S</li><li class="letter" data-id="18">T</li><li class="letter" data-id="19">W</li><li class="letter" data-id="20">X</li><li class="letter" data-id="21">Y</li><li class="letter" data-id="22">Z</li>
                </ul>
                <!-- left inner -->
                <div class="content">
                    <div class="location">
                        <p class="title">热门游戏</p>
                        <ul>
                            <li v-for="(item,i) in hotGame" :key='i'>{{item}}</li>
                        </ul>
                        <div class="clear"></div>
                    </div>
                    <div class="list" v-for="(item,i) in allGames" :key='i'>
                        <p class="title">{{item.sign}}</p>
                        <ul>
                            <li v-for="(city,i) in item.games" :key='i'>{{city}}</li>
                        </ul>
                    </div>
                </div>
            <!-- </mt-tab-container-item> -->
            </div>
        <!-- </mt-tab-container> -->
        <!-- tab-containerEnd -->
        </div>
    </div>
</template>
<script>
import cTitle from 'components/title';
import { mapState } from 'vuex';

require('c-swipe/dist/swipe.css');
export default {

  data() {
    return {
      selected:'1',
      allGames:[
        {sign:"A",games:["宝贝星球","消灭星星豪华版 双人坦克世界3D","安顺","安庆"]},
        {sign:"B",games:["老爹烘培店","蚌埠","包头","保定","白银","宝山"]},
        {sign:"C",games:["快刀切水果3","成都","长沙","承德"]},
        {sign:"D",games:["米老鼠和唐老鸭","大庆","大同","丹东","大冶"]},
        {sign:"E",games:["突击对决无敌版","安阳","安顺","安庆"]}
      ],
      hotGame:["DNF","LOL","王者荣耀"]
    };
  },

  components: { cTitle},
  methods: {

  },

  //读取vuex的属性,html即可直接上vuex属性{{jan}}
  computed: mapState([])//直接引用vuex状态值
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #city {
    .input {
      padding: 0.625rem 5%;
      position: fixed;
      z-index: 999;
      background: #fff;
      width: 100%;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        position: absolute;
        left: 2.75rem;
        line-height: 1.875rem;
      }

      input {
        color: #666;
        background-color: #fafafa;
        width: 90%;
        height: 1.875rem;
        border-radius: 0.3125rem;
        padding-left: 1.875rem;
        border: 0;
        outline: 0;
        // background:url(../../../../assets/images/search.png) no-repeat 0.625rem 0.625rem #fff;
      }
    }

    .innerRig {
      position: fixed;
      width: 2.5rem;
      z-index: 99;
      right: 0;
      top: 6.25rem;
      bottom: 0;
      display: flex;
      flex-direction: column;
      color: #8c8c8c;
      li { flex: 1; }
    }

    .content {
      text-align: left;

      .location {
        padding: 0 0.9375rem;

        .title {
          color: #666;
          font-size: 14px;
          line-height: 2.25rem;
        }

        ul {
          display: flex;
          flex-wrap: wrap;
          padding: 0 1.25rem;

          li {
            float: left;
            padding: 0 1rem;
            margin-right: 0.375rem;
            margin-bottom: 0.375rem;
            background: #fff;
            border: solid 0.0625rem #ebebeb;
            font-size: 12px;
            color: #333;
            height: 1.875rem;
            line-height: 1.875rem;
            text-align: center;
            border-radius: 0.25rem;
          }
        }
      }

      .list {
        .title {
          color: #666;
          font-size: 12px;
          line-height: 1.5rem;
          padding-left: 0.875rem;
          background-color: #fafafa;
        }

        ul {
          padding-left: 2.875rem;
          background: #fff;

          li {
            width: 100%;
            height: 2.25rem;
            line-height: 2.25rem;
            border-bottom: 0.0625rem solid #ebebeb;
            color: #333;
          }
          li:last-child { border-bottom: 0; }
        }
      }
    }
  }
</style>