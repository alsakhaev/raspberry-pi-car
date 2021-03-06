import { trace } from './common';

// Copied from AppRTC's sdputils.js:

export function forceChosenVideoCodec(sdp: string, codec: string) {
	return maybePreferCodec(sdp, 'video', 'send', codec);
}

export function forceChosenAudioCodec(sdp: string, codec: string) {
	return maybePreferCodec(sdp, 'audio', 'send', codec);
}


// Sets |codec| as the default |type| codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
export function maybePreferCodec(sdp: string, type: string, dir: string, codec: string) {
	var str = type + ' ' + dir + ' codec';
	if (codec === '') {
		trace('No preference on ' + str + '.');
		return sdp;
	}

	trace('Prefer ' + str + ': ' + codec);	// kclyu

	var sdpLines = sdp.split('\r\n');

	// Search for m line.
	var mLineIndex = findLine(sdpLines, 'm=', type);
	if (mLineIndex === null) {
		trace('* not found error: ' + str + ': ' + codec);	// kclyu
		return sdp;
	}

	// If the codec is available, set it as the default in m line.
	var codecIndex = findLine(sdpLines, 'a=rtpmap', codec);
	trace('mLineIndex Line: ' + sdpLines[mLineIndex]);
	trace('found Prefered Codec in : ' + codecIndex + ': ' + sdpLines[codecIndex]);
	trace('codecIndex', codecIndex);
	if (codecIndex) {
		var payload = getCodecPayloadType(sdpLines[codecIndex]);
		if (payload) {
			sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
			//sdpLines[mLineIndex] = setDefaultCodecAndRemoveOthers(sdpLines, sdpLines[mLineIndex], payload);
		}
	}

	// delete id 100(VP8) and 101(VP8)

	trace('** Modified LineIndex Line: ' + sdpLines[mLineIndex]);
	sdp = sdpLines.join('\r\n');
	return sdp;
}

// Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).
export function findLine(sdpLines: any, prefix: any, substr: any) {
	return findLineInRange(sdpLines, 0, -1, prefix, substr);
}

// Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).
export function findLineInRange(sdpLines: any, startLine: any, endLine: any, prefix: any, substr: any) {
	var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
	for (var i = startLine; i < realEndLine; ++i) {
		if (sdpLines[i].indexOf(prefix) === 0) {
			if (!substr ||
				sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
				return i;
			}
		}
	}
	return null;
}

// Gets the codec payload type from an a=rtpmap:X line.
export function getCodecPayloadType(sdpLine: any) {
	var pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
	var result = sdpLine.match(pattern);
	return (result && result.length === 2) ? result[1] : null;
}

// Returns a new m= line with the specified codec as the first one.
export function setDefaultCodec(mLine: any, payload: any) {
	var elements = mLine.split(' ');

	// Just copy the first three parameters; codec order starts on fourth.
	var newLine = elements.slice(0, 3);

	// Put target payload first and copy in the rest.
	newLine.push(payload);
	for (var i = 3; i < elements.length; i++) {
		if (elements[i] !== payload) {
			newLine.push(elements[i]);
		}
	}
	return newLine.join(' ');
}


export function setDefaultCodecAndRemoveOthers(sdpLines: any, mLine: any, payload: any) {
	var elements = mLine.split(' ');

	// Just copy the first three parameters; codec order starts on fourth.
	var newLine = elements.slice(0, 3);

	// Put target payload first and copy in the rest.
	newLine.push(payload);
	for (var i = 3; i < elements.length; i++) {
		if (elements[i] !== payload) {

			//  continue to remove all matching lines
			for (var line_removed = true; line_removed;) {
				line_removed = RemoveLineInRange(sdpLines, 0, -1, "a=rtpmap", elements[i]);
			}
			//  continue to remove all matching lines
			for (var line_removed = true; line_removed;) {
				line_removed = RemoveLineInRange(sdpLines, 0, -1, "a=rtcp-fb", elements[i]);
			}
		}
	}
	return newLine.join(' ');
}

export function RemoveLineInRange(sdpLines: any, startLine: any, endLine: any, prefix: any, substr: any) {
	var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
	for (var i = startLine; i < realEndLine; ++i) {
		if (sdpLines[i].indexOf(prefix) === 0) {
			if (!substr ||
				sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
				var str = "Deleting(index: " + i + ") : " + sdpLines[i];
				trace(str);
				sdpLines.splice(i, 1);
				return true;
			}
		}
	}
	return false;
}

