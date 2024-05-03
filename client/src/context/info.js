import { createContext, useState } from "react";

const InfoContext = createContext();

function InfoProvider({ children }) {
  const [info, setInfo] = useState({
    roadNo: { name: "국도번호", selected: [] },
    laneOps: { name: "차로수", selected: [], checkboxes: [] },
    facilOps: { name: "교통시설물", selected: [], checkboxes: [] },
    speedOps: { name: "제한속도", selected: [], checkboxes: [] },
    barrierOps: { name: "중앙분리대유형", selected: [], checkboxes: [] },
    lightOps: { name: "신호등개수", selected: [], checkboxes: [] },
    caronlyOps: { name: "자동차전용도로유무", selected: [], checkboxes: [] },
    onewayOps: { name: "일방통행유무", selected: [], checkboxes: [] },
  });

  const INITIAL_VIEW_STATE = {
    longitude: 127.2,
    latitude: 37.0,
    zoom: 6.920000000000002,
    bearing: 0,
    pitch: 0,
  };

  const [taasInfo, setTaasInfo] = useState([]);
  const [tmsInfo, setTmsInfo] = useState([]);
  const [tmsdInfo, setTmsdInfo] = useState([]);

  const [depth1, setDepth1] = useState(null);
  const [depth2, setDepth2] = useState(null);

  const [isSelect, setIsSelect] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const [view, setView] = useState(INITIAL_VIEW_STATE);
  const [LD, setLD] = useState(false);
  const [data, setData] = useState({ nroad: null, emiroad: null });
  const [rdata, setRdata] = useState(null);
  const [idata, setIdata] = useState(null);
  const [pdata, setPdata] = useState(null);

  const [rdepth, setRdepth] = useState({ index: 3, type: "car" });
  const [idepth, setIdepth] = useState({ index: 3, type: "car" });
  const [pdepth, setPdepth] = useState("car");

  const [activeMenu, setActiveMenu] = useState("acc");
  const [acclayer1, setAcclayer1] = useState(false);
  const [acclayer2, setAcclayer2] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const [rcbx, setRcbx] = useState([false, false, false, false, false]);
  const [icbx, setIcbx] = useState([false, false, false, false, false]);

  const [userHasInteractedR, setUserHasInteractedR] = useState(false);
  const [userHasInteractedI, setUserHasInteractedI] = useState(false);

  const [searchedRoadNo, setSearchedRoadNo] = useState({
    type: null,
    value: null,
  });

  const [selectedRoad, setSelectedRoad] = useState("");
  const [pointer, setPointer] = useState(null);

  return (
    <InfoContext.Provider
      value={{
        info,
        setInfo,
        isSelect,
        setIsSelect,
        taasInfo,
        setTaasInfo,
        tmsInfo,
        setTmsInfo,
        depth1,
        setDepth1,
        depth2,
        setDepth2,
        rdepth,
        setRdepth,
        idepth,
        setIdepth,
        pdepth,
        setPdepth,
        isFilter,
        setIsFilter,
        tmsdInfo,
        setTmsdInfo,
        view,
        setView,
        INITIAL_VIEW_STATE,
        LD,
        setLD,
        data,
        setData,
        rdata,
        setRdata,
        idata,
        setIdata,
        pdata,
        setPdata,
        activeMenu,
        setActiveMenu,
        acclayer1,
        setAcclayer1,
        acclayer2,
        setAcclayer2,
        showProfile,
        setShowProfile,
        showChart,
        setShowChart,
        rcbx,
        setRcbx,
        icbx,
        setIcbx,
        userHasInteractedR,
        setUserHasInteractedR,
        userHasInteractedI,
        setUserHasInteractedI,
        searchedRoadNo,
        setSearchedRoadNo,
        selectedRoad,
        setSelectedRoad,
        pointer,
        setPointer,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
}

export { InfoProvider };
export default InfoContext;
