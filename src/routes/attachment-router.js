import express from 'express'
import multer from 'multer'
import http from '@passioncloud/http'
import fs from 'fs'
import path from 'path'
import { query, body,  } from 'express-validator'
import { expressValidatorHandler } from './router-utils.js'
import { saveAttachmentDetails } from '../services/attachment-service.js'

const attachment = multer({ dest: './attachments' })

const attachmentRouter = express.Router()

attachmentRouter.post('/',
    attachment.single('uploaded_file'),
    async function uploadFileToServer(req, res, next) {
        try {
            if(!req.file?.filename) {
                throw Error('Uploaded file not received')
            }
            const attachment = await saveAttachmentDetails(req.file)
            res.status(http.statusCodes.CREATED).json(attachment)
        } catch (e) { next(e) }
    })

attachmentRouter.get('/',
    query('filename').isLength({ min: 1 }),
    expressValidatorHandler,
    async function downloadFileFromServer(req, res, next) {
        try {
            const filename = req.query.filename
            confirmExists(filename)
            res.set('Content-Disposition', `attachment; filename="${filename}"`)
            await downloadFile(filename, res)
            res.status(http.statusCodes.OK).end()
        } catch (e) {
            console.log(e)
            next(e)
        }
    })

function confirmExists(filename) {
    let filepath = path.join('./attachments', filename)
    if (!fs.existsSync(filepath)) {
        throw Error(`File with filename ${filename} does not exist on the server`)
    }
}

async function downloadFile(filename, writeStream) {
    let filepath = path.join('./attachments', filename)
    return new Promise((res, rej) => {
        const readStream = fs.createReadStream(filepath)
        readStream.on('error', rej)
        readStream.pipe(writeStream)
        readStream.on('end', res)
    });
}

export default attachmentRouter

