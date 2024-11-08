async function fetchCovidData() {
    const response = await fetch('https://covid-19.dataflowkit.com/v1');
    const data = await response.json();
    
    const SouthAfricaData = data[37];  
    if (!SouthAfricaData) {
        console.error("Data for South Africa not found.");
        return null;
    }

    const cases = SouthAfricaData["Total Cases_text"] ? parseInt(SouthAfricaData["Total Cases_text"].replace(/,/g, "")) : 0;
    const deaths = SouthAfricaData["Total Deaths_text"] ? parseInt(SouthAfricaData["Total Deaths_text"].replace(/,/g, "")) : 0;
    const recovered = SouthAfricaData["Total Recovered_text"] ? parseInt(SouthAfricaData["Total Recovered_text"].replace(/,/g, "")) : 0;

    return { cases, deaths, recovered };
}

function createLegend(legendData, pieChartWidth) {
    const legendWidth = 200;
    const svgWidth = pieChartWidth + legendWidth + 20; 

    const chartContainer = d3.select("#chart-container");
    chartContainer.html("");

    const svgContainer = chartContainer.append("svg")
        .attr("width", svgWidth)
        .attr("height", 500); 

    
    const pieChartGroup = svgContainer.append("g")
        .attr("transform", `translate(${pieChartWidth / 2},${250})`); 

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(180); 
    const color = d3.scaleOrdinal().range(["#FFA500", "#0077B6", "#C23B22"]);

    const parts = pieChartGroup.selectAll(".arc")
        .data(pie(legendData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("fill", d => color(d.data.label));

        parts.append("path")
        .attr("d", arc)
        .attr("class", "pie-piece")
        .on("mouseover", function(event, d) {

            const tooltip = d3.select("#tooltip");
            tooltip.style("visibility", "visible")
                .html(`Total: ${d.data.value.toLocaleString()}<br>Percentage: ${(d.data.value / (d3.sum(legendData, d => d.value)) * 100).toFixed(2)}%`);
            
            // Apply hover effect (opacity change)
            d3.select(this).style("opacity", 0.7);  // Reduce opacity on hover
        })
        .on("mousemove", function(event) {
            const tooltip = d3.select("#tooltip");
            tooltip.style("top", (event.pageY + 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            // Reset tooltip visibility
            d3.select("#tooltip").style("visibility", "hidden");
            
            // Reset hover effect
            d3.select(this).style("opacity", 1);  // Reset opacity
        });
    

    parts.append("text")
        .attr("transform", function(d) {
            const centroid = arc.centroid(d);
            return `translate(${centroid})`;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(d => `${((d.data.value / (d3.sum(legendData, d => d.value))) * 100).toFixed(1)}%`);

    const legend = svgContainer.append("g")
        .attr("transform", `translate(${pieChartWidth + 20}, 20)`); 

    const legendItems = legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 30})`); 

    legendItems.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => d.color);

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .attr("font-size", "14px")
        .attr("fill", "black")
        .text(d => d.label);
}

function createPieChart() {
    fetchCovidData().then(data => {
        if (!data) {
            console.error("Can't fetch API data");
            return;  
        }

        const pieData = [
            { label: "Cases", value: data.cases, color: "#FFA500" },
            { label: "Recovered", value: data.recovered, color: "#0077B6" },
            { label: "Deaths", value: data.deaths, color: "#C23B22" }
        ];

        const pieChartWidth = 500; // Make the pie chart bigger

        // Create pie chart and legend dynamically
        createLegend(pieData, pieChartWidth);
    }).catch(err => {
        console.error("Error fetching data: ", err);
    });
}

createPieChart();
