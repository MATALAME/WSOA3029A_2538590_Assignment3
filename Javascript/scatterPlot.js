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
        carbohydrates: d.nutritions.carbohydrates,
        name: d.name,
    }));

    //3. Create Margins
    const margin = { top: 20, right: 30, bottom: 40, left: 100 }; //This creates a margin object that's used to set the amount of space surrounding the visualization's main content 
    const WIDTH = 1300 - margin.left - margin.right;
    const HEIGHT = 600 - margin.top - margin.bottom;

    //4. Create an SVG 
    let svg = d3.select("#scatter")
        .append("svg")
        .attr("width", WIDTH + margin.left + margin.right)
        .attr("height", HEIGHT + margin.top + margin.bottom + 50) //The SVG was cutting off the heading for the x axis, so I added 30 pixels to allow more room for the heading
        .append("g")
        .attr("transform", `translate(${margin.left + 50},${margin.top})`);

    //5. Scales
    const xScale = d3.scaleLinear()
        .domain([0,20]) // Sugar range based on data
        .range([0, 1000]);

    const yScale = d3.scaleLinear()
        .domain([0, 20]) // Carb range (0 to 20)
        .range([HEIGHT, 0]);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.carbohydrates)]) // Fat range
        .range([13, 20]); // I tried using the code from my bubbleDiagram for the radius, but the circles were two big and it made it hard to read, so I made the radius smaller.

    const colorScale = d3.scaleThreshold()
        .domain([5, 10, 15, 20]) 
        .range(["#FFF4DF", "#FFCD90", "#FF8303", "#FD5901"]);

    // 6. Create Axes
    const xAxis = d3.axisBottom(xScale).ticks(5); // Creates the ticks for the x Scale (5, 10, 15, 20)
    const yAxis = d3.axisLeft(yScale).ticks(5); // Creates the ticks for the y Scale (0.0, 0.5, 1.0)

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${HEIGHT})`)
        .call(xAxis)
        .selectAll("text")  
        .style("font-size", "16px"); 

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll("text") 
        .style("font-size", "16px"); 

    // 7. Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .style("font-size", "16px"); // Initially hidden

    // 8. Create bubbles
    // I tried using the same method as the bubble diagram but the bubbles have different coordinates so I had to use a dynamic method to create the bubbles and for the coordinates to be placed based sugar and fat.
    svg.selectAll(".bubble")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.sugar))
        .attr("cy", d => yScale(d.carbohydrates))
        .attr("fill", d => colorScale(d.carbohydrates)) 
        .attr("r", d => radiusScale(d.carbohydrates)) // The size of the circles will change based on the d.fat data, but because of the way the data is so small for example 0.5, 0.6, there isnt a huge difference.

        .on("mouseenter", function (event, d) {
            tooltip
                .style("visibility", "visible")
                .text(`${d.name}: ${d.sugar}g sugar, ${d.carbohydrates}g fat`);
        })
        .on("mousemove", function (event) {
            tooltip
                .style("top", (event.pageY + 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseleave", function () {
            tooltip.style("visibility", "hidden");
        });

    // Add the headinsg for the axes 
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", WIDTH / 2)
        .attr("y", HEIGHT + margin.bottom)
        .style("text-anchor", "middle")
        .text("Sugar (g)")

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)") //To ensure that the readibilty was good, I had to tilt the text because it was overlapping with the axes
        .attr("y", -margin.left)
        .attr("x", -HEIGHT / 2)
        .style("text-anchor", "middle")
        .text("Carbohydrates (g)");


function filterData(filter) {
    // This select all circles and sets their visibility based on the filter button clicked 
    d3.selectAll(".bubble").each(function(d) {
        const sugar = d.sugar;
        const carbohydrates = d.carbohydrates;

        // Determines visibility based on the filter
        let isVisible = false;
        switch (filter) {
            case 'all':
                isVisible = true; 
                break;
            case 'low-sugar':
                isVisible = sugar >= 0 && sugar <= 10; 
                break;
            case 'high-sugar':
                isVisible = sugar > 10 && sugar <= 20; 
                break;
            case 'low-carb':
                isVisible = carbohydrates >= 0 && carbohydrates <= 10;
                break;
            case 'high-carb':
                isVisible = carbohydrates > 10 && carbohydrates <= 20;
                break;
        }
        // Updates the visibility of the circles
        d3.select(this).style("display", isVisible ? "block" : "none");
    });
}

document.getElementById("all").addEventListener("click", () => filterData('all'));
document.getElementById("low-sugar").addEventListener("click", () => filterData('low-sugar'));
document.getElementById("high-sugar").addEventListener("click", () => filterData('high-sugar'));
document.getElementById("low-carb").addEventListener("click", () => filterData('low-carb'));
document.getElementById("high-carb").addEventListener("click", () => filterData('high-carb'));

const carbsRange = ["0 - 5g", "5g - 10g", "10g - 15g", "15g - 20g"];
 
function createLegend() {
    const legendWidth = 20; 
    const legendHeight = 20; 
    const legendSpacing = 10; 
    const legendX = WIDTH - 200;  
    const legendY = 150;  

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    svg.append("text")
      .attr("x", legendX) 
      .attr("y", legendY - 20) 
      .attr("font-size", "16px") 
      .attr("font-weight", "bold") 
      .text("Carbohydrates");
  
    // Colour for each carb range
    legend.selectAll("rect")
      .data(colorScale.range())  // Refering to the colour range we created. 
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * (legendHeight + legendSpacing))  //Puts the colours in a rectangle
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", d => d);  
  
    // Labels for each carb range
    legend.selectAll("text")
      .data(carbsRange)  // Bind the carbs range labels
      .enter()
      .append("text")
      .attr("x", legendWidth + 10)  // I struggled to put the text next to the respective colour box, I asked AI because I was struggling, it explained to me that since the width is 20, I needed to add additional pixels to ensure that its not positioned at the edge of the box. So I added 10 to give better readability.
      .attr("y", (d, i) => i * (legendHeight + legendSpacing) + legendHeight / 1.5)  // Aligns the text vertically
      .text(d => d)  
      .attr("font-size", "14px")
      .attr("fill", "#000");  
  }
  
  createLegend();
}
