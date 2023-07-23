import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./");

app.get("/", (req, res) => {
    res.render("view.ejs", loadFollows());
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

function loadFollows() {

    const following_json = require('../data/following.json')['relationships_following'];
    const followers_json = require('../data/followers_1.json');

    const following = [];
    const followers = [];

    const notMutual = [];

    for (let curr of following_json) {
        following.push(curr.string_list_data[0].value)
    }
    
    for (let curr of followers_json) {
        followers.push(curr.string_list_data[0].value)
    }
    
    for (let user of following) {
        if(!followers.includes(user)) {
            notMutual.push(user);
        }
    }

    return {
        following,
        followers,
        notMutual
    }
}