import { useState } from "react";
import "./TopBar.css";
import Modal from "./Modal";
import { CgFileDocument } from "react-icons/cg";
import guide from "../img/guide2.PNG";
import LogoSVG from "../img/Logo.svg";
import LBacc from "./LBacc";
import LBcurr from "./LBcurr";
import useInfo from "../hooks/use-info";

const TopBar = () => {
  //Modal/////////////////////////////////////////////////////////////
  const {
    activeMenu,
    setActiveMenu,
    setDepth1,
    setDepth2,
    acclayer1,
    acclayer2,
    setAcclayer1,
    setAcclayer2,
    setRcbx,
    setIcbx,
  } = useInfo();
  const [showModal, setShowModal] = useState(false);

  const handleModOpen = () => {
    setShowModal(true);
  };

  const handleModClose = () => {
    setShowModal(false);
  };

  const modal = (
    <Modal onClose={handleModClose}>
      <img src={guide} alt="guide1" height="700%" />
    </Modal>
  );

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === "acc" && !acclayer1 && !acclayer2) {
      setDepth1(null);
      setDepth2(null);
      setRcbx([false, false, false, false, false]);
      setIcbx([false, false, false, false, false]);
    } else if (menu === "curr") {
      setDepth1(null);
      setDepth2(null);
      setAcclayer1(false);
      setAcclayer2(false);
      setRcbx([false, false, false, false, false]);
      setIcbx([false, false, false, false, false]);
    }
  };

  ///////////////////////////////////////////////////////////////
  return (
    <div>
      <div className="topbar_ct">
        <div className="top_column">
          <a href="./">
            <img src={LogoSVG} alt="KoRAP Logo" className="logo_image" />
          </a>
          <div onClick={() => handleMenuClick("acc")}>사고위험지도</div>
          <div onClick={() => handleMenuClick("curr")}>일반국도현황</div>
        </div>

        <div onClick={handleModOpen} className="guide">
          <div className="dscrp">데이터 설명서&nbsp;</div>
          <CgFileDocument className="dscrp_ic" />
        </div>
        {/* <div className="guide2">데이터 설명서</div> */}
      </div>
      {showModal && modal}

      {activeMenu === "acc" && (
        <div>
          {" "}
          <LBacc />{" "}
        </div>
      )}
      {activeMenu === "curr" && (
        <div>
          {" "}
          <LBcurr />{" "}
        </div>
      )}
    </div>
  );
};

export default TopBar;
