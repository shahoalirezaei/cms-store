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
      const res = await fetch("api/categories");
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

    const { error, data } = await authFetch(
      "api/products",
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
        <div className="wrapper w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5">
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product title"
              className="bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
            />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product price"
              className="bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product count"
              className="bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
              value={newProductCount}
              onChange={(e) => setNewProductCount(e.target.value)}
            />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product number of colors"
              className="bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
              value={newProductColors}
              onChange={(e) => setNewProductColors(e.target.value)}
            />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <select
              className="flex justify-between bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
              value={selectedCategoryID}
              onChange={(e) => setSelectedCategoryID(e.target.value)}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/*  ImageUploader Component */}
          <div className="input-wrapper h-[45px] w-full flex flex-col items-center bg-[#f0f0f0] px-5 rounded-xl overflow-hidden">
            <ImageUploader onUploadSuccess={(url) => setNewProductImg(url)} />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <textarea
              placeholder="Product description ..."
              className="bg-inherit outline-0 border-0 w-full px-2 py-2.5 text-base"
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
