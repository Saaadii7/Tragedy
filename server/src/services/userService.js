class UserService {
    constructor({ models, user }) {
        this.user = user;
        this.models = models;
    }
    async all() {
        return await this.models.user.findAll();
    }
    async create(obj) {
        return await this.models.user.create(obj);
    }
    async find(id) {
        return await this.models.user.byId(id);
    }
}
module.exports = UserService;
