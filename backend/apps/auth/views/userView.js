const bcrypt = require("bcrypt");
const { models } = require("../../../core/db/sequelize");
const {
  BadRequestException,
  ConflictException,
} = require("../../../core/responses/exceptions");
const {
  CreatedResponse,
  OkResponse,
  NoContentResponse,
} = require("../../../core/responses");

// TODO both list and get should have some fields removed, e.g. hash, this is a common requirement and should be centralised
const list = async (req, res) => {
  users = await models.User.findAll();
  return new OkResponse(users).sendJson(res);
};

const get = async (req, res) => {
  user = await models.User.findByPk(req.params.id);
  if (!user) return res.status(404).send("User not found");
  return new OkResponse(user).sendJson(res);
};

const create = async (req, res, next) => {
  // TODO move validation into a class based serializer as this will be repeated in other views
  // Alternatively move validation into centralized middleware, probably still worth using class methods
  if (!req.body.email)
    return new BadRequestException("Email address required").send(res);
  if (!req.body.password)
    return new BadRequestException("Password required").send(res);

  // Check if email is taken
  let user = await models.User.findOne({ where: { email: req.body.email }, paranoid: false });
  if (user)
    return new ConflictException("Email address already in use").send(res);

  // TODO perform validation on password, enacting restrictions, e.g., password length and complexity
  // TODO does password need salt?
  req.body.hash = await bcrypt.hash(req.body.password, 10);
  try {
    user = await models.User.create(req.body);
  } catch (e) {
    return next(e);
  }

  // TODO send verification email
  return new CreatedResponse("User created").send(res);
};

// TODO dont' allow updating of password
// TODO only allow user to update themselves, or admin to update any user, same for all user endpoints actually
const update = async (req, res, next) => {
  try {
    await models.User.update(req.body, { where: { id: req.params.id } });
    user = await models.User.findByPk(req.params.id);
    return new OkResponse(user).sendJson(res);
  } catch (e) {
    next(e);
  }
};

const destroy = async (req, res, next) => {
  try {
    await models.User.destroy({ where: { id: req.params.id } });
    return new NoContentResponse().send(res);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  list,
  get,
  create,
  update,
  destroy,
};
