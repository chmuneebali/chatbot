class Controllers {
    static successResponse(res, message, status, code, data = null) {
        return res.status(code).json({ message, status, code, data });
    }

    static errorResponse(res, message, status, code, exception = null) {
        return res.status(code).json({ message, status, code, exception });
    }
}

module.exports = Controllers;
