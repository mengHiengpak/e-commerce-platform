import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import useCollection from "../../hook/useCollection";

function DeleteCategory() {
    const [id, setId] = useState("");
    const [, , , remove] = useCollection('categories');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id.trim()) return toast.error("Please enter the category ID");
        if (!confirm("Are you sure you want to delete this category?")) return;
        const res = await remove(id);
        if (res?.success) {
            toast.success("Category deleted successfully!");
            navigate("/category");
        } else {
            toast.error(res?.message || "Failed to delete category");
        }
    };

    return (
        <div>
            <h1 className="text-xl font-semibold">Delete category</h1>

            <div className="max-w-lg bg-white p-3 rounded-md mt-4 ">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block mb-2">Category ID*</label>
                        <input
                            type="text"
                            onChange={(e) => setId(e.target.value)}
                            name="id"
                            className="input w-full"
                            placeholder="Enter Category ID"
                            required
                        />
                    </div>

                    <div className="mb-3 flex items-center justify-end gap-4">
                        <Link to="/category" className="btn btn-ghost">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-error">
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteCategory;
