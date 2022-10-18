<template>
  <div id="delivery_map" style="width: 100%; height: 100%;"></div>
</template>

<script>
import AMap from 'AMap';

export default {
  name: 'deliveryMap',
  data() {
    return {};
  },
  props: {
    path_list: {
      type: Array
    },
    center_path: {
      type: Array
    }
  },

  created() {
    // this.setMap();
  },
  watch: {
    path_list() {
      this.setMap();
    }
  },
  mounted() {
    this.setMap();
    // console.log(this.path_list);
  },
  methods: {
    setMap: function(p) {
      // let that = this;
      var map = new AMap.Map('delivery_map', {
        center: this.center_path,
        zoom: 12
      });
      var marker = new AMap.Marker({
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: this.center_path
      });
      marker.setMap(map);
      var path = this.path_list;
      var polygon = new AMap.Polygon({
        path: path,
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50
      });
      map.add(polygon);
      // 缩放地图到合适的视野级别
      map.setFitView([polygon]);

      // var polyEditor = new AMap.PolyEditor(map, polygon)

      // polyEditor.on('addnode', function(event) {
      //     log.info('触发事件：addnode')
      // })

      // polyEditor.on('adjust', function(event) {
      //     log.info('触发事件：adjust')
      // })

      // polyEditor.on('removenode', function(event) {
      //     log.info('触发事件：removenode')
      // })

      // polyEditor.on('end', function(event) {
      //     log.info('触发事件： end')
      //     // event.target 即为编辑后的多边形对象
      // })
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#delivery_map {
  .amap-icon {
    img {
      width: 30px;
    }
  }
}
</style>
<style>
.amap-icon img {
  width: 25px;
  height: 34px;
}
</style>
