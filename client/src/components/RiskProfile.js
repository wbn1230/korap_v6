import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const RiskProfile = ({ data, options, highlightNode, followMap }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && data) {
      const newChart = new Chart(ref.current, {
        type: "line",
        data: data,
        options: {
          ...options,
          interaction: {
            mode: "index",
            intersect: false,
          },
          animation: {
            duration: 0,
          },

          onClick: (event, element, chart) => {
            if (element.length > 0) {
              const index = element[0].index;
              followMap(index);
            }
          },

          onHover: (event, element, chart) => {
            const ctx = chart.ctx;

            if (element.length > 0) {
              const index = element[0].index;
              const x = element[0].element.x;

              highlightNode(index);
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, 30);
              ctx.lineTo(x, chart.chartArea.bottom);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = "#000000";
              ctx.stroke();
              ctx.restore();
            }
          },
        },
      });

      const checkbox = () => {
        const legend = document.getElementById("legend");
        legend.innerHTML = "";
        newChart.data.datasets.forEach((dataset, index) => {
          const wrapper = document.createElement("div");
          wrapper.className = `checkbox-wrapper checkbox-wrapper-${index}`;

          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = dataset.label;
          checkbox.value = index;
          checkbox.id = `dataset${index}`;
          checkbox.checked = true;

          let label = document.createElement("label");
          label.htmlFor = `dataset${index}`;

          let labelText = document.createTextNode(dataset.label);

          label.appendChild(labelText);
          legend.appendChild(checkbox);
          legend.appendChild(label);

          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
          legend.appendChild(wrapper);
        });
      };
      checkbox();

      const checkboxEffect = (chart, element) => {
        const index = element.target.value;
        if (chart.isDatasetVisible(index)) {
          chart.hide(index);
        } else {
          chart.show(index);
        }
      };
      const dataset0 = document.getElementById("dataset0");
      const dataset1 = document.getElementById("dataset1");
      const dataset2 = document.getElementById("dataset2");

      dataset0.addEventListener("change", (e) => {
        checkboxEffect(newChart, e);
      });
      dataset1.addEventListener("change", (e) => {
        checkboxEffect(newChart, e);
      });
      dataset2.addEventListener("change", (e) => {
        checkboxEffect(newChart, e);
      });

      return () => {
        newChart.destroy();
      };
    }
    // eslint-disable-next-line
  }, [data, options]);

  return <canvas className={`riskprofile`} ref={ref}></canvas>;
};

export default RiskProfile;
