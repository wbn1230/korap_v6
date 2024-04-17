import "./LBacc.css";
import React, { useMemo, useState } from "react";
import Accordion2 from "./Accordion2";
import "./Accordion2.css";
import RiskChart from "./RiskChart";
import RiskProfile from "./RiskProfile";
import useInfo from "../hooks/use-info";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdIndeterminateCheckBox,
  MdOutlineSsidChart,
} from "react-icons/md";
import { FaCar, FaWalking, FaBiking } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
//  MdOutlineStackedLineChart,

const LBacc = () => {
  const {
    rdata,
    rdepth,
    setRdepth,
    setIdepth,
    rcbx,
    icbx,
    setRcbx,
    setIcbx,
    userHasInteractedR,
    setUserHasInteractedR,
    userHasInteractedI,
    setUserHasInteractedI,
  } = useInfo();
  const [menuToggle, setMenuToggle] = useState(true);
  const [currentRoadIndicator, setCurrentRoadIndicator] = useState(3);
  const [currentICIndicator, setCurrentICIndicator] = useState(3);
  const [selectedRoadIcon, setSelectedRoadIcon] = useState("car");
  const [selectedICIcon, setSelectedICIcon] = useState("car");
  const [showChart, setShowChart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
  };

  const handleRoadDropdownCLick = (op) => {
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

  let roadData = [];

  if (rdata && rdepth.type === "car") {
    if (rdepth.index === 3) {
      roadData = rdata.mergedGJ.features
        .filter((feature) => feature.properties.road_no === 1)
        .sort(
          (a, b) =>
            parseInt(a.properties.fromnodeid, 10) -
            parseInt(b.properties.fromnodeid, 10)
        );
    }
  }

  const xlabels = roadData.map((feature) => feature.properties.fromnodeid);
  const dataPoints = roadData.map((feature) => feature.properties.l_car_abs);

  const pdata = useMemo(
    () => ({
      labels: xlabels,
      datasets: [
        {
          label: ["1번 국도"],
          data: dataPoints,
          borderColor: "blue",
          borderWidth: 1,
          fill: true,
          tension: 0.1,
        },
      ],
    }),
    [rdepth, rdata]
  );

  const poptions = useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
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
              max: 2,
              min: 0.5,
            },
          },
          pan: {
            enabled: true,
            mode: "x",
          },
          legend: {
            display: true,
          },
        },
      },
    }),
    []
  );

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };
  ///////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////
  let counts = {};

  if (rdata && rdepth.type === "car") {
    if (rdepth.index === 3) {
      rdata.mergedGJ.features.forEach((feature) => {
        const value = feature.properties.l_car_abs;
        const roadNo = feature.properties.road_no;

        if (roadNo >= 1 && roadNo <= 30) {
          if (!counts[roadNo]) {
            counts[roadNo] = [0, 0, 0, 0, 0];
          }

          if (0 <= value && value < 0.33642) counts[roadNo][0]++;
          else if (0.33642 <= value && value < 1.33964) counts[roadNo][1]++;
          else if (1.33964 <= value && value < 4.00281) counts[roadNo][2]++;
          else if (4.00281 <= value && value < 13.0132) counts[roadNo][3]++;
          else if (13.0132 <= value && value < 150.4113) counts[roadNo][4]++;
        }
      });
    }
  }

  const normalizeCounts = (counts) => {
    var normalized = {};
    Object.keys(counts).forEach((roadNo) => {
      const total = counts[roadNo].reduce((sum, current) => sum + current, 0);
      normalized[roadNo] = counts[roadNo].map(function (count) {
        var result = ((count / total) * 100).toFixed(3);
        result = result.substring(0, result.length - 1);
        return result;
      });
    });
    return normalized;
  };

  const normalizedCounts = normalizeCounts(counts);

  const cdata = useMemo(
    () => ({
      labels: [
        "1번 국도",
        "2번 국도",
        "3번 국도",
        "4번 국도",
        "5번 국도",
        "6번 국도",
        "7번 국도",
        "13번 국도",
        "14번 국도",
        "15번 국도",
        "17번 국도",
        "18번 국도",
        "19번 국도",
        "20번 국도",
        "21번 국도",
        "22번 국도",
        "23번 국도",
        "24번 국도",
        "25번 국도",
        "26번 국도",
        "27번 국도",
        "28번 국도",
        "29번 국도",
        "30번 국도",
      ],
      datasets: [
        {
          label: "매우 낮음",
          data: Object.values(normalizedCounts).map((counts) => counts[0]),
          backgroundColor: "#00afb9",
        },
        {
          label: "낮음",
          data: Object.values(normalizedCounts).map((counts) => counts[1]),
          backgroundColor: "#79c2a5",
        },
        {
          label: "보통",
          data: Object.values(normalizedCounts).map((counts) => counts[2]),
          backgroundColor: "#f2d492",
        },
        {
          label: "높음",
          data: Object.values(normalizedCounts).map((counts) => counts[3]),
          backgroundColor: "#e98d78",
        },
        {
          label: "매우 높음",
          data: Object.values(normalizedCounts).map((counts) => counts[4]),
          backgroundColor: "#dd0016",
        },
      ],
    }),
    [rdepth, rdata]
  );

  const coptions = useMemo(
    () => ({
      // animation: false,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          beginAtZero: true,
          stacked: true,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    }),
    []
  );

  const toggleChart = () => {
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
            <div className="label">• 지표선택</div>
            <div className="accdropdown">
              <button className="indicator">
                {rindicatorTxt(currentRoadIndicator)}
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
                <button
                  className="button"
                  onClick={() => handleRoadDropdownCLick(3)}
                >
                  평균 사고 건수
                </button>
                {/*                 <button
                  className="button"
                  onClick={() => handleRoadDropdownCLick(4)}
                >
                  국도번호
                </button> */}
              </div>
            </div>
          </div>

          <div id="관점" className="inner-accordion-item">
            <div className="label">• 관점</div>
            <div className="content">
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
          </div>

          <div id="위험도R" className="inner-accordion-item">
            <div className="label">• 위험도</div>
            <div className="content">
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
          </div>
        </div>
      ),
    },
    {
      id: "교차사고",
      label: "교차로 사고위험도",
      content: (
        <div>
          <div id="지표선택" className="inner-accordion-item">
            <div className="label">• 지표선택</div>
            <div className="content">
              <div className="accdropdown">
                <button className="indicator">
                  {iindicatorTxt(currentICIndicator)}
                </button>
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
            <div className="label">• 관점</div>
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
            <div className="label">• 위험도</div>
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

  //프로필 / 차트 문구 추가, <button className="data_button graph" onClick={toggleChart}> 추가

  return (
    <div>
      <div className={`detail_div ${menuToggle ? "" : "hidden"}`}>
        <div className="accordion_div">
          <Accordion2 items={items} />
        </div>
        <div className={`riskprofile_div ${menuToggle ? "" : "hidden"}`}>
          {/* <button className="data_button graph"> */}
          <button className="data_button graph" onClick={toggleProfile}>
            <MdOutlineSsidChart />
            {/* <span className="graph_text">리스크 프로필을 표출합니다.</span> */}
          </button>
          {/* <button className="data_button chart"> */}
          <button className="data_button chart" onClick={toggleChart}>
            <IoStatsChart />
            {/* <span className="chart_text">차트 정보를 표출합니다.</span> */}
          </button>
        </div>
        {showProfile && (
          <div className="profile_container">
            <RiskProfile data={pdata} options={poptions} />
          </div>
        )}
        {showChart && (
          <div className="chart_container">
            <RiskChart data={cdata} options={coptions} />
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
