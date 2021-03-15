// 注册地图
import * as echarts from "echarts";
import map from "@/map_data/shen_zhen.json";

echarts.registerMap(map.name, map) // 注册深圳地图

export const mapName = map.name
export const title = map.title
