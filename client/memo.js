///////////////////////////////////////
// const layer1 = new MVTLayer({
//   id: "mvt-layer1",
//   data: `https://api.mapbox.com/v4/redsilver522.3nx27h6v/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
//   // data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
//   // data: `https://a.tiles.mapbox.com/v4/redsilver522.3nx27h6v/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
//   // data: `https://b.tiles.mapox.com/v4/redsilver522.3nx27h6v/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
//   //Stylesb
//   minZoom: 10,
//   maxZoom: 22,
//   lineWidthScale: 20,
//   lineWidthMinPixels: 1,
//   lineWidthMaxPixels: 15,
//   pickable: true,
//   autoHighlight: true,
//   getLineColor: [255, 0, 0],
//   // (d) => {
//   //   const lanes = d.properties.RDLN;
//   //   if (lane === lanes) {
//   //     return [0, 0, 0];
//   //   } else {
//   //     return [230, 0, 60];
//   //   }
//   // },
//   visible: isDetail,
//   // updateTriggers: {
//   //   getLineColor: lane,
//   // },
//   onClick: (d) => handleClick(d.object.properties),
// });

// const layer2 = new MVTLayer({
//   id: "mvt-layer2",
//   data: `https://api.mapbox.com/v4/redsilver522.lds2.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
//   //Styles
//   lineWidthScale: 20,
//   lineWidthMinPixels: 1,
//   lineWidthMaxPixels: 15,
//   pickable: true,
//   autoHighlight: true,
//   getLineColor: (d) => {
//     const roadNoTemp = d.properties.ROAD_NO;
//     if (roadNoTemp == roadNo) {
//       return [0, 0, 0, 255];
//     } else {
//       return [0, 0, 0, 0];
//     }
//   },
//   visible: isDetail,
//   updateTriggers: {
//     getLineColor: roadNo,
//   },
//   onClick: (d) => handleClick(d.object.properties.RDLN),
// });

// const fetchData = useCallback(async () => {
//   setLD(true);
//   try {
//     const [emiRes, vpRes, ppRes, bpRes] = await Promise.all([
//       // axios.get("https://d2vuklgckwaas3.cloudfront.net/aadt.geojson"), //https://{bucketname}.s3.ap-northeast-1.amazonaws.com
//       // axios.get("https://d2vuklgckwaas3.cloudfront.net/aadtdot.geojson"), //https://eg-demo.s3.ap-northeast-1.amazonaws.com/aadt.geojson
//       axios.get("https://d2vuklgckwaas3.cloudfront.net/emi_sorted.geojson"),
//       axios.get(
//         "https://d2vuklgckwaas3.cloudfront.net/vcount_sorted.geojson"
//       ), ///emi_sorted.geojson
//       axios.get(
//         "https://d2vuklgckwaas3.cloudfront.net/pcount_sorted.geojson"
//       ),
//       axios.get(
//         "https://d2vuklgckwaas3.cloudfront.net/bcount_sorted.geojson"
//       ),
//     ]);

//     setData((prev) => ({
//       ...prev,
//       // nroad: nroadRes.data,
//       // aadtDot: aadtDot.data,
//       emiroad: emiRes.data,
//       vpoint: vpRes.data,
//       ppoint: ppRes.data,
//       bpoint: bpRes.data,
//     }));
//   } catch (err) {
//     console.error("Error fetching data:", err);
//   } finally {
//     setLD(false);
//     setIsFilter(true);
//   }
// }, [setData, setIsFilter, setLD]);

// useEffect(() => {
//   fetchData();
// }, [fetchData]);
