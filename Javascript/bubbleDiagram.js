//I kept getting a CORS error, but I managed to get the "Allow CORS: Access-Control-Allow-origin" extension on Chrome which removed the CORS error.
//https://mybrowseraddon.com/access-control-allow-origin.html?v=0.1.9&type=install 
 
fetch('https://www.fruityvice.com/api/fruit/all')
    .then(response => response.json()) 
    .then(data => {
        createBubbles(data);  
    });

//1.Grab Data 
/*I kept getting a CORS error whenever i wanted to fetch from the internet, I used AI to help me and it gave me a proxy that helps get through the CORS error, the issue is that it temporarily works. 
Even when it temporarily worked it gave me errors such as "too many requests" so I'm currently using a csv till I find a more effective solution for the CORS error*/

// d3.csv("all.csv").then((data) => {
//   createBubbles(data);
// });

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
    .attr("width", WIDTH);

// Create Scales
let rScale;
let colorScale;

function createBubbles(data) {
  // 3. Create Scales
  const rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.nutritions.calories)])
      .range([10, 60]);

  const familyColors = {
      "Ebenaceae": "#FF5733",
      "Rosaceae": "#C70039",
      "Musaceae": "#FFB347",
      "Solanaceae": "#FF6347",
      "Malvaceae": "#FFD700",
      "Ericaceae": "#32CD32",
      "Actinidiaceae": "#FFA07A",
      "Sapindaceae": "#98FB98",
      "Bromeliaceae": "#FF4500",
      "Moraceae": "#ADFF2F",
      "Grossulariaceae": "#FFDAB9",
      "Passifloraceae": "#7FFF00",
      "Rutaceae": "#FFAE42",
      "Myrtaceae": "#FF6347",
      "Anacardiaceae": "#008000",
      "Cactaceae": "#F4A460",
      "Lythraceae": "#E9967A",
      "Vitaceae": "#9ACD32",
      "Lauraceae": "#FFA500",
      "Betulaceae": "#DC143C",
      "Clusiaceae": "#FFDEAD"
  };

  // 4. Create Bubbles
  Bubbles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", d => rScale(d.nutritions.calories))
      .attr("cy", d => HEIGHT / 2 -30)
      .style("fill", d => familyColors[d.family])
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
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("x", WIDTH / 4)
      .attr("y", 30) 
      .attr("text-anchor", "middle")
      .style("visibility", "hidden"); // Starts off as hidden, and only be visible on click.

  const weightGainHeading = svg.append("text")
      .attr("class", "weight-gain-heading")
      .text("WEIGHT GAIN")
      .attr("font-size", "16px")
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
}
