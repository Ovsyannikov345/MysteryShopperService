const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require(".");

const User = sequelize.define(
    "User",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patronymic: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.SMALLINT,
        },
        city: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const Company = sequelize.define(
    "Company",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const ContactPerson = sequelize.define(
    "ContactPerson",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patronymic: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const Order = sequelize.define(
    "Order",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completionTime: {
            type: DataTypes.SMALLINT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    { updatedAt: false }
);

const Request = sequelize.define(
    "Request",
    {
        accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const Report = sequelize.define(
    "Report",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grade: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        graded: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    { timestamps: false }
);

const CompanyReview = sequelize.define(
    "CompanyReview",
    {
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        grade: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const UserReview = sequelize.define(
    "UserReview",
    {
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        grade: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
    { timestamps: false }
);

const SupportRequest = sequelize.define(
    "SupportRequest",
    {
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    { updatedAt: false }
);

const UserOrders = sequelize.define("UserOrders", {}, { timestamps: false });

Company.hasOne(ContactPerson);
ContactPerson.belongsTo(Company);

Company.hasMany(Order);
Order.belongsTo(Company);

User.belongsToMany(Order, { through: UserOrders });
Order.belongsToMany(User, { through: UserOrders });

User.hasMany(Request);
Request.belongsTo(User);
Order.hasMany(Request);
Request.belongsTo(Order);

User.hasMany(Report);
Report.belongsTo(User);
Order.hasMany(Report);
Report.belongsTo(Order);

User.hasMany(CompanyReview);
CompanyReview.belongsTo(User);
Company.hasMany(CompanyReview);
CompanyReview.belongsTo(Company);

User.hasMany(UserReview);
UserReview.belongsTo(User);
Company.hasMany(UserReview);
UserReview.belongsTo(Company);

User.hasMany(SupportRequest);
Company.hasMany(SupportRequest);
SupportRequest.belongsTo(User);
SupportRequest.belongsTo(Company);

module.exports = {
    Company,
    CompanyReview,
    ContactPerson,
    Order,
    Report,
    Request,
    SupportRequest,
    UserReview,
    User,
};