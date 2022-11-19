# youtube-bookmarker
Chrome extension that supports bookmarking specific timestamps in YouTube videos

### Functionalities supported:
1. Allows users to create multiple bookmarks at specific timestamps in a YouTube video
2. Displays all created bookmarks for a YouTube video
3. Supports seeking the video to the specific timestamp where the bookmark was created
4. Delete created bookmarks for a video
5. Check to ensure the extension works only when the user's tab is on a youtube page

#### Tech Stack:
- HTML5
- CSS3
- JavaScript

### JavaScript Concepts used:
 - let and const
 - Arrow functions
 - Promises
 - Async and await
 - Template Literals
 - Destructuring
 - DOM Manipulation using native JS DOM methods
 
#### Additional Notes
A service worker script is used which keeps listening to any tab changes by the user and fires an event to the contentScript which manipulates the DOM (Document Object Model) to implement the bookmark functionality. The extension utilizes both the chrome tabs API and the chrome storage API for the business logic.
