import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    declare email: string;

    @Attribute(DataTypes.STRING)
    declare password: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare firstName: string;

    @Attribute(DataTypes.STRING)
    declare lastName: string;

    @Attribute(DataTypes.DATE)
    declare birthDay: Date;

    @Attribute(DataTypes.STRING)
    declare sex: string;

    @Attribute(DataTypes.STRING)
    declare group: string;

    @Attribute(DataTypes.STRING)
    declare description: string;

    @Attribute(DataTypes.STRING)
    declare telegram: string;
}