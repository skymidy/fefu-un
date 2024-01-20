import express from 'express';
import {User} from "../Models/User";
import {sequelize} from "../Models";
import {sql} from "@sequelize/core";
import {Avatar} from "../Models/Avatar";
import {UserTag} from "../Models/UserTag";
import {Tag} from "../Models/Tag";
import {UserLikedUser} from "../Models/UserLikedUser";

export const router = express.Router();

const loginCheck = (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.redirect("/registration");
        return;
    }
    next();
}
/* GET home page. */
router.get('/', async function (req, res, next) {
    res.redirect("/registration");
});
router.get('/profile', loginCheck, async function (req, res, next) {

    let cookie = req.cookies.loginStatus;

    let userModel = await User.findOne({where: {id: req.cookies.loginStatus.id}});
    let userTags = await UserTag.findAll({where: {userId: userModel.id}});
    let useridTags: number[] = [];
    for (const userTagsKey in userTags) {
        useridTags.push(userTags[userTagsKey].tagId);
    }
    let tags = await Tag.findAll({where: {id: useridTags}});
    let avatar = await Avatar.findOne({where: {userId: userModel.id}});
    res.render('index', {title: 'profile', lang:cookie.lang, data: {userModel, tags, avatar}});
});
router.get('/profile_card/:userId', loginCheck, async function (req, res, next) {

    let cookie = req.cookies.loginStatus;

    let userModel = await User.findOne({where: {id: req.params["userId"]}});
    let userTags = await UserTag.findAll({where: {userId: userModel.id}});
    let useridTags: number[] = [];
    for (const userTagsKey in userTags) {
        useridTags.push(userTags[userTagsKey].tagId);
    }
    let tags = await Tag.findAll({where: {id: useridTags}});
    let avatar = await Avatar.findOne({where: {userId: userModel.id}});
    res.render('index', {title: 'profile_card', lang:cookie.lang,  data: {userModel, tags, avatar}});

});
router.get('/reciprocity', loginCheck, async function (req, res, next) {

    let cookie = req.cookies.loginStatus;

    let userIds = await UserLikedUser.findAll({where: {userId: cookie.id}});
    let usersIdsArr: number[] = [];
    userIds.forEach((v) => usersIdsArr.push(v.likedUserId));
    let users = await User.findAll({where: {id: usersIdsArr}});
    let avatars = await Avatar.findAll({where: {userId: usersIdsArr}});
    res.render('index', {title: 'reciprocity', lang:cookie.lang,  data: {users, avatars}});
});
router.get('/registration', function (req, res, next) {
    res.render('index', {title: 'registration', lang:"en"});
});
router.get('/ribbon', loginCheck, async function (req, res, next) {
    let cookie = req.cookies.loginStatus;
    res.render('index', {title: 'ribbon', lang:cookie.lang});
});
