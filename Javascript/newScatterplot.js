async function fetchData() {
   const url = "https://covid-19.dataflowkit.com/v1";
   const response = await fetch(url);
   const data = await response.json();

   const filteredData = data.slice(0, 25).map(d => ({
       country: d.Country_text,
       totalCases: parseInt(d["Total Cases_text"].replace(/,/g, "")),
       totalRecovered: parseInt(d["Total Recovered_text"].replace(/,/g, "")),
       totalDeaths: parseInt(d["Total Deaths_text"].replace(/,/g, ""))
   }));

   createScatterPlot(filteredData);
}

function createScatterPlot(data) {
   const margin = { top: 20, right: 30, bottom: 40, left: 200 };
   const WIDTH = 1100 - margin.left - margin.right;
   const HEIGHT = 500 - margin.top - margin.bottom;

   const svg = d3.select("#scatter")
       .append("svg")
       .attr("width", WIDTH + margin.left + margin.right)
       .attr("height", HEIGHT + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);

   // Define color scale based on total cases
   const colorScale = d3.scaleThreshold()
      .domain([10000000, 30000000, 40000000])
      .range(["#FFCD90", "#FF8303", "#FD5901"]);

   const xScale = d3.scaleLinear()
       .domain([0, 50000000])  
       .range([0, WIDTH]);

   const yScale = d3.scaleLinear()
       .domain([0, 50000000])  
       .range([HEIGHT, 0]);

   // Add x-axis
   svg.append("g")
       .attr("transform", `translate(0,${HEIGHT})`)
       .call(d3.axisBottom(xScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); 

   // Add y-axis
   svg.append("g")
       .call(d3.axisLeft(yScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); 

       svg.append("text")
       .attr("class", "x-axis-label")
       .attr("x", WIDTH / 2)
       .attr("y", HEIGHT + margin.bottom )  // Adjust positioning as needed
       .attr("text-anchor", "middle")
       .style("font-size", "16px", "bold")
       .text("Total Cases");

   // Y-axis label
   svg.append("text")
       .attr("class", "y-axis-label")
       .attr("x", -HEIGHT / 2)
       .attr("y", -margin.left + 150)  // Adjust positioning as needed
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .style("font-size", "16px", "bold")
       .text("Recovered");

   // Tooltip
   const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

   // Draw bubbles
   svg.selectAll(".bubble")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "bubble")
       .attr("cx", d => xScale(d.totalCases))  
       .attr("cy", d => yScale(d.totalRecovered))  
       .attr("r", 15)  
       .attr("fill", d => colorScale(d.totalCases))  // Apply color scale based on total cases
       .attr("stroke", "#000")  // Black stroke color
       .attr("stroke-width", 1)  // Stroke width
       .on("mouseenter", function (event, d) {
           tooltip.style("visibility", "visible")
               .text(`${d.country}: Total Cases: ${d.totalCases}, Recovered: ${d.totalRecovered}`);
       })
       .on("mousemove", function (event) {
           tooltip.style("top", (event.pageY + 10) + "px")
               .style("left", (event.pageX + 10) + "px");
       })
       .on("mouseleave", function () {
           tooltip.style("visibility", "hidden");
       });

   // Add legend
   createLegend(svg, colorScale, WIDTH);
}

function createLegend(svg, colorScale, WIDTH) {
   const legendWidth = 20;
   const legendHeight = 20;
   const legendSpacing = 10;
   const legendX = WIDTH - 150;  // Adjusted positioning for visibility
   const legendY = 20;

   const colorRange = colorScale.range();
   const legendLabels = ["< 2M", "2M - 4M", "4M - 6M", "> 6M"];

   const legend = svg.append("g")
       .attr("class", "legend")
       .attr("transform", `translate(${legendX}, ${legendY})`);

   // Draw color boxes in the legend
   legend.selectAll(".legend-box")
       .data(colorRange)
       .join("rect")
       .attr("class", "legend-box")
       .attr("x", 0)
       .attr("y", (d, i) => i * (legendHeight + legendSpacing))
       .attr("width", legendWidth)
       .attr("height", legendHeight)
       .style("fill", d => d);

   // Add text labels for the legend
   legend.selectAll(".legend-text")
       .data(legendLabels)
       .join("text")
       .attr("class", "legend-text")
       .attr("x", legendWidth + 10)
       .attr("y", (d, i) => i * (legendHeight + legendSpacing) + legendHeight / 1.5)
       .text(d => d)
       .attr("font-size", "14px")
       .attr("fill", "#000");
}

// Filter bubbles by case and death counts
function filterData(filter) {
   d3.selectAll(".bubble").each(function(d) {
       let isVisible = false;

       switch (filter) {
           case 'lower-cases':
               isVisible = d.totalCases <= 25000000;
               break;
           case 'higher-cases':
               isVisible = d.totalCases > 25000000 && d.totalCases <= 50000000;
               break;
           case 'lower-deaths':
               isVisible = d.totalRecovered <= 25000000;
               break;
           case 'higher-deaths':
               isVisible = d.totalRecovered > 25000000 && d.totalDeaths <= 50000000;
               break;
           default:
               isVisible = true;  // Shows all bubbles if no filter is applied
               break;
       }

       d3.select(this).style("display", isVisible ? "block" : "none");
   });
}

// Event listeners for filtering
document.getElementById("all").addEventListener("click", () => filterData("all"));
document.getElementById("lower-cases").addEventListener("click", () => filterData('lower-cases'));
document.getElementById("higher-cases").addEventListener("click", () => filterData('higher-cases'));
document.getElementById("lower-recovered").addEventListener("click", () => filterData('lower-deaths'));
document.getElementById("higher-recovered").addEventListener("click", () => filterData('higher-deaths'));

fetchData();
