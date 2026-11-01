const saveButton = document.querySelector("#saveButton");
const storyContent = document.querySelector("#storyContent");
const storyTitle = document.querySelector("#storyTitle");
const newStoryButton = document.querySelector("#newStory");
const myStoriesButton = document.querySelector("#myStories");
const storiesContainer = document.querySelector("#storiesContainer");
const logoutButton = document.querySelector("#logoutButton");
const publicStoriesButton = document.querySelector("#publicStories");
const editProfileButton = document.querySelector("#editProfilrButton");

//const storyVisibility = document.querySelector("#storyVisibility");

//const userId = localStorage.getItem("userId");

const token = localStorage.getItem("token");

if (token === null) {
    window.location.replace("login.html");
}
loadCurrentUser();

function loadCurrentUser(){
    fetch("http://localhost:8080/auth/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(function(response) {
        if(response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }
        return response.json();
    }).then(function(user) {
        if(user == undefined || user == null){
            alert("User not found. Please log in again.");
            return;
        }
        document.querySelector("#currentUsername").textContent = "Welcome, " + user.username;
        //localStorage.setItem("userId", user.id);
    }).catch(function (error) {
        console.error(error);
        alert("Unable to load user info");
    });     

}
//if(userId === null){
//    window.location.href = "login.html";
//}
let currentStoryId = null;
let storyVisible = false; // Second click it will not show anything. 

const savedStory = localStorage.getItem("story");
storyTitle.value = "";
storyContent.value = "";
if (savedStory) {
    storyContent.value = savedStory;
}

const savedTitle = localStorage.getItem("storyTitle");
if (savedTitle) {
    storyTitle.value = savedTitle;
}

editProfileButton.addEventListener("click", function() {
    window.location.href = "edit-profile.html";
});

saveButton.addEventListener("click", function() {

    const story = storyContent.value;
    const title = storyTitle.value;
     const selectedVisibility = document.querySelector(
        'input[name="visibility"]:checked'
    ).value;


    const storyObject = {
        //userId: userId,
        title: title,
        content: story,
        visibility : selectedVisibility
    };

    if (currentStoryId === null) {
        createStory(storyObject);
    } else {
        updateStory(storyObject);
    }

});

function createStory(storyObject) {

    fetch("http://localhost:8080/stories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(storyObject)
    })
    .then(function(response) {
        if(response.status === 401) {
            handleUnauthorized();
            return;
        }   
        if (!response.ok) {
            throw new Error("Failed to create story");
        }
        return response.json();
    })
    .then(function(savedStory) {
        if(savedStory == undefined || savedStory == null){
            return;
        }
        currentStoryId = savedStory.id;
        alert("Story created with ID: " + currentStoryId);
    }).catch(function (error) {
        console.error(error);
        alert("Unable to save story");
    });
}

function updateStory(storyObject) {

    fetch(`http://localhost:8080/stories/${currentStoryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(storyObject)
    })
    .then(function(response) {

        if(response.status === 401) {
            handleUnauthorized();
            return;
        }   
        if(response.status === 404) {
            alert("Story not found. It may have been deleted.");
            return;
        }   
    
        if (!response.ok) {
            throw new Error("Failed to update story");
        }

        alert("Story updated with ID: " + currentStoryId);
    }).catch(function (error) {
        console.error(error);
        alert("Unable to update story");
    });;
}




myStoriesButton.addEventListener("click", function() {

    if(storyVisible){
        storiesContainer.innerHTML = "";
        storyVisible = false;
        return;
    }
    fetch("http://localhost:8080/stories",{
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(function(response) {
        if(response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error("Failed to fetch stories");
        }
        return response.json();
    }).then(function(stories) {
        if(stories == undefined || stories == null){
            alert("No stories found.");
            return;
        }
        showStories(stories);
        storyVisible = true;
        // Here you can implement logic to display the user's stories in the UI
    }).catch(function (error) {
        console.error(error);
        alert("Unable to load stories");
    });;
});

logoutButton.addEventListener("click", function() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
});

function showStories(stories) {
    storiesContainer.innerHTML = "";
    for(let i =0;i<stories.length;i++){
        const story = stories[i];
        const storyDiv = document.createElement("div");
        storyDiv.textContent = story.title;
        storiesContainer.appendChild(storyDiv);
        storyDiv.addEventListener("click", function() {
            const storyItems = storiesContainer.querySelectorAll("div");
            for (let j = 0; j < storyItems.length; j++) {
                storyItems[j].classList.remove("active-story");
            }
            storyDiv.classList.add("active-story");
            loadStory(story.id);
        });
    }
}

function loadStory(storyId){
    fetch("http://localhost:8080/stories/"+storyId,{
        method: "GET",
         headers: {
            "Authorization": "Bearer " + token
        }
    }).then(function(response) {
        if(response.status === 401) {
            handleUnauthorized();
            return;
        }
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
        currentStoryId = story.id;
        storyTitle.value = story.title;
        storyContent.value = story.content;
        document.querySelector('input[name="visibility"][value="' + story.visibility + '"]').checked = true;
        
        
    }).catch(function (error) {
        console.error(error);
        alert("Unable to load story");
    });;
}
newStoryButton.addEventListener("click", function() {
    currentStoryId = null;
    storyTitle.value = "";
    storyContent.value = "";
    const storyItems = storiesContainer.querySelectorAll("div");
    for (let j = 0; j < storyItems.length; j++) {
        storyItems[j].classList.remove("active-story");
    }
    document.querySelector(
        'input[name="visibility"][value="PRIVATE"]'
    ).checked = true;
    //storiesContainer.innerHTML = "";
});

function handleUnauthorized() {

    localStorage.removeItem("token");

    window.location.replace("login.html");
}

publicStoriesButton.addEventListener("click", function() {
    window.open("public-stories.html", "_blank");
});