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
   const margin = { top: 20, right: 150, bottom: 40, left: 200 };
   const WIDTH = 1300 - margin.left - margin.right;
   const HEIGHT = 500 - margin.top - margin.bottom;

   const svg = d3.select("#scatter")
       .append("svg")
       .attr("width", WIDTH + margin.left + margin.right)
       .attr("height", HEIGHT + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);


   const colorScale = d3.scaleThreshold()
      .domain([10000000, 30000000, 40000000])
      .range(["#FFCD90", "#FF8303", "#FD5901"]);

   const xScale = d3.scaleLinear()
       .domain([0, 50000000])  
       .range([0, WIDTH]);

   const yScale = d3.scaleLinear()
       .domain([0, 50000000])  
       .range([HEIGHT, 0]);

   svg.append("g")
       .attr("transform", `translate(0,${HEIGHT})`)
       .call(d3.axisBottom(xScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); 

   svg.append("g")
       .call(d3.axisLeft(yScale).tickValues([0, 10000000, 20000000, 30000000, 40000000, 50000000]).tickFormat(d3.format(".1s"))); 

       svg.append("text")
       .attr("class", "x-axis-label")
       .attr("x", WIDTH / 2)
       .attr("y", HEIGHT + margin.bottom )  
       .attr("text-anchor", "middle")
       .style("font-size", "16px", "bold")
       .text("Total Cases");

   svg.append("text")
       .attr("class", "y-axis-label")
       .attr("x", -HEIGHT / 2)
       .attr("y", -margin.left + 150) 
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .style("font-size", "16px", "bold")
       .text("Recovered");

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
       .attr("cx", d => xScale(d.totalCases))  
       .attr("cy", d => yScale(d.totalRecovered))  
       .attr("r", 15)  
       .attr("fill", d => colorScale(d.totalCases))  
       .attr("stroke", "#000")  
       .attr("stroke-width", 1)  
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

   createLegend1(svg, colorScale, WIDTH);
}

function createLegend1(svg, colorScale, WIDTH) {
    const legendData = [
        { label: "< 10M", domain: [0, 10000000], color: "#FFCD90" },
        { label: "10M - 30M", domain: [10000000, 30000000], color: "#FF8303" },
        { label: "30M - 40M", domain: [30000000, 40000000], color: "#FD5901" }
    ];

    const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${WIDTH - 50}, 50)`);  

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", (d, i) => i * 25)
        .style("fill", d => d.color);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25 + 15)
        .text(d => `${d.domain[0].toLocaleString()} - ${d.domain[1].toLocaleString()}`)
        .attr("font-size", "14px")
        .attr("fill", "#000");
}

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
               isVisible = true; 
               break;
       }

       d3.select(this).style("display", isVisible ? "block" : "none");
   });
}

document.getElementById("all").addEventListener("click", () => filterData("all"));
document.getElementById("lower-cases").addEventListener("click", () => filterData('lower-cases'));
document.getElementById("higher-cases").addEventListener("click", () => filterData('higher-cases'));
document.getElementById("lower-recovered").addEventListener("click", () => filterData('lower-deaths'));
document.getElementById("higher-recovered").addEventListener("click", () => filterData('higher-deaths'));

fetchData();
