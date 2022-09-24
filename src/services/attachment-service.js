import db from "../../db.js"
import { nextNoFor } from "./no-series.js"
import mime from 'mime-types'

/**
 * Sales attachment details to database 
 * @param {Express.Multer.File} multerFile
 */
export const saveAttachmentDetails = async multerFile => {
    const attachmentDetails = new AttachmentDetails(multerFile)
    const stmt = 'INSERT INTO attachments (id, filename, extension, disk_filename, mimetype, size) VALUES(?,?,?,?,?,?) RETURNING *'
    const id = await nextNoFor('attachments')
    const values = [
        id, 
        attachmentDetails.filename, 
        attachmentDetails.extension,
        attachmentDetails.disk_filename,
        attachmentDetails.mimetype,
        attachmentDetails.size
    ]
    /** @type {import("../declarations/attachment").Attachment[]} */
    const [attachment] = await db.query(conn => conn.query(stmt, values))
    console.log('inserted', attachment)
    return attachment
}

class AttachmentDetails {
    _file;
    /**
     *
     * @param {Express.Multer.File} file
     */
    constructor(file) {
        this._file = file;
    }
    get file() {
        return this._file;
    }
    get filename() {
        return this.file.originalname
    }
    get disk_filename() {
        return this.file.filename
    }

    get mimetype() {
        return mime.lookup(this.file.originalname).toString();
    }
    get extension() {
        return mime.extension(this.mimetype).toString();
    }

    get size() {
        return AttachmentDetails.humanFileSizeFor(this.file.size);
    }

    /**
     * Get human readable file size.
     * @see https://stackoverflow.com/a/20732091/10030693
     */
    static humanFileSizeFor(size) {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return ((size / Math.pow(1024, i)).toFixed(0) +
            ' ' +
            ['B', 'kB', 'MB', 'GB', 'TB'][i]);
    }
}

