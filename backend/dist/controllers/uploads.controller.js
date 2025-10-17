"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
const cloudinary_1 = require("../services/cloudinary");
async function uploadFile(req, res) {
    const { file, dataUrl } = req.body;
    try {
        const uploadRes = await cloudinary_1.cloudinary.uploader.upload(dataUrl || file, {
            folder: 'peve/uploads',
            resource_type: 'auto',
        });
        return res.json({ success: true, data: { url: uploadRes.secure_url, publicId: uploadRes.public_id, format: uploadRes.format, bytes: uploadRes.bytes } });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
