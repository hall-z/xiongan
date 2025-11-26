<template>
  <view>
    <view>
      <view style="position: fixed; right: 0; bottom: 40px; z-index: 1">
        <!-- <image
          @click="toggleTrackMode"
          src="../../static/track.png"
          style="width: 40px; height: 40px; margin-bottom: 10px"
        ></image>
        <image
          @click="testlist"
          src="../../static/location.png"
          style="width: 40px; height: 40px; margin-bottom: 10px"
        ></image>
        <image
          @click="location"
          src="../../static/location.png"
          style="width: 40px; height: 40px"
        ></image> -->
      </view>
    </view>
    <map
      id="map"
      ref="mapRef"
      :style="`width: ${width}; height: ${height};`"
      :scale="map.scale"
      @regionchange="regionchange"
      @updated="updated"
      :latitude="map.latitude"
      :longitude="map.longitude"
      :markers="covers"
      :show-location="true"
      :polyline="polyline"
      @callouttap="handleMarkerClick"
      @markertap="handleMarkerClick"
    ></map>

    <!-- 最近厕所信息显示区域 -->
    <view v-if="displayToilet" class="nearest-toilet-panel">
      <view class="toilet-info">
        <text class="toilet-name">{{ displayToilet.name }}</text>
        <view class="toilet-details">
          <text v-if="displayToilet.distance !== undefined" class="toilet-distance">
            距离：{{ displayToilet.distance }}米
          </text>
          <text v-if="displayToilet.duration !== undefined" class="toilet-duration">
            用时：{{ Math.ceil(displayToilet.duration / 60) }}分钟
          </text>
        </view>
        <text class="toilet-address">地址：{{ displayToilet.address }}</text>
      </view>
      <button class="navigate-btn" @click="navigateToToilet">导航</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// 响应式数据
const height = ref('500px')
const width = ref('500px')
const map = reactive({
  scale: 17,
  latitude: 39.038,
  longitude: 116.145,
})
const covers = ref([])
const polyline = ref([]) // 轨迹线
const isTrackMode = ref(false) // 轨迹模式开关
const selectedMarker = ref(null) // 当前选中的标记点
const currentUserLocation = ref(null) // 当前用户位置
const trackedToilet = ref(null) // 正在查看轨迹的厕所

const list = ref([
  {
    id: 1,
    name: '金湖园东WC(24小时开放)',
    address: '金湖西路74号',
    longitude: 115.931504,
    latitude: 39.067017,
  },
  {
    id: 2,
    name: '和谐园南WC(24小时开放)',
    address: '和谐园5号楼下',
    longitude: 115.924435,
    latitude: 39.068118,
  },
  {
    id: 3,
    name: '盛兴园西WC(24小时开放)',
    address: '善容路109号',
    longitude: 115.92568,
    latitude: 39.070683,
  },
  {
    id: 4,
    name: '悦祥园南WC(24小时开放)',
    address: '乐安街185号',
    longitude: 115.92591,
    latitude: 39.074245,
  },
  {
    id: 5,
    name: '红莲中园西WC(24小时开放)',
    address: '善容路15号',
    longitude: 115.923802,
    latitude: 39.077293,
  },
  {
    id: 6,
    name: '红莲中园东WC(24小时开放)',
    address: '崇文北110号',
    longitude: 115.927397,
    latitude: 39.078933,
  },
  {
    id: 7,
    name: '红莲西园东WC(24小时开放)',
    address: '新荷东路6号',
    longitude: 115.921376,
    latitude: 39.076859,
  },
  {
    id: 8,
    name: '红莲西园西WC(24小时开放)',
    address: '新荷西路10号',
    longitude: 115.919027,
    latitude: 39.076072,
  },
  {
    id: 9,
    name: '容和园东WC(24小时开放)',
    address: '崇文北路126号',
    longitude: 115.927874,
    latitude: 39.077604,
  },
  {
    id: 10,
    name: '玉泉庭南WC(24小时开放)',
    address: '八于街75号',
    longitude: 115.9373,
    latitude: 39.07714,
  },
  {
    id: 11,
    name: '杏秋苑东WC(24小时开放)',
    address: '容德东路6号',
    longitude: 115.949561,
    latitude: 39.079713,
  },
  {
    id: 12,
    name: '红枫苑西WC(24小时开放)',
    address: '渥城北路37号',
    longitude: 115.952819,
    latitude: 39.080167,
  },
  {
    id: 13,
    name: '弘文花园西WC(24小时开放)',
    address: '河北省保定市容城县弘文西路',
    longitude: 115.958348,
    latitude: 39.075245,
  },
  {
    id: 14,
    name: '弘文花园东WC(24小时开放)',
    address: '河北省保定市容城县乐安街',
    longitude: 115.961514,
    latitude: 39.07528,
  },
  {
    id: 15,
    name: '弘信花园东WC(24小时开放)',
    address: '河北省保定市容城县文营西路',
    longitude: 115.957364,
    latitude: 39.071765,
  },
  {
    id: 16,
    name: '尚德花园北WC(24小时开放)',
    address: '双文北街双文幼儿园对面',
    longitude: 115.960147,
    latitude: 39.070668,
  },
  {
    id: 17,
    name: '滨河园西WC(24小时开放)',
    address: '善容路滨河园小区楼下',
    longitude: 115.926247,
    latitude: 39.066054,
  },
  {
    id: 18,
    name: '临波庭南WC(24小时开放)',
    address: '八于街53号',
    longitude: 115.939623,
    latitude: 39.077801,
  },
  {
    id: 19,
    name: '盛芳花园东WC(24小时开放)',
    address: '河北省保定市容城县',
    longitude: 115.95739,
    latitude: 39.067129,
  },
  {
    id: 20,
    name: '康宁园西WC(24小时开放)',
    address: '河北省保定市容城县乐安街',
    longitude: 115.923875,
    latitude: 39.071943,
  },
  {
    id: 21,
    name: '丹若苑WC(24小时开放)',
    address: '渥城北路65号公寓楼内',
    longitude: 115.95449,
    latitude: 39.0775,
  },
  {
    id: 22,
    name: '红莲东园南WC(24小时开放)',
    address: '河北省保定市容城县',
    longitude: 115.93389,
    latitude: 39.079702,
  },
  {
    id: 23,
    name: '荷香园西WC(24小时开放)',
    address: '红莲街118号',
    longitude: 115.931011,
    latitude: 39.078512,
  },
  {
    id: 24,
    name: '荷香园东WC(24小时开放)',
    address: '龚庄路14号',
    longitude: 115.932713,
    latitude: 39.078522,
  },
  {
    id: 25,
    name: '树华园北WC(24小时开放)',
    address: '八于街104号',
    longitude: 115.933293,
    latitude: 39.075785,
  },
  {
    id: 26,
    name: '兴达苑西WC(24小时开放)',
    address: '河北省保定市容城县紫薇园东南62.9米',
    longitude: 115.941961,
    latitude: 39.073536,
  },
  {
    id: 27,
    name: '甘霖苑西WC(24小时开放)',
    address: '金源东路槐香社区旁',
    longitude: 115.938382,
    latitude: 39.073484,
  },
  {
    id: 28,
    name: '居安苑南33号WC(24小时开放)',
    address: '河北省保定市容城县金湖街',
    longitude: 115.947848,
    latitude: 39.066185,
  },
  {
    id: 29,
    name: '居安苑南37号WC(24小时开放)',
    address: '河北省保定市容城县金湖街',
    longitude: 115.946758,
    latitude: 39.066222,
  },
  {
    id: 30,
    name: '春茗苑东WC(24小时开放)',
    address: '河北省保定市容城县',
    longitude: 115.950732,
    latitude: 39.073231,
  },
  {
    id: 31,
    name: '悦泽苑东WC(24小时开放)',
    address: '河北省保定市容城县',
    longitude: 115.948106,
    latitude: 39.073673,
  },
  {
    id: 32,
    name: '广业园东WC(24小时开放)',
    address: '河北雄安新区容东片区龚庄路44号',
    longitude: 115.934467,
    latitude: 39.071828,
  },
  {
    id: 33,
    name: '朝晖园西WC(24小时开放)',
    address: '河北雄安新区容东片区龚庄路23号',
    longitude: 115.934649,
    latitude: 39.074101,
  },
  {
    id: 34,
    name: '福星苑南WC(24小时开放)',
    address: '金湖街11号',
    longitude: 115.950468,
    latitude: 39.066152,
  },
  {
    id: 35,
    name: '日新园西WC(24小时开放)',
    address: '河北省保定市容城县崇文北路',
    longitude: 115.929902,
    latitude: 39.072893,
  },
  {
    id: 36,
    name: '海棠苑东WC(24小时开放)',
    address: '河北省保定市容城县雄安新区中铁十二局工友生活住宿区东北73.1米',
    longitude: 115.950809,
    latitude: 39.074894,
  },
  {
    id: 37,
    name: '长庆居WC(24小时开放)',
    address: '兴易路3号',
    longitude: 116.148953,
    latitude: 39.030207,
  },
  {
    id: 38,
    name: '长庆居WC(24小时开放)',
    address: '河北省保定市雄县兴易路',
    longitude: 116.149146,
    latitude: 39.029307,
  },
  {
    id: 39,
    name: '朗惠苑WC(24小时开放)',
    address: '河北省雄安新区雄县望驾街',
    longitude: 116.154693,
    latitude: 39.029112,
  },
  {
    id: 40,
    name: '红景苑WC(24小时开放)',
    address: '同德二路27号',
    longitude: 116.15786,
    latitude: 39.026665,
  },
  {
    id: 41,
    name: '金秋园WC(24小时开放)',
    address: '同德二路14号',
    longitude: 116.156351,
    latitude: 39.02375,
  },
  {
    id: 42,
    name: '富汇园WC(24小时开放)',
    address: '同德四路45号',
    longitude: 116.154698,
    latitude: 39.024016,
  },
  {
    id: 43,
    name: '金泽坊WC(24小时开放)',
    address: '学苑西路11号',
    longitude: 116.145858,
    latitude: 39.024114,
  },
  {
    id: 44,
    name: '锦帆坊WC(24小时开放)',
    address: '兴易路21号',
    longitude: 116.149434,
    latitude: 39.022797,
  },
  {
    id: 45,
    name: '福满园WC(24小时开放)',
    address: '同德四路64号',
    longitude: 116.153458,
    latitude: 39.022152,
  },
  {
    id: 46,
    name: '活力景观带南WC(24小时开放)',
    address: '河北省保定市雄县涞济路',
    longitude: 116.151679,
    latitude: 39.02204,
  },
  {
    id: 47,
    name: '丹溪苑南WC(24小时开放)',
    address: '河北省保定市容城县容霸路',
    longitude: 115.819379,
    latitude: 39.068005,
  },
  {
    id: 48,
    name: '玉柳北苑WC(24小时开放)',
    address: '河北省保定市容城县进德街',
    longitude: 115.820859,
    latitude: 39.06982,
  },
  {
    id: 49,
    name: '敬贤庭WC(24小时开放)',
    address: '河北省保定市容城县容华街',
    longitude: 115.829819,
    latitude: 39.0712,
  },
  {
    id: 50,
    name: '容华院小区WC(24小时开放)',
    address: '河北省保定市容城县龙泉西路',
    longitude: 115.834522,
    latitude: 39.071284,
  },
  {
    id: 51,
    name: '容华街禄安园WC(24小时开放)',
    address: '河北省保定市容城县容华街',
    longitude: 115.848599,
    latitude: 39.071771,
  },
  {
    id: 52,
    name: '裕丰北苑WC(24小时开放)',
    address: '河北省保定市容城县大水大街',
    longitude: 115.852888,
    latitude: 39.071998,
  },
  {
    id: 53,
    name: '兴学街WC(24小时开放)',
    address: '河北省保定市容城县兴学街',
    longitude: 115.852937,
    latitude: 39.065633,
  },
  {
    id: 54,
    name: '育兴园WC(24小时开放)',
    address: '河北省保定市容城县育兴东路',
    longitude: 115.846029,
    latitude: 39.067551,
  },
  {
    id: 55,
    name: '进徳街飞泉党群WC(24小时开放)',
    address: '河北省保定市容城县锦霞东路',
    longitude: 115.831823,
    latitude: 39.069358,
  },
  {
    id: 56,
    name: '进徳街陶然南苑WC(24小时开放)',
    address: '河北省保定市容城县进德街',
    longitude: 115.83317,
    latitude: 39.069001,
  },
  {
    id: 57,
    name: '滨水路滨水北湾WC(24小时开放)',
    address: '河北省保定市容城县滨水路',
    longitude: 115.839566,
    latitude: 39.066543,
  },
  {
    id: 58,
    name: '河照北湾WC(24小时开放)',
    address: '河北省保定市容城县楼堤路',
    longitude: 115.842072,
    latitude: 39.067121,
  },
  {
    id: 59,
    name: '河照中湾WC(24小时开放)',
    address: '河北省保定市容城县龙泉东步行街',
    longitude: 115.841812,
    latitude: 39.066431,
  },
  {
    id: 60,
    name: '富民东庭WC(24小时开放)',
    address: '河北省保定市容城县富民街',
    longitude: 115.839845,
    latitude: 39.053166,
  },
  {
    id: 61,
    name: '春晓南庭WC(24小时开放)',
    address: '河北省保定市容城县福康中路',
    longitude: 115.836961,
    latitude: 39.052518,
  },
  {
    id: 62,
    name: '福康西路51号WC(24小时开放)',
    address: '河北省保定市容城县福康西路',
    longitude: 115.835694,
    latitude: 39.055302,
  },
  {
    id: 63,
    name: '春晓北庭67号WC(24小时开放)',
    address: '河北省保定市容城县福康西路',
    longitude: 115.835703,
    latitude: 39.053754,
  },
  {
    id: 64,
    name: '璟云庭二区WC(24小时开放)',
    address: '河北省保定市容城县中建三局容东片区G2标段项目管理部东北335.7米',
    longitude: 115.957551,
    latitude: 39.059372,
  },
  {
    id: 65,
    name: '璟华庭二区东WC(24小时开放)',
    address: '河北省保定市容城县春明二街',
    longitude: 115.950643,
    latitude: 39.06044,
  },
  {
    id: 66,
    name: '咏华园四区北WC(24小时开放)',
    address: '河北省保定市容城县雄安新区容东DEG社区RDSG-5标项目管理部东南56.2米',
    longitude: 115.949139,
    latitude: 39.056609,
  },
  {
    id: 67,
    name: '迎福庭WC(24小时开放)',
    address: '雄B聚福东路59号',
    longitude: 116.138528,
    latitude: 39.016967,
  },
  {
    id: 68,
    name: '富宏西庭WC(24小时开放)  ',
    address: '雄B文兴路76号',
    longitude: 116.142373,
    latitude: 39.018592,
  },
  {
    id: 69,
    name: '丰宁西居WC(24小时开放)  ',
    address: '雄B雄昝路115号',
    longitude: 116.144601,
    latitude: 39.017191,
  },
  {
    id: 70,
    name: '嘉泰东园WC(24小时开放)  ',
    address: '雄B宁泰路75号',
    longitude: 116.146972,
    latitude: 39.019209,
  },
  {
    id: 71,
    name: '嘉兰园WC(24小时开放)  ',
    address: '雄B望溪北路16号',
    longitude: 116.153584,
    latitude: 39.019041,
  },
  {
    id: 72,
    name: '龙润中居WC(24小时开放)  ',
    address: '雄B兴易路184号',
    longitude: 116.149559,
    latitude: 39.014668,
  },
  {
    id: 73,
    name: '育才南坊WC(24小时开放)  ',
    address: '雄B涞济路200号',
    longitude: 0.0,
    latitude: 0.0,
  },
  {
    id: 74,
    name: '晓书西坊WC(24小时开放)  ',
    address: '雄B永安街112-1号',
    longitude: 116.157608,
    latitude: 39.014331,
  },
  {
    id: 75,
    name: '龙华湾WC(24小时开放)',
    address: '容西片区容华街127-1号',
    longitude: 115.84081,
    latitude: 39.071774,
  },
  {
    id: 76,
    name: '盛景中苑WC(24小时开放)',
    address: '容西片区盛景步行街25号旁',
    longitude: 115.844727,
    latitude: 39.062043,
  },
  {
    id: 77,
    name: '同福园WC(24小时开放)',
    address: '容西片区文苑中路7号',
    longitude: 115.850557,
    latitude: 39.05789,
  },
  {
    id: 78,
    name: '容西法院WC(24小时开放)',
    address: '容西片区楼堤路法院公卫',
    longitude: 115.84011,
    latitude: 39.056314,
  },
  {
    id: 79,
    name: '祥辉庭WC(24小时开放)',
    address: '容西片区祥辉路21号',
    longitude: 115.821901,
    latitude: 39.063574,
  },
  {
    id: 80,
    name: '悦华园二区WC(24小时开放)',
    address: '河北省保定市容城县张市路',
    longitude: 115.95588,
    latitude: 39.055779,
  },
  {
    id: 81,
    name: '悦华园一区WC(24小时开放)',
    address: '河北省保定市容城县中建三局容东片区G2标段项目管理部东南260.8米',
    longitude: 115.957053,
    latitude: 39.057624,
  },
  {
    id: 82,
    name: '育才南坊WC(24小时开放)',
    address: '河北省保定市雄县涞济路',
    longitude: 116.152021,
    latitude: 39.004658,
  },
  {
    id: 83,
    name: '华序府WC(24小时开放)',
    address: '河北省保定市容城县启动区体育中心项目北京城建总承包部东南415.0米',
    longitude: 115.972229,
    latitude: 39.038854,
  },
  {
    id: 84,
    name: '咏华园二区WC(24小时开放)',
    address: '河北省保定市容城县中建八局容东片区G1标段项目管理部西北216.1米',
    longitude: 115.951932,
    latitude: 39.056546,
  },
  {
    id: 85,
    name: '咏华园二区WC(24小时开放)',
    address: '河北省保定市容城县中建八局容东片区G1标段项目管理部西北201.5米',
    longitude: 115.951932,
    latitude: 39.056546,
  },
  {
    id: 86,
    name: '福汇园WC(24小时开放)',
    address: '中国河北省保定市雄县涞济路隆昌居0312',
    longitude: 116.151542,
    latitude: 39.031363,
  },
])

const mapList = ref([])

const load = ref(true)

// 计算最近的厕所
const nearestToilet = computed(() => {
  if (!currentUserLocation.value || list.value.length === 0) {
    return null
  }

  let nearest = null
  let minDistance = Infinity

  list.value.forEach((toilet) => {
    // 跳过无效坐标
    if (!toilet.latitude || !toilet.longitude || toilet.latitude === 0 || toilet.longitude === 0) {
      return
    }

    const distance = calculateDistance(
      currentUserLocation.value.latitude,
      currentUserLocation.value.longitude,
      toilet.latitude,
      toilet.longitude,
    )

    if (distance < minDistance) {
      minDistance = distance
      nearest = {
        ...toilet,
        distance: Math.round(distance),
      }
    }
  })

  return nearest
})

// 决定显示哪个厕所信息（优先显示正在查看轨迹的厕所，否则显示最近的厕所）
const displayToilet = computed(() => {
  // 如果正在查看某个厕所的轨迹，则显示该厕所信息
  if (trackedToilet.value) {
    return trackedToilet.value
  }
  // 否则显示最近的厕所
  return nearestToilet.value
})

// 引用
const mapRef = ref(null)
let mapContext = null

// 生命周期钩子
onMounted(() => {
  // 创建地图上下文
  mapContext = uni.createMapContext('map', getCurrentInstance().proxy)

  uni.getSystemInfo({
    success: (res) => {
      height.value = res.windowHeight + 'px'
      width.value = res.windowWidth + 'px'
    },
  })
  list.value = convertToiletListCoordinates(list.value)
  location()
  showAllToilets() // 添加这一行，显示所有厕所标记点
  // 添加默认轨迹绘制
  drawDefaultTrack()
})

// 绘制默认轨迹（从当前位置到最近的厕所）
const drawDefaultTrack = () => {
  // 使用 setTimeout 确保位置获取完成
  setTimeout(() => {
    if (currentUserLocation.value && nearestToilet.value) {
      drawTrack(nearestToilet.value)
    }
  }, 1000)
}

// 当视野发生改变
const regionchange = () => {
  console.log('当视野发生改变')
}
// 显示所有厕所标记点
const showAllToilets = () => {
  const markers = list.value.map(toilet => {
    // 跳过无效坐标
    if (!toilet.latitude || !toilet.longitude || toilet.latitude === 0 || toilet.longitude === 0) {
      return null
    }
    
    return {
      id: toilet.id || toilet.name,
      latitude: toilet.latitude,
      longitude: toilet.longitude,
      iconPath: '../../static/images/map/gc.png',
      width: 30,
      height: 30,
      callout: {
        content: toilet.name,
        display: 'BYCLICK',
        padding: 10,
        borderRadius: 4,
      },
    }
  }).filter(marker => marker !== null) // 过滤掉空值
  
  covers.value = markers
}

// 根据东北 西南经纬度 以及后台返回标记点 格式化成小程序marker点
const getFortMatMarkerList = (northeast, southwest, scale, backendMarkerList) => {
  // 屏幕中显示的经度的长度和纬度的长度
  const mapWidth = southwest.longitude - northeast.longitude
  const mapHeight = northeast.latitude - southwest.latitude
  // 将屏幕中地图分割的横向 格子数和 纵向格子数
  const widthSize = scale
  const heightSize = widthSize + parseInt(scale / 2)
  // 计算每个格子的经纬度的长度
  const unitWidth = mapWidth / widthSize
  const unitHeight = mapHeight / heightSize

  const pointData = {}
  backendMarkerList.forEach((latLng) => {
    // 如果点在显示范围内
    if (
      latLng.latitude < northeast.latitude &&
      latLng.latitude > southwest.latitude &&
      latLng.longitude < northeast.longitude &&
      latLng.longitude > southwest.longitude
    ) {
      const relativeX = latLng.longitude - northeast.longitude
      const relativeY = latLng.latitude - southwest.latitude
      // 计算出这个点，处于哪个格子
      const x = parseInt(Math.floor(relativeX / unitWidth))
      const y = parseInt(Math.floor(relativeY / unitHeight))

      // 生成单元格点位数据
      const pointKey = x + ',' + y
      if (pointData[pointKey] == undefined) {
        pointData[pointKey] = []
      }
      pointData[pointKey].push(latLng)
    }
  })

  const resultMapArray = []
  for (let y = 0; y < heightSize; y++) {
    for (let x = 0; x < widthSize; x++) {
      const pointKey = x + ',' + y
      // 筛选有点位的格子
      if (pointData[pointKey] != undefined) {
        let markerItem = {}
        // 聚合点与单点共存 , 长度等于一 不聚合点
        if (pointData[pointKey].length == 1) {
          markerItem = {
            id: pointData[pointKey][0].id || pointData[pointKey][0].name, // 使用name作为id避免undefined
            latitude: pointData[pointKey][0].latitude,
            longitude: pointData[pointKey][0].longitude,
            iconPath: '../../static/images/map/gc.png',
            width: 30,
            height: 30,
            callout: {
              content: pointData[pointKey][0].name,
              display: 'BYCLICK',
              padding: 10,
              borderRadius: 4,
            },
          }
        } else if (pointData[pointKey].length > 1) {
          // 聚合点
          markerItem = {
            id: pointData[pointKey][0].id || pointData[pointKey][0].name,
            latitude: pointData[pointKey][0].latitude,
            longitude: pointData[pointKey][0].longitude,
            iconPath: '../../static/images/map/gc.png',
            width: 30,
            height: 30,
          }
        }
        resultMapArray.push(markerItem)
      }
    }
  }
  mapList.value = resultMapArray
  return resultMapArray
}

const updated = () => {
  console.log('渲染完成')
}


// 定位当前
const location = () => {
  console.log('开始获取地址')
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      // 保存用户当前位置
      currentUserLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude,
      }

      map.latitude = res.latitude
      map.longitude = res.longitude

      mapContext.moveToLocation({
        latitude: res.latitude,
        longitude: res.longitude,
      })
    },
    fail: () => {
      console.log('地理位置获取失败')
    },
  })
}

// const testlist = () => {
//   getList()
// }

// const getList = (la = 0, lo = 0) => {
//   mapContext.getCenterLocation({
//     success: (res) => {
//       let latitude = res.latitude
//       let longitude = res.longitude
//       if (la !== 0) {
//         latitude = la
//         longitude = lo
//       }
//     },
//   })
// }

// 处理标记点点击事件
const handleMarkerClick = (e) => {
  console.log('marker clicked', e)
  const markerId = e.detail.markerId
  const marker = list.value.find((item) => item.name === markerId || item.id === markerId)
  if (marker) {
    selectedMarker.value = marker
    drawTrack(marker)
    // if (isTrackMode.value) {
    //   // 在轨迹模式下，获取轨迹数据并绘制
    //   drawTrack(marker)
    // } else {
    //   // 普通模式下显示信息
    //   uni.showModal({
    //     title: '厕所名称：' + marker.name,
    //     content: '厕所地址：' + marker.address,
    //     confirmText: '查看轨迹',
    //     success: function (res) {
    //       if (res.confirm) {
    //         drawTrack(marker)
    //       }
    //     },
    //   })
    // }
  }
}

// 绘制轨迹
const drawTrack = (marker) => {
  // 设置正在查看轨迹的厕所
  trackedToilet.value = marker

  // 如果有用户位置信息，计算并显示距离
  if (currentUserLocation.value) {
    const distance = calculateDistance(
      currentUserLocation.value.latitude,
      currentUserLocation.value.longitude,
      marker.latitude,
      marker.longitude,
    )
    trackedToilet.value = {
      ...marker,
      distance: Math.round(distance),
    }
  }

  // 只有当用户位置存在时才请求路径
  if (currentUserLocation.value) {
    console.log(marker, map)
    // 通过腾讯的规划接口获取线路信息
    uni.request({
      url: 'https://restapi.amap.com/v3/direction/walking?parameters',
      data: {
        origin: currentUserLocation.value.longitude + ',' + currentUserLocation.value.latitude, // 出发点,当前定位
        destination: marker.longitude + ',' + marker.latitude, // 目的
        key: '',
      },
      success: (res) => {
        console.log(res)
        const trackPoints = []
        const stepsList = res.data.route.paths[0].steps
        const duration = res.data.route.paths[0].duration
        stepsList.forEach((item) => {
          const polen = item.polyline.split(';')
          polen.forEach((vv) => {
            const splits = vv.split(',')
            trackPoints.push({
              longitude: parseFloat(splits[0]),
              latitude: parseFloat(splits[1]),
            })
          })
        })
        polyline.value = [
          {
            points: trackPoints,
            color: '#58C06C',
            width: 4,
            dottedLine: false,
          },
        ]
        // 更新 trackedToilet，添加 duration 信息
        if (currentUserLocation.value) {
          const distance = calculateDistance(
            currentUserLocation.value.latitude,
            currentUserLocation.value.longitude,
            marker.latitude,
            marker.longitude,
          )
          trackedToilet.value = {
            ...marker,
            distance: Math.round(distance),
            duration: parseInt(duration) // 添加 duration 字段
          }
        }
        // uni.showToast({
        //   title: '已显示轨迹',
        //   icon: 'success',
        // })
      },
    })
  }
}



/**
 * 百度坐标系(BD-09)转高德坐标系(GCJ-02)
 * @param {number} bdLat - 百度坐标纬度
 * @param {number} bdLng - 百度坐标经度
 * @returns {Object} 转换后的高德坐标 {lat, lng}
 */
const bd09ToGcj02 = (bdLat, bdLng) => {
  const x = bdLng - 0.0065
  const y = bdLat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000.0 / 180.0)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000.0 / 180.0)
  
  const gcjLng = z * Math.cos(theta)
  const gcjLat = z * Math.sin(theta)
  
  return {
    lat: gcjLat,
    lng: gcjLng
  }
}

/**
 * 批量转换百度坐标为高德坐标
 * @param {Array} toiletList - 厕所列表
 * @returns {Array} 转换后的厕所列表
 */
const convertToiletListCoordinates = (toiletList) => {
  return toiletList.map(toilet => {
    // 检查是否为有效坐标
    if (toilet.latitude && toilet.longitude && 
        toilet.latitude !== 0 && toilet.longitude !== 0) {
      // 假设原始数据是BD-09坐标系
      const gcjCoords = bd09ToGcj02(toilet.latitude, toilet.longitude)
      return {
        ...toilet,
        latitude: gcjCoords.lat,
        longitude: gcjCoords.lng
      }
    }
    return toilet
  })
}

// 计算两点间距离（单位：米）
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  // console.log(lat1, lng1, lat2, lng2)
  const radLat1 = (lat1 * Math.PI) / 180.0
  const radLat2 = (lat2 * Math.PI) / 180.0
  const a = radLat1 - radLat2
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
      ),
    )
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 // 输出为公里
  // s=s.toFixed(2);
  return s * 1000 // 转换为米
}

// 导航到最近的厕所
const navigateToToilet = () => {
  const toilet = displayToilet.value
  if (toilet) {
    uni.openLocation({
      latitude: parseFloat(toilet.latitude),
      longitude: parseFloat(toilet.longitude),
      name: toilet.name,
      address: toilet.address,
      success: () => {
        console.log('打开地图成功')
      },
      fail: (err) => {
        console.error('打开地图失败', err)
        uni.showToast({
          title: '无法打开地图',
          icon: 'none',
        })
      },
    })
  }
}
</script>

<style scoped>
.nearest-toilet-panel {
  position: fixed;
  right: 10px;
  bottom: 20px;
  left: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toilet-info {
  flex: 1;
}

.toilet-name {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.toilet-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 3px;
}

.toilet-distance {
  font-size: 14px;
  color: #ff6600;
  margin-right: 10px;
}

.toilet-address {
  display: block;
  font-size: 12px;
  color: #666;
}

.toilet-duration {
  font-size: 14px;
  color: #007aff;
}

.navigate-btn {
  padding: 8px 15px;
  font-size: 14px;
  color: white;
  white-space: nowrap;
  background-color: #007aff;
  border: none;
  border-radius: 5px;
}
</style>
