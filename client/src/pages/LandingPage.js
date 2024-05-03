import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Map } from "react-map-gl";
import DeckGL, { GeoJsonLayer, ScatterplotLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css"; //remove console log error
import "./LandingPage.css";
import dissolvedRoad from "../National_Road_Dissolved3.json";
import intPoint from "../National_Road_Interchange_Final_geojson";
import useTooltip from "../hooks/use-tooltip";
import useInfo from "../hooks/use-info";
import useEmiColor from "../hooks/use_emicolor";
import Controls from "../components/Controls";
import Basemap from "../components/Basemap";
import TopBar from "../components/TopBar";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicmVkc2lsdmVyNTIyIiwiYSI6ImNsaHl4enpjNzE4N3Eza3Bjemk3MTc1cDYifQ.EL1F3mAAhdlX1du8lCLDGw";

function LandingPage() {
  const { getTooltip } = useTooltip();
  const {
    info,
    taasInfo,
    tmsInfo,
    depth1,
    depth2,
    isFilter,
    view,
    setView,
    INITIAL_VIEW_STATE,
    LD,
    data,
    rdata,
    idata,
    pdata,
    activeMenu,
    acclayer1,
    acclayer2,
    showProfile,
    selectedRoad,
    pointer,
    pdepth,
    rdepth,
    rcbx,
    idepth,
    icbx,
  } = useInfo();
  const {
    getEmiVColor,
    getEmiPColor,
    getEmiBColor,
    getRoadColor,
    getTmsColor,
    getTmsdColor,
    getRaccColor,
    getIaccColor,
    getPaccColor,
  } = useEmiColor();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [length, setLength] = useState(null);
  const [basemap, setBasemap] = useState(
    "mapbox://styles/redsilver522/cli2ji9m500w901pofuyqhbtz"
  );

  //LAYERS
  const layer0 = new GeoJsonLayer({
    id: "oneroad",
    data: dissolvedRoad,
    lineWidthMaxPixels: 3,
    getLineColor:
      depth2 !== "교통량지점" ? [117, 147, 169, 200] : [0, 0, 0, 255 * 0.2],
    getLineWidth: 500,
    visible: view.zoom >= 6 && depth1 !== "TAAS",
  });

  const layer1 = useMemo(() => {
    if (!data.nroad) return null;

    return new GeoJsonLayer({
      id: "nationalRoad",
      data: data.nroad,
      lineWidthMaxPixels: 5,
      lineWidthMinPixels: 3,
      getLineWidth: 700,
      getLineColor: (d) => {
        switch (depth1) {
          case "도로현황":
            return getRoadColor(d);
          case "TMS":
            if (depth2 === "교통량구간") {
              return getTmsColor(d.properties.aadt_pred);
            } else {
              return [230, 0, 60, 0];
            }

          default:
            return [230, 0, 60];
        }
      },
      pickable: true,
      autoHighlight: true,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 6 &&
        (depth1 === "도로현황" ||
          (depth1 !== "TAAS" && depth2 !== "교통량지점" && depth2 !== null)),
      onClick: (i) => console.log(i),
      updateTriggers: {
        getLineColor: [info, depth1, tmsInfo],
      },
    });
  }, [
    data.nroad,
    depth1,
    depth2,
    isFilter,
    view.zoom,
    info,
    getRoadColor,
    getTmsColor,
    tmsInfo,
    activeMenu,
  ]);

  const layer2 = useMemo(() => {
    if (!data.emiroad) return null;

    return new GeoJsonLayer({
      id: "emiRoad",
      data: data.emiroad,
      lineWidthMaxPixels: 7,
      lineWidthMinPixels: depth2 !== null ? 4 : 1,
      getLineWidth: depth2 !== null ? 2000 : 1,
      getLineColor: (d) => {
        switch (depth2) {
          case "차량관점":
            return getEmiVColor(d.properties.emi_v);
          case "보행자관점":
            return getEmiPColor(d.properties.emi_p);
          case "자전거관점":
            return getEmiBColor(d.properties.emi_b);
          default:
            return [230, 0, 60];
        }
      },
      pickable: true,
      autoHighlight: true,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 6 &&
        depth1 === "TAAS",
      onClick: (i) => console.log(i),
      updateTriggers: {
        getLineColor: [taasInfo, depth2],
      },
    });
  }, [
    data.emiroad,
    depth1,
    depth2,
    taasInfo,
    getEmiVColor,
    getEmiPColor,
    getEmiBColor,
    isFilter,
    view.zoom,
    activeMenu,
  ]);

  /////////////////////////////////////////////////////
  const onHover = (info) => {
    if (info.object) {
      setHoveredItem({
        id: info.object.properties.id || info.object.properties.UID,
      });
    } else {
      setHoveredItem(null);
    }
  };

  const getDynamicPointRadius = useCallback(
    (d) => {
      if (
        hoveredItem &&
        (d.properties.id === hoveredItem.id ||
          d.properties.UID === hoveredItem.id)
      ) {
        return 200; // 1000
      }
      return 2; // 4
    },
    [hoveredItem]
  );
  /////////////////////////////////////////////////////

  const layer3 =
    depth1 === "도로현황" &&
    new GeoJsonLayer({
      id: "int",
      data: intPoint,
      stroked: true,
      filled: true,
      pointType: "circle",
      lineWidthScale: 10,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 3,
      getFillColor: [229, 252, 246],
      getLineColor: [60, 60, 60],
      getPointRadius: 100,
      // pickable: true,
      // onHover: onHover,
      // autoHighlight: true,
      // highlightColor: [255, 0, 0, 200],
      visible: activeMenu === "curr" && view.zoom >= 9.7,
    });

  const layer4 = useMemo(() => {
    if (!data.vpoint) return null;

    return new GeoJsonLayer({
      id: "vpoint",
      data: data.vpoint,
      lineWidthScale: 10,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 9.7 &&
        depth2 === "차량관점",
      onClick: (i) => console.log(i),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.vpoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer5 = useMemo(() => {
    if (!data.ppoint) return null;

    return new GeoJsonLayer({
      id: "ppoint",
      data: data.ppoint,
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 9.7 &&
        depth2 === "보행자관점",
      onClick: (i) => console.log(i),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.ppoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer6 = useMemo(() => {
    if (!data.bpoint) return null;

    return new GeoJsonLayer({
      id: "bpoint",
      data: data.bpoint,
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 10,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: [0, 0, 0, 255 * 0.25],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 9.7 &&
        depth2 === "자전거관점",
      onClick: (i) => console.log(i),
      updateTriggers: {
        getPointRadius: hoveredItem,
      },
    });
  }, [
    data.bpoint,
    depth2,
    isFilter,
    view.zoom,
    hoveredItem,
    getDynamicPointRadius,
    activeMenu,
  ]);

  const layer7 = useMemo(() => {
    if (!data.aadtDot) return null;

    return new GeoJsonLayer({
      id: "aadtdot",
      data: data.aadtDot,
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getFillColor: (d) => {
        return getTmsdColor(d.properties.Resduals);
      },
      getLineColor: [0, 0, 0, 255 * 0.75],
      pickable: true,
      autoHighlight: true,
      getPointRadius: 1000,
      visible:
        activeMenu === "curr" &&
        isFilter &&
        view.zoom >= 6 &&
        depth2 === "교통량지점",
      onClick: (i) => console.log(i),
      updateTriggers: {
        getFillColor: tmsInfo,
      },
    });
  }, [
    data.aadtDot,
    depth2,
    tmsInfo,
    isFilter,
    view.zoom,
    getTmsdColor,
    activeMenu,
  ]);

  // NP, LP, RP Layers //////////////////////////////////////////////////////////////////////

  const layer8 = useMemo(() => {
    if (!rdata) return null;

    return new GeoJsonLayer({
      id: "roadAcdnt",
      data: rdata.mergedGJ,
      lineWidthScale: 1000,
      lineWidthMaxPixels: 5,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getFillColor: [255, 255, 255, 255 * 0.7],
      getLineColor: (d) => {
        return getRaccColor(d.properties);
      },
      pickable: true,
      autoHighlight: true,
      onHover: onHover,
      onClick: (i) => console.log(i),
      visible:
        activeMenu === "acc" &&
        isFilter &&
        view.zoom >= 6 &&
        acclayer1 &&
        !showProfile,
      updateTriggers: {
        getLineColor: [rdepth, rcbx],
      },
    });
  }, [
    rdata,
    isFilter,
    view.zoom,
    activeMenu,
    acclayer1,
    showProfile,
    getRaccColor,
    rdepth,
    rcbx,
  ]);

  const layer9 = useMemo(() => {
    if (!idata) return null;

    return new GeoJsonLayer({
      id: "intAcdnt",
      data: idata.mergedGJ,
      lineWidthScale: 20,
      lineWidthMaxPixels: 2,
      pointRadiusMinPixels: 4,
      pointRadiusMaxPixels: 10,
      getFillColor: (d) => {
        return getIaccColor(d.properties);
      },
      getLineColor: [0, 0, 0, 255 * 0.75],
      pickable: true,
      autoHighlight: true,
      getPointRadius: getDynamicPointRadius,
      onHover: onHover,
      visible:
        activeMenu === "acc" &&
        isFilter &&
        view.zoom >= 6 &&
        acclayer2 &&
        !showProfile,
      onClick: (i) => console.log(i, icbx),
      updateTriggers: {
        getFillColor: [idepth, icbx],
        getPointRadius: hoveredItem,
      },
    });
  }, [
    idata,
    isFilter,
    view.zoom,
    activeMenu,
    acclayer2,
    hoveredItem,
    getDynamicPointRadius,
    getIaccColor,
    idepth,
    icbx,
    showProfile,
  ]);

  const layer10 = useMemo(() => {
    if (!pdata) return null;

    return new GeoJsonLayer({
      id: "riskprof",
      data: pdata.mergedGJ,
      lineWidthScale: 1000,
      lineWidthMaxPixels: 5,
      pointRadiusMinPixels: 3,
      pointRadiusMaxPixels: 7,
      getLineColor: (d) => {
        return getPaccColor(d.properties);
      },
      pickable: true,
      autoHighlight: true,
      onHover: onHover,
      onClick: (i) => console.log(i),
      visible:
        activeMenu === "acc" && isFilter && view.zoom >= 6 && showProfile,
      updateTriggers: {
        getLineColor: [pdepth, rdepth, selectedRoad],
      },
    });
  }, [
    pdata,
    pdepth,
    rdepth,
    isFilter,
    view.zoom,
    activeMenu,
    showProfile,
    selectedRoad,
    getPaccColor,
  ]);

  const layer11 = useMemo(() => {
    if (!pdata || !pointer) return null;

    const nodeFeature = pdata.mergedGJ.features.find(
      (feature) => feature.properties.fromnodeid === pointer
    );

    const pointData = nodeFeature ? [nodeFeature] : [];

    return new ScatterplotLayer({
      id: "pointer",
      data: pointData,
      getPosition: (d) => d.geometry.coordinates[0][0],
      getRadius:
        view.zoom <= 8
          ? 3000
          : view.zoom <= 9
          ? 2000
          : view.zoom <= 10
          ? 1000
          : view.zoom <= 11
          ? 500
          : view.zoom <= 12
          ? 200
          : view.zoom <= 14
          ? 100
          : view.zoom <= 15
          ? 50
          : view.zoom <= 17
          ? 20
          : 5,
      // 2869.23 / (view.zoom - 7.07),
      lineWidthScale: 10,
      getFillColor: [0, 170, 255, 255 * 0.85],
      stroked: true,
      lineWidthMaxPixels: 2,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      pickable: false,
      visible:
        activeMenu === "acc" && isFilter && view.zoom >= 6 && showProfile,
      updateTriggers: {
        getPosition: [pointer],
      },
    });
  }, [pdata, pointer, activeMenu, isFilter, showProfile, view.zoom]);

  const layers = [
    layer0,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    layer6,
    layer7,
    layer8,
    layer9,
    layer10,
    layer11,
  ];

  // 사고위험지도 setLength
  useEffect(() => {
    if (!acclayer1 || rcbx.every((val) => val === false)) {
      setLength(0);
      return;
    }
    if (rdata && rdepth.type === "car") {
      // 차량
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_bi_1 = Number(feature.properties.l_car_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_bi_1 && l_car_bi_1 < 0.003) ||
            (rcbx[3] && 0.003 <= l_car_bi_1 && l_car_bi_1 < 0.012) ||
            (rcbx[2] && 0.012 <= l_car_bi_1 && l_car_bi_1 < 0.029) ||
            (rcbx[1] && 0.029 <= l_car_bi_1 && l_car_bi_1 < 0.083) ||
            (rcbx[0] && 0.0823 <= l_car_bi_1 && l_car_bi_1 < 0.19)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_bi_2 = Number(feature.properties.l_car_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_bi_2 && l_car_bi_2 < 0.0141) ||
            (rcbx[3] && 0.0141 <= l_car_bi_2 && l_car_bi_2 < 0.04707) ||
            (rcbx[2] && 0.04707 <= l_car_bi_2 && l_car_bi_2 < 0.10406) ||
            (rcbx[1] && 0.10406 <= l_car_bi_2 && l_car_bi_2 < 0.23738) ||
            (rcbx[0] && 0.23738 <= l_car_bi_2 && l_car_bi_2 < 0.54188)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_car_abs = Number(feature.properties.l_car_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_car_abs && l_car_abs < 0.33642) ||
            (rcbx[3] && 0.33642 <= l_car_abs && l_car_abs < 1.33964) ||
            (rcbx[2] && 1.33964 <= l_car_abs && l_car_abs < 4.00281) ||
            (rcbx[1] && 4.00281 <= l_car_abs && l_car_abs < 13.0132) ||
            (rcbx[0] && 13.0132 <= l_car_abs && l_car_abs < 150.4113)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    } else if (rdata && rdepth.type === "walk") {
      // 보행자
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_bi_1 = Number(feature.properties.l_ped_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_ped_bi_1) ||
            (rcbx[3] && 0 < l_ped_bi_1 && l_ped_bi_1 < 0.002) ||
            (rcbx[2] && 0.002 <= l_ped_bi_1 && l_ped_bi_1 < 0.005) ||
            (rcbx[1] && 0.005 <= l_ped_bi_1 && l_ped_bi_1 < 0.014) ||
            (rcbx[0] && 0.014 <= l_ped_bi_1 && l_ped_bi_1 < 0.04)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_bi_2 = Number(feature.properties.l_ped_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_ped_bi_2 && l_ped_bi_2 < 0.003) ||
            (rcbx[3] && 0.003 <= l_ped_bi_2 && l_ped_bi_2 < 0.013) ||
            (rcbx[2] && 0.013 <= l_ped_bi_2 && l_ped_bi_2 < 0.032) ||
            (rcbx[1] && 0.032 <= l_ped_bi_2 && l_ped_bi_2 < 0.113) ||
            (rcbx[0] && 0.113 <= l_ped_bi_2 && l_ped_bi_2 < 0.27)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_ped_abs = Number(feature.properties.l_ped_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_ped_abs) ||
            (rcbx[3] && 0 <= l_ped_abs && l_ped_abs < 0.334) ||
            (rcbx[2] && 0.334 <= l_ped_abs && l_ped_abs < 1.333) ||
            (rcbx[1] && 1.333 <= l_ped_abs && l_ped_abs < 3.667) ||
            (rcbx[0] && 3.667 <= l_ped_abs && l_ped_abs < 20.68)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    } else if (rdata && rdepth.type === "bike") {
      // 자전거
      if (rdepth.index === 1) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_bi_1 = Number(feature.properties.l_cyc_bi_1);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_cyc_bi_1) ||
            (rcbx[3] && 0 < l_cyc_bi_1 && l_cyc_bi_1 < 0.001) ||
            (rcbx[2] && 0.001 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.003) ||
            (rcbx[1] && 0.003 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.007) ||
            (rcbx[0] && 0.0007 <= l_cyc_bi_1 && l_cyc_bi_1 < 0.03)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 2) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_bi_2 = Number(feature.properties.l_cyc_bi_2);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.001) ||
            (rcbx[3] && 0.001 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.005) ||
            (rcbx[2] && 0.005 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.014) ||
            (rcbx[1] && 0.014 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.038) ||
            (rcbx[0] && 0.038 <= l_cyc_bi_2 && l_cyc_bi_2 < 0.08)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      } else if (rdepth.index === 3) {
        if (rcbx.every((val) => val === true)) {
          setLength(14933);
          return;
        }
        let totalLength = 0;

        rdata.mergedGJ.features.forEach((feature) => {
          const l_cyc_abs = Number(feature.properties.l_cyc_abs);
          const length_l1 = Number(feature.properties.length_l1);

          if (
            (rcbx[4] && 0 >= l_cyc_abs) ||
            (rcbx[3] && 0 <= l_cyc_abs && l_cyc_abs < 0.3329) ||
            (rcbx[2] && 0.3329 <= l_cyc_abs && l_cyc_abs < 0.667) ||
            (rcbx[1] && 0.667 <= l_cyc_abs && l_cyc_abs < 1.667) ||
            (rcbx[0] && 1.667 <= l_cyc_abs && l_cyc_abs < 4.7)
          ) {
            totalLength += length_l1;
          }
        });
        if (totalLength < 1000) {
          setLength((totalLength / 1000).toFixed(2));
        } else {
          setLength(Math.round(totalLength / 1000));
        }
      }
    }
  }, [rdata, rdepth, rcbx, acclayer1, setLength]);

  // 도로현황 setLength
  useEffect(() => {
    if (data.nroad && info && depth1 === "도로현황") {
      const {
        roadNo,
        laneOps,
        facilOps,
        speedOps,
        barrierOps,
        lightOps,
        caronlyOps,
        onewayOps,
      } = info;
      const filterConditions = [];
      if (roadNo.selected) {
        filterConditions.push((feature) =>
          roadNo.selected.includes(parseInt(feature.properties.road_no))
        );
      }

      if (laneOps.checkboxes) {
        const laneRanges = ["1", "2", "3", "4", "5"];
        var laneConditions = laneOps.checkboxes
          .map((laneOp, index) => {
            if (laneOp) {
              return (feature) =>
                feature.properties.width === laneRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        laneConditions = [];
      }
      if (facilOps.checkboxes) {
        const facilRanges = ["0", "1", "2", "4", "8"];
        var facilConditions = facilOps.checkboxes
          .map((facilOp, index) => {
            if (facilOp) {
              return (feature) =>
                feature.properties.facil_kind === facilRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        facilConditions = [];
      }
      if (speedOps.checkboxes) {
        const speedRanges = [20, 30, 40, 50, 60, 70, 80];
        var speedConditions = speedOps.checkboxes
          .map((speedOp, index) => {
            if (speedOp) {
              if (index === 8) {
                return (feature) =>
                  feature.properties.max_spd === null ||
                  feature.properties.max_spd === 0;
              } else if (index === 7) {
                return (feature) =>
                  feature.properties.max_spd === 90 ||
                  feature.properties.max_spd === 100 ||
                  feature.properties.max_spd === 110;
              } else {
                return (feature) =>
                  feature.properties.max_spd === speedRanges[index];
              }
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        speedConditions = [];
      }
      if (barrierOps.checkboxes) {
        const barrierRanges = ["0", "1", "2", "3", "4", "5", "15"];
        var barrierConditions = barrierOps.checkboxes
          .map((barrierOp, index) => {
            if (barrierOp) {
              return (feature) =>
                feature.properties.barrier === barrierRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        barrierConditions = [];
      }
      if (lightOps.checkboxes) {
        const lightRanges = [0, 1, 2, 3, 4, null];
        var lightConditions = lightOps.checkboxes
          .map((lightOp, index) => {
            if (lightOp) {
              return (feature) =>
                feature.properties.num_cross === lightRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        lightConditions = [];
      }
      if (caronlyOps.checkboxes) {
        const caronlyRanges = ["0", "1", null];
        var caronlyConditions = caronlyOps.checkboxes
          .map((caronlyOp, index) => {
            if (caronlyOp) {
              return (feature) =>
                feature.properties.auto_exclu === caronlyRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        caronlyConditions = [];
      }
      if (onewayOps.checkboxes) {
        const onewayRanges = ["0", "1"];
        var onewayConditions = onewayOps.checkboxes
          .map((onewayOp, index) => {
            if (onewayOp) {
              return (feature) =>
                feature.properties.oneway === onewayRanges[index];
            } else {
              return null;
            }
          })
          .filter((condition) => condition !== null);
      } else {
        onewayConditions = [];
      }

      const filtered = data.nroad.features.filter((feature) => {
        return (
          filterConditions.every((condition) => condition(feature)) &&
          (laneConditions.length === 0 ||
            laneConditions.some((condition) => condition(feature))) &&
          (facilConditions.length === 0 ||
            facilConditions.some((condition) => condition(feature))) &&
          (speedConditions.length === 0 ||
            speedConditions.some((condition) => condition(feature))) &&
          (barrierConditions.length === 0 ||
            barrierConditions.some((condition) => condition(feature))) &&
          (lightConditions.length === 0 ||
            lightConditions.some((condition) => condition(feature))) &&
          (caronlyConditions.length === 0 ||
            caronlyConditions.some((condition) => condition(feature))) &&
          (onewayConditions.length === 0 ||
            onewayConditions.some((condition) => condition(feature)))
        );
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : 0;

      setLength(totalLength);
    } else if (data.emiroad && taasInfo && depth1 === "TAAS") {
      const filtered = data.emiroad.features.filter((feature) => {
        let emi, conditions;

        switch (depth2) {
          case "차량관점":
            emi = feature.properties.emi_v;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 261.86,
              taasInfo[2] && 261.86 < emi && emi <= 1573.98,
            ];
            break;

          case "보행자관점":
            emi = feature.properties.emi_p;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 253.88,
              taasInfo[2] && 253.88 < emi && emi <= 599.42,
            ];
            break;
          case "자전거관점":
            emi = feature.properties.emi_b;
            conditions = [
              taasInfo[0] && 0 === emi,
              taasInfo[1] && 0 < emi && emi <= 72.46,
              taasInfo[2] && 72.46 < emi && emi <= 185.56,
            ];
            break;
          default:
            conditions = [];
            break;
        }

        if (conditions.every((val) => val === false)) {
          return emi === -100;
        } else {
          return conditions.some((val) => val === true);
        }
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : depth1 === "TAAS"
          ? 14927
          : 0;

      setLength(totalLength);
    } else if (data.nroad && tmsInfo && depth2 === "교통량구간") {
      const filtered = data.nroad.features.filter((feature) => {
        let aadt, conditions;

        aadt = feature.properties.aadt_pred;
        conditions = [
          tmsInfo[0] && 1524 <= aadt && aadt <= 18271,
          tmsInfo[1] && 18271 < aadt && aadt <= 82417,
          tmsInfo[2] && 82417 < aadt && aadt <= 298292,
        ];

        if (conditions.every((val) => val === false)) {
          return aadt === -100;
        } else {
          return conditions.some((val) => val === true);
        }
      });

      const totalLength =
        filtered.length !== 0
          ? Math.round(
              filtered.reduce((acc, feature) => {
                return acc + feature.properties.length;
              }, 0) / 1000
            )
          : depth2 === "교통량구간"
          ? 14933
          : 0;

      setLength(totalLength);
    } else {
      setLength(0);
    }
  }, [depth1, depth2, data.emiroad, taasInfo, data.nroad, info, tmsInfo]);

  return (
    <div className="main">
      <TopBar />
      <div className="container">
        <Basemap basemap={basemap} setBasemap={setBasemap} />
        <Controls
          view={view}
          setView={setView}
          INITIAL_VIEW_STATE={INITIAL_VIEW_STATE}
        />

        {activeMenu && (
          <div className="lengthSum">
            선택구간 연장 <span>{length ? length : 0}</span> km
          </div>
        )}

        <DeckGL
          initialViewState={view}
          onViewStateChange={({ viewState }) => setView(viewState)}
          controller={true}
          layers={layers}
          getTooltip={({ object, layer }) => getTooltip({ object, layer })}
        >
          <Map mapStyle={basemap} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
        </DeckGL>
      </div>

      {LD && (
        <div className="overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
