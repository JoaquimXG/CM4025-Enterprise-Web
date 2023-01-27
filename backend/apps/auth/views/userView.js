const { models } = require("../../../core/db/sequelize");

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
  // TODO validate email
  // TODO hash password before storing
  // TODO check if email already in system
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
