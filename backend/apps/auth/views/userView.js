const bcrypt = require("bcrypt");
const { models } = require("../../../core/db/sequelize");
const {
  BadRequestException,
  ConflictException,
} = require("../../../core/responses/exceptions");
const { Response } = require("../../../core/responses");

const list = async (req, res) => {
  users = await models.User.findAll();
  res.status(200).json(users);
};

const get = async (req, res) => {
  user = await models.User.findByPk(req.params.id);
  if (!user) return res.status(404).send("User not found");
  res.status(200).json(user);
};

const create = async (req, res, next) => {
  // TODO move validation into a class based serializer as this will be repeated in other views
  // Alternatively move validation into centralized middleware, probably still worth using class methods
  if (!req.body.email)
    return new BadRequestException("Email address required").send(res);
  if (!req.body.password)
    return new BadRequestException("Password required").send(res);

  // Check if email is taken
  let user = await models.User.findOne({ where: { email: req.body.email } });
  if (user)
    return new ConflictException("Email address already in use").send(res);

  // TODO perform validation on password, enacting restrictions, e.g., password length and complexity
  // TODO does password need salt?
  req.body.hash = await bcrypt.hash(req.body.password, 10);
  try {
    user = await models.User.create(req.body);
  } catch (e) {
    next(e);
  }

  // TODO send verification email
  // TODO set user status to unverified, should just use default field on the model

  return new Response(201, "User created").send(res);
};

const update = async (req, res) => {
  await models.User.update(req.body, { where: { id: req.params.id } });
  user = await models.User.findByPk(req.params.id);
  res.status(200).json(user);
};

const destroy = async (req, res) => {
  user = await models.User.destroy({ where: { id: req.params.id } });
  res.status(200).json(user);
};

module.exports = {
  list,
  get,
  create,
  update,
  destroy,
};
