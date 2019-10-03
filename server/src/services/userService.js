class UserService {
    constructor({ models, user, httpStatus }) {
        this.user = user;
        this.models = models;
        this.httpStatus = httpStatus;
    }
    async all(query = {}, offset = 0, limit = 20) {
        try {
            return await this.models.user.findAll({
                limit,
                offset: offset * (limit + 1),
                where: query
            });
        } catch (err) {
            return {
                error: this.httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Please contact Administration'
            };
        }
    }
    async create(obj = {}) {
        try {
            let user = await this.models.user.create(obj);
            return { user, message: 'Added Successfully' };
        } catch (err) {
            throw err;
        }
    }
    async findById(id) {
        try {
            return await this.models.user.byId(id);
        } catch (err) {
            throw err;
        }
    }
    async findByQuery(query = {}, single = true) {
        return single
            ? await this.models.user.findOne({ where: query })
            : await this.models.user.find({ where: query });
    }
    async update(obj = {}, query = {}) {
        try {
            let updated = await this.models.user.update(obj, {
                where: query,
                validate: true,
                sideEffects: true,
                paranoid: true,
                returning: true
            });
            if (!updated[1][0]) {
                throw new Error('User not found.');
            }
            return updated[1][0];
        } catch (err) {
            throw err;
        }
    }
    async delete(query = {}) {
        try {
            let result = await this.models.user.destroy({ where: query });
            if (!result) {
                throw new Error('User not found');
            }
        } catch (err) {
            throw err;
        }
    }
}
module.exports = UserService;
