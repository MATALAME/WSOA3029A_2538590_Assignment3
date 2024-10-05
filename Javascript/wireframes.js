const wireframes = [
    {
        title: "Wireframe 1",
        description: "This is the home page where I have an introduction that presents the purpose and theme of the website. I included a call to action button to help the user navigate to another page. Within this page, I am also going to include a quote from the CEO of the company, as well as the goals and objectives of this business. Lastly I will include a section for the sponsors/ partners of the business.",
        imgSrc: "../Images/Wireframe1.png",
        altText: "Wireframe 1",
        imgSrc2: "../Images/Phone1.png",
        altText2: "Wireframe 1"
    },
    {
        title: "Wireframe 2",
        description: "This is the “unlock” page which gives information about fruits and their benefits. It provides information about the medical and physical advantages of including them in your diet. I did not want to make it too long as it may be too overwhelming for users. Towards the end of the page there will be a section that introduces the diet plans offered by the business.  ",
        imgSrc: "../Images/Wireframe2.png",
        altText: "Wireframe 2",
        imgSrc2: "../Images/Phone2.png",
        altText2: "Wireframe 2"
    },
    {
        title: "Wireframe 3",
        description: "This is the pricing page where the fruit plan subscriptions are going to be shown with “BUY” buttons that will direct the users to the respective plan. The page includes images of the plan, the titles of the plans, what the plans includes and the prices of each of the plans. ",
        imgSrc: "../Images/Wireframe3.png",
        altText: "Wireframe 3",
        imgSrc2: "../Images/Phone3.png",
        altText2: "Wireframe 3"
    },
    {
        title: "Wireframe 4",
        description: "This is the redirected page for the chosen fruit plan, showcasing further detailed information about the plan, the mentor that will be assisting the consumer, and an image of the mentor in question. The page also has a 'subscribe' button which will direct the user to the checkout page. Further more I am going to include the pricing so the consumer is aware of the price they will be paying.",
        imgSrc: "../Images/Wireframe4.png",
        altText: "Wireframe 4",
        imgSrc2: "../Images/Phone4.png",
        altText2: "Wireframe 3"
    },
    {
        title: "Wireframe 5",
        description: "This is the design page which shows the process and design choices made to make this website, these will include colour, font, and image choices. This page will also include the User Flow, Information Structure, and other essential design info. I'm also planning on including the essay here as a pdf link, the reason is because I don't want to have too much information on one page as it will be too clustered.",
        imgSrc: "../Images/Wireframe5.png",
        altText: "Wireframe 5",
        imgSrc2: "../Images/Phone5.png",
        altText2: "Wireframe 3"
    },
    {
        title: "Wireframe 6",
        description: "This is the explore page which showcases the data visualizations. The user will be able to interact with two data visualizations, namely: the bubble diagram and the scatterplot. ",
        imgSrc: "../Images/Wireframe6.png",
        altText: "Wireframe 6",
        imgSrc2: "../Images/Phone6.png",
        altText2: "Wireframe 3"
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
            <img class="phone-img" src="${wireframe.imgSrc2}" alt="${wireframe.altText2}">
        </div>
        <p>${wireframe.description}</p>
    `;
    wireframeList.appendChild(item);
});
