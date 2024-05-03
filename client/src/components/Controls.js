import "./Controls.css";
import { React, useState } from "react";
import useInfo from "../hooks/use-info";
import { GiExpand, GiMagnifyingGlass } from "react-icons/gi";
import { BiHide } from "react-icons/bi";
import { FlyToInterpolator } from "deck.gl";

const Controls = ({ view, setView, INITIAL_VIEW_STATE }) => {
  const {
    isFilter,
    setIsFilter,
    activeMenu,
    depth1,
    depth2,
    // info,
    // taasInfo,
    // tmsInfo,
    acclayer1,
    acclayer2,
    showProfile,
    setSearchedRoadNo,
    rdepth,
    setRdepth,
    idepth,
    pdepth,
    rdata,
    pdata,
    rcbx,
    icbx,
  } = useInfo();
  const [isClicked, setIsClicked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("road_no");

  const zoomToRoad_r = (nodeId) => {
    const node = rdata.mergedGJ.features.find(
      (feature) => feature.properties.fromnodeid === nodeId
    );

    if (node) {
      const middleIndex = Math.floor(node.geometry.coordinates[0].length / 2);
      const [longitude, latitude] = node.geometry.coordinates[0][middleIndex];

      setView({
        longitude,
        latitude,
        zoom: 15,
        transitionDuration: 1000,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const zoomToRoad_p = (nodeId) => {
    const node = pdata.mergedGJ.features.find(
      (feature) => feature.properties.fromnodeid === nodeId
    );

    if (node) {
      const middleIndex = Math.floor(node.geometry.coordinates[0].length / 2);
      const [longitude, latitude] = node.geometry.coordinates[0][middleIndex];

      setView({
        longitude,
        latitude,
        zoom: 15,
        transitionDuration: 1000,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const highlightRoad_r = (roadNo) => {
    const featureExists = rdata.mergedGJ.features.some(
      (feature) => feature.properties.road_no === roadNo
    );
    if (featureExists) {
      setView({
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude,
        zoom: INITIAL_VIEW_STATE.zoom,
        transitionDuration: 800,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const highlightRoad_p = (roadNo) => {
    const featureExists = pdata.mergedGJ.features.some(
      (feature) => feature.properties.road_no === roadNo
    );
    if (featureExists) {
      setView({
        longitude: INITIAL_VIEW_STATE.longitude,
        latitude: INITIAL_VIEW_STATE.latitude,
        zoom: INITIAL_VIEW_STATE.zoom,
        transitionDuration: 800,
        TransitionInterpolator: new FlyToInterpolator(),
      });
    }
  };

  const handleSearchSubmit = (event) => {
    if (rdata || pdata) {
      event.preventDefault();
      setRdepth((prev) => ({
        ...prev,
        index: 4,
      }));
      if (searchType === "road_no") {
        if (acclayer1) {
          const roadno = parseInt(searchTerm, 10);
          highlightRoad_r(roadno);
          setSearchedRoadNo(() => ({
            type: "road_no",
            value: searchTerm,
          }));
        } else if (showProfile) {
          const roadno = searchTerm;
          highlightRoad_p(roadno);
          setSearchedRoadNo(() => ({
            type: "road_no",
            value: searchTerm,
          }));
        }
      } else {
        if (acclayer1) {
          zoomToRoad_r(searchTerm);
          setSearchedRoadNo(() => ({
            type: "nodeid",
            value: searchTerm,
          }));
        } else if (showProfile) {
          zoomToRoad_p(searchTerm);
          setSearchedRoadNo(() => ({
            type: "nodeid",
            value: searchTerm,
          }));
        }
      }
      setShowSearch(false);
      setSearchTerm("");
    } else {
      event.preventDefault();
      setSearchTerm("");
      return;
    }
  };

  return (
    <div className="toggle_button_div">
      <button
        className="toggle_button"
        onClick={() =>
          setView((prev) => {
            return {
              ...prev,
              zoom: prev.zoom < 20 ? prev.zoom + 1 : prev.zoom,
            };
          })
        }
      >
        +
      </button>
      <button
        className="toggle_button"
        onClick={() =>
          setView((prev) => ({
            ...prev,
            zoom: prev.zoom > 0.87 ? prev.zoom - 1 : prev.zoom,
          }))
        }
      >
        -
      </button>
      <button
        className="toggle_button"
        onClick={() => setView(INITIAL_VIEW_STATE)}
      >
        <GiExpand />
      </button>

      <button
        className={`toggle_button ${isClicked ? "clicked" : ""}`}
        onClick={() => {
          setIsFilter(!isFilter);
          setIsClicked(!isClicked);
        }}
      >
        <BiHide />
      </button>
      <button
        className="toggle_button"
        onClick={() =>
          console.log(
            "\nzoom:",
            view.zoom,
            "\nactivemenu:",
            activeMenu,
            "\ndepth1:",
            "\n",
            depth1,
            "\ndepth2:",
            "\n",
            depth2,
            "\nacclayer1:",
            "\n",
            acclayer1,
            "\nacclayer2:",
            "\n",
            acclayer2,
            "\nrdepth:",
            "\n",
            rdepth,
            "\nidepth:",
            "\n",
            idepth,
            "\npdepth:",
            "\n",
            pdepth,
            // "\nrdata:",
            // "\n",
            // rdata,
            "\npdata:",
            "\n",
            pdata,
            "\nrcbx&icbx:",
            "\n",
            rcbx,
            icbx
          )
        }
      >
        VS
      </button>
      <button
        className="toggle_button"
        onClick={() => setShowSearch(!showSearch)}
      >
        <GiMagnifyingGlass />
      </button>
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="search_input">
          <div>
            <label className="searchLabel">
              <input
                type="radio"
                value="road_no"
                checked={searchType === "road_no"}
                onChange={() => setSearchType("road_no")}
              />
              국도번호&nbsp;
            </label>
            <label className="searchLabel">
              <input
                type="radio"
                value="nodeid"
                checked={searchType === "nodeid"}
                onChange={() => setSearchType("nodeid")}
              />
              노드번호
            </label>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색: "
            autoFocus
          />
        </form>
      )}
    </div>
  );
};

export default Controls;
