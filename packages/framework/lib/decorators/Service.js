"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const metadata_1 = require("../metadata");
function Service(ExplicitService) {
    return (target, key) => {
        const ImplicitService = Reflect.getMetadata('design:type', target, key);
        if (!ImplicitService && !ExplicitService) {
            throw new Error(`${target.constructor.name}:${key.toString()} needs to have an explicitly defined type`);
        }
        const ServiceClass = ExplicitService || ImplicitService;
        if (!metadata_1.metaStorage.services.has(ServiceClass)) {
            metadata_1.metaStorage.services.set(ServiceClass, new ServiceClass());
        }
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get() { return metadata_1.metaStorage.caches.get(ServiceClass); }
        });
    };
}
exports.Service = Service;
//# sourceMappingURL=Service.js.map