// Async function to fetch data from the API
async function fetchCovidData() {
    const response = await fetch('https://covid-19.dataflowkit.com/v1');
    const data = await response.json();
    
    // Check if data is available for South Africa (38th element)
    const SouthAfricaData = data[37];  // Get South Africa's data (38th element)
    if (!SouthAfricaData) {
        console.error("Data for South Africa not found.");
        return null;
    }

    // Use regex to remove commas and parse integers
    const cases = SouthAfricaData["Total Cases_text"] ? parseInt(SouthAfricaData["Total Cases_text"].replace(/,/g, "")) : 0;
    const deaths = SouthAfricaData["Total Deaths_text"] ? parseInt(SouthAfricaData["Total Deaths_text"].replace(/,/g, "")) : 0;
    const recovered = SouthAfricaData["Total Recovered_text"] ? parseInt(SouthAfricaData["Total Recovered_text"].replace(/,/g, "")) : 0;

    return { cases, deaths, recovered };
}

// Function to create the pie chart (No changes needed here)
function createPieChart() {
    fetchCovidData().then(data => {
        if (!data) {
            console.error("Unable to fetch valid data for the pie chart.");
            return;  // Exit if data is not valid
        }

        const pieData = [
            { label: "Cases", value: data.cases, color: "blue" },
            { label: "Recovered", value: data.recovered, color: "green" },
            { label: "Deaths", value: data.deaths, color: "red" }
        ];
        
        const width = 400, height = 400, radius = Math.min(width, height) / 2;
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        
        const color = d3.scaleOrdinal().range(["#FFA500", "#0077B6", "#C23B22"]);
        
        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(radius);
        
        const arcs = svg.selectAll(".arc")
            .data(pie(pieData))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("fill", d => color(d.data.label));
        
        arcs.append("path")
            .attr("d", arc)
            .attr("class", "pie-piece")
            .on("mouseover", function(event, d) {
                const tooltip = d3.select("#tooltip");
                tooltip.style("visibility", "visible")
                    .html(`
                        <strong>${d.data.label}:</strong><br>
                        Total: ${d.data.value.toLocaleString()}<br>
                        Percentage: ${(d.data.value / (data.cases + data.recovered + data.deaths) * 100).toFixed(2)}%
                    `);
            })
            .on("mousemove", function(event) {
                const tooltip = d3.select("#tooltip");
                tooltip.style("top", (event.pageY + 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("visibility", "hidden");
            });

        arcs.append("text")
            .attr("transform", function(d) {
                const centroid = arc.centroid(d);
                return `translate(${centroid})`;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(d => `${((d.data.value / (data.cases + data.recovered + data.deaths)) * 100).toFixed(1)}%`);

        // Create the legend for the pie chart
        const legend = d3.select("#legend");

        pieData.forEach(d => {
            const legendItem = legend.append("div")
                .attr("class", "em");

            legendItem.append("span")
                .style("background-color", d.color);

            legendItem.append("span")
                .text(`${d.label}: ${((d.value / (data.cases + data.recovered + data.deaths)) * 100).toFixed(1)}%`);
        });
    }).catch(err => {
        console.error("Error fetching data: ", err);
    });
}

// Create the chart
createPieChart();
