
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            if (files[0].type.startsWith('image/')) {
                onImageUpload(files[0]);
            } else {
                alert('Please upload a valid image file.');
            }
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, [onImageUpload]);

    return (
        <div className="w-full">
            <label
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging ? 'border-yellow-500 bg-yellow-50' : 'border-amber-300 bg-amber-50/50 hover:bg-amber-50'}`}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-amber-700">
                        <UploadIcon />
                        <p className="mb-2 text-lg"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-sm">PNG, JPG, GIF or WEBP</p>
                    </div>
                )}
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files)}
                />
            </label>
        </div>
    );
};
