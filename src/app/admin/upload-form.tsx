"use client";
// Type for uploaded image metadata
type AdminImageMeta = {
  section: 'gallery' | 'slider';
  category: 'exterior' | 'interior' | 'before-after' | 'ceramic' | 'wheels';
  title: string;
  description: string;
  tags: string[] | string;
  beforeImage: string;
  afterImage?: string;
};
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminUploadForm() {
  const [section, setSection] = useState<'gallery' | 'slider'>('gallery');
  const [category, setCategory] = useState<'exterior' | 'interior' | 'before-after' | 'ceramic' | 'wheels'>('exterior');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<AdminImageMeta[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      const res = await fetch('/uploads/metadata.json');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
      setLoadingImages(false);
    };
    fetchImages();
  }, [message]);

  const handleDelete = async (idx: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: idx }),
    });
    if (res.ok) {
      setMessage('Image deleted successfully!');
      setEditIndex(null);
    } else {
      setMessage('Failed to delete image.');
    }
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    const img = images[idx];
    setSection(img.section);
    setCategory(img.category || 'exterior');
    setTitle(img.title);
    setDescription(img.description);
    setTags(Array.isArray(img.tags) ? img.tags.join(', ') : img.tags);
    setBeforeImage(null);
    setAfterImage(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex === null) return;
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('index', String(editIndex));
    formData.append('section', section);
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    if (beforeImage) formData.append('beforeImage', beforeImage);
    if (afterImage) formData.append('afterImage', afterImage);
    const res = await fetch('/api/admin/edit', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setMessage('Image updated successfully!');
      setEditIndex(null);
      setTitle('');
      setDescription('');
      setTags('');
      setBeforeImage(null);
      setAfterImage(null);
      setCategory('exterior');
    } else {
      setMessage('Failed to update image.');
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'before') setBeforeImage(e.target.files[0]);
      else setAfterImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImage) {
      setMessage('Before image is required.');
      return;
    }
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('section', section);
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('beforeImage', beforeImage);
    if (afterImage) formData.append('afterImage', afterImage);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setMessage('Upload successful!');
      setTitle('');
      setDescription('');
      setTags('');
      setBeforeImage(null);
      setAfterImage(null);
      setCategory('exterior');
    } else {
      setMessage('Upload failed.');
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center px-2 py-8">
      {/* Navigation Bar */}
      <nav className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Image Upload</h1>
        <Link href="/">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all">Back to Home</button>
        </Link>
      </nav>

      {/* Card Layout */}
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-white/10">
        <form onSubmit={editIndex === null ? handleSubmit : handleSaveEdit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-white">Section</label>
              <select value={section} onChange={e => setSection(e.target.value as 'gallery' | 'slider')} className="w-full border border-blue-400 rounded px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500">
                <option value="gallery">Gallery</option>
                <option value="slider">SliderSection</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-white">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as 'exterior' | 'interior' | 'before-after' | 'ceramic' | 'wheels')} className="w-full border border-blue-400 rounded px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500">
                <option value="exterior">Exterior</option>
                <option value="interior">Interior</option>
                <option value="before-after">Before/After</option>
                <option value="ceramic">Ceramic Coating</option>
                <option value="wheels">Wheels & Tires</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-white">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-blue-400 rounded px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-white">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-blue-400 rounded px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 min-h-[60px]" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-white">Tags (comma separated)</label>
              <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full border border-blue-400 rounded px-3 py-2 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. exterior, transformation, sedan" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-white">Before Image</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'before')} required className="w-full text-white" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-white">After Image (optional)</label>
              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'after')} className="w-full text-white" />
            </div>
          </div>
          <button type="submit" disabled={uploading || (editIndex === null && !beforeImage)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-full shadow-lg transition-all mt-4">
            {uploading ? 'Uploading...' : editIndex === null ? 'Upload' : 'Save Changes'}
          </button>
          {editIndex !== null && (
            <button type="button" onClick={() => { setEditIndex(null); setTitle(''); setDescription(''); setTags(''); setBeforeImage(null); setAfterImage(null); setSection('gallery'); }} className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-full shadow-lg transition-all">Cancel Edit</button>
          )}
        </form>
        {message && (
          <div className={`mt-6 text-center font-semibold ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
        )}
      </div>
      {/* Uploaded Images List */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-xl font-bold text-white mb-4">Uploaded Images</h2>
        {loadingImages ? (
          <div className="text-white">Loading...</div>
        ) : images.length === 0 ? (
          <div className="text-white">No images uploaded yet.</div>
        ) : (
          <div className="space-y-4">
            {images.map((img, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.beforeImage} alt={img.title} className="w-24 h-24 object-cover rounded shadow" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{img.title}</div>
                  <div className="text-white text-sm">{img.description}</div>
                  <div className="text-white text-xs">Tags: {Array.isArray(img.tags) ? img.tags.join(', ') : img.tags}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(idx)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(idx)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


