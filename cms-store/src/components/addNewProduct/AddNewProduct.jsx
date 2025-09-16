import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { IoMdAttach } from "react-icons/io";

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

  const [imgError, setImgError] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      await fetch("http://localhost:8001/api/categories")
        .then(async (res) => {
          // console.log(res);

          if (!res.ok) {
            throw new Error(`Server Error: ${res.status}`);
          }
          const text = await res.text();
          if (!text) {
            return [];
          }
          return JSON.parse(text);
        })
        .then((data) => {
          // console.log(data);
          setCategories(data);
        });
    } catch (error) {
      // console.log(error);
    }
  };

  const createSlugUrl = (title) => {
    return title
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-English letters and special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();
  };

  const handleImageUpload = (event, setNewProductImg, setImgError) => {
    const file = event.target.files[0];

    if (!file) return;

    // 2MB size limit
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImgError("File size must be less than 2MB");
      event.target.value = null;
      return;
    }
    setImgError("");
    setNewProductImg(file);
  };

  const createNewProduct = async (event) => {
    event.preventDefault();

    // Check if all required product fields are provided
    if (
      !newProductTitle ||
      !newProductPrice ||
      !newProductCount ||
      !newProductImg ||
      !newProductColors ||
      !selectedCategoryID
    ) {
      toast.error("Please fill all required fields", {
        position: "bottom-left",
        autoClose: 3000,
      });
      return;
    }

    // Upload image to Cloudinary
    try {
      const formData = new FormData();

      formData.append("file", newProductImg);
      formData.append("upload_preset", "products_unsigned_preset"); // perset name
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dimj5vpdf/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        toast.error("Image upload failed. Please try again.", {
          position: "bottom-left",
          autoClose: 3000,
        });
        return;
      }

      const uploadedImageUrl = data.secure_url;

      // Construct new product object
      const newProduct = {
        title: newProductTitle,
        price: newProductPrice,
        count: newProductCount,
        img: uploadedImageUrl,
        popularity: 100,
        sale: 0,
        colors: newProductColors,
        url: createSlugUrl(newProductTitle),
        productDesc: newProductDesc,
        categoryID: selectedCategoryID,
      };

      // Send request to backend
      const { error, data: savedProduct } = await authFetch(
        "http://localhost:8001/api/products",
        "POST",
        newProduct
      );

      // Handle response
      if (error) {
        toast.error("Error! product not creat", {
          position: "bottom-left",
          autoClose: 3000,
        });
      } else {
        console.log(savedProduct);
        getAllProduct();
        emptyInputs();
        toast.success("Success! product created", {
          position: "bottom-left",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  };

  const emptyInputs = () => {
    setNewProductTitle("");
    setNewProductPrice("");
    setNewProductCount("");
    setNewProductImg("");
    setNewProductColors("");
    setNewProductDesc("");
  };

  return (
    <div className="mt-8 md:mt-10 lg:mt-14">
      <h3 className="table-title">Add new product</h3>
      <form
        action="#"
        className="flex flex-col mt-3 md:mt-5 bg-white items-center md:items-end p-3 md:p-5 rounded-2xl gap-y-4"
      >
        <div className="wrapper w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5">
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product title"
              className="bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product price"
              className="bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product count"
              className="bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              value={newProductCount}
              onChange={(e) => setNewProductCount(e.target.value)}
            />
          </div>

          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <input
              type="text"
              placeholder="Product number of colors"
              className="bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              value={newProductColors}
              onChange={(e) => setNewProductColors(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <select
              className="flex justify-between bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              id="category"
              value={selectedCategoryID}
              onChange={(e) => setSelectedCategoryID(e.target.value)}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.length ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <div>
            <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
              <label
                htmlFor="productImg"
                className="flex gap-x-2 items-center cursor-pointer px-4 py-2 rounded-md text-gray-400"
              >
                <IoMdAttach />
                Attach product image
              </label>
              <input
                id="productImg"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleImageUpload(e, setNewProductImg, setImgError)
                }
              />
            </div>
            {imgError && (
              <p className=" text-center text-red-500 text-sm mt-1">
                {imgError}
              </p>
            )}
          </div>
          <div className="input-wrapper w-full flex items-center bg-[#f0f0f0] px-5 rounded-xl">
            <textarea
              type="text"
              className="bg-inherit outline-0  border-0 w-full px-2 py-2.5 text-base"
              placeholder="Product description ..."
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button
        type="button"
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
