const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const auth = require('../verifyToken');
const Op = require('sequelize').Op;

// router.get('/', auth.optional, function(req, res, next) {
//     return res.json([]);
// });

const api = makeInvoker(({ userService, userMapper, httpStatus }) => {
    return {
        index: async (req, res) => {
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
        }
    };
});

router.get('/', auth.optional, api('index'));
module.exports = router;
