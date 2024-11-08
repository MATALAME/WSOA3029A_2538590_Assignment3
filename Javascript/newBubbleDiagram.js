async function fetchData() {
    const response = await fetch("https://covid-19.dataflowkit.com/v1");
    const data = await response.json();
    const filteredData = data.slice(24, 50);
    createBubbles(filteredData);
}

const MARGIN = { top: 40, right: 100, bottom: 40, left: 40 };
let WIDTH = window.innerWidth * 0.8 - MARGIN.left - MARGIN.right;
let HEIGHT = window.innerHeight * 0.8 - MARGIN.top - MARGIN.bottom;

const svg = d3.select("#force")
    .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
    .append("g")
    .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
    .style("border-radius", "20px");

const colorScale = d3.scaleThreshold()
    .domain([2000000, 4000000, 6000000])
    .range(["#FB6D4C", "#C23B22", "#580000"]);

let Bubbles;
const tooltip = d3.select("#tooltip");

function createBubbles(data) {
    const rScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => parseFloat(d['Total Cases_text'].replace(/,/g, '')) || 0)]) 
        .range([10, 40]);

    Bubbles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", d => rScale(parseFloat(d['Total Cases_text'].replace(/,/g, '')) || 0))
        .attr("cy", HEIGHT / 2 - 30)
        .style("fill", d => colorScale(parseFloat(d['Total Cases_text'].replace(/,/g, '')) || 0))
        .on("mouseenter", (event, d) => {
            tooltip.style("visibility", "visible")
                .text(`Country: ${d.Country_text}, Cases: ${d['Total Cases_text']}, Deaths: ${d['Total Deaths_text']}, Recovered: ${d['Total Recovered_text']}`);
        })
        .on("mousemove", event => {
            tooltip.style("top", (event.pageY + 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseleave", () => tooltip.style("visibility", "hidden"));

    const forceX = d3.forceX(WIDTH / 2).strength(0.05);
    const forceY = d3.forceY(HEIGHT / 2).strength(0.05);
    const collideForce = d3.forceCollide(d => rScale(parseFloat(d['Total Cases_text'].replace(/,/g, '')) || 0) + 2);

    const forceXSplit = d3.forceX(d => {
        const cases = parseFloat(d['Total Cases_text'].replace(/,/g, '')) || 0;
        const deaths = parseFloat(d['Total Deaths_text'].replace(/,/g, '')) || 0;
        const recovered = parseFloat(d['Total Recovered_text'].replace(/,/g, '')) || 0;
        if (recovered >= 4500000) return WIDTH / 4;
        if (deaths >= 20000) return (3 * WIDTH) / 4;
        return WIDTH / 2;
    }).strength(0.05);

    const simulation = d3.forceSimulation(data)
        .force("x", forceX)
        .force("y", forceY)
        .force("collide", collideForce)
        .on("tick", () => {
            Bubbles.attr("cx", d => d.x).attr("cy", d => d.y);
        });

    d3.select("#split").on("click", () => {
        simulation.force("x", forceXSplit).alpha(0.6).restart();
    });

    d3.select("#combine").on("click", () => {
        simulation.force("x", forceX).alpha(0.9).restart();
    });

    const mostRecoveredTitle = svg.append("text")
        .attr("class", "most-recovered-title")
        .text("Most Recovered")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .attr("x", WIDTH / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("visibility", "hidden");

    const mostDeathsTitle = svg.append("text")
        .attr("class", "most-deaths-title")
        .text("Most Deaths")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .attr("x", (WIDTH * 3) / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("visibility", "hidden");

    d3.select("#split").on("click", function () {
        simulation.force("x", forceXSplit).alphaTarget(0.6).restart();
        mostRecoveredTitle.style("visibility", "visible");
        mostDeathsTitle.style("visibility", "visible");
    });

    d3.select("#combine").on("click", function () {
        simulation.force("x", forceX).alphaTarget(0.9).restart();
        mostRecoveredTitle.style("visibility", "hidden");
        mostDeathsTitle.style("visibility", "hidden");
    });

    createLegend();
}

function createLegend() {
    const legendData = ["0 - 2000000", "2000000 - 4000000", "4000000 - 6000000"];
    const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${WIDTH - 150}, 100)`);

    legend.selectAll("rect")
        .data(colorScale.range())
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", (d, i) => i * 25)
        .style("fill", d => d);

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) => i * 25 + 15)
        .text(d => d);
}

window.addEventListener("resize", () => {
    WIDTH = window.innerWidth * 0.8 - MARGIN.left - MARGIN.right;
    HEIGHT = window.innerHeight * 0.8 - MARGIN.top - MARGIN.bottom;
    svg.attr("width", WIDTH + MARGIN.left + MARGIN.right).attr("height", HEIGHT + MARGIN.top + MARGIN.bottom);
    createBubbles(data);
});

fetchData();
