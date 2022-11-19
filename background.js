//* Listen to any updates on our tab system and find the tab that
//* we are currently on and check if it is a youtube page.

const youTubeUrl = "youtube.com/watch"

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  
  //* The extension should work only on youtube videos
  if (tab.url && tab.url.includes(youTubeUrl)) {

    //* Get the query parameters of the video from the address bar
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    console.log("Url Parameters ", urlParameters);

    //* Notify the content script that a new video has been loaded
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v") //* unique youtube video id
    })
  }
})