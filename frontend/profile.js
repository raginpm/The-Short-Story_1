const nationality = document.querySelector("#profileNationality");
const hometown = document.querySelector("#profileHometown");   
const gender = document.querySelector("#profileGender");
const username = document.querySelector("#profileUsername");
const publicStoryContainer = document.querySelector("#profileStoriesContainer");

const token = localStorage.getItem("token");
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
    let currentPage = 0;
    const pageSize = 5;
    let loading = false;
    let noMoreComments = false;
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
        let goodReviewAddedBool = false;
        hadGoodReviewAdded(story.id)
        .then(function(goodReviewAdded) {

            if (goodReviewAdded === undefined) {
                goodReviewAdded = false;
                goodReviewAddedBool = false;
            }

            if (goodReviewAdded) {
                goodReviewAddedBool = true;
                publicReviewGoodButton.classList.add("selected");
            }
        });
        publicReviewGoodButton.addEventListener("click", function () {
            if(!goodReviewAddedBool){
                fetch("http://localhost:8080/stories/"+story.id+"/good-review", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }).then(function(response) {
                    if(response.status === 401){
                        localStorage.removeItem("token");
                        window.location.replace("login.html");
                        return;
                    }
                    if(!response.ok){
                        throw new Error("Failed to mark story as good one");
                    }
                    return response.json();
                }).then(function(responseObject){
                    if(responseObject == undefined){
                        alert("Failed to mark story as good one");
                        return;
                    }
                    goodReviewAddedBool = true;
                    publicReviewGoodButton.classList.add("selected");
                    //publicReviewGoodOne.textContent = "Good One: " + responseObject.goodOneCount;
                }).catch(function(error){
                    console.error(error);
                    alert("An error occurred while marking the story as good one.");
                });
            }
        });
        
        publicReviewGoodOne.appendChild(publicReviewGoodButton);
        
        const publicReviewComments = document.createElement("div");
        publicReviewComments.classList.add("public-review-comment");
        const publicReviewCommentsButton = document.createElement("button");
        publicReviewCommentsButton.classList.add("public-review-comment-button");
        const commentIcon = document.createElement("span");
        commentIcon.classList.add("comment-icon");
        
          commentIcon.innerHTML = `
            <img
                class="comment-outline"
                src="assets/comments-svgrepo-com.svg"
                alt="Comment"
            >

            <img
                class="comment-solid"
                src="assets/comments-svgrepo-com.svg"
                alt="Comment"
            >
        `;

        publicReviewCommentsButton.appendChild(commentIcon);
        

        publicReviewComments.appendChild(publicReviewCommentsButton);
        

        publicReviewCard.appendChild(publicReviewComments);

        
        storyCard.appendChild(writerName);
        storyCard.appendChild(storyTitle);
        storyCard.appendChild(preview);
        storyCard.appendChild(readMoreButton);
        storyCard.appendChild(publicReviewCard);
        let commentLoaded = false;
        publicReviewCommentsButton.addEventListener("click", function () {

            publicReviewCommentsButton.classList.toggle("selected");
            if(commentLoaded){
                const existingCommentSection =
                storyCard.querySelector(
                    ".user-comment-section"
                );
                if (existingCommentSection !== null) {
                    existingCommentSection.remove();
                }
                commentLoaded = !commentLoaded;
            }else{
                const userCommentSection = document.createElement("div");
                userCommentSection.classList.add("user-comment-section");
            
                const userCommentViewSection = document.createElement("div");

                userCommentViewSection.addEventListener("scroll",function () {
                        const scrollPosition = userCommentViewSection.scrollTop + userCommentViewSection.clientHeight;
                        const totalHeight = userCommentViewSection.scrollHeight;

                        if (scrollPosition>= totalHeight - 50) {
                            loadComment(
                                story.id,
                                userCommentViewSection
                            );
                        }
                    }
                );

                userCommentViewSection.classList.add("user-comment-view-section");

                const userCommentAddingSection = document.createElement("div");
                userCommentAddingSection.classList.add("user-comment-adding-section");

                userCommentSection.appendChild(userCommentViewSection);
                userCommentSection.appendChild(userCommentAddingSection);

                userCommentViewSection.dataset.currentPage = 0;
                userCommentViewSection.dataset.pageSize = 5;
                userCommentViewSection.dataset.loading = false;
                userCommentViewSection.dataset.noMoreComments = false;

                loadCommentingSection(userCommentAddingSection,userCommentViewSection,story.id);
                loadComment(story.id,userCommentViewSection);
                storyCard.appendChild(userCommentSection);
                commentLoaded = !commentLoaded;
            }
                
        });

        publicStoryContainer.appendChild(storyCard);
    
    }
}

function hadGoodReviewAdded(storyId) {

    return fetch(
        "http://localhost:8080/stories/" + storyId + "/good-review",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    )
    .then(function(response) {

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to check good review status");
        }

        return response.json();
    })
    .then(function(goodReviewAdded) {

        if (goodReviewAdded === undefined) {
            return;
        }

        return goodReviewAdded;
    })
    .catch(function(error) {
        console.error(error);
        alert("An error occurred while checking good review status.");
    });
}

function loadCommentingSection(commentAddingSection, commentViewSection, storyId) {
        
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment...";
    commentInput.classList.add("comment-input");
    const submitCommentButton = document.createElement("button");
    submitCommentButton.textContent = "Submit";
    submitCommentButton.classList.add("comment-post-button");
    commentAddingSection.appendChild(commentInput);
    commentAddingSection.appendChild(submitCommentButton);
    submitCommentButton.addEventListener("click", function () {
        const commentText = commentInput.value.trim();
        if (commentText !== "") {
            const commentObject = {
                content: commentText
            };
            console.log("Adding comment to story:", storyId, commentObject);
            addCommentToStory(storyId, commentViewSection,commentObject);
            commentInput.value = "";
        } else {
            alert("Comment cannot be empty.");
        }
    });
        

}


function addCommentToStory(storyId, commentViewSection,commentObejct) {

    fetch("http://localhost:8080/stories/"+storyId+"/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body:JSON.stringify(commentObejct)

    }).then(function(response) {
        if(response.status === 401){
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }
        if(!response.ok){
            throw new Error("Failed to add comment");
        }
        return response.json();
    }).then(function(responseObject){
        if(responseObject == undefined){
            alert("Failed to add comment");
            return;
        }
        //viewAddedComment(responseObject,commentViewSection)
        loadNewComment(responseObject,commentViewSection)
        console.log("Comment added successfully:", responseObject);
    }).catch(function(error){
        console.error(error);
        alert("An error occurred while adding the comment.");
    });

}

function loadNewComment(comment,userCommentViewSection){
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("user-comment-view");
    const username = document.createElement("span");
    username.classList.add("comment-username");
    username.textContent = comment.username;
    const content = document.createElement("p");
    content.classList.add("comment-content");
    content.textContent = comment.content;
    commentDiv.appendChild(username);
    commentDiv.appendChild(content);
    console.log("Adding comment to view section:", comment.username,comment.content);
    userCommentViewSection.prepend(commentDiv);
}
function viewAddedComment(comment,userCommentViewSection){
    
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("user-comment-view");
    const username = document.createElement("span");
    username.classList.add("comment-username");
    username.textContent = comment.username;
    const content = document.createElement("p");
    content.classList.add("comment-content");
    content.textContent = comment.content;
    commentDiv.appendChild(username);
    commentDiv.appendChild(content);
    console.log("Adding comment to view section:", comment.username,comment.content);
    userCommentViewSection.appendChild(commentDiv);
}


function loadComment(storyId,userCommentViewSection) {
 
    if (userCommentViewSection.dataset.loading === "true") {
        return;
    }
    if (userCommentViewSection.dataset.noMoreComments === "true") {
        return;
    }
    userCommentViewSection.dataset.loading ="true";
    const currentPage =Number( userCommentViewSection.dataset.currentPage);
    const pageSize = 7;

    userCommentViewSection.dataset.loading = true;
    fetch("http://localhost:8080/stories/"+storyId+"/comments?page="+currentPage+"&size="+pageSize,{
        method:"GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(function(response) {
        console.log("Comments received:", response);
        if(response.status === 401){
            localStorage.removeItem("token");
            window.location.replace("login.html");
            return;
        }
        if(!response.ok){
            throw new Error("Failed to load comments");
        }
        return response.json();
    }).then(function(comments){
        
        if(comments == undefined || comments == null || comments.length === 0){
            userCommentViewSection.dataset.noMoreComments = true;
            return;
        }
        console.log("Comments loaded successfully:", comments);
        showComments(comments,userCommentViewSection);
        userCommentViewSection.dataset.currentPage = String(currentPage + 1);
        if (comments.length < pageSize) {
            userCommentViewSection.dataset.noMoreComments = "true";
        }
    }).catch(function(error){
        console.error(error);
        alert("An error occurred while loading comments.");
    }).finally(function() {
        userCommentViewSection.dataset.loading = false;
    });; 
    
}

function showComments(
        comments,
        userCommentViewSection) {

   
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        loadThisComment(comment,userCommentViewSection)
    }
} 

function loadThisComment(comment,userCommentViewSection){
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("user-comment-view");
    const username = document.createElement("span");
    username.classList.add("comment-username");
    username.textContent = comment.username;
    const content = document.createElement("p");
    content.classList.add("comment-content");
    content.textContent = comment.content;
    commentDiv.appendChild(username);
    commentDiv.appendChild(content);
    console.log("Adding comment to view section:", comment.username,comment.content);
    userCommentViewSection.appendChild(commentDiv);
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


