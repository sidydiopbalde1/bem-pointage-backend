import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from =
      this.config.get<string>('MAIL_FROM') ??
      'Pointage App <noreply@pointage.com>';

    const port = Number(this.config.get('MAIL_PORT')) || 587;
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port,
      secure,
      requireTLS: !secure, // STARTTLS pour les ports 587/2525
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendWelcome(opts: {
    to: string;
    firstName: string;
    lastName: string;
    resetToken: string;
  }) {
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

  async sendLateNotification(opts: {
    to: string;
    firstName: string;
    checkInTime: Date;
    minutesLate: number;
  }) {
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

  async sendMonthlyReport(opts: {
    to: string;
    firstName: string;
    month: number;
    year: number;
    stats: {
      workingDays: number;
      present: number;
      late: number;
      absent: number;
      totalHours: number;
    };
    attendances: Array<{
      date: Date;
      checkIn: Date;
      checkOut: Date | null;
      status: string;
    }>;
  }) {
    const monthName = new Date(opts.year, opts.month - 1).toLocaleString(
      'fr-FR',
      {
        month: 'long',
        year: 'numeric',
      },
    );

    const rows = opts.attendances
      .map((a) => {
        const checkIn = a.checkIn.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const checkOut = a.checkOut
          ? a.checkOut.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })
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

  async sendLeaveRequestToAdmin(opts: {
    adminEmail: string;
    employeeFirstName: string;
    employeeLastName: string;
    department: string | null;
    type: string;
    startDate: Date;
    endDate: Date;
    reason: string;
  }) {
    const typeLabels: Record<string, string> = {
      ANNUAL: 'Congé annuel',
      SICK: 'Congé maladie',
      MATERNITY: 'Congé maternité',
      UNPAID: 'Congé sans solde',
      OTHER: 'Autre',
    };

    await this.send({
      to: opts.adminEmail,
      subject: `Nouvelle demande de congé — ${opts.employeeFirstName} ${opts.employeeLastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nouvelle demande de congé</h2>
          <p>Une nouvelle demande de congé a été soumise et nécessite votre validation.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Employé</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.employeeFirstName} ${opts.employeeLastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Département</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.department ?? '—'}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Type</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${typeLabels[opts.type] ?? opts.type}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Du</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.startDate.toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Au</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.endDate.toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Motif</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.reason}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 13px;">Connectez-vous à la plateforme pour traiter cette demande.</p>
        </div>
      `,
    });
  }

  async sendLeaveReviewToEmployee(opts: {
    to: string;
    firstName: string;
    type: string;
    startDate: Date;
    endDate: Date;
    status: 'APPROVED' | 'REJECTED';
  }) {
    const typeLabels: Record<string, string> = {
      ANNUAL: 'Congé annuel',
      SICK: 'Congé maladie',
      MATERNITY: 'Congé maternité',
      UNPAID: 'Congé sans solde',
      OTHER: 'Autre',
    };

    const approved = opts.status === 'APPROVED';
    const statusLabel = approved ? 'Approuvée' : 'Refusée';
    const color = approved ? '#16a34a' : '#dc2626';

    await this.send({
      to: opts.to,
      subject: `Demande de congé ${statusLabel.toLowerCase()} — ${opts.startDate.toLocaleDateString('fr-FR')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${color};">Demande de congé ${statusLabel}</h2>
          <p>Bonjour ${opts.firstName},</p>
          <p>Votre demande de congé a été <strong style="color: ${color};">${statusLabel.toLowerCase()}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Type</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${typeLabels[opts.type] ?? opts.type}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Du</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.startDate.toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Au</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">${opts.endDate.toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Statut</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb; color: ${color}; font-weight: bold;">${statusLabel}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 13px;">Connectez-vous à la plateforme pour consulter le détail.</p>
        </div>
      `,
    });
  }

  private statCard(label: string, value: string, color: string): string {
    return `
      <div style="background: #f9fafb; border-left: 4px solid ${color};
                  padding: 12px 16px; border-radius: 4px; min-width: 120px;">
        <div style="font-size: 22px; font-weight: bold; color: ${color};">${value}</div>
        <div style="font-size: 12px; color: #6b7280;">${label}</div>
      </div>`;
  }

  private async send(opts: { to: string; subject: string; html: string }) {
    try {
      const info = await this.transporter.sendMail({ from: this.from, ...opts }) as { messageId: string };
      this.logger.log(`Email sent to ${opts.to} — messageId: ${info.messageId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${opts.to}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
