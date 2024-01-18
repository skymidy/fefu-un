import {faker as FakerRu} from "@faker-js/faker/locale/ru";
import {transilt} from "../util/transilt";
import {User} from "./User";
import bcrypt from "bcrypt";
import {faker} from "@faker-js/faker";
import {Tag} from "./Tag";
import {UserTag} from "./UserTag";
import path from "path";
import * as fs from "fs";
import {Avatar} from "./Avatar";

const TAGS = [
    "love", "friendship", "cooperation",
    "arias", "leo", "sagittarius", "taurus", "virgo", "capricorn", "pisces", "scorpio", "cancer", "aquarius", "libra", "gemini",
    "alcohol", "nicotine", "healthy",
    "sport", "music", "anime", "board games", "computer games", "mental health", "fashion", "healthy food", "cooking", "dance", "design", "travel"
];
export const generateUser = async () => {

    let sexT = FakerRu.person.sexType()
    let sex = sexT.toString();

    let firstName = FakerRu.person.firstName(sexT);
    let lastName = FakerRu.person.lastName(sexT);

    let birthDate = FakerRu.date.between({
        from: new Date(2001, 1, 1,),
        to: new Date(2006, 1, 1,)
    });

    let email = transilt(firstName).toLowerCase() + "." + transilt(lastName).slice(0, 2).toLowerCase() + "@dvfu.ru";

    let studyType = ["А", "О", "Б", "С", "М", "Б"]
    let group = studyType[Math.floor(Math.random() * 5)] + Math.floor(Math.random() * 8 + 1) + Math.floor(Math.random() + 1) + new Date(birthDate.getUTCFullYear() + 18, 1, 1,).getUTCFullYear().toString().slice(2, 4)
        + "-0" + Math.floor(Math.random() * 9) + ".0" + Math.floor(Math.random() * 9) + ".0" + Math.floor(Math.random() * 9)
        + FakerRu.string.fromCharacters("абвгдежзиклмнопрстэюя", {min: 0, max: 3})

    let telegram = "@" + faker.lorem.word({length: {min: 5, max: 7}});

    let description = FakerRu.person.bio();


    const salt = await bcrypt.genSalt(10);
    let newUserModel = {
        birthDay: birthDate,
        description: description,
        email: email,
        firstName: firstName,
        group: group,
        lastName: lastName,
        password: await bcrypt.hash("password", salt),
        sex: sex,
        telegram: telegram
    }

    let newUser = await User.create(newUserModel);

    let fakeTags: string[] = [TAGS[Math.floor(Math.random() * 3)], TAGS[Math.floor(Math.random() * 12 + 3)], TAGS[Math.floor(Math.random() * 3 + 15)]];

    fakeTags.push(...TAGS.filter((v, i) => {
        if (i < 18) {
            return false
        }
        return Math.random() * 10 > 5;
    }))
    await addTags();
    for (const v in fakeTags) {
        let tag = await Tag.findOne({where: {title: fakeTags[v]}});
        await UserTag.create({userId: newUser.id, tagId: tag.id});
    }

    let fake_avatarUrl = FakerRu.image.url({width: 244, height: 344});
    let res = await fetch(fake_avatarUrl);

    let fake_avatarImage = await res.blob();
    const file_path = path.join(__dirname, '../public/uploads');
    const fake_avatarBuffer = Buffer.from(await fake_avatarImage.arrayBuffer());
    let file_name = faker.string.alphanumeric({length: {min: 3, max: 7}}) + res.url.split("/").pop();
    fs.writeFile(path.join(file_path, file_name),
        fake_avatarBuffer, (e) => console.log(e))
    let fakeAvatarModel = await Avatar.create({userId: newUser.id, name: file_name});

    return {newUser, fakeTags, fakeAvatarModel};
};

export const addTags = async (_tags: string[] = TAGS) => {
    let query = await Tag.findAll({where: {title: _tags}});
    if (query.length === _tags.length) {
        return;
    }
    let tags2add = _tags.filter((v) => {
        return !(v in query);
    });
    for (const v in tags2add) {
        await Tag.create({title: tags2add[v]});
    }
}

