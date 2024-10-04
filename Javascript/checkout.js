const plans = [
    {
        name: "Citrus Plan (Basic Plan)",
        img: "../Images/citrusCheckout.jpg", 
        price: "R120/pm"
    },
    {
        name: "Tropical Plan (Premium Plan)",
        img: "../Images/tropicalCheckout.jpg", 
        price: "R180/pm"
    },
    {
        name: "Berry Plan (Elite Plan)",
        img: "../Images/berryCheckout.jpg", 
        price: "R220/pm"
    }
];

// This links the dropdown options with these values in the array
const planMap = {
    "citrus-Select": "Citrus Plan (Basic Plan)",
    "tropical-Select": "Tropical Plan (Premium Plan)",
    "berry-Select": "Berry Plan (Elite Plan)"
};


function updateItemContainer(selectedPlan) {
    const planName = planMap[selectedPlan]; 

    const plan = plans.find(plan => plan.name === planName); 

    if (plan) { 
        document.getElementById("plan-image").src = plan.img;
        document.getElementById("plan-name").textContent = plan.name;
        document.getElementById("plan-price").textContent = `Price: ${plan.price}`;
    }
}

document.getElementById("Dropdown").addEventListener("change", function() {
    const selectedOption = this.value; 
    updateItemContainer(selectedOption); 
});

updateItemContainer("berry-Select"); 
