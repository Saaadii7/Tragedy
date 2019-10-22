const { makeInvoker } = require('awilix-express');
const router = require('express').Router();

const api = makeInvoker(
    ({ userService, userSchema, userMapper, httpStatus }) => {
        return {
            all: async (req, res) => {
                let { limit, offset, search, ...others } = req.query;
                const pageSize = limit || 20;
                const page = offset || 0;
                let query = search
                    ? {
                          [Op.or]: [
                              { first: { [Op.iLike]: `%${search}%` } },
                              { last: { [Op.iLike]: `%${search}%` } },
                              others
                          ]
                      }
                    : {};
                let users = await userService.all(query, page, pageSize);
                return res.status(httpStatus.OK).send(userMapper.map(users));
            },
            create: async (req, res) => {
                let obj = req.body;
                const { error, value } = userSchema.validate(obj);
                if (error) {
                    throw new Error(error);
                }
                try {
                    let user = await userService.create(value);
                    return res
                        .status(httpStatus.CREATED)
                        .send(userMapper.map(user));
                } catch (err) {
                    throw err;
                }
            },
            get: async (req, res) => {
                let id = req.params.id;
                try {
                    let user = await userService.findById(id);
                    if (!user) {
                        throw new Error('User not found.');
                    }
                    return res.status(httpStatus.OK).send(userMapper.map(user));
                } catch (err) {
                    throw err;
                }
            },
            update: async (req, res) => {
                let obj = req.body;
                const { error, value } = userSchema.validate(obj);
                if (error) {
                    throw new Error('Data provided is not right.');
                }
                try {
                    let user = await userService.update(value, {
                        id: req.params.id
                    });
                    return res.status(httpStatus.OK).send(userMapper.map(user));
                } catch (err) {
                    throw err;
                }
            },
            delete: async (req, res) => {
                try {
                    await userService.delete({
                        id: req.params.id
                    });
                    return res
                        .status(httpStatus.OK)
                        .send({ message: 'Successfully Deleted.' });
                } catch (err) {
                    throw err;
                }
            }
        };
    }
);

router
    .get('/', api('all'))
    .post('/', api('create'))
    .get('/:id', api('get'))
    .put('/:id', api('update'))
    .delete('/:id', api('delete'));

module.exports = router;
