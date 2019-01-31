const config = require("../config");
const models = require("../models");

const app = config.app;
const MailAddress = models.mailAddress.MailAddress;

function _getWhereParamsFromRequest(request) {
    const personId = request.params.personId;
    const mailId = request.params.mailAddress;

    const body = {
        where: {
            PersonId: personId
        }
    };

    if (mailId) {
        body["where"]["id"] = mailId;
    }

    return body;
}

module.exports.listEmails = function (request, response, next) {
    app.query(
        next,
        MailAddress.findAll(_getWhereParamsFromRequest(request)),
        addresses => {
            response.json(addresses);
        }
    );
};

module.exports.addNewEmail = function (request, response, next) {
    const personId = request.params.personId;

    const emailAddress = request.body.address;
    const emailType = request.body.type;

    if (!(emailAddress && emailType)) {
        next({
            status: 400,
            message: "Missing field(s)."
        })
    }
    else {
        app.query(
            next,
            MailAddress.create({
                PersonId: personId,
                address: emailAddress,
                type: emailType
            }),
            addresses => {
                response.json(addresses);
            }
        );
    }
};

module.exports.getEmail = function (request, response, next) {
    app.query(
        next,
        MailAddress.findOne(_getWhereParamsFromRequest(request)),
        emailData => {
            if (!emailData) {
                app.throwNotFound(next);
            }
            else {
                response.json(emailData);
            }
        });
};

module.exports.updateEmail = function (request, response, next) {
    app.query(
        next,
        MailAddress.update(request.body, _getWhereParamsFromRequest(request)),
        emailData => {
            if (!(emailData && emailData[0])) {
                app.throwNotFound(next);
            }
            else {
                response.status("204").send("");
            }
        });
};

module.exports.deleteEmail = function (request, response, next) {
    app.query(
        next,
        MailAddress.destroy(_getWhereParamsFromRequest(request)),
        emailData => {
            if (!emailData) {
                app.throwNotFound(next);
            }
            else {
                response.status("204").send("");
            }
        });
};
