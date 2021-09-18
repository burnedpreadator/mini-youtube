const express = require('express');
const axios = require('axios');
const {google} = require('googleapis');
const app = express();
const port = 3000;
const apiKey = "AIzaSyBX-bcIcREQR_eR3M0lFHUzOHAd5LlL4KA";
const baseApiUrl = "https://www.googleapis.com/youtube/v3";
const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/search-with-googleapis", async (req, res, next) => {
    try {
      const searchQuery = req.query.search_query;
      // const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;
      // const response = await axios.get(url);
      const response = await youtube.search.list({
        maxResults: 20,
        part: "id", 
        q: searchQuery,
        type: 'video'
      })
      const videoId = response.data.items.map((item) => item.id.videoId);

      // res.send(response.data.items);
      renderResult(res, videoId);
      // res.render("home", titles);
    } catch (err) {
      next(err);
    }
});

function renderResult(res, videoId) {
	res.render('home', {ids: videoId},
	  function(err, result) {
		if (!err) {res.end(result);}
		else {res.end('Oops ! An error occurred.');
		  console.log(err);}
	});
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });