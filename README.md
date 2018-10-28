# Daniel Wade
# Enhancement Developer Assignment

Hi there. Thanks for the interview this week. It was nice to meet all of you.

Recruiter said no frameworks and vanilla js. This was a challenge since it has been a while not working with some sort of framework / lib.  So, no frameworks, JQuery, etc... I did bring in one small lib to help with localstorage called strg.js: https://github.com/fend25/strg.js/blob/master/README.md. I'm also using SASS. The watch call for sass would be: `sass --watch sass/styles.scss:styles.css`. As I'm writing this I realize that I'm using the Fetch api and it is working great on my son's Windows machine with IE Edge. But it will break on lower versions of IE without polyfill. Also, this means that app needs to run with server environment. See instructions below.

To run locally please run use web server and SASS. If you don't have handy you can use node http-server:

`sass --watch sass/styles.scss:styles.css`

`npm install http-server -g` then in run command `http-server` which will run at http://127.0.0.1:8080

I believe I have all features and extras in place. The save products are shown on same page using icon and colors. I have the application running on my personal site. You can find it here:

http://danwade.name/pb-assignment/

Thanks again, looking forward to hearing feedback.



