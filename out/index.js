"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "./");
app.get("/", (req, res) => {
    res.render("view.ejs", loadFollows());
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
function loadFollows() {
    const following_json = require('../following.json')['relationships_following'];
    const followers_json = require('../followers.json');
    const following = [];
    const followers = [];
    const notMutual = [];
    for (let curr of following_json) {
        following.push(curr.string_list_data[0].value);
    }
    for (let curr of followers_json) {
        followers.push(curr.string_list_data[0].value);
    }
    for (let user of following) {
        if (!followers.includes(user)) {
            notMutual.push(user);
        }
    }
    return {
        following,
        followers,
        notMutual
    };
}
