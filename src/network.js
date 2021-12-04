import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import africa from './africa.json';
import classes from './Site.module.css';
import './index.css';
import logo from './OECD_white_EN.png';
import MaterialIcon from 'material-icons-react';
import { ForceGraph2D } from 'react-force-graph';
// import * as ForceGraph2D from 'react-force-graph-2d';
// import * as d3 from 'd3';
// import * as d3Force from 'd3-force';


const Network = props => {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWttZCIsImEiOiJjajBqYjJpY2owMDE0Mndsbml0d2V1ZXczIn0.el8wQmA-TSJp2ggX8fJ1rA';
  const colors = ["#F3F2E8","#D4EBE2","#B6E3DB","#97DCD5","#79D5CF","#5ACEC9","#3CC6C2","#1DBFBC","#333333"]

  const [Dist, setDist] = useState(1000)  
  const [mapnetwork, setmapnetwork] = useState("Network")  
  
  const tooltip = e => {
    if (e.payload[0]) {
    return ( <div className={classes.tooltip}> {e.payload[0].payload.time} <br/>SCI {e.payload[0].payload.time}x</div> ) }
  }
  
  // useEffect(() => {},[]); 
    
  const TimeSlider = ({ Dist, width }) => {
    return (    
      <div style={{ width: `${width}px` }} className={classes["input-slider"]}>
        <input type="range"
          min={0}
          max={1000}
          value={Dist}
          step={1}
          onChange={event =>
             setDist(event.target.value)
            }
        />
        {<span>{Dist} Minutes</span>}
      </div>
    );
  }
  
  
 const [mapbox, setmapbox] = useState( {lng: 10,
    lat: 0,
    zoom: 2.5,
    button: "Map"} );

const mapContainerRef = useRef(null);

const [map, setMap] = useState(null);


useEffect(() => { 
  
  if (!map) {
  const popUp = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
  });

  const map = new mapboxgl.Map({
  container: mapContainerRef.current,
  style: 'mapbox://styles/mkmd/ckguwdhux0j7719p9rz2hpmpi', /// Select mapstyle from mapbox studio
  center: [mapbox.lng, mapbox.lat],
  zoom: mapbox.zoom,
  attributionControl: false
});
  

map.on('load', () => {
  setMap(map);
  map.addSource('node-237nu4', { type: 'vector', url: 'mapbox://mkmd.1ya649n5'});
  map.addSource('edge-dm0qvz', { type: 'vector', url: 'mapbox://mkmd.1rxtvzvy'});
  map.addLayer({
    id: 'edge',
    source:'edge-dm0qvz',
    type : "line",
    'source-layer':'edge-dm0qvz',
    // filter: [ "match", ["get", "iso_3166_1"], ["TJ","IR","CN", "GL", "SJ", "TM", "EH", "KP" ], false, true ],
    paint: {
      "line-color" : ["match", ["get","border"],
       ["0"],colors[0],
       "red"
    ]
    },
  })
  
  map.addLayer({
    id: 'node',
    source:'node-237nu4',
    type : "circle",
    'source-layer':'node-237nu4',
     filter: [
      "all",
      [
        ">",
        ["get", "Pop2015"],
        0
      ]
    ],
    paint: {
      "circle-radius":  [
        "step",
        ["get", `Between`],
        2.5,
        40000000,
        3,
        70000000,
        4,
        100000000,
        6,
        200000000,
        8,
        500000000,
        10,
        1000000000,
        13,
        118476350000,
        15,
      ]
      ,
      "circle-color": [
        "step",
        ["get", `Pop2015`],
        colors[0],
        10000,
        colors[1],
        30000,
        colors[2],
        100000,
        colors[3],
        300000,
        colors[4],
        1000000,
        colors[5],
        2000000,
        colors[6],
        11847635,
        colors[7],
      ],
  
      "circle-stroke-width": 1,
      "circle-stroke-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        0,
        3,
        0,
        15,
        1,
      ],
      "circle-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        0,
        3,
        0.4,
        10,
        1
      ]
  
      
      // [
      //   "case",
      //   ["boolean", ["feature-state", "hover"], false],
      //   1,
      //   0.7,
      // ],
    },
  });
  map.on('mousemove', 'node', e =>  {
    let coordinates = [e.lngLat.lng, e.lngLat.lat];
    popUp
      .setLngLat(coordinates)
      .setHTML(
      `<bold>Between:${e.features[0].properties.Between}</bold><br/>
      ${e.features[0].properties.agglosName}<br/>
      <strong>${e.features[0].properties.Pop2015}</strong><br/><bold>${e.features[0].properties.ISO3}</bold><br/>
      <small>Degree: ${e.features[0].properties.degree}</small>`
      )
      .addTo(map);
      var popupElem = popUp.getElement();
      popupElem.style.color = colors[0];
  });

  map.on('mouseleave', 'node', e =>  {
    map.getCanvas().style.cursor = ''
    popUp.remove()
  });
  
  
  map.on('mousemove', 'edge', e =>  {
    let coordinates = [e.lngLat.lng, e.lngLat.lat];
    popUp
      .setLngLat(coordinates)
      .setHTML(        
      `<bold>Time: ${Math.round(e.features[0].properties.time)}min</bold><br/>
      <bold>Time Ur :${Math.round(e.features[0].properties.timeU)}min</bold><br/>
      <bold>Time Ur&CB${Math.round(e.features[0].properties.value)}min</bold><br/>
      `
      )
      .addTo(map);
      var popupElem = popUp.getElement();
      popupElem.style.color = colors[0];
  });

  // map.on('mouseleave', 'edge', e =>  {
  //   map.getCanvas().style.cursor = ''
  //   popUp.remove()
  // });


  });
}},[map]);


/////////////////////////////////////////// Network part


// africa.nodes.map(e => {
//   e.x = e.x
//   e.y = e.y
// })

africa.nodes.map(e => {
  e.visibility="true"  
  if (e.size===0.1)
  {
    e.visibility="false"
  }
  })
  

africa.links.map(e => e.border===1? e.color="rgb(255,255,255,.3)" : e.color=e.source.color)
// africa.links.map(e => e.time = Math.round(e.time))
// africa.links.map(e => e.border==1? e.value=e.value+1000 : null)
// africa.links.map(e => e.value=e.value*Math.random())
// console.log(africa)

const fgRef = useRef();
const nodes = africa.nodes
const links = africa.links

const [graphData, setGraphData] = useState({ nodes: nodes, links: links });

useEffect(() => {
  
if ((Dist === 0 | Dist === 60 | Dist === 300 | Dist === 1000) && mapnetwork === "Network")
{
const fg = fgRef.current;
fg.d3Force('link').distance(link => link.border===1? link.time+Dist : link.time).iterations(200);
fg.zoom(0.025703429015691344)
fg.centerAt(496,2656)

// fg.d3Force('box', () => {
//   nodes.forEach(node => {    
//     node.x=node.reX*500
//     node.y=node.reY*500
//     node.vx=3
//     node.vy=3
//     // const x = node.x || 0, y = node.y || 0;

//     // // bounce on box walls
//     // if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
//     // if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
//   });
// });

}}, [Dist]);


/////////////////////////////////////////////////////////////////////////////////////



  return (
    <div>
    <div className={classes.topleft}> <div className={classes.headwrapper}> <div className={classes.buttonwrapper}>          
    <button className={mapnetwork==="Map"? classes.buttonActive : classes.button} onClick={() => mapnetwork==="Network"? setmapnetwork("Map") : null}>{"Map"}</button>
    <button className={mapnetwork==="Network"? classes.buttonActive : classes.button} onClick={() => mapnetwork==="Map"? setmapnetwork("Network") : null}>{"Network"}</button></div>
    <headtitle>Cities and roads in Africa</headtitle></div><br/>
    <span>Set the border cost</span><br/>
    <button className={Dist===0? classes.buttonActivedist : classes.buttondist} onClick={() => mapnetwork==="Network"? setDist(0) : null}>{"0min"}</button>
    <button className={Dist===60? classes.buttonActivedist : classes.buttondist} onClick={() => mapnetwork==="Network"? setDist(60) : null}>{"60min"}</button>
    <button className={Dist===300? classes.buttonActivedist : classes.buttondist} onClick={() => mapnetwork==="Network"? setDist(300) : null}>{"300min"}</button>
    <button className={Dist===1000? classes.buttonActivedist : classes.buttondist} onClick={() => mapnetwork==="Network"? setDist(1000) : null}>{"1000min"}</button>    
    <TimeSlider Dist={Dist}/>
    <table className={classes.table}>
        <thead>
          <tr>
            {/* <th>Country</th><th>Road</th><th>Network</th> */}
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    {/* <br/> <span>Regional average</span> */}
          <div className="VariableInfoWrapper">
              <MaterialIcon icon="info"/>
              <span><strong>How it is calculated?</strong><br/>
              The Social Connectedness Index measures the strength of connectedness between two geographic areas as represented by Facebook friendship ties.<br/><br/>
              <strong>Methodology</strong><br/>
              We use aggregated friendship connections on Facebook to measure social connectedness between geographies. Locations are assigned to users based on information they provide, connection information, and location services they have opted into. We use these friendships to estimate the probability a pair of users in these countries are Facebook friends and map this to an index score called the Social Connectedness Index (SCI). If the SCI is twice as large between two pairs of regions, it means the users in the first region-pair are about twice as likely to be connected than the second region-pair.<br/><br/>
            The figure shows a heat map of the social connectedness. For each country in our data, the colors highlight connections of the focal country, given in orange. The lightest color corresponds to the 20th percentile of the connectedness to the focal country; darker colors correspond to closer connections.
            <br/><br/><color>Click the right button to check more detail and download the data on the Facebook page</color> </span>
          </div>
          <div className="FB">
          <a href="https://dataforgood.fb.com/tools/social-connectedness-index/#:~:text=The%20Social%20Connectedness%20Index%20measures,social%20mobility%2C%20trade%20and%20more.">
              <MaterialIcon icon="facebook"/>
              <span>Move to the Facebook Data for Good page to check detail and download the data</span>
          </a>
          </div>
       </div>
       <div><div ref={mapContainerRef} className={classes.mapContainer} /></div>
    
    {Dist===0? mapnetwork==="Map"? null :  < ForceGraph2D    
    ref={fgRef}
    backgroundColor="black"    
    graphData={graphData}
    nodeId="id"
    nodeVal="size3"
    nodeLabel="nameG"
    nodeAutoColorBy="group"
    linkSource="source"
    linkTarget="target"
    linkColor="color"
    cooldownTime={10000}  
    nodeVisibility={e => e.size>0.2}
    linkLabel={e => Math.round(e.border===1? e.time+Dist : e.time)+"min"}
    // onRenderFramePre={(e) => console.log(e)}
    // onRenderFramePost={(e) => console.log(e)}
    // d3AlphaDecay={0}
    // d3VelocityDecay={0}    
    /> : null}    
    {Dist===60? mapnetwork==="Map"? null :  < ForceGraph2D    
    ref={fgRef}
    backgroundColor="black"    
    graphData={graphData}
    nodeId="id"
    nodeVal="size3"
    nodeLabel="nameG"
    nodeAutoColorBy="group"
    linkSource="source"
    linkTarget="target"
    linkColor="color"
    cooldownTime={10000}  
    nodeVisibility={e => e.size>0.2}
    linkLabel={e => Math.round(e.border===1? e.time+Dist : e.time)+"min"}
    // onRenderFramePre={(e) => console.log(e)}
    // onRenderFramePost={(e) => console.log(e)}
    // d3AlphaDecay={0}
    // d3VelocityDecay={0}    
    /> : null}
    {Dist===300? mapnetwork==="Map"? null :  < ForceGraph2D    
    ref={fgRef}
    backgroundColor="black"    
    graphData={graphData}
    nodeId="id"
    nodeVal="size3"
    nodeLabel="nameG"
    nodeAutoColorBy="group"
    linkSource="source"
    linkTarget="target"
    linkColor="color"
    cooldownTime={10000}      
    nodeVisibility={e => e.size>0.2}
    linkLabel={e => Math.round(e.border===1? e.time+Dist : e.time)+"min"}
    /> : null}          
    {Dist===1000? mapnetwork==="Map"? null :  < ForceGraph2D    
    ref={fgRef}
    backgroundColor="black"    
    graphData={graphData}
    nodeId="id"
    nodeVal="size3"
    nodeLabel="nameG"    
    nodeAutoColorBy="group"
    linkSource="source"
    linkTarget="target"
    linkColor="color"
    nodeVisibility={e => e.size>0.2}
    linkLabel={e => Math.round(e.border===1? e.time+Dist : e.time)+"min"}
    cooldownTime={10000}      
    // linkCurvature={0.1}
    d3AlphaDecay={0}    
    /> : null}          
  </div>      
);
  
};

export default Network;






