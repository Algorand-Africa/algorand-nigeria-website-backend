export const emailVerificationHTMLTemplate = (
  verificationLink: string,
  name: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Email Verification</title>
        </head>
        <body>
            <h1>Email Verification</h1>
            <p>Hello ${name},</p>
            <p>Please click the link below to verify your email</p>
            <a href="${verificationLink}">Verify Email</a>
        </body>
    </html>
    `;
};

export const passwordResetHTMLTemplate = (resetLink: string, name: string) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Password Reset</title>
        </head>
        <body>
            <h1>Password Reset</h1>
            <p>Hello ${name},</p>
            <p>Please click the link below to reset your password</p>
            <a href="${resetLink}">Reset Password</a>
        </body>
    </html>
    `;
};
