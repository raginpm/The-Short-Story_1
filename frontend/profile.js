const nationality = document.querySelector("#profileNationality");
const hometown = document.querySelector("#profileHometown");   
const gender = document.querySelector("#profileGender");
const username = document.querySelector("#profileUsername");
const publicStoryContainer = document.querySelector("#profileStoriesContainer");

const parameters =
    new URLSearchParams(window.location.search);

const userId =
    parameters.get("userId");


let currentPage = 0;
const pageSize = 20;
let loading = false;
let noMoreStories = false;

loadProfile();
loadUserStories();

function loadProfile() {
    fetch("http://localhost:8080/users/" + userId+"/profile"

    ).then(function(response) {
        if(response.status ===404){
            alert("User not found");
            return
        }
        if(!response.ok){
            throw new Error("Failed to fetch profile");
        }
        return response.json();
    }).then(function(profile) {
        if(profile===undefined){
            alert("User not found");
            return;
        }
        nationality.textContent = profile.nationality || "Not Provided";
        hometown.textContent = profile.hometown || "Not Provided";
        gender.textContent = profile.gender || "Not Provided";

    }).catch(function(error) {
        console.error("Error fetching public stories:", error);
        alert("An error occurred while loading the profile.");
    });
}

function loadUserStories() {
    if(noMoreStories || loading) {
        return;
    }
    loading = true;
    fetch( "http://localhost:8080/stories/public/user/"
        + userId
        + "?page="
        + currentPage
        + "&size="
        + pageSize, {

        method: "GET",
    }).then(function(response) {
        if(response.status === 404){
            alert("User not found");
            return;
        }
        if (!response.ok) {
            throw new Error("Failed to load user stories");
        }
        return response.json();
    }).then(function(stories){
        if(stories == null){
            alert("No stories found for this user.");
            return;
        }
        if(stories.length === 0){
            const noStories = document.createElement("p");
            noStories.textContent = "No stories found for this user.";
            userStoriesContainer.appendChild(noStories);
            noMoreStories = true;
            return;
        }
        showPublicStories(stories); 
        currentPage++;
        if(stories.length < pageSize){
            noMoreStories = true;
        }

    }).catch(function(error) {
        console.error(error);
        alert("An error occurred while loading user stories.");
    }).finally(function() {
        loading = false;
    });
}

function showPublicStories(stories) {
    publicStoryContainer.innerHTML = "";
    for(let i=0; i<stories.length; i++){
        const story = stories[i];
        
        const storyCard = document.createElement("div");
        const writerName = document.createElement("div");

        writerName.classList.add("story-card-writer");
        writerName.textContent = "By: " + story.username;
    
        storyCard.classList.add("story-card");
        const storyTitle = document.createElement("h2");
        storyTitle.classList.add("story-card-title");
        storyTitle.textContent = story.title;

        const preview = document.createElement("p");
        preview.classList.add("story-card-preview");
         const previewText =story.content.substring(0, 100) + "...";
        preview.textContent = previewText;

        const readMoreButton = document.createElement("button");
        readMoreButton.classList.add("story-card-button");
        readMoreButton.textContent = "Read More";

        storyCard.dataset.preview = previewText;
        storyCard.dataset.expanded = "false";
        console.log("Adding click event listener for story:", story.id);
        readMoreButton.addEventListener("click", function() {
            if(storyCard.dataset.expanded === "false") {
                openPublicStory(story.id,storyCard);
                storyCard.dataset.expanded = "true";
            }else{
                const preview =storyCard.querySelector(".story-card-preview");
                preview.textContent =storyCard.dataset.preview;
                readMoreButton.textContent = "Read Story";
                storyCard.dataset.expanded = "false";
            }
        });

        const publicReviewCard = document.createElement("div");
        publicReviewCard.classList.add("public-review-card");

        const publicReviewGoodOne = document.createElement("div");
        publicReviewGoodOne.classList.add("public-review-good-one");
        //publicReviewGoodOne.textContent = "Good One: " + story.goodOneCount;
        publicReviewCard.appendChild(publicReviewGoodOne);

        const publicReviewGoodButton = document.createElement("button");
        publicReviewGoodButton.classList.add("public-review-good-button");
const goodIcon = document.createElement("span");

goodIcon.classList.add("good-icon");

goodIcon.innerHTML = `
    <img
        class="ok-hand-outline"
        src="assets/ok-payment-svgrepo-com.svg"
        alt="Good"
    >

    <img
        class="ok-hand-solid"
        src="assets/ok-payment-svgrepo-com.svg"
        alt="Good"
    >
`;

publicReviewGoodButton.appendChild(goodIcon);

publicReviewGoodButton.addEventListener("click", function () {
    publicReviewGoodButton.classList.toggle("selected");
});

        //const goodButtonText = document.createElement("span");
        //goodButtonText.classList.add("good-button-text");
        //goodButtonText.textContent = " ";
        //publicReviewGoodButton.appendChild(goodButtonText);
        

        publicReviewGoodOne.appendChild(publicReviewGoodButton);

        const publicReviewComments = document.createElement("div");
        publicReviewComments.classList.add("public-review-comments");
        publicReviewComments.textContent = "Comments: " + story.commentCount;
        publicReviewCard.appendChild(publicReviewComments);

        
        storyCard.appendChild(writerName);
        storyCard.appendChild(storyTitle);
        storyCard.appendChild(preview);
        storyCard.appendChild(readMoreButton);
        storyCard.appendChild(publicReviewCard);
        
        publicStoryContainer.appendChild(storyCard);
    
    }
}

function openPublicStory(storyId,storyCard) {
    console.log("Open story:", storyId);
    fetch("http://localhost:8080/stories/public/"+storyId,
        {
            method: "GET",
        }
    ).then(function(response) {
        if(response.status === 404) {
            alert("Story not found. It may have been deleted.");
            return;
        }
        if(!response.ok){
            throw new Error("Failed to fetch story");
        }
        return response.json();
    }).then(function(story){
        if(story == undefined || story == null){
            alert("Story not found. It may have been deleted.");
            return;
        }
        const preview = storyCard.querySelector(".story-card-preview");
        preview.textContent = story.content;
        const readMoreButton = storyCard.querySelector(".story-card-button");
        readMoreButton.textContent = "Collapse";
    }).catch(function (error) {
        console.error("Error fetching story:", error);
        alert("Unable to load story");
    });
}


