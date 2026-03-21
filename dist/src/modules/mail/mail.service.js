"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    config;
    transporter;
    logger = new common_1.Logger(MailService_1.name);
    from;
    constructor(config) {
        this.config = config;
        this.from = this.config.get('MAIL_FROM') ?? 'Pointage App <noreply@pointage.com>';
        this.transporter = nodemailer.createTransport({
            host: this.config.get('MAIL_HOST'),
            port: this.config.get('MAIL_PORT') ?? 587,
            secure: this.config.get('MAIL_PORT') === 465,
            auth: {
                user: this.config.get('MAIL_USER'),
                pass: this.config.get('MAIL_PASS'),
            },
        });
    }
    async sendWelcome(opts) {
        const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${opts.resetToken}`;
        await this.send({
            to: opts.to,
            subject: 'Bienvenue — Activez votre compte',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bienvenue ${opts.firstName} ${opts.lastName} !</h2>
          <p>Votre compte a été créé sur la plateforme de gestion des pointages.</p>
          <p>Pour activer votre compte, vous devez définir votre mot de passe en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #2563eb; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Définir mon mot de passe
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Ce lien est valable 24 heures. Si vous n'avez pas demandé la création de ce compte, ignorez cet email.
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      `,
        });
    }
    async sendLateNotification(opts) {
        const time = opts.checkInTime.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
        await this.send({
            to: opts.to,
            subject: `Retard enregistré — ${opts.checkInTime.toLocaleDateString('fr-FR')}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Retard enregistré</h2>
          <p>Bonjour ${opts.firstName},</p>
          <p>
            Votre pointage d'aujourd'hui a été enregistré à <strong>${time}</strong>,
            soit <strong>${opts.minutesLate} minutes de retard</strong> par rapport à l'heure prévue (09h00).
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            Si vous pensez qu'il s'agit d'une erreur, contactez votre responsable.
          </p>
        </div>
      `,
        });
    }
    async sendMonthlyReport(opts) {
        const monthName = new Date(opts.year, opts.month - 1).toLocaleString('fr-FR', {
            month: 'long',
            year: 'numeric',
        });
        const rows = opts.attendances
            .map((a) => {
            const checkIn = a.checkIn.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            });
            const checkOut = a.checkOut
                ? a.checkOut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                : '—';
            const statusColor = a.status === 'PRESENT' ? '#16a34a' : '#dc2626';
            const statusLabel = a.status === 'PRESENT' ? 'Présent' : 'Retard';
            return `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">
              ${a.date.toLocaleDateString('fr-FR')}
            </td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${checkIn}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${checkOut}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center; color: ${statusColor};">
              ${statusLabel}
            </td>
          </tr>`;
        })
            .join('');
        await this.send({
            to: opts.to,
            subject: `Rapport mensuel de pointage — ${monthName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Rapport de pointage — ${monthName}</h2>
          <p>Bonjour ${opts.firstName},</p>
          <p>Voici votre rapport de pointage pour le mois de <strong>${monthName}</strong>.</p>

          <div style="display: flex; gap: 16px; margin: 20px 0; flex-wrap: wrap;">
            ${this.statCard('Jours travaillés', `${opts.stats.workingDays}`, '#2563eb')}
            ${this.statCard('Présences', `${opts.stats.present}`, '#16a34a')}
            ${this.statCard('Retards', `${opts.stats.late}`, '#f59e0b')}
            ${this.statCard('Absences', `${opts.stats.absent}`, '#dc2626')}
            ${this.statCard('Heures totales', `${opts.stats.totalHours.toFixed(1)}h`, '#7c3aed')}
          </div>

          <h3>Détail des pointages</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Date</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Arrivée</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Départ</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Statut</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Rapport généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}.
          </p>
        </div>
      `,
        });
    }
    statCard(label, value, color) {
        return `
      <div style="background: #f9fafb; border-left: 4px solid ${color};
                  padding: 12px 16px; border-radius: 4px; min-width: 120px;">
        <div style="font-size: 22px; font-weight: bold; color: ${color};">${value}</div>
        <div style="font-size: 12px; color: #6b7280;">${label}</div>
      </div>`;
    }
    async send(opts) {
        try {
            await this.transporter.sendMail({ from: this.from, ...opts });
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${opts.to}: ${error.message}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map