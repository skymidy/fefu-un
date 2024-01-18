import express from 'express';
import {User} from "../Models/User";
import {sequelize} from "../Models";
import {sql} from "@sequelize/core";
import {Avatar} from "../Models/Avatar";
import {UserTag} from "../Models/UserTag";
import {Tag} from "../Models/Tag";
import {UserLikedUser} from "../Models/UserLikedUser";

export const router = express.Router();

const loginCheck = (req, res, next)=>{
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
    let userModel = await User.findOne({where:{id:req.cookies.loginStatus.id}});
    let userTags = await UserTag.findAll({where:{userId:userModel.id}});
    let useridTags:number[] = [];
    for (const userTagsKey in userTags) {
        useridTags.push(userTags[userTagsKey].tagId);
    }
    console.log(userTags)
    let tags = await Tag.findAll({where:{id:useridTags}});
    let avatar = await Avatar.findOne({where:{userId: userModel.id}});
    res.render('index', {title: 'profile', data: {userModel, tags, avatar}});
});
router.get('/profile_card/:userId', loginCheck, async function (req, res, next) {

    let userModel = await User.findOne({where: {id: req.params["userId"]}});
    let userTags = await UserTag.findAll({where: {userId: userModel.id}});
    let useridTags: number[] = [];
    for (const userTagsKey in userTags) {

        useridTags.push(userTags[userTagsKey].tagId);
    }

    let tags = await Tag.findAll({where: {id: useridTags}});
    let avatar = await Avatar.findOne({where: {userId: userModel.id}});
    res.render('index', {title: 'profile_card', data: {userModel, tags, avatar}});
});
router.get('/reciprocity', loginCheck, async function (req, res, next) {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    let userIds = await UserLikedUser.findAll({where:{userId:cookie.id}});
    let usersIdsArr:number[] = [];
    userIds.forEach((v)=>usersIdsArr.push(v.likedUserId));
    let users = await User.findAll({where:{id:usersIdsArr}});
    let avatars = await Avatar.findAll({where:{userId: usersIdsArr}});
    res.render('index', {title: 'reciprocity', data:{users,avatars}});
});
router.get('/registration', function (req, res, next) {
    res.render('index', {title: 'registration'});
});
router.get('/ribbon', loginCheck,async function (req, res, next) {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }

    const user = await User.findOne({where: {email: cookie.email}});

    if (user) {
        let users = await sequelize.query(
            sql`with target_users as (
                    select 
                    u.*
                    from usertags ut, users u, tags t
                    where ut.id = t.id
                        and (t.title in (
                                        select t.title 
                                        from usertags ut 
                                        join tags t on ut.tagId like t.id
                                        where ut.userId like :userId 
                                        ))
                    and u.id = ut.userId
                    group by u.id
                )
                select tru.*
                from  target_users tru
                where 
                    id not like :userId
                    and (id not in (select likeduserId from userlikedusers uu where uu.userId like :userId))
                    and (id not in (select dislikeduserId from userdislikedusers uu where uu.userId like :userId))`,
            {
                replacements: {userId: user.id},
            })
        if(users[0].length !== 0) {
            let userModel = await User.findOne({where: {id: users[0][0]["id"]}});
            let userTags = await UserTag.findAll({where: {userId: userModel.id}});
            let useridTags: number[] = [];
            for (const userTagsKey in userTags) {

                useridTags.push(userTags[userTagsKey].tagId);
            }

            let tags = await Tag.findAll({where: {id: useridTags}});
            let avatar = await Avatar.findOne({where: {userId: userModel.id}});
            res.render('index', {title: 'ribbon', data: {userModel, tags, avatar}});
        }else {
            res.render('index', {title: 'ribbon', data: {userModel:null}});
        }

    } else {
        res.status(400).json({status: false, error: "User does not exist"});
    }
});
