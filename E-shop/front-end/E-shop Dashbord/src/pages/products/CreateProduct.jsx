import React, { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useQuery } from "../../hook/useQuery";
import { useCollection } from "../../hook/useCollection";
import { useStorage } from "../../hook/useStorege";

function CreateProduct() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data: categories } = useQuery("categories");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [note, setNote] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  const { uploadFile } = useStorage();
  const [isLoading, create] = useCollection("product");

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
    if (image) {
      uploadResult = await uploadFile(image);
    }

    if (image && !uploadResult?.filename) {
      toast.error("Image upload failed. Please try again.");
      return;
    }

    try {
      await create({
        name,
        category,
        salePrice,
        costPrice,
        imageUrl: uploadResult?.filename || "",
        currentStock,
        note,
      });

      setName("");
      setCategory("");
      setCostPrice("");
      setSalePrice("");
      setNote("");
      setCurrentStock("");
      setImage(null);
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Create new product</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
      >
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name*
            </label>
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
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category*
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              id="category"
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Choose Category
              </option>
              {(Array.isArray(categories) ? categories : []).map((item) => (
                <option key={item._id || Math.random()} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="costPrice"
              className="block text-sm font-medium mb-1"
            >
              Cost Price*
            </label>
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
            <label
              htmlFor="salePrice"
              className="block text-sm font-medium mb-1"
            >
              Sale Price*
            </label>
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
            <label
              htmlFor="currentStock"
              className="block text-sm font-medium mb-1"
            >
              Current Stock*
            </label>
            <input
              id="currentStock"
              type="number"
              onChange={(e) => setCurrentStock(e.target.value)}
              value={currentStock}
              className="input input-bordered w-full"
              placeholder="Enter current stock"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="block text-sm font-medium mb-1">
              Note*
            </label>
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

        <div className="bg-white p-4 rounded-md shadow-sm">
          {preview ? (
            <div className="relative w-full h-50 sm:h-75">
              <img
                src={preview}
                alt="preview"
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
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <span className="text-gray-500 text-sm">
                Click to upload an image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
          {image && (
            <div className="text-center mt-2">
              <p className="text-xs text-gray-600 truncate">{image.name}</p>
            </div>
          )}
        </div>

        <div className="mb-3 flex items-center justify-end gap-4 col-span-2">
          <Link to="/products">Back</Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-neutral"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
