import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const RiskProfile = ({ data, options }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && data) {
      const newChart = new Chart(ref.current, {
        type: "line",
        data: data,
        options: options,
      });

      return () => {
        newChart.destroy();
      };
    }
  }, [data, options]);

  return <canvas className={`riskprofile`} ref={ref}></canvas>;
};

export default RiskProfile;
