const sponsors = [
    { 
        name: "Fitness Vally",
        imgSrc: "./Images/FitnessVally.png",
        altText: "Fitness Vally Logo"
    },

    {
        name: "Jubes Kitchen",
        imgSrc: "./Images/JubesKitchen.png",
        altText: "Jubes Kitchen"
    },

    {
        name: "Well Health",
        imgSrc: "./Images/WellHealth.png",
        altText: "Well Health"
    },

    {
        name: "Yummy Foods",
        imgSrc: "./Images/YummyFoods.png",
        altText: "Yummy Foods Logo"
    },

    {
        name: "Lex Ralo Corp",
        imgSrc: "./Images/LexRalo.png",
        altText: "Lex Ralo Logo"
    }
]

const sponsorList = document.getElementById("sponsor-list");
sponsors.forEach(sponsor => {
    const item = document.createElement("div");
    item.className = "sponsor-item";
    item.innerHTML = `
        <div class="content">
            <img src="${sponsor.imgSrc}" alt="${sponsor.altText}">
            <p>${sponsor.name}</p>
        </div>
    `;
    sponsorList.appendChild(item);
});