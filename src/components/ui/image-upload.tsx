
import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  initialValue?: string;
  onChange: (image: string, file?: File) => void;
  label?: string;
}

const ImageUpload = ({ initialValue, onChange, label = 'Gambar' }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result, selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFile(null);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-2 px-4 w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          <span>Pilih Gambar</span>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {preview && (
        <div className="mt-2 border rounded p-2 flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-500"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Hapus Gambar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
