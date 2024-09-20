const dietPlan = [
    {
        id: 1,
        name: "Citrus Fruit Diet Plan (Basic Plan)",
        description: "Includes weekly citrus-based meal plans, recipes, nutritional tips, a monthly progress check-in, and one online mentor consultation.",
        price: "R120" + "/pm",
        image: "../Images/Citrus.jpg",
    },
    {
        id: 2,
        name: "Tropical Fruit Diet Plan (Premium Plan)",
        description: "Offers personalized tropical fruit meal plans, shopping lists, two mentor consultations, fitness tips, and access to exclusive online events.",
        price: "R180" + "/pm",
        image: "../Images/Tropical.jpg",
    },
    {
        id: 3,
        name: "Berry Fruit Diet Plan (Elite Plan)",
        description: "Features custom berry-based meal plans, daily updates, weekly coaching sessions, unlimited mentor support, and exclusive discounts on berry products.",
        price: "R220" + "/pm",
        image: "../Images/Berries.jpg",
    },

];

const container = document.getElementById('diet-cards');

dietPlan.map(plan => {
    const card = document.createElement('article');
    card.classList.add('card');

    card.innerHTML = `
        <img src="${plan.image}" alt="${plan.name}" />
        <div class="card-content">
            <h3>${plan.name}</h3>
            <p>${plan.description}</p>
            <p class="price">${plan.price}</p>
            <button class="btn">See More</button>
        </div>
    `;

    container.appendChild(card);
});
