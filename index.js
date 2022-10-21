var through = require('through2')
var gutt = require('gutt')
var PluginError = require('plugin-error')

module.exports = function gulpGutt (params) {
	if (typeof params === 'function') params = {
		stringifier: params
	}

	if (typeof params.showError === 'undefined') params.showError = true

	return through.obj(function (file, enc, next) {
		var template

		try {
			template = gutt.parseFile(file.path, params.cwd, params).stringifyWith(params.stringifier)
		} catch (e) {
			if (params.showError) {
				return next(new PluginError('gulp-gutt', e.message))
			}

			return next()
		}
		
		if (typeof params.handler === 'function') {
			try {
				template = params.handler(template, file.path, params.cwd)
			} catch (e) {
				if (params.showError) {
					return next(new PluginError('gulp-gutt', e.message))
				}

				return next()
			}
		}
		
		file.contents = new Buffer(template)
		this.push(file)
		next()
	})
}
