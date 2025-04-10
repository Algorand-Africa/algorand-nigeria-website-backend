export const emailVerificationHTMLTemplate = (
  verificationLink: string,
  name: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Email Verification</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #f9f9f9; border-radius: 5px; padding: 20px; }
                .logo { text-align: center; margin-top: 20px; }
                .button { display: inline-block; padding: 10px 20px; background-color: #2D2DF1; color: #FFFFFF; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">   
                <h1>Email Verification</h1>
                <p>Hello ${name},</p>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <p><a href="${verificationLink}" class="button">Verify Email</a></p>
                <div class="footer">
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
                <div class="logo">
                    <img src="https://res.cloudinary.com/dy7olyvi0/image/upload/v1744284302/algorand-nigeria-logo-black-CMYK_2_o7sqfj.png" alt="Logo" width="200">
                </div>
            </div>
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
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #f9f9f9; border-radius: 5px; padding: 20px; }
                .logo { text-align: center; margin-top: 20px; }
                .button { display: inline-block; padding: 10px 20px; background-color: #2D2DF1; color: #FFFFFF; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset</h1>
                <p>Hello ${name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <p><a href="${resetLink}" class="button">Reset Password</a></p>
                <div class="footer">
                    <p>If you didn't request this password reset, please ignore this email.</p>
                </div>
                <div class="logo">
                    <img src="https://res.cloudinary.com/dy7olyvi0/image/upload/v1744284302/algorand-nigeria-logo-black-CMYK_2_o7sqfj.png" alt="Logo" width="200">
                </div>
            </div>
        </body>
    </html>
    `;
};

export const eventRSVPHTMLTemplate = (eventName: string, eventLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Event Registration Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #f9f9f9; border-radius: 5px; padding: 20px; }
                .logo { text-align: center; margin-top: 20px; }
                .button { display: inline-block; padding: 10px 20px; background-color: #2D2DF1; color: #FFFFFF; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Thank You for Your Interest!</h1>
                <p>Hello,</p>
                <p>Thank you for your interest in attending "${eventName}". To secure your spot, please click the button below to complete your registration:</p>
                <p><a href="${eventLink}" class="button">Reserve Your Spot</a></p>
                <p>Please note that registration is on a first-come, first-served basis.</p>
                <div class="footer">
                    <p>If you did not sign up for this event, please ignore this email.</p>
                </div>
                <div class="logo">
                    <img src="https://res.cloudinary.com/dy7olyvi0/image/upload/v1744284302/algorand-nigeria-logo-black-CMYK_2_o7sqfj.png" alt="Logo" width="200">
                </div>
            </div>
        </body>
    </html>
    `;
};

export const eventRSVPUpdateHTMLTemplate = (
  eventName: string,
  newEventLink: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Event Registration Update</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #f9f9f9; border-radius: 5px; padding: 20px; }
                .logo { text-align: center; margin-top: 20px; }
                .button { display: inline-block; padding: 10px 20px; background-color: #2D2DF1; color: #FFFFFF; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Important Event Update</h1>
                <p>Hello,</p>
                <p>There has been an update to the registration link for "${eventName}". To ensure your spot at the event, please use the updated registration link below:</p>
                <p><a href="${newEventLink}" class="button">Updated Registration Link</a></p>
                <p>Please complete your registration using this new link as soon as possible to maintain your spot.</p>
                <div class="footer">
                    <p>If you no longer wish to attend this event, you can ignore this email.</p>
                </div>
                <div class="logo">
                    <img src="https://res.cloudinary.com/dy7olyvi0/image/upload/v1744284302/algorand-nigeria-logo-black-CMYK_2_o7sqfj.png" alt="Logo" width="200">
                </div>
            </div>
        </body>
    </html>
    `;
};
