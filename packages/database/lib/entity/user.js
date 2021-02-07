"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiUser = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("./base/UserEntity");
let MiUser = class MiUser extends UserEntity_1.UserEntity {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MiUser.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MiUser.prototype, "discriminator", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MiUser.prototype, "avatarUrl", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], MiUser.prototype, "lastUpdate", void 0);
MiUser = __decorate([
    typeorm_1.Entity({ name: 'users' })
], MiUser);
exports.MiUser = MiUser;
//# sourceMappingURL=User.js.map