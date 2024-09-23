const wireframes = [
    {
        title: "Wireframe 1",
        description: "This is the home page where I have an introduction that presents the purpose and theme of the website. I have a call to action button for the “unlock” page.",
        imgSrc: "../Images/Wireframe1.png",
        altText: "Wireframe 1"
    },
    {
        title: "Wireframe 2",
        description: "This is the “unlock” page which gives information about fruits and their benefits.",
        imgSrc: "../Images/Wireframe2.png",
        altText: "Wireframe 2"
    },
    {
        title: "Wireframe 3",
        description: "This is the pricing page where the fruit plans subscriptions are going to be shown with “BUY” buttons.",
        imgSrc: "../Images/Wireframe3.png",
        altText: "Wireframe 3"
    },
    {
        title: "Wireframe 4",
        description: "This is one of the cards for the different fruit plans, showcasing the mentors and what the subscriptions include.",
        imgSrc: "../Images/Wireframe4.png",
        altText: "Wireframe 4"
    },
    {
        title: "Wireframe 5",
        description: "This is the DESIGN page which shows the process and design choices made to make this website, including colour choices, font choices, and image choices.",
        imgSrc: "../Images/Wireframe5.png",
        altText: "Wireframe 5"
    }
];

const wireframeList = document.getElementById("wireframe-list");
wireframes.forEach(wireframe => {
    const item = document.createElement("div");
    item.className = "wireframe-item";
    item.innerHTML = `
        <h3>${wireframe.title}</h3>
        <div class="content">
            <img src="${wireframe.imgSrc}" alt="${wireframe.altText}">
            <p>${wireframe.description}</p>
        </div>
    `;
    wireframeList.appendChild(item);
});
