import "./Dropdown2.css";
import React from "react";
import useInfo from "../hooks/use-info";

const Dropdown2 = ({ options, handleSelection }) => {
  const { isSelect } = useInfo();

  return (
    <div>
      {isSelect && (
        <ul className="dropdown2">
          {options.map((option) => (
            <li key={option[0]} onClick={() => handleSelection(option)}>
              <label className="option-label2">
                국도 {option[0]}호선 ({option[1]})
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown2;
