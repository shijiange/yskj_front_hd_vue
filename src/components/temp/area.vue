<template>
<div id="area">
<div class="fe-mod fe-mod-3" :style="{'text-align':datas.params.align,'color':datas.params.color,'background-color':datas.params.bgcolor}">
    <h2 @click="areaClick()" :style="{'font-size':datas.params.fontsize1}">
    <img  src="../../assets/images/choose_city.png" :width="datas.data[1]">
    {{datas.params.title1|| '点击选择区域'}}</h2>
    <h4 :style="{'font-size':datas.params.fontsize2}" v-show="datas.params.showtitle2 == 1">{{datas.params.title2|| '区域说明'}}</h4>

</div>

<div id="container"></div>
</div>
</template>
<script>
export default {
  props: ['datas'],
  mounted(){

  },
  methods:{
    areaClick(){
      console.log('点击响应，ajax得到数据后写入#container');
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#area {
  text-align: left;
  padding: 0.625rem;
  .fe-mod-3 h2 { padding: 0; margin: 0; font-size: 18px; font-weight: 100; img { vertical-align: middle; } }
  .fe-mod-3 h4 { padding: 0; margin: 0; font-size: 14px; font-weight: 100; padding-top: 0.1875rem; }
  .select_place_bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(12, 2, 2, 0.82); z-index: 2000; }
  .select_place_box { position: fixed; top: 50%; z-index: 9999; max-width: 40rem; width: 100%; overflow: hidden; margin-top: -1.25rem; }
  .index_tabBox { overflow: hidden; margin: 0.625rem; background: #fff; }
  .index_tabBox ul { padding: 0.3125rem 0.625rem; vertical-align: top; width: 100%; }
  .index_tabBox li { height: 1.25rem; line-height: 1.5rem; border: 0.0625rem dashed rgba(204, 182, 182, 0.07); width: 25%; float: left; margin: 0.3125rem 0 0.3125rem 0; }
  .index_tabBox .bd li a { display: block; text-align: center; color: #6a6868; font-size: 13px; }
}
</style>