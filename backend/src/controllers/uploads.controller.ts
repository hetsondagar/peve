import { Request, Response } from 'express';
import { cloudinary } from '../services/cloudinary';

export async function uploadFile(req: Request, res: Response) {
  const { file, dataUrl } = req.body as any;
  try {
    const uploadRes = await cloudinary.uploader.upload(dataUrl || file, {
      folder: 'peve/uploads',
      resource_type: 'auto',
    });
    return res.json({ success: true, data: { url: uploadRes.secure_url, publicId: uploadRes.public_id, format: uploadRes.format, bytes: uploadRes.bytes } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}


