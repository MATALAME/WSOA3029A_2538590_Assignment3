const plans = [
    {
        name: "Citrus Plan (Basic Plan)",
        img: "../Images/citrusCheckout.jpg", 
        price: "R120/pm",
        description: "The plan includes fresh, citrus-focused meal plans delivered weekly, simple and healthy citrus recipes to enhance your diet, advice on optimizing health with citrus fruits, monthly tracking of your health improvements, and a one-on-one session each month with a nutrition mentor."
    },
    {
        name: "Tropical Plan (Premium Plan)",
        img: "../Images/tropicalCheckout.jpg", 
        price: "R180/pm",
        description: "The plan includes customized meal plans featuring tropical fruits, easy weekly shopping lists for tropical ingredients, two sessions each month for personalized guidance, exercise tips to complement your tropical diet, and access to webinars and live sessions."
    },
    {
        name: "Berry Plan (Elite Plan)",
        img: "../Images/berryCheckout.jpg", 
        price: "R220/pm",
        description: "The plan includes tailored meal plans centered around various berries, daily tips and reminders to help you stay on track, weekly coaching for motivation, round-the-clock access to a mentor, and special offers on berry-related items."
    }
];

const planMap = {
    "citrus-Select": "Citrus Plan (Basic Plan)",
    "tropical-Select": "Tropical Plan (Premium Plan)",
    "berry-Select": "Berry Plan (Elite Plan)"
};

function updateItemContainer(selectedPlan) {
    const planName = planMap[selectedPlan]; 
    const plan = plans.find(plan => plan.name === planName); 

    if (plan) { 
        //This fills the html with the array caused by selected option on the dropdown menu 
        document.getElementById("plan-image").src = plan.img;
        document.getElementById("plan-name").textContent = plan.name;
        document.getElementById("plan-price").textContent = `Price: ${plan.price}`;
        document.getElementById("plan-decription").textContent = plan.description;
    } else {
        // This will clear the display if no plan is selected, it will keep the html elements empty
        document.getElementById("plan-image").src = "";
        document.getElementById("plan-name").textContent = "";
        document.getElementById("plan-price").textContent = "";
        document.getElementById("plan-decription").textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Dropdown").addEventListener("change", function() {
        const selectedOption = this.value; 
        updateItemContainer(selectedOption); 
    });

    updateItemContainer("none-Select"); 
});


//I ran out of time to create a Local Storage for the text fields, but I was intenting on storying that information in a local storage whenever uses fill in their details.
//I excluded the card fields, because I felt as though since its not an official website, I cannot protect and secure the card details of users. 
//I also wanted to add error messages for when there is an incomplete field. 