import "./Controls.css";
import { React, useState } from "react";
import useInfo from "../hooks/use-info";
import { GiExpand } from "react-icons/gi";
import { BiHide } from "react-icons/bi";

const Controls = ({ setView, INITIAL_VIEW_STATE }) => {
  const {
    isFilter,
    setIsFilter,
    view,
    depth1,
    depth2,
    info,
    taasInfo,
    tmsInfo,
    acclayer1,
    acclayer2,
    rdepth,
    idepth,
    rdata,
    idata,
    rcbx,
    icbx,
  } = useInfo();
  const [isClicked, setIsClicked] = useState(false);

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
            "\nview:",
            view,
            "\ndepth1:",
            "\n",
            depth1,
            "\ndepth2:",
            "\n",
            depth2,
            "\ninfo:",
            info,
            "\ntaasInfo:",
            "\n",
            taasInfo,
            "\ntmsInfo:",
            "\n",
            tmsInfo,
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
            "\nrdata:",
            "\n",
            rdata,
            "\nidata:",
            "\n",
            idata,
            "\nrcbx&icbx:",
            "\n",
            rcbx,
            icbx
          )
        }
      >
        VS
      </button>
    </div>
  );
};

export default Controls;
