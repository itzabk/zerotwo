const resetMessage = () => {
  const message = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>OTP</title>
      </head>
      <body>
      <div>
          <div><h1 style = {color:'red'}>Your Password has been reset </h1></div>
          <p><h3>This mail is to inform you that your password with ZeroTwo has been reset.</h3></p>
          <br/>
          <div>If this was not you, report to Customer care immediately without further delay to secure your account!. </div>
          </div>
      </body>
      </html>`;
  return message;
};

module.exports = resetMessage;
