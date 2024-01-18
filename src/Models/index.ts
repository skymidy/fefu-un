import { Sequelize } from '@sequelize/core';
import {User} from "./User";
import {UserTag} from "./UserTag";
import {Tag} from "./Tag";
import {Avatar} from "./Avatar";
import {UserLikedUser} from "./UserLikedUser";
import {UserDislikedUser} from "./UserDislikedUser";

export const sequelize = new Sequelize('fefu-un', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    models:[User, Tag, UserTag,Avatar,UserLikedUser,UserDislikedUser]
});
