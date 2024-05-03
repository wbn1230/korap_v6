import "./LBacc.css";
import React, { useMemo, useState } from "react";
import { FlyToInterpolator } from "deck.gl";
import Dropdown2 from "./Dropdown2";
import Accordion2 from "./Accordion2";
import "./Accordion2.css";
import RiskChart from "./RiskChart";
import RiskProfile from "./RiskProfile";
import useInfo from "../hooks/use-info";
import axios from "axios";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdIndeterminateCheckBox,
  MdOutlineSsidChart,
} from "react-icons/md";
import { FaCar, FaWalking, FaBiking } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

const LBacc = () => {
  const {
    rdata,
    pdata,
    setPdata,
    rdepth,
    setRdepth,
    setIdepth,
    pdepth,
    setPdepth,
    rcbx,
    icbx,
    setRcbx,
    setIcbx,
    acclayer1,
    acclayer2,
    setAcclayer1,
    setAcclayer2,
    userHasInteractedR,
    setUserHasInteractedR,
    userHasInteractedI,
    setUserHasInteractedI,
    isSelect,
    setIsSelect,
    selectedRoad,
    setSelectedRoad,
    setView,
    INITIAL_VIEW_STATE,
    setLD,
    setIsFilter,
    showProfile,
    setShowProfile,
    showChart,
    setShowChart,
    setPointer,
  } = useInfo();
  const [menuToggle, setMenuToggle] = useState(true);
  const [currentRoadIndicator, setCurrentRoadIndicator] = useState(3);
  const [currentICIndicator, setCurrentICIndicator] = useState(3);
  const [currentProfileIndicator, setCurrentProfileIndicator] = useState("car");
  const [selectedRoadIcon, setSelectedRoadIcon] = useState("car");
  const [selectedICIcon, setSelectedICIcon] = useState("car");
  const [selectedRPIcon, setSelectedRPIcon] = useState("car");
  const [selection, setSelection] = useState("");

  const fetchRiskProfile = async () => {
    setLD(true);
    try {
      const rpRes = await axios.get("http://localhost:4000/riskprofile");
      setPdata(rpRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLD(false);
      // console.log("rp fetched");
      setIsSelect(false);
      setIsFilter(true);
    }
  };

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
  };

  const handleRoadDropdownClick = (op) => {
    setCurrentRoadIndicator(op);
    setRdepth((prev) => ({
      ...prev,
      index: op,
    }));
  };
  const handleICDropdownCLick = (op) => {
    setCurrentICIndicator(op);
    setIdepth((prev) => ({
      ...prev,
      index: op,
    }));
  };
  const handleProfileIconClick = (op) => {
    setSelectedRPIcon(op);
    setCurrentProfileIndicator(op);
    setPdepth(op);
    /*     setRdepth((prev) => ({
      ...prev,
      index: 3,
    })); */
  };

  const resetMap = (roadNo) => {
    if (roadNo) {
      setView({
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude - 1.5,
        zoom: 6.35,
        transitionDuration: 800,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const rindicatorTxt = (ind) => {
    if (ind === 1) {
      return "(기본) 구간별 건 / km";
    } else if (ind === 2) {
      return "(기본) 구간별 건 / 대·km";
    } else if (ind === 3) {
      return "평균 사고 건수";
    }
  };
  const iindicatorTxt = (ind) => {
    if (ind === 1) {
      return "(기본) 구간별 건 / 차로";
    } else if (ind === 2) {
      return "(기본) 구간별 건 / 대·차로";
    } else if (ind === 3) {
      return "평균 사고 건수";
    }
  };

  const handleSelection = (options) => {
    if (!pdata) {
      fetchRiskProfile();
    }
    setSelectedRoad(options[0]);
    setSelection(`국도 ${options[0]}호선 (${options[1]})`);
    setIsSelect(false);
    setPointer(null);
    resetMap(options[0]);
  };

  const handleRoadIconClick = (icon) => {
    setSelectedRoadIcon(icon);
    setRdepth((prev) => ({
      ...prev,
      type: icon,
    }));
  };

  const handleICIconClick = (icon) => {
    setSelectedICIcon(icon);
    setIdepth((prev) => ({
      ...prev,
      type: icon,
    }));
  };

  const handleRCbx = (idx) => {
    if (!userHasInteractedR) {
      setRcbx(rcbx.map((_, index) => index === idx));
      setUserHasInteractedR(true);
    } else {
      setRcbx((prev) => {
        const lst = [...prev];
        lst[idx] = !lst[idx];
        return lst;
      });
    }
  };

  const handleICbx = (idx) => {
    if (!userHasInteractedI) {
      setIcbx(icbx.map((_, index) => index === idx));
      setUserHasInteractedI(true);
    } else {
      setIcbx((prev) => {
        const lst = [...prev];
        lst[idx] = !lst[idx];
        return lst;
      });
    }
  };
  /////////////////////////////////////////////////////////////////

  const roads = [
    ["1", "목포-신의주"],
    ["2", "신안-부산"],
    ["3", "남해-초산"],
    ["4", "부안-경주"],
    ["5", "통영-중강진"],
    ["6", "인천-강릉"],
    ["7", "부산-온성"],
    ["13", "완도-금산"],
    ["14", "거제-포항"],
    ["15", "고흥-남원"],
    ["17", "여수-광주"],
    ["18", "진도-구례"],
    ["19", "남해-홍천"],
    ["20", "산청-포항"],
    ["21", "남원-이천"],
    ["22", "정읍-순천"],
    ["23", "강진-천안"],
    ["24", "신안-울산"],
    ["25", "진해-청주"],
    ["26", "군산-대구"],
    ["27", "완도-군산"],
    ["28", "영주-포항"],
    ["29", "보성-서산"],
    ["30", "부안-대구"],
    ["31", "부산-신고산"],
    ["32", "태안-대전"],
    ["33", "고성-구미"],
    ["34", "당진-영덕"],
    ["35", "부산-강릉"],
    ["36", "보령-울진"],
    ["37", "거창-파주"],
    ["38", "태안-동해"],
    ["39", "부여-의정부"],
    ["40", "당진-공주"],
    ["42", "인천-동해"],
    ["43", "세종-고성"],
    ["44", "양평-양양"],
    ["45", "서산-가평"],
    ["46", "인천-고성"],
    ["47", "안산-철원"],
    ["48", "강화-서울"],
    ["56", "철원-양양"],
    ["58", "진해-청도"],
    ["59", "광양-양양"],
    ["67", "칠곡-군위"],
    ["75", "가평-화천"],
    ["77", "부산-파주"],
    ["79", "의령-창녕"],
    ["82", "평택-화성"],
    ["87", "포천-철원"],
    ["88", "영양-울진"],
  ];

  const horizontalRoads = [
    "2",
    "4",
    "6",
    "18",
    "20",
    "24",
    "26",
    "30",
    "32",
    "34",
    "36",
    "38",
    "42",
    "44",
    "45",
    "46",
    "48",
    "56",
    "82",
    "88",
  ]; //가로 방향성
  const verticalRoads = [
    "1",
    "3",
    "5",
    "7",
    "13",
    "14",
    "15",
    "17",
    "19",
    "21",
    "22",
    "23",
    "25",
    "27",
    "28",
    "29",
    "31",
    "33",
    "35",
    "37",
    "39",
    "40",
    "43",
    "47",
    "58",
    "59",
    "67",
    "75",
    "77",
    "79",
    "87",
  ]; //세로 방향성
  // const mixedRoads = [];

  const laneF = (code) => {
    switch (code) {
      case "1":
        return "1 차선";
      case "2":
        return "2 차선";
      case "3":
        return "4 차선";
      case "4":
        return "5-8 차선";
      case "5":
        return "9 차선 이상";
      default:
        return "N/A";
    }
  };

  const facilF = (code) => {
    switch (code) {
      case "0":
        return "일반도로";
      case "1":
        return "교량";
      case "2":
        return "터널";
      case "4":
        return "고가도로";
      case "8":
        return "지하도로";
      default:
        return "N/A";
    }
  };

  const speedF = (code) => {
    switch (code) {
      case null:
        return "결측";
      case 0:
        return "결측";
      case 20:
        return "20";
      case 30:
        return "30";
      case 40:
        return "40";
      case 50:
        return "50";
      case 60:
        return "60";
      case 70:
        return "70";
      case 80:
        return "80";
      case 90:
        return "90이상";
      case 100:
        return "90이상";
      case 110:
        return "90이상";
      default:
        return "N/A";
    }
  };

  const barrierF = (code) => {
    switch (code) {
      case "0":
        return "분리대 없음";
      case "1":
        return "벽";
      case "2":
        return "봉";
      case "3":
        return "화단";
      case "4":
        return "안전지대";
      case "5":
        return "금속";
      case "15":
        return "기타";
      default:
        return "N/A";
    }
  };

  const lightF = (code) => {
    switch (code) {
      case 0:
        return "0";
      case 1:
        return "1";
      case 2:
        return "2";
      case 3:
        return "3";
      case 4:
        return "4";
      case null:
        return "결측";
      default:
        return "N/A";
    }
  };

  const caronlyF = (code) => {
    switch (code) {
      case "0":
        return "비해당";
      case "1":
        return "해당";
      case null:
        return "결측";
      default:
        return "N/A";
    }
  };

  const onewayF = (code) => {
    switch (code) {
      case "0":
        return "비해당";
      case "1":
        return "해당";
      default:
        return "N/A";
    }
  };

  const sortVerticalRoadData = (rawData) => {
    return rawData.sort((a, b) => {
      const aCoords = a.geometry.coordinates[0][0];
      const bCoords = b.geometry.coordinates[0][0];

      if (aCoords[1] === bCoords[1]) {
        return aCoords[0] - bCoords[0];
      }
      return aCoords[1] - bCoords[1];
    });
  };

  const sortHorizontalRoadData = (rawData) => {
    return rawData.sort((a, b) => {
      const aCoords = a.geometry.coordinates[0][0];
      const bCoords = b.geometry.coordinates[0][0];

      if (aCoords[0] === bCoords[0]) {
        return aCoords[1] - bCoords[1];
      }
      return aCoords[0] - bCoords[0];
    });
  };

  /*   const sortManual = (rawData) => {
    return rawData.sort((a, b) => {
      const aCoords = a.geometry.coordinates[0][0];
      const bCoords = b.geometry.coordinates[0][0];

      if (aCoords[0] <= 126.16 && bCoords[0] <= 126.16)
        return aCoords[1] - bCoords[1];
      else if (aCoords[0] > 126.16 && bCoords[0] > 126.16)
        return aCoords[0] - bCoords[0];
      return aCoords[0] - bCoords[0];
    });
  }; */

  const { roadData, accDataPoints, bi1DataPoints, bi2DataPoints, xlabels } =
    useMemo(() => {
      let roadData = [];
      let lengthSum = 0;
      const propertyMap = {
        car: { abs: "l_car_abs", bi1: "l_car_bi_1", bi2: "l_car_bi_2" },
        walk: { abs: "l_ped_abs", bi1: "l_ped_bi_1", bi2: "l_ped_bi_2" },
        bike: { abs: "l_cyc_abs", bi1: "l_cyc_bi_1", bi2: "l_cyc_bi_2" },
      };

      if (!pdata || !showProfile)
        return {
          roadData: [],
          accDataPoints: [],
          bi1DataPoints: [],
          bi2DataPoints: [],
          xlabels: [],
        };

      const rawData = pdata.mergedGJ.features.filter(
        (feature) => feature.properties.road_no === selectedRoad
      );

      if (horizontalRoads.includes(selectedRoad)) {
        roadData = sortHorizontalRoadData(rawData);
      } else if (verticalRoads.includes(selectedRoad)) {
        roadData = sortVerticalRoadData(rawData);
      }
      /* else if (mixedRoads.includes(selectedRoad)) {
        roadData = sortManual(rawData);
      } */

      const dataKeys = propertyMap[pdepth];

      const accDataPoints = roadData.map(
        (feature) => feature.properties[dataKeys.abs]
      );
      const bi1DataPoints = roadData.map(
        (feature) => feature.properties[dataKeys.bi1]
      );
      const bi2DataPoints = roadData.map(
        (feature) => feature.properties[dataKeys.bi2]
      );

      const lengths = roadData.map((feature) =>
        parseInt(feature.properties.length, 10)
      );
      const xlabels = lengths.map((length) => {
        lengthSum += length;
        return (lengthSum / 1000).toFixed(1);
      });

      return {
        roadData,
        accDataPoints,
        bi1DataPoints,
        bi2DataPoints,
        xlabels,
      };
      //eslint-disable-next-line
    }, [pdata, showProfile, selectedRoad, pdepth]);

  const highlightNode = (index) => {
    const node = roadData[index];
    if (node) {
      setPointer(node.properties.fromnodeid);
    }
  };
  const followMap = (index) => {
    if (pdata) {
      const node = roadData[index];

      if (node) {
        setPointer(node.properties.fromnodeid);
      }

      const pointer = pdata.mergedGJ.features.find(
        (feature) =>
          feature.properties.fromnodeid === node.properties.fromnodeid
      );

      if (pointer) {
        setView({
          longitude: pointer.geometry.coordinates[0][0][0],
          latitude: pointer.geometry.coordinates[0][0][1] - 0.01,
          zoom: 12,
          transitionDuration: 700,
          TransitionInterpolator: new FlyToInterpolator(),
        });
      }
    }
  };

  const roadNo = roadData.map((feature) => feature.properties.road_no);

  const profdata = useMemo(
    () => ({
      labels: xlabels,
      datasets: [
        {
          label: roadNo[0]
            ? `${roadNo[0]}번 국도 - 평균사고건수   `
            : `평균사고건수`,
          data: accDataPoints,
          borderColor: "red",
          borderWidth: 1,
          pointRadius: 0.1,
          fill: false,
          tension: 0,
          stepped: "before",
          yAxisID: "y1",
        },
        {
          label: roadNo[0]
            ? `${roadNo[0]}번 국도 - 구간별 건 / km   `
            : `구간별 건 / km`,
          data: bi1DataPoints,
          borderColor: "#004182",
          borderWidth: 1,
          pointRadius: 0.1,
          fill: false,
          tension: 0,
          stepped: true,
          yAxisID: "y2",
        },
        {
          label: roadNo[0]
            ? `${roadNo[0]}번 국도 - 구간별 건 / 대·km`
            : `구간별 건 / 대·km`,
          data: bi2DataPoints,
          borderColor: "#118DF0",
          borderWidth: 1,
          pointRadius: 0.1,
          fill: false,
          tension: 0,
          stepped: true,
          yAxisID: "y2",
        },
      ],
    }),
    // eslint-disable-next-line
    [roadData]
  );

  const profoptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "거리 (km)",
          },
          ticks: {
            maxTicksLimit: 15,
          },
        },
        y1: {
          beginAtZero: true,
          position: "left",
          title: {
            display: true,
            padding: 3,
            text: "평균사고건수",
          },
          grid: {
            color: "#00000030",
          },
        },
        y2: {
          beginAtZero: true,
          position: "right",
          title: {
            display: true,
            padding: 3,
            text: "지표",
          },
          grid: {
            color: function (context) {
              if (
                context.tick.value === context.scale.min ||
                context.tick.value === context.scale.max
              ) {
                return "rgba(0, 0, 0, 0)";
              }
              return "#00000030";
            },
          },
          border: {
            dash: [5, 5],
          },
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            limits: {
              x: { min: 0, max: 2 },
              y1: { min: 0, max: 2 },
              y2: { min: 0, max: 2 },
            },
          },
          pan: {
            enabled: true,
            mode: "x",
          },
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            pointStyle: "line",
          },
          onHover: function (event, legendItem, legend) {
            event.native.target.style.cursor = "pointer";
          },
          onLeave: function (event, legendItem, legend) {
            event.native.target.style.cursor = "";
          },
        },
        tooltip: {
          backgroundColor: "rgba(242, 242, 242, 0.9)",
          borderColor: "#404040",
          borderWidth: 1,
          cornerRadius: 0,
          padding: 10,
          titleFont: {
            size: 15,
            weight: "bold",
            color: "red",
          },
          bodyFont: {
            size: 14,
            weight: 500,
          },
          caretPadding: 10,
          bodyColor: "black",
          displayColors: false,
          bodySpacing: 5,
          footerColor: "white",
          callbacks: {
            label: function () {
              return null;
            },
            title: function () {
              return null;
            },
            afterBody: function (tooltipItem) {
              const index = tooltipItem[0].dataIndex;
              const feature = roadData[index];

              if (feature && feature.properties) {
                const props = feature.properties;
                return [
                  `도로명: ${props.road_name || "N/A"}`,
                  `차로수: ${laneF(props.width) || "N/A"}`,
                  `교통시설물: ${facilF(props.facil_kind) || "N/A"}`,
                  `제한속도: ${speedF(parseInt(props.max_spd, 10)) || "N/A"}`,
                  `중앙분리대유형: ${barrierF(props.barrier) || "N/A"}`,
                  `신호등개수: ${
                    lightF(parseInt(props.num_cross, 10)) || "N/A"
                  }`,
                  `자동차전용도로유무: ${caronlyF(props.auto_exclu) || "N/A"}`,
                  `일방통행유무: ${onewayF(props.oneway) || "N/A"}`,
                ].join("\n");
              }
              return "";
            },
          },
        },
      },
    }),
    [roadData]
  );

  const toggleProfile = () => {
    if (selectedRoad || selection) {
      setSelectedRoad(null);
      setSelection("");
    }
    if (currentProfileIndicator !== "car") {
      setCurrentProfileIndicator("car");
      setPdepth("car");
    }
    if (showChart) {
      setShowChart(false);
    }
    if (acclayer1 || acclayer2) {
      setAcclayer1(false);
      setAcclayer2(false);
    }
    setShowProfile((prev) => !prev);
  };
  ///////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////
  const { chrtdata } = useMemo(() => {
    let counts = {};

    if (acclayer1 && rdata) {
      if (rdepth.type === "car") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.003) counts[roadNo][0]++;
                else if (0.003 <= value && value < 0.012) counts[roadNo][1]++;
                else if (0.012 <= value && value < 0.029) counts[roadNo][2]++;
                else if (0.029 <= value && value < 0.083) counts[roadNo][3]++;
                else if (0.083 <= value && value < 0.19) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.0141) counts[roadNo][0]++;
                else if (0.0141 <= value && value < 0.04707)
                  counts[roadNo][1]++;
                else if (0.04707 <= value && value < 0.10406)
                  counts[roadNo][2]++;
                else if (0.10406 <= value && value < 0.23738)
                  counts[roadNo][3]++;
                else if (0.23738 <= value && value < 0.54188)
                  counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_car_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.33642) counts[roadNo][0]++;
                else if (0.33642 <= value && value < 1.33964)
                  counts[roadNo][1]++;
                else if (1.33964 <= value && value < 4.00281)
                  counts[roadNo][2]++;
                else if (4.00281 <= value && value < 13.0132)
                  counts[roadNo][3]++;
                else if (13.0132 <= value && value < 150.4113)
                  counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      } else if (rdepth.type === "walk") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.002) counts[roadNo][1]++;
                else if (0.002 <= value && value < 0.005) counts[roadNo][2]++;
                else if (0.005 <= value && value < 0.014) counts[roadNo][3]++;
                else if (0.014 <= value && value < 0.04) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.003) counts[roadNo][0]++;
                else if (0.003 <= value && value < 0.013) counts[roadNo][1]++;
                else if (0.013 <= value && value < 0.032) counts[roadNo][2]++;
                else if (0.032 <= value && value < 0.113) counts[roadNo][3]++;
                else if (0.113 <= value && value < 0.27) counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_ped_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.334) counts[roadNo][1]++;
                else if (0.334 <= value && value < 1.333) counts[roadNo][2]++;
                else if (1.333 <= value && value < 3.667) counts[roadNo][3]++;
                else if (3.667 <= value && value < 20.68) counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      } else if (rdepth.type === "bike") {
        switch (rdepth.index) {
          case 1:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_bi_1;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.001) counts[roadNo][1]++;
                else if (0.001 <= value && value < 0.003) counts[roadNo][2]++;
                else if (0.003 <= value && value < 0.007) counts[roadNo][3]++;
                else if (0.007 <= value && value < 0.03) counts[roadNo][4]++;
              }
            });
            break;
          case 2:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_bi_2;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 <= value && value < 0.001) counts[roadNo][0]++;
                else if (0.001 <= value && value < 0.005) counts[roadNo][1]++;
                else if (0.005 <= value && value < 0.014) counts[roadNo][2]++;
                else if (0.014 <= value && value < 0.038) counts[roadNo][3]++;
                else if (0.038 <= value && value < 0.08) counts[roadNo][4]++;
              }
            });
            break;
          case 3:
            rdata.mergedGJ.features.forEach((feature) => {
              const value = feature.properties.l_cyc_abs;
              const roadNo = feature.properties.road_no;
              if (roadNo >= 1 && roadNo <= 88 && roadNo !== 60) {
                if (!counts[roadNo]) counts[roadNo] = [0, 0, 0, 0, 0];
                if (0 >= value) counts[roadNo][0]++;
                else if (0 <= value && value < 0.3329) counts[roadNo][1]++;
                else if (0.3329 <= value && value < 0.667) counts[roadNo][2]++;
                else if (0.667 <= value && value < 1.667) counts[roadNo][3]++;
                else if (1.667 <= value && value < 4.7) counts[roadNo][4]++;
              }
            });
            break;
          default:
            break;
        }
      }
    }

    const normalizeCounts = (counts) => {
      let normalized = {};
      Object.keys(counts).forEach((roadNo) => {
        let total = counts[roadNo].reduce((sum, current) => sum + current, 0);
        normalized[roadNo] = counts[roadNo].map((count) =>
          ((count / total) * 100).toFixed(4).slice(0, -2)
        );
      });
      return normalized;
    };

    const normalizedCounts = normalizeCounts(counts);

    const roadLabels = Object.keys(normalizedCounts).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );
    const datasets = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"].map(
      (label, idx) => ({
        label,
        data: roadLabels.map((roadNo) => ({
          x: `${roadNo}번 국도`,
          y: normalizedCounts[roadNo][idx],
          originalCount: counts[roadNo][idx],
        })),
        backgroundColor: [
          "#00afb9",
          "#79c2a5",
          "#f2d492",
          "#e98d78",
          "#dd0016",
        ][idx],
      })
    );

    return {
      counts,
      normalizedCounts,
      chrtdata: {
        labels: roadLabels.map((roadNo) => `${roadNo}번 국도`),
        datasets,
      },
    };
  }, [rdepth, rdata, acclayer1]);

  const chrtoptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      barPercentage: 0.75,
      scales: {
        x: {
          stacked: true,
          ticks: {
            maxTicksLimit: 20,
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label;
              const value = context.parsed.y;
              const originalCount = context.raw.originalCount;
              return `${label}: ${value}% (${originalCount})`;
            },
          },
        },
        legend: {
          display: true,
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
          limits: {
            x: { min: 0, max: "original" },
          },
        },
      },
    }),
    []
  );

  const toggleChart = () => {
    if (showProfile) {
      setShowProfile(false);
    }
    if (acclayer1 || acclayer2) {
      setAcclayer2(false);
    }
    setShowChart((prev) => !prev);
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const items = [
    {
      id: "도로사고",
      label: "단일로 사고위험도",
      content: (
        <div>
          <div id="지표선택" className="inner-accordion-item">
            <span className="label">• 지표선택</span>
            <div className="accdropdown">
              <div className="indicator">
                {rindicatorTxt(currentRoadIndicator)}
              </div>
              <div className="dropdown-content">
                <button onClick={() => handleRoadDropdownClick(1)}>
                  (기본) 구간별 건 / km
                </button>
                <button onClick={() => handleRoadDropdownClick(2)}>
                  (기본) 구간별 건 / 대·km
                </button>
                <button onClick={() => handleRoadDropdownClick(3)}>
                  평균 사고 건수
                </button>
              </div>
            </div>
          </div>

          <div id="관점" className="inner-accordion-item">
            <span className="label">• 관점</span>
            <div className="icon_container">
              <button
                className={`icon_button car ${
                  selectedRoadIcon === "car" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("car")}
              >
                <FaCar />
                <div className="icon_label">차량</div>
              </button>
              <button
                className={`icon_button walk ${
                  selectedRoadIcon === "walk" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("walk")}
              >
                <FaWalking />
                <div className="icon_label">보행자</div>
              </button>
              <button
                className={`icon_button bike ${
                  selectedRoadIcon === "bike" ? "selected" : ""
                }`}
                onClick={() => handleRoadIconClick("bike")}
              >
                <FaBiking />
                <div className="icon_label">자전거</div>
              </button>
            </div>
          </div>

          {!showChart && (
            <div id="위험도R" className="inner-accordion-item">
              <span className="label">• 위험도</span>
              <div className="checkbox_container">
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Rcb_vh"
                    className="hidden_checkbox"
                    checked={rcbx[0]}
                    onChange={() => handleRCbx(0)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryHigh" />
                  매우 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Rcbx_h"
                    className="hidden_checkbox"
                    checked={rcbx[1]}
                    onChange={() => handleRCbx(1)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box high" /> 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Rcbx_m"
                    className="hidden_checkbox"
                    checked={rcbx[2]}
                    onChange={() => handleRCbx(2)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box medium" /> 보통
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Rcbx_l"
                    className="hidden_checkbox"
                    checked={rcbx[3]}
                    onChange={() => handleRCbx(3)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box low" /> 낮음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="rcbx_vl"
                    className="hidden_checkbox"
                    checked={rcbx[4]}
                    onChange={() => handleRCbx(4)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryLow" /> 매우
                  낮음
                </label>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "교차사고",
      label: "교차로 사고위험도",
      content: (
        <div>
          <div id="지표선택" className="inner-accordion-item">
            <span className="label">• 지표선택</span>
            <div className="content">
              <div className="accdropdown">
                <div className="indicator">
                  {iindicatorTxt(currentICIndicator)}
                </div>
                <div className="dropdown-content">
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(1)}
                  >
                    (기본) 구간별 건 / 차로
                  </button>
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(2)}
                  >
                    (기본) 구간별 건 / 대·차로
                  </button>
                  <button
                    className="button"
                    onClick={() => handleICDropdownCLick(3)}
                  >
                    평균 사고 건수
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="관점" className="inner-accordion-item">
            <span className="label">• 관점</span>
            <div className="content">
              <div className="icon_container">
                <button
                  className={`icon_button car ${
                    selectedICIcon === "car" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("car")}
                >
                  <FaCar />
                  <div className="icon_label">차량</div>
                </button>
                <button
                  className={`icon_button walk ${
                    selectedICIcon === "walk" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("walk")}
                >
                  <FaWalking />
                  <div className="icon_label">보행자</div>
                </button>
                <button
                  className={`icon_button bike ${
                    selectedICIcon === "bike" ? "selected" : ""
                  }`}
                  onClick={() => handleICIconClick("bike")}
                >
                  <FaBiking />
                  <div className="icon_label">자전거</div>
                </button>
              </div>
            </div>
          </div>

          <div id="위험도I" className="inner-accordion-item">
            <span className="label">• 위험도</span>
            <div className="content">
              <div className="checkbox_container">
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_vh"
                    className="hidden_checkbox"
                    checked={icbx[0]}
                    onChange={() => handleICbx(0)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryHigh" />{" "}
                  매우 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_h"
                    className="hidden_checkbox"
                    checked={icbx[1]}
                    onChange={() => handleICbx(1)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box high" /> 높음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_m"
                    className="hidden_checkbox"
                    checked={icbx[2]}
                    onChange={() => handleICbx(2)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box medium" /> 보통
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_l"
                    className="hidden_checkbox"
                    checked={icbx[3]}
                    onChange={() => handleICbx(3)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box low" /> 낮음
                </label>
                <label className="checkbox_label">
                  <input
                    type="checkbox"
                    id="Icbx_vl"
                    className="hidden_checkbox"
                    checked={icbx[4]}
                    onChange={() => handleICbx(4)}
                  />
                  <span className="custom_checkbox"></span>
                  <MdIndeterminateCheckBox className="color_box veryLow" /> 매우
                  낮음
                </label>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  ///////////////////////////////////////////////////////////////
  const canvasStyle = {
    width: "99%",
    height: "100%",
  };
  const profileStyle = {
    width: "99%",
    height: "88%",
  };
  const visibleItems = showChart
    ? items.filter((item, index) => index !== 1)
    : items;
  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className={`detail_div ${menuToggle ? "" : "hidden"}`}>
        <div className="accordion_div">
          {!showProfile && <Accordion2 items={visibleItems} />}
        </div>
        <div className={`riskprofile_div`}>
          <button className="data_button profile" onClick={toggleProfile}>
            <MdOutlineSsidChart />
            <span className="profile_text">리스크 프로필을 표출합니다.</span>
          </button>
          <button className="data_button chart" onClick={toggleChart}>
            <IoStatsChart />
            <span className="chart_text">차트 정보를 표출합니다.</span>
          </button>
        </div>
        {showProfile && (
          <div className="profile_container">
            <div className="rpoptions">
              <div className="rp_icon_container">
                <button
                  className={`rp_icon car ${
                    selectedRPIcon === "car" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("car")}
                >
                  <FaCar />
                </button>
                <button
                  className={`rp_icon walk ${
                    selectedRPIcon === "walk" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("walk")}
                >
                  <FaWalking />
                </button>
                <button
                  className={`rp_icon bike ${
                    selectedRPIcon === "bike" ? "selected" : ""
                  }`}
                  onClick={() => handleProfileIconClick("bike")}
                >
                  <FaBiking />
                </button>
              </div>
              <div className="dropdown_container" style={{ width: "40%" }}>
                <div
                  className="rp_roadNo"
                  onClick={() => setIsSelect(!isSelect)}
                >
                  <div>{selection ? `${selection}` : "국도 선택"}</div>
                  {isSelect ? <GoTriangleUp /> : <GoTriangleDown />}
                </div>
                {isSelect && (
                  <Dropdown2
                    options={roads}
                    handleSelection={handleSelection}
                  />
                )}
              </div>
            </div>
            <div style={profileStyle}>
              <div id="legend"></div>
              <RiskProfile
                data={profdata}
                options={profoptions}
                highlightNode={highlightNode}
                followMap={followMap}
              />
            </div>
          </div>
        )}

        {showChart && (
          <div className="chart_container">
            <div style={canvasStyle}>
              <RiskChart data={chrtdata} options={chrtoptions} />
            </div>
          </div>
        )}
      </div>
      <div
        className={`toggle-button ${menuToggle ? "" : "hidden"}`}
        onClick={toggleMenu}
      >
        {menuToggle ? <MdArrowBackIos /> : <MdArrowForwardIos />}
      </div>
    </div>
  );
};

export default LBacc;

/*   const roadTabs = [
    {
      id: "지표선택",
      label: " • 지표선택",
      content: (
        <div className="accdropdown">
          <button className="indicator">
            {indicatorTxt(currentRoadIndicator)}
          </button>
          <div className="dropdown-content">
            <button
              className="button"
              onClick={() => handleRoadDropdownCLick(1)}
            >
              (기본) 구간별 건 / km
            </button>
            <button
              className="button"
              onClick={() => handleRoadDropdownCLick(2)}
            >
              (기본) 구간별 건 / 대·km
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "관점",
      label: "• 관점",
      content: (
        <div className="icon_container">
          <button
            className={`icon_button car ${
              selectedRoadIcon === "car" ? "selected" : ""
            }`}
            onClick={() => handleRoadIconClick("car")}
          >
            <FaCar />
            <div className="icon_label">차량</div>
          </button>
          <button
            className={`icon_button walk ${
              selectedRoadIcon === "walk" ? "selected" : ""
            }`}
            onClick={() => handleRoadIconClick("walk")}
          >
            <FaWalking />
            <div className="icon_label">보행자</div>
          </button>
          <button
            className={`icon_button bike ${
              selectedRoadIcon === "bike" ? "selected" : ""
            }`}
            onClick={() => handleRoadIconClick("bike")}
          >
            <FaBiking />
            <div className="icon_label">자전거</div>
          </button>
        </div>
      ),
    },
    {
      id: "위험도R",
      label: " • 위험도",
      content: (
        <div className="checkbox_container">
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleRCbx(0)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box veryHigh" /> 매우 높음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleRCbx(1)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box high" /> 높음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleRCbx(2)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box medium" /> 보통
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleRCbx(3)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box low" /> 낮음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleRCbx(4)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box veryLow" /> 매우 낮음
          </label>
        </div>
      ),
    },
  ];
  ///////////////////////////////////////////////////////////////
  const intTabs = [
    {
      id: "지표선택",
      label: " • 지표선택",
      content: (
        <div className="accdropdown">
          <button className="indicator">
            {indicatorTxt(currentICIndicator)}
          </button>
          <div className="dropdown-content">
            <button className="button" onClick={() => handleICDropdownCLick(1)}>
              (기본) 구간별 건 / km
            </button>
            <button className="button" onClick={() => handleICDropdownCLick(2)}>
              (기본) 구간별 건 / 대·km
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "관점",
      label: "• 관점",
      content: (
        <div className="icon_container">
          <button
            className={`icon_button car ${
              selectedICIcon === "car" ? "selected" : ""
            }`}
            onClick={() => handleICIconClick("car")}
          >
            <FaCar />
            <div className="icon_label">차량</div>
          </button>
          <button
            className={`icon_button walk ${
              selectedICIcon === "walk" ? "selected" : ""
            }`}
            onClick={() => handleICIconClick("walk")}
          >
            <FaWalking />
            <div className="icon_label">보행자</div>
          </button>
          <button
            className={`icon_button bike ${
              selectedICIcon === "bike" ? "selected" : ""
            }`}
            onClick={() => handleICIconClick("bike")}
          >
            <FaBiking />
            <div className="icon_label">자전거</div>
          </button>
        </div>
      ),
    },
    {
      id: "위험도I",
      label: " • 위험도",
      content: (
        <div className="checkbox_container">
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleICbx(0)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box veryHigh" /> 매우 높음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleICbx(1)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box high" /> 높음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleICbx(2)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box medium" /> 보통
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleICbx(3)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box low" /> 낮음
          </label>
          <label className="checkbox_label">
            <input
              type="checkbox"
              id="checkbox_id"
              className="hidden_checkbox"
              onChange={() => handleICbx(4)}
            />
            <span className="custom_checkbox"></span>
            <MdIndeterminateCheckBox className="color_box veryLow" /> 매우 낮음
          </label>
        </div>
      ),
    },
  ]; */
///////////////////////////////////////////////////////////////
