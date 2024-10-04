//1.Grab Data 
/*I kept getting a CORS error whenever i wanted to fetch from the internet, I used AI to help me and it gave me a proxy that helps get through the CORS error, the issue is that it temporarily works. 

fetch('https://cors-anywhere.herokuapp.com/https://www.fruityvice.com/api/fruit/all')
    .then(response => response.json()) 
    .then(data => {
        createBubbles(data);
    })

Even when it temporarily worked it gave me errors such as "too many requests" so I'm currently using a csv till I find a more effective solution for the CORS error*/

// d3.csv("all.csv").then((data) => {
//   createBubbles(data);
// });

//I kept getting a CORS error, but I managed to get the "Allow CORS: Access-Control-Allow-origin" extension on Chrome which removed the CORS error.
//https://mybrowseraddon.com/access-control-allow-origin.html?v=0.1.9&type=install 
 
fetch('https://www.fruityvice.com/api/fruit/all')
    .then(response => response.json()) 
    .then(data => {
        createBubbles(data);  
    });

// Global variables, I did this so the data can be accessible to all the functions and the bubbles too
//let data;
//let Bubbles;

//2. SET UP/ CREATE SVG
let Bubbles;
let HEIGHT = window.innerHeight,
    WIDTH = window.innerWidth;

    let svg = d3
    .select("#force")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH)
    // .style("background-color", "#f3f3f3")  // The SVG looked flat on the page and I decided to make the background a bit grey to make it stand out. 
    .style("border-radius", "20px"); 

// Create Scales
let rScale;

const colorScale = d3.scaleThreshold() /*Determines the colours by how many calories they have. 0-25 = Lighter green, 25 - 50 = light green, 50 -75 = dark green, 75-100 = darker green, More than 100 = darkest green. */
    .domain([25, 50, 75, 100])
    .range(["#648500", "#68BB59", "#4CBB17", "#1E5631", "#062905"]);

const calorieRanges = ["0-25", "25-50", "50-75", "75-100", "More than 100"]; //These are the ranges for the Legend and the colours that correspond with the calories.

function createBubbles(data) {
  // 3. Create Scales
  const rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.nutritions.calories)])
      .range([10, 60]);

  // 4. Create Bubbles
  Bubbles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", d => rScale(d.nutritions.calories))
      .attr("cy", d => HEIGHT / 2 - 30)
      .style("fill", d => colorScale(d.nutritions.calories))  // Apply the color scale
      .style("visibility", "visible");


  // 5. Create Tooltip
  const tooltip = d3.select("#tooltip");

  Bubbles
      .on("mouseenter", function (event, d) {
          tooltip
              .style("visibility", "visible")
              .text(`${d.name}: ${d.nutritions.calories}g calories, ${d.nutritions.protein}g protein`);
      })
      .on("mousemove", function (event) {
          tooltip
              .style("top", (event.pageY + 10) + "px")
              .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseleave", function () {
          tooltip.style("visibility", "hidden");
      });

  // 6. Set up the force simulation
  const forceX = d3.forceX(WIDTH / 2).strength(0.05);
  const forceY = d3.forceY(HEIGHT / 2).strength(0.05);
  const collideForce = d3.forceCollide(d => rScale(d.nutritions.calories) + 2);
  const manyBody = d3.forceManyBody().strength(-30);

  const forceXSplit = d3.forceX(d => {
      if (d.nutritions.calories < 50) {
          return WIDTH / 4;  // Position for less than 50 calories
      } else if (d.nutritions.calories >= 50 && d.nutritions.calories <= 628) {
          return WIDTH / 2;  // Position for between 50 and 628 calories
      }
  }).strength(0.05);

  const simulation = d3
      .forceSimulation(data)
      .force("x", forceX)
      .force("y", forceY)
      .force("forceCollide", collideForce)
      .force("manyBody", manyBody);

  simulation.on("tick", function () {
      Bubbles.attr("cx", d => d.x).attr("cy", d => d.y);
  });

  // 7. Add headings for Weight Loss and Weight Gain
  const weightLossHeading = svg.append("text")
      .attr("class", "weight-loss-heading")
      .text("WEIGHT LOSS")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("x", WIDTH / 4)
      .attr("y", 30) 
      .attr("text-anchor", "middle")
      .style("visibility", "hidden"); // Starts off as hidden, and only be visible on click.

  const weightGainHeading = svg.append("text")
      .attr("class", "weight-gain-heading")
      .text("WEIGHT GAIN")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("x", WIDTH / 2) 
      .attr("y", 30) 
      .attr("text-anchor", "middle")
      .style("visibility", "hidden"); // Also starts off as hidden, and only be visible on click.

  // 8. Button clicks
  d3.select("#split").on("click", function () {
      simulation.force("x", forceXSplit).alphaTarget(0.6).restart();
      // Show the headings when "All" is clicked
      weightLossHeading.style("visibility", "visible");
      weightGainHeading.style("visibility", "visible");
  });

  d3.select("#combine").on("click", function () {
      simulation.force("x", forceX).alphaTarget(0.9).restart();
      // Hide the headings when "Weight Management" button is pressed. 
      weightLossHeading.style("visibility", "hidden");
      weightGainHeading.style("visibility", "hidden");
  });

  d3.select("#familyDropdown").on("change", function() {
    const selectedFamily = d3.select(this).property("value");

    Bubbles.style("visibility", d => {
        // Shows all bubbles when the "All" option is selected by the user
        if (selectedFamily === "All") {
            return "visible";
        } 
        return d.family === selectedFamily ? "visible" : "hidden";
    });
});

function createLegend() {
    const legendWidth = 20;  // Width of the legend color boxes
    const legendHeight = 20; // Height of the legend color boxes
    const legendSpacing = 10; // Space in between the legend boxes
    const legendX = WIDTH - 300;  //The legend kept going off-screen so I kept adjusting the amount to ensure its a suitable range
    const legendY = 150;  

    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    svg.append("text")
      .attr("x", legendX) 
      .attr("y", legendY - 20) 
      .attr("font-size", "16px") 
      .attr("font-weight", "bold") 
      .text("Calories");
  
    // Colour for eachh calorie range
    legend.selectAll("rect")
      .data(colorScale.range())  // Refering to the colour range we created. 
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * (legendHeight + legendSpacing))  //Puts the colours in a rectangle
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", d => d);  
  
    // Labels for each calorie range
    legend.selectAll("text")
      .data(calorieRanges)  // Bind the calorie range labels
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





