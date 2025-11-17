import { EventEmitter } from 'events';
import { sendEmail } from '../services/email/email.service';
import { emailTemplate } from '../services/email/send.temp';
import { OtpEnumType } from 'src/common/enums';
export const eventEmitter = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
eventEmitter.on(OtpEnumType.CONFIRM_EMAIL, async (data) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, otp } = data;
  await sendEmail({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    to: email,
    subject: OtpEnumType.CONFIRM_EMAIL,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    html: emailTemplate(otp, OtpEnumType.CONFIRM_EMAIL),
  });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
eventEmitter.on(OtpEnumType.FORGET_PASSWORD, async (data) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, otp } = data;
  await sendEmail({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    to: email,
    subject: OtpEnumType.FORGET_PASSWORD,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    html: emailTemplate(otp, OtpEnumType.FORGET_PASSWORD),
  });
});
