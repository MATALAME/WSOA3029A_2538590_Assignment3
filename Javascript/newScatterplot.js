async function fetchData() {
   const url = "https://covid-19.dataflowkit.com/v1";
   const response = await fetch(url);
   const data = await response.json();

   const filteredData = data.slice(0, 20).map(d => ({
       country: d.Country_text,
       totalCases: parseInt(d["Total Cases_text"].replace(/,/g, "")),
       totalRecovered: parseInt(d["Total Recovered_text"].replace(/,/g, "")),
       totalDeaths: parseInt(d["Total Deaths_text"].replace(/,/g, ""))
   }));

   createScatterPlot(filteredData);
}

function createScatterPlot(data) {
   const margin = { top: 20, right: 30, bottom: 40, left: 100 };
   const WIDTH = 1300 - margin.left - margin.right;
   const HEIGHT = 600 - margin.top - margin.bottom;

   const svg = d3.select("#scatter")
       .append("svg")
       .attr("width", WIDTH + margin.left + margin.right)
       .attr("height", HEIGHT + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);

   // Define the scales with fixed domains starting from 0
   const xScale = d3.scaleLinear()
       .domain([0, 50000000])  // Custom domain for totalCases, starting from 0
       .range([0, WIDTH]);

   const yScale = d3.scaleLinear()
       .domain([0, 50000000])  // Custom domain for totalRecovered, starting from 0
       .range([HEIGHT, 0]);

   // Add X axis with custom tick values
   svg.append("g")
       .attr("transform", `translate(0,${HEIGHT})`)
       .call(d3.axisBottom(xScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); // Custom tick formatting

   // Add Y axis with custom tick values
   svg.append("g")
       .call(d3.axisLeft(yScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); // Custom tick formatting

       
   // Create bubbles (circles)
   const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");

   svg.selectAll(".bubble")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "bubble")
       .attr("cx", d => xScale(d.totalCases))  // Dynamically position based on totalCases
       .attr("cy", d => yScale(d.totalRecovered))  // Dynamically position based on totalRecovered
       .attr("r", 15)  // Fixed radius for simplicity
       .attr("fill", "#1f77b4")
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


   // Create Legend
   createLegend(svg);
}

function filterData(filter) {
   d3.selectAll(".bubble").each(function(d) {
       let isVisible = false;

       // Determine visibility based on filter type
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
               isVisible = true;  // Show all bubbles if no filter is applied
               break;
       }

       // Apply visibility to each bubble based on the condition
       d3.select(this).style("display", isVisible ? "block" : "none");
   });
}


// Add event listeners for filter buttons
document.getElementById("all").addEventListener("click", () => filterData("all"));
document.getElementById("lower-cases").addEventListener("click", () => filterData('lower-cases'));
document.getElementById("higher-cases").addEventListener("click", () => filterData('higher-cases'));
document.getElementById("lower-recovered").addEventListener("click", () => filterData('lower-deaths'));
document.getElementById("higher-recovered").addEventListener("click", () => filterData('higher-deaths'));


function createLegend(svg) {
   const legendWidth = 20;
   const legendHeight = 20;
   const legendSpacing = 10;
   const legendX = 1100;
   const legendY = 150;

   const legend = svg.append("g")
       .attr("class", "legend")
       .attr("transform", `translate(${legendX}, ${legendY})`);

   const colorRange = ["#1f77b4"];

   legend.selectAll("rect")
       .data(colorRange)
       .enter()
       .append("rect")
       .attr("x", 0)
       .attr("y", (d, i) => i * (legendHeight + legendSpacing))
       .attr("width", legendWidth)
       .attr("height", legendHeight)
       .style("fill", d => d);

   legend.selectAll("text")
       .data(["0-10000000", "10000000-20000000", "20000000-30000000", "30000000-40000000", "40000000-50000000"])
       .enter()
       .append("text")
       .attr("x", legendWidth + 10)
       .attr("y", (d, i) => i * (legendHeight + legendSpacing) + legendHeight / 1.5)
       .text(d => d)
       .attr("font-size", "14px")
       .attr("fill", "#000");
}

// Initialize the fetch and plot function
fetchData();
