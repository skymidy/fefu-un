import express from 'express';

import bcrypt from 'bcrypt';
import {User} from "../Models/User";
import {UserLikedUser} from "../Models/UserLikedUser";

import {sequelize} from "../Models";
import {sql} from "@sequelize/core";
import {generateUser} from "../Models/fake";
import {Tag} from "../Models/Tag";
import {UserTag} from "../Models/UserTag";
import {UserDislikedUser} from "../Models/UserDislikedUser";

export const router = express.Router();

router.post('/registration', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    let usr = {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt)
    };
    let created_user = await User.create(usr);
    res.status(201).json(created_user);
});

router.post('/login', async (req, res, next) => {

    var cookie = req.cookies.loginStatus;
    if (cookie !== undefined) {
        res.status(200).json({status: true, error: "Already Logged"});
    }

    const user = await User.findOne({where: {email: req.body.email}});
    if (user) {
        const password_valid = await bcrypt.compare(req.body.password, user.password);
        if (password_valid) {
            res.cookie('loginStatus', {email: user.email, id: user.id}, {maxAge: 900000, httpOnly: true});
            res.status(200).json({status: true, error: "Success"});
        } else {
            res.status(400).json({status: false, error: "Password Incorrect"});
        }

    } else {
        res.status(400).json({status: false, error: "User does not exist"});
    }


});

router.post('/generateUsers', async (req, res, next) => {
    let created_users= [];
    for (let i = 0; i < req.body.count; i++) {
        created_users.push(await generateUser());
    }
    res.status(201).json(created_users);
});

router.post('/addTags', async (req, res, next) => {
    let tags: string[] = req.body.tags;
    tags.forEach((value) => {
        Tag.create({title: value});
    })
    res.status(201).json({});
});

router.post('/addTagToUser', async (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    let tag = await Tag.findOne({where:{title:req.body.title}});
    await UserTag.create({userId: cookie.id, tagId: tag.id});
    res.status(201).json({});
});
router.post('/removeTagToUser', async (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    let tag = await Tag.findOne({where:{title:req.body.title}});
    await UserTag.destroy({where:{userId: cookie.id, tagId: tag.id}});
    res.status(201).json({});
});
router.post('/like/add', async (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    await UserLikedUser.create({userId:cookie.id,likedUserId:req.body.userId})
    res.status(201).json({});
});
router.post('/like/remove', async (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    await UserLikedUser.destroy({where:{userId:cookie.id,likedUserId:req.body.userId}});
    res.status(201).json({});
});
router.post('/dislike/add', async (req, res, next) => {
    let cookie = req.cookies.loginStatus;
    if (cookie === undefined) {
        res.status(401).json({});
        return;
    }
    await UserDislikedUser.create({userId:cookie.id,dislikedUserId:req.body.userId})
    res.status(201).json({});
});