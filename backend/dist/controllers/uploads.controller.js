"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const cloudinary_1 = require("../services/cloudinary");
async function uploadFile(req, res) {
    try {
        const file = req.file;
        const { dataUrl } = req.body;
        if (!file && !dataUrl) {
            return res.status(400).json({ success: false, error: 'No file provided' });
        }
        let uploadRes;
        if (file) {
            // Handle multer file upload
            const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            uploadRes = await cloudinary_1.cloudinary.uploader.upload(base64String, {
                folder: 'peve/projects',
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto'
            });
        }
        else {
            // Handle data URL upload
            uploadRes = await cloudinary_1.cloudinary.uploader.upload(dataUrl, {
                folder: 'peve/projects',
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto'
            });
        }
        return res.json({
            success: true,
            data: {
                url: uploadRes.secure_url,
                publicId: uploadRes.public_id,
                format: uploadRes.format,
                bytes: uploadRes.bytes
            }
        });
    }
    catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
