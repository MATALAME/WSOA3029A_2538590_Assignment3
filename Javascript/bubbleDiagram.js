// fetch('https://cors-anywhere.herokuapp.com/https://www.fruityvice.com/api/fruit/all')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok: ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data); 
//         const fruitList = document.getElementById('fruit-list');
//         data.forEach(fruit => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${fruit.name} (${fruit.family}) - Calories: ${fruit.nutritions.calories}, Carbs: ${fruit.nutritions.carbohydrates}g, Protein: ${fruit.nutritions.protein}g, Fat: ${fruit.nutritions.fat}g, Sugar: ${fruit.nutritions.sugar}g`;
//             fruitList.appendChild(listItem);
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching fruits:', error);
//     });


//1.Grab Data 
/*I kept getting a CORS error whenever i wanted to fetch from the internet, I used AI to help me and it gave me a proxy that helps get through the CORS error, the issue is that it temporarily works. 
Even when it temporarily worked it gave me errors such as "too many requests" so I'm currently using a csv till I find a more effective solution for the CORS error*/

d3.csv("all.csv").then((data) => {
  createBubbles(data);
});

// Global variables, I did this so the data can be accessible to all the functions and the bubbles too
let data;
let Bubbles;

//2. SET UP/ CREATE SVG
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
    // Define data as a global variable
    data = data;
  
    //3.Create Scales
    rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.nutritions__protein)])
    .range([10, 60]);  // Adjust the size range

  
    colorScale = d3.scaleOrdinal().range(d3.schemeSet3);
  
    //4. Create Bubbles
    Bubbles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", d => rScale(d.nutritions__protein))
      .style("fill", d => colorScale(d.family));
  
    //5. Create Tooltip 
    const tooltip = d3.select("#tooltip");
  
    Bubbles
      .on("mouseenter", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .text(`${d.name}: ${d.nutritions__protein}g protein`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", (event.pageY + 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
      });
  
    //6. Set up the force simulation
    const forceX = d3.forceX(WIDTH / 2).strength(0.05);
    const forceY = d3.forceY(HEIGHT / 2).strength(0.05);
    const collideForce = d3.forceCollide((d) => rScale(d.nutritions__protein) + 2);
    const manyBody = d3.forceManyBody().strength(-30);
    const forceXSplit = d3.forceX(d => {
        if (d.nutritions__protein < 0.5) {
          return WIDTH / 4;  // Position for less than 0.5
        } else if (d.nutritions__protein >= 0.5 && d.nutritions__protein < 2) {
          return WIDTH / 2;  // Position for between 0.5 and 2
        } else {
          return (3 * WIDTH) / 4;  // Position for greater than or equal to 2
        }
      }).strength(0.05);
      
  
    const simulation = d3
      .forceSimulation()
      .force("x", forceX)
      .force("y", forceY)
      .force("forceCollide", collideForce)
      .force("manyBody", manyBody);
  
    simulation.nodes(data);

    simulation.on("tick", function () {
      Bubbles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });
  
    //7. Button clicks
    d3.select("#split").on("click", function () {
      simulation.force("x", forceXSplit).alphaTarget(0.6);
    });
  
    d3.select("#combine").on("click", function () {
      simulation.force("x", forceX).alpha(0.9);
    });
  }
  