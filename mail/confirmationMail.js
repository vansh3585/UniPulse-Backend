const confirmationMail = (instructorName, EventName,Description,DeadlineDate,RegistrationLink,Tag) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Event Confirmation Email</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
    <div class="container">
        <div class="message">Event Registration Confirmation</div>
        <div class="body">
            <p>Dear ${instructorName},</p>
            <p>You have successfully created the event <span class="highlight">"${EventName}"</span>. We are excited to have you on board!</p>

            <!-- Event Details -->
            <div class="event-details">
                <p><strong>Event Name:</strong> ${EventName}</p>
                <p><strong>Description:</strong> ${Description}</p>
                <p><strong>Deadline Date:</strong> ${DeadlineDate}</p>
                <p><strong>Registration Link:</strong> <a href="${RegistrationLink}" target="_blank">${RegistrationLink}</a></p>
                <p><strong>Tag:</strong> ${Tag}</p>
            </div>

            <p>Please log in to your Instructor dashboard to edit if you think you made an error or if this is not you.</p>
        </div>
        <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                href="mailto:campusBuzz@gmail.com">campusBuzz@gmail.com</a>. We are here to help!</div>
    </div>
</body>

    
    </html>`;
  };

  module.exports = confirmationMail