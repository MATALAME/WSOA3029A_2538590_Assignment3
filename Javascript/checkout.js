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

document.getElementById("purchase").addEventListener("click", function (event) {
    event.preventDefault(); /*is used to stop the browser from automatically submitting the form when the "subscribe" button is clicked. This allows the script to 
    check each input field first, to ensure that all the fields are completed before running.*/

    let isCompleted = true; //Starts as true, then if the conditions below are 'false', it won't proceed to the next page.
    
    // Name Field
    const name = document.getElementById("name").value;
    if (!name) { //checks if the name field is empty
        document.getElementById("name-error").innerText = "Name can't be empty"; //displays error message if the field is incomplete
        isCompleted = false;  // This flags the form as incomplete if the field is empty
    } else if (!/^[a-zA-Z]+$/.test(name)) { // Check if the name contains only letters, from lowercase 'a-z' and uppercase 'A-Z'
        document.getElementById("name-error").innerText = "Name can't contain numbers"; // displays error message if numbers are inserted
        isCompleted = false;  // Flag the form as incomplete
    } else {
        document.getElementById("name-error").innerText = ""; 
    }
    
    // Surname Field
    const surname = document.getElementById("surname-name").value;
    if (!surname) { //(Checks if empty)
        document.getElementById("surname-error").innerText = "Surname can't be empty";
        isCompleted = false; //(Flags as incomplete)
    } else if (!/^[a-zA-Z]+$/.test(surname)) { // Check if the name contains only letters, from lowercase 'a-z' and uppercase 'A-Z'
        document.getElementById("surname-error").innerText = "Name can't contain numbers"; // displays error message if numbers are inserted
        isCompleted = false;  // Flag the form as incomplete
    }else {
        document.getElementById("surname-error").innerText = "";
    }
    
    // Email Field
    const email = document.getElementById("email").value;
    const emailProvider = /@gmail\.com$|@outlook\.com$|@icloud\.com$|@yahoo\.com/; /*I wanted the code to check if valid email service providers were inserted before considering it has "complete", 
    by checking the four most popular email service providers namely: gmail, outlook, icloud and yahoo*/
    if (!emailProvider.test(email)) { /*I really struggled with this part because I didn't know how the code will account for what is typed as well as the provider name. So I asked AI and it showed me the 'test' method. 
        The .test() method checks if the email string matches the provider specified in the 'emailProvider'. It returns false it doesn't match and true if it does.*/
        document.getElementById("email-error").innerText = "Invalid email";
        isCompleted = false; //(flags it as incomplete)
    } else {
        document.getElementById("email-error").innerText = "";
    }
    
    // Phone number Field
    const phone = document.getElementById("phone").value;
    const phoneLimit = /^[0-9]{10}$/; /*[0-9] checks for any single digit from 0 to 9 and {10} specifies the numbers [0-9] must appear exactly 10 times ensuring that no numbers more/ below 10 are accepted. */
    if (!phoneLimit.test(phone)) { //Checks whether exactly 10 numbers between [0-9] were inserted.
        document.getElementById("phone-error").innerText = "Phone number must be exactly 10 digits";
        isCompleted = false;
    } else {
        document.getElementById("phone-error").innerText = "";
    }
    
    // Password Field
    const password = document.getElementById("password").value;
    const minCharacter = /.{8,}/; //Only allows a minimum of 8 characters in the password
    const numberCharacter = /\d/; //(Checks numbers between [0-9])
    const specialCharacter= /[!@#$%^&*(),.?":{}|<>]/; //Declaring all the special characters that users can include 
    
    if (!minCharacter.test(password)) {
        document.getElementById("password-error").innerText = "Password must be at least 8 characters long";  
        isCompleted = false;
    } else if (!numberCharacter.test(password)) {
        document.getElementById("password-error").innerText = "Password must contain at least one number";
        isCompleted = false;
    } else if (!specialCharacter.test(password)) {
        document.getElementById("password-error").innerText = "Password must contain at least one special character";
        isCompleted = false;
    } else {
        document.getElementById("password-error").innerText = "";
    }
    
    // If all conditions are correct, it allows the form to submit
    if (isCompleted) {
        // alert("Subscription successful!");
        window.location.href = "./purchase.html";  // Allows redirect to purchase page
    }

    const message = document.getElementById("message");
    const characterCount = document.getElementById("character-count");

    function updateCharacterCount() {
        const currentLength = message.value.length; // Get the current length of the input
        const remainingChars = 50 - currentLength; // Calculate remaining characters

        characterCount.innerText = `${remainingChars} characters remaining`;

        // This prevents users from being able type if the character limit is reached
    if (currentLength >= 50) {
        message.value = message.value.substring(0, 50); 
    }
}

    // Event listener for input changes on the message field
    message.addEventListener("input", updateCharacterCount);

    updateCharacterCount();

});
