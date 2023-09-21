const otpMessage = (otp) => {
  const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP</title>
    </head>
    <body>
    <div>
        <div><h1>Your One Time Password [OTP] is : <span style = {color = 'red';}><b>${otp}</b></span></h1></div>
        <p><h5>This OTP is only valid for 5 minutes. Kindly enter this OTP to continue with your Login Process.</h5></p>
        <br/>
        <br/>
        <div>If this was not you, Someone might have accidentally entered your e-mail address. In case of concerns immediately reach out to ZeroTwo Customer Support. </div>
        </div>
    </body>
    </html>`;
  return message;
};

module.exports = otpMessage;
