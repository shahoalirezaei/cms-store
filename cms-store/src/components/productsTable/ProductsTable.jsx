import React, { useEffect, useState, useMemo } from "react";
import ErrorBox from "../errorBox/ErrorBox";
import DetailsModal from "../detailsModal/DetailsModal";
import EditModal from "../editModal/EditModal";
import DeleteModal from "../deleteModal/DeleteModal";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";

function ProductsTable({ allProduct, getAllProduct }) {
  const { authFetch } = useAuthFetch()
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [mainProsuctInfo, setMainProsuctInfo] = useState({});
  const [productID, setProductID] = useState(null);
  const [sortType, setSortType] = useState("default");

  // state for input Edit Modal /////////////
  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCount, setNewProductCount] = useState("");
  const [newProductImg, setNewProductImg] = useState("");
  const [newProductPopularity, setNewProductPopularity] = useState("");
  const [newProductSale, setNewProductSale] = useState("");
  const [newProductColors, setNewProductColors] = useState("");

  const sortedProducts = useMemo(() => {
    const sorted = [...allProduct];

    switch (sortType) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "count":
        return sorted.sort((a, b) => b.count - a.count);
      case "popularity":
        return sorted.sort((a, b) => b.popularity - a.popularity);
      case "sale":
        return sorted.sort((a, b) => b.sale - a.sale);
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [allProduct, sortType]);

  const closeDetailsModal = () => {
    setIsShowDetailsModal(false);
  };

  const updateProductInfos = async (event) => {
    event.preventDefault();
    const newProductInfos = {
      title: newProductTitle,
      price: newProductPrice,
      count: newProductCount,
      img: newProductImg,
      popularity: newProductPopularity,
      sale: newProductSale,
      colors: newProductColors,
    };

    const { error, data } = await authFetch(
      `http://localhost:8001/api/products/${productID}`,
      "PUT",
      newProductInfos
    );

    if (error) {
      toast.error("Error! product not update", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllProduct();

      toast.success(`Success! Product is update`, {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    // fetch(`http://localhost:8001/api/products/${productID}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newProductInfos),
    // })
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       throw new Error(`Server error: ${res.status}`);
    //     }

    //     const text = await res.text();
    //     if (!text) {
    //       return [];
    //     }

    //     return JSON.parse(text);
    //   })
    //   .then((result) => {
    //     getAllProduct();

    //     toast.success(`Success! Product is update`, {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   })
    //   .catch((error) => {
    //     // console.error("Fetch error:", error);
    //     toast.error("Error! product not update", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   });
    setIsShowEditModal(false);
  };

  const deleteModalSubmitAction = async () => {
    console.log("submit");
    const { error, data } = await authFetch(
      `http://localhost:8001/api/products/${productID}`,
      "DELETE"
    );
    if (error) {
      toast.error("Error! product not delete", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      console.log(data);
      getAllProduct();
      toast.success("Success! product deleted", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
    setIsShowDeleteModal(false);
  };

  return (
    <>
      <div className="p-4 overflow-x-hidden">
        <h4 className="text-2xl font-semibold my-4">Product list</h4>
        <select
          className="mb-4 border p-2 rounded outline-gray-500 text-zinc-700 text-sm md:text-base"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="count">Most in Stock</option>
          <option value="popularity">Most Popular</option>
          <option value="sale">Best Sellers</option>
          <option value="title">Alphabetical</option>
        </select>

        <table className="table-fixed w-full bg-white rounded-2xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="hidden sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Image
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/5">
                Title
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Price
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Count
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5 lg:w-1/3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedProducts.length ? (
              sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="text-center hidden sm:table-cell px-4 py-2">
                    {product.img ? (
                      <img
                        src={product.img}
                        alt="Product"
                        className="w-20 lg:w-32 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="w-20 lg:w-32 rounded-lg object-cover">
                        No Image
                      </span>
                    )}
                  </td>
                  <td className="text-center px-4 py-2">
                    <p className="flex flex-wrap justify-center text-xs sm:text-sm  sm:max-w-[150px]">
                      {product.title}
                    </p>
                  </td>
                  <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                    ${product.price}
                  </td>
                  <td className="text-center px-4 py-2 text-gray-800 text-sm sm:text-base">
                    {product.count}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                      <button
                        className="details-btn"
                        onClick={() => {
                          setIsShowDetailsModal(true);
                          setMainProsuctInfo(product);
                        }}
                      >
                        <FaInfoCircle className="sm:hidden" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setIsShowEditModal(true);
                          setProductID(product.id);
                          setNewProductTitle(product.title);
                          setNewProductPrice(product.price);
                          setNewProductCount(product.count);
                          setNewProductImg(product.img);
                          setNewProductPopularity(product.popularity);
                          setNewProductSale(product.sale);
                          setNewProductColors(product.colors);
                        }}
                      >
                        <FaEdit className="sm:hidden" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setIsShowDeleteModal(true);
                          setProductID(product.id);
                        }}
                      >
                        <FaTrash className="sm:hidden" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <ErrorBox msg="Oops! No products to display." colCount={5} />
            )}
          </tbody>
        </table>
      </div>
      {isShowDetailsModal && (
        <DetailsModal onHide={closeDetailsModal}>
          <table className="table-fixed w-full bg-white rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Popularity
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Total sales
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Colors
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainProsuctInfo.popularity}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainProsuctInfo.sale}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainProsuctInfo.colors}
                </td>
              </tr>
            </tbody>
          </table>
        </DetailsModal>
      )}
      {isShowEditModal && (
        <EditModal
          onClose={() => setIsShowEditModal(false)}
          onSubmit={(e) => updateProductInfos(e)}
          title="Please enter the new product infos"
        >
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product-title"
              value={newProductTitle}
              onChange={(e) => setNewProductTitle(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product count"
              value={newProductCount}
              onChange={(e) => setNewProductCount(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product image address"
              value={newProductImg}
              onChange={(e) => setNewProductImg(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product"
              value={newProductPopularity}
              onChange={(e) => setNewProductPopularity(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product total sale"
              value={newProductSale}
              onChange={(e) => setNewProductSale(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Product colors"
              value={newProductColors}
              onChange={(e) => setNewProductColors(e.target.value)}
            />
          </div>
        </EditModal>
      )}
      {isShowDeleteModal && (
        <DeleteModal
          cancelAction={() => setIsShowDeleteModal(false)}
          submitAction={deleteModalSubmitAction}
          title="Are you sure for delete this item ?"
        />
      )}
    </>
  );
}
export default ProductsTable;
