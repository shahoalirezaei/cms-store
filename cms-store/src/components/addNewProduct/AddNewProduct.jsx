import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import ImageUploader from "../imageUploader/ImageUploader";

function AddNewProduct({ getAllProduct }) {
  const { authFetch } = useAuthFetch();
  const [categories, setCategories] = useState([]);
  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCount, setNewProductCount] = useState("");
  const [newProductImg, setNewProductImg] = useState("");
  const [newProductColors, setNewProductColors] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [selectedCategoryID, setSelectedCategoryID] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/categories");
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createSlugUrl = (title) => {
    return title
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  const createNewProduct = async (event) => {
    event.preventDefault();

    if (
      !newProductTitle ||
      !newProductPrice ||
      !newProductCount ||
      !newProductImg ||
      !newProductColors ||
      !selectedCategoryID
    ) {
      toast.error("Please fill all required fields", { position: "bottom-left", autoClose: 3000 });
      return;
    }

    const newProduct = {
      title: newProductTitle,
      price: newProductPrice,
      count: newProductCount,
      img: newProductImg,
      popularity: 100,
      sale: 0,
      colors: newProductColors,
      url: createSlugUrl(newProductTitle),
      productDesc: newProductDesc,
      categoryID: selectedCategoryID,
    };

    const { error, data: savedProduct } = await authFetch(
      "http://localhost:8001/api/products",
      "POST",
      newProduct
    );

    if (error) {
      toast.error("Error! Product not created", { position: "bottom-left", autoClose: 3000 });
    } else {
      toast.success("Product created successfully!", { position: "bottom-left", autoClose: 3000 });
      getAllProduct();
      emptyInputs();
    }
  };

  const emptyInputs = () => {
    setNewProductTitle("");
    setNewProductPrice("");
    setNewProductCount("");
    setNewProductImg("");
    setNewProductColors("");
    setNewProductDesc("");
    setSelectedCategoryID("");
  };

  return (
    <div className="mt-8 md:mt-10 lg:mt-14">
      <h3 className="table-title">Add new product</h3>
      <form className="flex flex-col mt-3 md:mt-5 bg-white items-center md:items-end p-3 md:p-5 rounded-2xl gap-y-4">
       <div className="wrapper w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
  {/* Product Title */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Product Title</label>
    <input
      type="text"
      placeholder="Enter product title"
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none"
      value={newProductTitle}
      onChange={(e) => setNewProductTitle(e.target.value)}
    />
  </div>

  {/* Product Price */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Product Price</label>
    <input
      type="text"
      placeholder="Enter product price"
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none"
      value={newProductPrice}
      onChange={(e) => setNewProductPrice(e.target.value)}
    />
  </div>

  {/* Product Count */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Product Count</label>
    <input
      type="text"
      placeholder="Enter product count"
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none"
      value={newProductCount}
      onChange={(e) => setNewProductCount(e.target.value)}
    />
  </div>

  {/* Product Colors */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Number of Colors</label>
    <input
      type="text"
      placeholder="Enter number of colors"
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none"
      value={newProductColors}
      onChange={(e) => setNewProductColors(e.target.value)}
    />
  </div>

  {/* Category Select */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Category</label>
    <select
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none"
      value={selectedCategoryID}
      onChange={(e) => setSelectedCategoryID(e.target.value)}
    >
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.title}</option>
      ))}
    </select>
  </div>

  {/* Image Uploader */}
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Product Image</label>
    <div className="h-[50px] flex items-center">
      <ImageUploader onUploadSuccess={(url) => setNewProductImg(url)} />
    </div>
  </div>

  {/* Product Description */}
  <div className="flex flex-col md:col-span-2">
    <label className="text-sm font-medium mb-1">Description</label>
    <textarea
      placeholder="Enter product description..."
      className="bg-[#f0f0f0] rounded-xl px-3 py-2 outline-none w-full"
      value={newProductDesc}
      onChange={(e) => setNewProductDesc(e.target.value)}
    ></textarea>
  </div>
</div>


        <button
          type="submit"
          className="btn-blue w-3/4 sm:w-3/5 md:w-auto"
          onClick={createNewProduct}
        >
          Create product
        </button>
      </form>
    </div>
  );
}

export default AddNewProduct;
