//1.Grab Data
fetch('https://www.fruityvice.com/api/fruit/all')
        .then(response => response.json())
        .then(data => {
            createScatterPlot(data);
});

/*I experienced an issue with the two data visualizations parsing on top of each other, so I noticed its because I didn't make the SVG parse within my specific section element in my HTML.
So I corrected that by creating the section called "scatter" the ensured that I fixed it in my js "let svg = d3.select("#scatter") " */

//2. Create Scatter plot
function createScatterPlot(data) {
    const filteredData = data.map(d => ({ // The map method here creates a new array where each element from the original data array is transformed into an object containing only the desired categories which are sugar, fat, and name.
        sugar: d.nutritions.sugar,
        fat: d.nutritions.fat,
        name: d.name,
    }));

    //3. Create Margins
    const margin = { top: 20, right: 30, bottom: 40, left: 40 }; //This creates a margin object that's used to set the amount of space surrounding the visualization's main content 
    const WIDTH = 1300 - margin.left - margin.right;
    const HEIGHT = 600 - margin.top - margin.bottom;

    //4. Create an SVG 
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", WIDTH + margin.left + margin.right)
        .attr("height", HEIGHT + margin.top + margin.bottom + 30) //The SVG was cutting off the heading for the x axis, so I added 30 pixels to allow more room for the heading
        .append("g")
        .attr("transform", `translate(${margin.left + 50},${margin.top})`);

    //5. Scales
    const xScale = d3.scaleLinear()
        .domain([0,20]) // Sugar range based on data
        .range([0, 1000]);

    const yScale = d3.scaleLinear()
        .domain([0, 1]) // Fat range (0 to 1)
        .range([HEIGHT, 0]);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.fat)]) // Fat range
        .range([13, 20]); // I tried using the code from my bubbleDiagram for the radius, but the circles were two big and it made it hard to read, so I made the radius smaller.

    // 6. Create Axes
    const xAxis = d3.axisBottom(xScale).ticks(5); // Creates the ticks for the x Scale (5, 10, 15, 20)
    const yAxis = d3.axisLeft(yScale).tickValues([0.0, 0.5, 1.0]); // Creates the ticks for the y Scale (0.0, 0.5, 1.0)

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${HEIGHT})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // 7. Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden"); // Initially hidden

    // 8. Create bubbles
    svg.selectAll(".bubble")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.sugar))
        .attr("cy", d => yScale(d.fat))
        .attr("r", d => radiusScale(d.fat)) // // The size of the circles will change based on the d.fat data, but because of the way the data is so small for example 0.5, 0.6, there isnt a hige difference.

        .on("mouseenter", function (event, d) {
            tooltip
                .style("visibility", "visible")
                .text(`${d.name}: ${d.sugar}g sugar, ${d.fat}g fat`);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("top", (event.pageY + 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseleave", function () {
            tooltip.style("visibility", "hidden");
        });

    // Add labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", WIDTH / 2)
        .attr("y", HEIGHT + margin.bottom)
        .style("text-anchor", "middle")
        .text("Sugar (g)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -HEIGHT / 2)
        .style("text-anchor", "middle")
        .text("Fat (g)");
}
