const { models } = require("../../../core/db/sequelize");
const {
  BadRequestException,
  ConflictException,
} = require("../../../core/exceptions");

const list = async (req, res) => {
  users = await models.User.findAll();
  res.status(200).json(users);
};

const get = async (req, res) => {
  user = await models.User.findByPk(req.params.id);
  if (!user) return res.status(404).send("User not found");
  res.status(200).json(user);
};

const create = async (req, res) => {
  // TODO move validation into a class based serializer as this will be repeated in other views
  if (!req.body.email)
    return BadRequestException("Email address required").send(res);
  if (!req.body.password)
    return BadRequestException(400, "Password required").send(res);

  // TODO check if email already in system
  let user = await models.user.findOne({ where: { email: req.body.email } });
  if (user)
    return ConflictException(409, "Email address already in use").send(res);


  // TODO hash password before storing

  // TODO send verification email
  // TODO set user status to unverified

  user = await models.User.create(req.body);
  res.status(201).json(user);
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
