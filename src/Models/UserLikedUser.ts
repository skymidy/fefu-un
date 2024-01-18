import {Attribute, AutoIncrement, NotNull, PrimaryKey} from "@sequelize/core/decorators-legacy";
import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "@sequelize/core";

export class UserLikedUser extends Model<InferAttributes<UserLikedUser>, InferCreationAttributes<UserLikedUser>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare likedUserId: number;
}