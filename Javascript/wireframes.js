const wireframes = [
    {
        title: "Wireframe 1",
        description: "This is the home page where I have an introduction that presents the purpose and theme of the website. I included a call to action button to help the user navigate to another page. Within this page, I am also going to include a quote from the CEO of the company and as well as the goals and objectives of this business and lastly I will include a section for the sponsors/ partners of the business.",
        imgSrc: "../Images/Wireframe1.png",
        altText: "Wireframe 1"
    },
    {
        title: "Wireframe 2",
        description: "This is the “unlock” page which gives information about fruits and their benefits. It provides information about the benefits of fruits. I did not want to make it too long as it may be too overwhelming for users. Towards the end of the page there will be a section that introduces the diet plans offered by the business.  ",
        imgSrc: "../Images/Wireframe2.png",
        altText: "Wireframe 2"
    },
    {
        title: "Wireframe 3",
        description: "This is the pricing page where the fruit plans subscriptions are going to be shown with “BUY” buttons that will direct the users to the respective plan. The page includes images of the plan, the titles of the plans, what the plans includes and the prices of each of the plans. ",
        imgSrc: "../Images/Wireframe3.png",
        altText: "Wireframe 3"
    },
    {
        title: "Wireframe 4",
        description: "This is the redirected page for the chosen fruit plan, showcasing more specific information about the plan, which mentor will be assisting the consumer, and an image of the mentor in question. The page also has a 'subscribe' button which will direct the user to the checkout page. I'm also going to include the pricing so the consumer is aware of the price they will be paying.",
        imgSrc: "../Images/Wireframe4.png",
        altText: "Wireframe 4"
    },
    {
        title: "Wireframe 5",
        description: "This is the design page which shows the process and design choices made to make this website, these will include colour choices, font choices, and image choices. This page will also include the User Flow, Information Structure, and other essential design info. I'm also planning on including the essay here as a pdf link, the reason is because I don't want to have too much information on one page as it will be too clustered.",
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
