
function diffKeys(a, b) {
	var keys = {};
	var key;

	for (key in a) {
		keys[key] = true;
	}
	for (key in b) {
		keys[key] = true;
	}

	var added = [];
	var removed = [];
	var kept = [];

	Object.keys(keys).sort().forEach(function(key) {
		if (key in a && key in b) {
			kept.push(key);
		} else if (key in b) {
			added.push(key);
		} else {
			removed.push(key);
		}
	});

	return {
		added: added.sort(),
		removed: removed.sort(),
		kept: kept.sort()
	};
}

function type(value) {
	var t = typeof(value);

	if (t === 'object') {
		if (value === null) {
			return 'null';
		} else if (Array.isArray(value)) {
			return 'array';
		}
	} else if (t === 'number') {
		if (isNaN(value)) {
			return 'nan';
		}
	}

	return t;
}

function diff(a, b, path) {
	var aType = type(a);
	var bType = type(b);
	var subpath = path ? path + '::' : '';
	path = path || '.';

	if (aType === bType) {
		if (aType === 'object') {
			var keys = diffKeys(a, b);
			keys.removed.forEach(function(key) {
				console.log('%s removed', subpath + key);
			});
			keys.added.forEach(function(key) {
				console.log('%s added', subpath + key);
			});
			keys.kept.forEach(function(key) {
				diff(a[key], b[key], subpath + key);
			});
		} else if (aType === 'array') {
			var aLength = a.length;
			var bLength = b.length;
			if (aLength === bLength) {
				for (var i = 0; i < aLength; i++) {
					diff(a[i], b[i], subpath + '[' + i + ']');
				}
			} else {
				console.log('%s differs in array length (%s vs. %s)', path, aLength, bLength);
			}
		} else if (a !== b) {
			console.log('%s differs in value (type: %s)', path, aType);
		}
	} else {
		console.log('%s differs in type (%s vs. %s)', path, aType, bType);
	}
}

module.exports = diff;
