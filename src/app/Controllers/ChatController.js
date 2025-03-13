const controller = require('./Controller');
class ChatController {
    static get(req, res) {
        controller.successResponse(res,'Hello World!',true,200,[
            'd',
            'dfad'
        ]);
    }
}
module.exports = ChatController;