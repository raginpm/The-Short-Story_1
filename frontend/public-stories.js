const publicStoryContainer = document.querySelector("#publicStoriesContainer");
console.log("Public stories container:", publicStoryContainer);
let currentPage = 0;
const pageSize = 20;
let loading = false;
let noMoreStories = false;

loadPublicStories();

window.addEventListener("scroll", function(){
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if(scrollPosition >= pageHeight - 300) {
        loadPublicStories();
    }
});

function loadPublicStories() {
    if(loading || noMoreStories) {
        return;
    }
    loading = true
    fetch("http://localhost:8080/stories/public?page="+currentPage + "&size=" + pageSize, {
        method: "GET",  
    }).then(function(response) {
       if (response.status === 404) {
            alert("Story not found");
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load story");
        }
        return response.json();
    }).then(function(stories) {
        if(stories.length == 0){
            noMoreStories = true;
            return;
        }
        showPublicStories(stories);
        currentPage++;
        if(stories.length < pageSize){
            noMoreStories = true;
        }
    }).catch(function(error) {
        console.error("Error fetching public stories:", error);
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
    
        writerName.addEventListener("click", function() {
            window.location.href = "profile.html?userId=" + story.userId;
        });
        
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
        storyCard.appendChild(writerName);
        storyCard.appendChild(storyTitle);
        storyCard.appendChild(preview);
        storyCard.appendChild(readMoreButton);
        
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

