import * as d3 from "d3";
import { color } from "d3";
import csvPath from '../assets/data/spotify_data/data_by_year.csv';
// import {legend, swatches} from @d3/color-legend

function drawScatterFromCsv(){
    //async method
    d3.csv(csvPath).then((data) => {
        // array of objects
        console.log(data.length);
        console.log(data);
        // do something with the data (e.g process and render chart)
        //  const pData = processData();
        //  drawScatterChart(pData, id);
        //(data will only exist inside here since it is an async call to read in data) so all rendering and processsing with data has to occur inside the "then"
    });
}
/* 
    Same as the one above but we made the function itself asynch so we can use await
    The two do the same thing essentially but it is cleaner to read
*/
export async function drawScatterFromCsvAsync(){
    const data = await d3.csv(csvPath);
    console.log(data);
    drawScatterChart(data, "#scatter"); 
    //process data()
    //draw chart ()
    //There will be some delay in console before it prints the array
}


export function drawScatterChart(data, id) {
    
    // const margin = { top: 40, right: 40, bottom: 120, left: 100 };
    // const height = 300;
    // const width = 500;
    
    console.log(data)
   

    // margin convention
    const margin = {top: 10, right: 100, bottom: 50, left: 100};
    const parentDiv = document.getElementById(id.substring(1));
    const visWidth = parentDiv.clientWidth; //600 - margin.left - margin.right;
    // const visHeight = 460 - margin.top - margin.bottom;
    const visHeight = 460 - margin.top - margin.bottom;
    // const margin = {top: 40, right: 5, bottom: 100, left: 40};
    // const parentDiv = document.getElementById(id.substring(1));
    // const visWidth = parentDiv.clientWidth; //600 - margin.left - margin.right;
    // const visHeight = 400; //460 - margin.top - margin.bottom;
  
    const svg = d3.select(id).append("svg")
        // .attr("viewBox", [0, 0, 100, height])
        // .attr('width', '100%') //visWidth + margin.left + margin.right)
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom);
  
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // create scales
    
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year)).nice()
        .range([0, visWidth]);
    
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.energy)).nice()
        .range([visHeight, 0]);
    
    // create and add axes
    
    const xAxis = d3.axisBottom(x);
    
    g.append("g")
        .attr('transform', `translate(0, ${visHeight})`)
        .call(xAxis)
        .call(g => g.selectAll('.domain').remove())
      .append('text')
        .attr('x', visWidth / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text('Year');
    
    const yAxis = d3.axisLeft(y);
    
    g.append('g')
        .call(yAxis)
        .call(g => g.selectAll('.domain').remove())
      .append('text')
        .attr('x', -40)
        .attr('y', visHeight / 2)
        .attr('fill', 'black')
        .attr('dominant-baseline', 'middle')
        .text('Energy');
    
    // draw grid, based on https://observablehq.com/@d3/scatterplot
    
    const grid = g.append('g')
        .attr('class', 'grid');
    
    grid.append('g')
      .selectAll('line')
      .data(y.ticks())
      .join('line')
        .attr('stroke', '#d3d3d3')
        .attr('x1', 0)
        .attr('x2', visWidth)
        .attr('y1', d => 0.5 + y(d))
        .attr('y2', d => 0.5 + y(d));
    
    grid.append('g')
      .selectAll('line')
      .data(x.ticks())
      .join('line')
        .attr('stroke', '#d3d3d3')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', d => 0)
        .attr('y2', d => visHeight);

    let tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("font-family", "'Open Sans', sans-serif")
        .style("font-size", "12px")
        .style("z-index", "10")
        .style("visibility", "hidden"); 
    
    // draw points
    function drawPoints(data) {
      g.selectAll('circle')
        .data(data)
        .join('circle')
          .attr('opacity', 0.75)
          .attr('cx', d => x(d.year))
          .attr('cy', d => y(d.energy))
          .attr('fill', d =>  color(d.energy))
          .attr('r', 3)

          .on("mouseover", (e,d) => {
            // console.log(e)
            tooltip
             .style("visibility", "visible")
             .text("Year:" + d.year + "; Energy: " + d.energy)})
          .on("mousemove", (e,d) => {
              console.log(e)
              tooltip
              .style("top", (e.pageY-10)+"px")
              .style("left",(e.pageX+10)+"px")
              .text("Year:" + d.year + "; Energy: " + d.energy)})
            //   .text('Year' + d.year + ": " + d.energy))
            //   .attr('font-weight', 'bold')
          .on("mouseout", (e,d) => tooltip
          .style("visibility", "hidden"));
        //   .attr('r', d => 10000*size(d.enery));
    }
    
    console.log('HEREEEEEE')
    drawPoints(data);
    
    // // draw legend
    
    // const legend = g.append('g')
    //     .attr('transform', `translate(${visWidth})`);
    
    // const rows = legend.selectAll('g')
    //   .data(origins)
    //   .join('g')
    //     .attr('transform', (d, i) => `translate(20, ${i * 20})`);
    
    // add a square green button/click
    // svg.append('rect')
    //     .attr('width', 15)
    //     .attr('height', 15)
    //     .attr('stroke-width', 2)
    //     .attr('stroke', '#d3d3d3')
    //     // .attr('stroke', d => (d.energy))
    //     .attr('fill', d => 'green')
    //     // .on('click', onclick);
    
    // svg.append('text')
    //     .attr('font-size', 15)
    //     .attr('x', 20)
    //     .attr('y', 7.5)
    //     .attr('font-family', 'sans-serif')
    //     .attr('dominant-baseline', 'middle')
    //     .text(d => d)
    
    // track which origins are selected
    // const selected = new Map(origins.map(d => [d, true]));
    
    // function onclick(event, d) {
    //   const isSelected = selected.get(d);
      
    //   // select the square and toggle it
    //   const square = d3.select(this);
    //   square.attr('fill', d => isSelected ? 'white' : color(d));
    //   selected.set(d, !isSelected);
      
    //   // redraw the points
    //   drawPoints(data.filter(d => selected.get(d.origin)));
    // }
    
    // return svg.node();
  }