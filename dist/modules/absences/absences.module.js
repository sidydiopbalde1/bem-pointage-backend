"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsencesModule = void 0;
const common_1 = require("@nestjs/common");
const absences_service_1 = require("./absences.service");
const absences_controller_1 = require("./absences.controller");
const cloudinary_service_1 = require("./cloudinary.service");
const absence_scheduler_service_1 = require("./absence-scheduler.service");
const holidays_module_1 = require("../holidays/holidays.module");
let AbsencesModule = class AbsencesModule {
};
exports.AbsencesModule = AbsencesModule;
exports.AbsencesModule = AbsencesModule = __decorate([
    (0, common_1.Module)({
        imports: [holidays_module_1.HolidaysModule],
        providers: [absences_service_1.AbsencesService, cloudinary_service_1.CloudinaryService, absence_scheduler_service_1.AbsenceSchedulerService],
        controllers: [absences_controller_1.AbsencesController],
    })
], AbsencesModule);
//# sourceMappingURL=absences.module.js.map