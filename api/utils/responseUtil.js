const ResponseUtil = {};

ResponseUtil.sendSuccess = (res, object) => {
    res.status(200).send({
		message: 'Success',
		data: object,
    });
};
  
ResponseUtil.sendError = (res, error) => {
	res.status(500).send({
		message: 'Error',
		error: error.errors ? error.errors[0].message : error.message,
	});
};

ResponseUtil.sendWarning = (res, message) => {
	res.status(400).send({
		message: message,
    });
};

ResponseUtil.render = (res, page) => {
	res.status(200).send(page);
}

module.exports = ResponseUtil;