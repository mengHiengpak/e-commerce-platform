import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useQuery } from '../../hook/useQuery';
import { useCollection } from '../../hook/useCollection';
import { useStorage } from '../../hook/useStorege';
import { useFindById } from '../../hook/useFindById';
import { apiUrlBase } from '../../config/env';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [note, setNote] = useState("");
    const [currentstock, setCurrentStock] = useState("");

    const { data: categories } = useQuery("categories");
    const { uploadFile } = useStorage();
    const [isLoading, , updates] = useCollection('product');
    const { data: result, isLoading: isFinding } = useFindById('product', id);

    // Sync form state when product data loads
    useEffect(() => {
        if (result) {
            setName(result?.doc?.name || "");
            setCategory(result?.doc?.category || "");
            setCostPrice(result?.doc?.costPrice || "");
            setSalePrice(result?.doc?.salePrice || "");
            setNote(result?.doc?.note || "");
            setCurrentStock(result?.doc?.currentstock ?? "");

            if (result?.doc?.imageUrl) {
                setImage(result?.doc?.imageUrl);
                // Adjust endpoint URL as per your API server setup
                setPreview(`${apiUrlBase}/uploads/${result?.doc?.imageUrl}`);
            }
        }
    }, [result]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let uploadResult = null;

        // Upload new image if a File object was selected
        if (image && typeof image !== 'string') {
            uploadResult = await uploadFile(image);
            if (!uploadResult?.filename) {
                toast.error("Image upload failed. Please try again.");
                return;
            }
        }

        // Determine final image URL value
        const imageUrl = typeof image === 'string'
            ? image
            : (uploadResult?.filename || "");

        const res = await updates(id, {
            name,
            category,
            salePrice: Number(salePrice),
            costPrice: Number(costPrice),
            currentstock: Number(currentstock),
            imageUrl,
            note,
        });

        if (res) {
            toast.success("Updated product successfully!");
            navigate("/products");
        }
    };

    if (isFinding) {
        return <div className="p-4 text-center">Loading product details...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Left Section: Form Inputs */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name*</label>
                        <input
                            id="name"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="input input-bordered w-full"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="category" className="block text-sm font-medium mb-1">Category*</label>
                        <select
                            id="category"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            className="select select-bordered w-full"
                            required
                        >
                            <option value="" disabled>Choose Category</option>
                            {(Array.isArray(categories) ? categories : []).map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="costPrice" className="block text-sm font-medium mb-1">Cost Price*</label>
                        <input
                            id="costPrice"
                            type="number"
                            onChange={(e) => setCostPrice(e.target.value)}
                            value={costPrice}
                            className="input input-bordered w-full"
                            placeholder="Enter cost price"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="salePrice" className="block text-sm font-medium mb-1">Sale Price*</label>
                        <input
                            id="salePrice"
                            type="number"
                            onChange={(e) => setSalePrice(e.target.value)}
                            value={salePrice}
                            className="input input-bordered w-full"
                            placeholder="Enter sale price"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="currentstock" className="block text-sm font-medium mb-1">Current Stock*</label>
                        <input
                            id="currentstock"
                            type="number"
                            onChange={(e) => setCurrentStock(e.target.value)}
                            value={currentstock}
                            className="input input-bordered w-full"
                            placeholder="Enter current stock"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="note" className="block text-sm font-medium mb-1">Note</label>
                        <input
                            id="note"
                            type="text"
                            onChange={(e) => setNote(e.target.value)}
                            value={note}
                            className="input input-bordered w-full"
                            placeholder="Enter product note"
                        />
                    </div>
                </div>

                {/* Right Section: Image Preview */}
                <div className="bg-white p-4 rounded-md shadow-sm">
                    {preview ? (
                        <div className="relative w-full h-50 sm:h-75">
                            <img
                                src={preview}
                                alt="Product Preview"
                                className="rounded-lg shadow object-cover w-full h-full"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-error hover:bg-error/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-50 sm:h-75 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                            <span className="text-gray-500 text-sm">Click to upload an image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}

                    {image && typeof image !== 'string' && (
                        <div className="text-center mt-2">
                            <p className="text-xs text-gray-600 truncate">{image.name}</p>
                        </div>
                    )}
                </div>

                {/* Action Controls */}
                <div className="mb-3 flex items-center justify-end gap-4 col-span-2">
                    <Link to="/products" className="btn btn-ghost">
                        Back
                    </Link>
                    <button type="submit" className="btn btn-neutral" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProduct;