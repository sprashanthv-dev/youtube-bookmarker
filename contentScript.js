//* Define an IIFE
(() => {
    let youTubeLeftControls;
    let youTubePlayer;

    //* Video id
    let currentVideo = "";
    let currentVideoBookmarks = [];

    //* Listen to any events from the service worker
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj

        if (type === "NEW") {
            currentVideo = videoId;
            handleNewVideoLoaded();
        }
    })

    //* Fetch all existing bookmarks for the current video from chrome storage
    const fetchBookmarks = () => {

        return new Promise(resolve => {
            chrome.storage.sync.get([currentVideo], obj => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            });
        })
    }

    const handleNewVideoLoaded = async () => {

        currentVideoBookmarks = await fetchBookmarks();

        console.log("Current Bookmarks ", currentVideoBookmarks);

        //* Get the reference to the bookmark button 
        //* on the youtube video player
        const bookmarkBtnExists = document.getElementsByClassName(
            "bookmark-btn")[0];

        //* If the bookmark btn does not exist, create it
        if (!bookmarkBtnExists) {

            const bookmarkButton = createBookmarkButton();

            appendBookmarkButtonToControls(bookmarkButton);
            handleClickOnBookmark(bookmarkButton);
        }
    }

    const createBookmarkButton = () => {
        const bookmarkBtn = document.createElement("img");

        bookmarkBtn.src = chrome.runtime.getURL("/assets/bookmark.png");
        bookmarkBtn.className = `ytp-button bookmark-btn`;
        bookmarkBtn.title = "Click to bookmark current timestamp";

        return bookmarkBtn;
    }

    const appendBookmarkButtonToControls = bookmarkButton => {
         //* Access coressponding elements from youtube video player
         youTubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
         youTubePlayer = document.getElementsByClassName("video-stream")[0];

         //* Manipulate the DOM to add our bookmark btn to youtube controls
         youTubeLeftControls.appendChild(bookmarkButton);
    }

    const handleClickOnBookmark = bookmarkButton  => {

        //* To get the timestamp (in seconds) of when the user clicks
        //* on the bookmark we access the currentTime property on
        //* the youTubePlayer variable

        bookmarkButton.addEventListener("click", async () => {
            const currentTime = youTubePlayer.currentTime;

            const newBookmark = {
                time : currentTime,
                description : `Bookmark at ${getTime(currentTime)}`
            }

            console.log("New bookmark info ", newBookmark);

            currentVideoBookmarks = await fetchBookmarks();

            //* Use the chrome storage api to store the created
            //* bookmark for the current youtube video in ascending
            //* order of timestamps created
            chrome.storage.sync.set({
                [currentVideo] : JSON.stringify(
                    [...currentVideoBookmarks, newBookmark]
                    .sort((a, b) => a.time - b.time)
                )
            })

        })
    }

    const getTime = time => {
        let date = new Date(0);

        date.setSeconds(time);
        return date.toISOString().substr(11, 8);
    }

    //* This function is called here again to handle the
    //* case of refreshing the same tab
    handleNewVideoLoaded();

})();