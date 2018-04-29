import ACTIONS from '.'
import {stringify, stringifyVtt} from 'subtitle'

import request from 'superagent'

/* Export action creator to player */
export {jumpToChunk} from './editor'

const UPLOAD_URL = "http://localhost:3008/upload"
const FILENAME = 'videoFile'

export const volume = (offset) => {
    return {
        type: ACTIONS.VOLUME,
        payload: offset
    }
}

export const endVolume = () => {
    return {
        type: ACTIONS.END_VOLUME
    }
}

export const startVolume = (origin) => {
    return {
        type: ACTIONS.START_VOLUME
    }
}

export const playerUpdate = (playerState) => {
    return {
        type: ACTIONS.PLAYER_UPDATE,
        payload: playerState
    }
}

export const newUpload = () => {
    return {
        type: ACTIONS.NEW_UPLOAD 
    }
}  

export const startUpload = () => {
    return {
        type: ACTIONS.START_UPLOAD
    }
}

export const upload = (percent) => {
	return {
		type: ACTIONS.UPLOAD,
		payload: percent
	}
}

export const endUpload = () => {
	return {
		type: ACTIONS.END_UPLOAD
	}
}

/* NOTE: THIS FUNCTION DISPATCHES
   SERVER-GENERATED ACTIONS */
export const uploadVideo = (videoFile) => {
    return (dispatch, getState) => {
		dispatch(startUpload())
		request
			.post(UPLOAD_URL)
			.attach(FILENAME, videoFile)
			.on('progress', (e) => {
				dispatch(upload(e.percent))
			})
			.then((res, err) => {
				dispatch(endUpload())
				dispatch(res.body)
			})
    }
}

export const exportSRT = () => {
    return (dispatch, getState) => {
        var string = stringify(
            getState().editor.chunks.map((chunk, index) => {
                return {
                    start: chunk.start,
                    end: chunk.end,
                    text: chunk.inputText
                }
            }))

		var blob = new Blob([string]);
		var a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
		a.download = "/filename.srt";
		document.body.appendChild(a);
		a.click(); 
		document.body.removeChild(a);
    }
}
