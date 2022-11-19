import { getCurrentTab } from './utils.js';

const pattern = "youtube.com/watch";
const failureMsg = "This is not a youtube video page";
const noBookMarks = "No bookmarks to show";

//* adding a new bookmark row to the popup
const addNewBookmark = (bookmarkElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.description;
  bookmarkTitleElement.className = "bookmark-title";

  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  bookmarkElement.appendChild(newBookmarkElement);
};

//* display all currently saved bookmarks for the video
const viewBookmarks = (currentVideoBookmarks = []) => {
  const bookmarkElement = document.getElementById("bookmarks");

  if (bookmarkElement) {
    bookmarkElement.innerHTML = "";

    if (currentVideoBookmarks.length > 0) {

      for (let bookmark of currentVideoBookmarks) {
        addNewBookmark(bookmarkElement, bookmark);
      }
    } else {
      bookmarkElement.innerHTML = `<i>${noBookMarks}</i>`;
    }
  }
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

//* Event that fires when an html document is loaded
//* This is where we load all our bookmarks and display them
document.addEventListener("DOMContentLoaded", async () => {

  console.log("Hello World !!");

  let activeTabInfo = await getCurrentTab();
  let currentVideoId = getCurrentVideoId(activeTabInfo);

  //* If a video id exists and the user is on a youtube video page
  if (currentVideoId && activeTabInfo.url.includes(pattern)) {

    //* Get any current bookmarks associated with the video
    chrome.storage.sync.get(currentVideoId, data => {

      let currentVideoBookmarks = data[currentVideoId] 
        ? JSON.parse(data[currentVideoId]) : [];

      //* Pass the list of bookmarks populate the bookmarks in the UI
      viewBookmarks(currentVideoBookmarks);
    })
  } else {
    console.log("Inside else case");
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = `<div class="title">${failureMsg}</div>`
  }
});

const getCurrentVideoId = activeTabInfo => {

  const queryParameters = activeTabInfo.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  return urlParameters.get("v");
} 
