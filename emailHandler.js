'use strict';
const nodemailer = require('nodemailer');
const { MAIL_SERVICE, MAIL_USER, MAIL_PASS, MAIL_PORT, MAIL_HOST } = process.env;

const transport = nodemailer.createTransport({
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});


module.exports.sendEmail = async (event) => {

    if (event.httpMethod === "POST" && event.body) {
        let json = JSON.parse(event.body)

        const { toEmail, subject, content } = json

        var mailOptions = {
            from: "nazimfilzer@gmail.com",
            to: toEmail,
            subject: subject,
            html: content,
        };

        let info = await transport.sendMail(mailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: 'Email sent: ' + info.response,
                    data: {
                        messageId: info.messageId,
                        previewURL: nodemailer.getTestMessageUrl(info)
                    },
                }, null, 2),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            }
        };

    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
