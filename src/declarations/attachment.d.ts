import { Multer } from "multer";

type SaveAttachmentDetailsRequest = Express.Multer.File & {
    
}

interface Attachment {
    id: string;
    filename: string;
    extension: string;
    disk_filename: string;
    mimetype: string;
    size: string;
    created_at: string;
}