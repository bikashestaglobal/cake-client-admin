import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import M from "materialize-css";
import Config from "../../../config/Config";
import { storage } from "../../../../firebase/FirebaseConfig";
import Select from "react-select";

function AddProduct() {
  const history = useHistory();
  // State Variable
  const [weight, setWeight] = useState("");
  const [mrp, setMRP] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isAddLoaded, setIsAddLoaded] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    parentCategories: [],
    categories: [],
    skus: [],
    flavour: "",
    color: "",
    shape: "",
    images: [],
    isEggCake: false,
    isPhotoCake: false,
    description: "",
  });
  const [logoDefault, setlogoDefault] = useState("https://bit.ly/3kPLfxF");
  const [previewImages, setPreviewImages] = useState([]);
  const [progressInfos, setProgressInfos] = useState([]);

  const [category, setCategory] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [flavour, setFlavour] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [color, setColor] = useState([]);
  const [progress, setProgress] = useState("");

  const [selectPCat, setSelectPCat] = useState([]);
  const [selectSCat, setSelectSCat] = useState([]);
  const [selectFlavour, setSelectFlavour] = useState("");
  const [selectColor, setSelectColor] = useState("");

  const titleChangeHandler = (evt) => {
    const value = evt.target.value;
    setProduct({
      ...product,
      slug: value.toLowerCase().replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Iamege Change
  const imageChangeHandler = (event) => {
    if (event.target.files && event.target.files.length) {
      [...event.target.files].map((value, index) => {
        handleUpload(value, index);
        // let reader = new FileReader();
        // reader.onload = (e) => {
        //   setlogoDefault(e.target.result);
        // };
        // reader.readAsDataURL(value);
      });
    }
  };

  // Upload Image
  const handleUpload = (image, i) => {
    const uploadTask = storage.ref(`cakes/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // console.log(i, progress);
        setProgressInfos((old) => {
          return [...old, (progressInfos[i] = progress)];
        });
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("cakes")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setPreviewImages((old) => [...old, { url }]);
            setProduct((old) => {
              return {
                ...old,
                images: [...old.images, { url }],
              };
            });
            // setCategory({ ...category, category_image: url })
          });
      }
    );
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    const filteredPCat = selectPCat.map((value) => {
      return value.catId;
    });
    const filteredSCat = selectSCat.map((value) => {
      return value.catId;
    });

    const addProduct = {
      ...product,
      parentCategories: filteredPCat,
      categories: filteredSCat,
      flavour: selectFlavour,
      color: selectColor,
      images: previewImages,
    };

    fetch(Config.SERVER_URL + "/product", {
      method: "POST",
      body: JSON.stringify(addProduct),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Parent Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/parent-category?skip=0&limit=5000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setParentCategory(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Shapes
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/shape?skip=0&limit=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setShapes(modifyForSelect);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Category
  useEffect(() => {
    let url = `${Config.SERVER_URL}/category`;
    let body = "";
    let method = "GET";
    if (selectPCat.length) {
      const filter = selectPCat.map((value) => value.catId);
      console.log(filter);
      url = `${url}/byParentCategory?limit=200`;
      body = { catId: filter };
      method = "POST";
    } else {
      url = `${url}?limit=200`;
      setSelectSCat([]);
    }

    fetch(url, {
      method: method,
      body: body != "" ? JSON.stringify(body) : null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            if (!result.body.length) setSelectSCat([]);
            setCategory(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, [selectPCat]);

  // get Flavour
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour?limit=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            let f = result.body.map((v) => {
              return { label: v.name, value: v._id };
            });
            setFlavour(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Color
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/color?limit=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setColor(modifyForSelect);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // Add Time Handler
  const addSkusHandler = (evt) => {
    evt.preventDefault();
    if (weight == "" || mrp == "" || sellingPrice == "") {
      M.toast({ html: "Please Fill SKU Details", classes: "text-light" });
      return;
    }

    const isExist = product.skus.find((value) => {
      if (
        value.mrp == mrp &&
        value.weight == weight &&
        value.sellingPrice == sellingPrice
      ) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "SKU is already Exist", classes: "text-light" });
      return;
    }
    setProduct({
      ...product,
      skus: [...product.skus, { mrp, weight, sellingPrice }],
    });
    setMRP("");
    setWeight("");
    setSellingPrice("");
  }; // Add Time Handler

  const deleteSkuHandler = (i) => {
    const filtered = product.skus.filter((value, index) => index != i);

    setProduct({ ...product, skus: [...filtered] });
  };

  const addParentCategoryHandler = (evt) => {
    evt.preventDefault();
    const cat = JSON.parse(evt.target.value);

    const isExist = selectPCat.find((value) => {
      if (value.catId == cat.catId) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "Already Exist", classes: "text-light" });
      return;
    }

    console.log(selectPCat);
    setSelectPCat([...selectPCat, cat]);
  };

  const deleteParentCategoryHandler = (evt, value) => {
    evt.preventDefault();
    const filtered = selectPCat.filter(
      (cat, index) => cat.catId != value.catId
    );

    setSelectPCat([...filtered]);
  };

  const addSubCategoryHandler = (evt) => {
    evt.preventDefault();
    const cat = JSON.parse(evt.target.value);

    const isExist = selectSCat.find((value) => {
      if (value.catId == cat.catId) {
        return true;
      }
    });

    if (isExist) {
      M.toast({ html: "Already Exist", classes: "text-light" });
      return;
    }

    console.log(selectSCat);
    setSelectSCat([...selectSCat, cat]);
  };

  const deleteSubCategoryHandler = (evt, value) => {
    evt.preventDefault();
    const filtered = selectSCat.filter(
      (cat, index) => cat.catId != value.catId
    );

    setSelectSCat([...filtered]);
  };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <div className="row page-titles mb-0">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor m-b-0 m-t-0">Products</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Admin</Link>
              </li>
              <li className="breadcrumb-item active">Add Product</li>
            </ol>
          </div>
        </div>
        {/* End Bread crumb and right sidebar toggle */}

        {/* Listing Form */}
        <div className="row mt-2">
          <div className={"col-md-10 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Product Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Product Details</h3>
                </div>

                {/* Product Name */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT NAME HERE !
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={titleChangeHandler}
                    className="form-control"
                    placeholder={"Big Rectangle Cake"}
                  />
                </div>

                {/* Product Slug */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SLUG HERE !
                  </label>
                  <input
                    type="text"
                    value={product.slug}
                    onChange={(evt) =>
                      setProduct({ ...product, slug: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"big-rectangle-cake"}
                  />
                </div>

                {/* Parent Category */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PARENT CATEGORY HERE !
                  </label>
                  <div className="border p-2">
                    <select
                      className={"form-control custom-select"}
                      size={5}
                      name={"category"}
                      onChange={addParentCategoryHandler}
                    >
                      {parentCategory.map((value, index) => {
                        return (
                          <option
                            key={index}
                            value={JSON.stringify({
                              catId: value._id,
                              name: value.name,
                            })}
                          >
                            {value.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Selected Parent Category */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED PARENT CATEGORY!
                  </label>
                  <div className="border p-2">
                    {selectPCat.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-info p-2 btn mr-2"
                          onClick={(evt) =>
                            deleteParentCategoryHandler(evt, value)
                          }
                        >
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Sub Category */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUB CATEGORY HERE !
                  </label>

                  <div className="border p-2">
                    <select
                      className={"form-control custom-select"}
                      size={5}
                      name={"category"}
                      onChange={addSubCategoryHandler}
                    >
                      {category.map((value, index) => {
                        return (
                          <option
                            key={index}
                            value={JSON.stringify({
                              catId: value._id,
                              name: value.name,
                            })}
                          >
                            {value.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Selected Sub Category */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED SUB CATEGORY HERE !
                  </label>
                  <div className="border p-2">
                    {selectSCat.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-info p-2 btn mr-2"
                          onClick={(evt) =>
                            deleteSubCategoryHandler(evt, value)
                          }
                        >
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Flavour */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    FLAVOUR HERE !
                  </label>
                  <div className="border p-2" style={{ height: "150px" }}>
                    <Select
                      options={flavour}
                      onChange={(evt) => {
                        setSelectFlavour(evt.value);
                      }}
                    />
                  </div>
                </div>

                {/* Color */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    COLOR HERE !
                  </label>
                  <div className="border p-2">
                    <div className="border p-2" style={{ height: "150px" }}>
                      <Select
                        options={color}
                        onChange={(evt) => {
                          setSelectColor(evt.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Is Egg Cake*/}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    EGG CAKE
                  </label>
                  <div className="d-flex my-3">
                    <div className="custom-control custom-radio pl-0 ml-0">
                      <input
                        type="radio"
                        id="cakeType1"
                        name="eggCake"
                        // checked={!product.isEggCake ? true : false}
                        value={true}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isEggCake: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType1">
                        YES
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="cakeType2"
                        name="eggCake"
                        // checked={!product.isEggCake ? true : false}
                        value={false}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isEggCake: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType2">
                        NO
                      </label>
                    </div>
                  </div>
                </div>

                {/* Is Photo Cake*/}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PHOTO CAKE
                  </label>
                  <div className="d-flex my-3">
                    <div className="custom-control custom-radio pl-0 ml-0">
                      <input
                        type="radio"
                        id="cakeType3"
                        name="photoCake"
                        value={true}
                        // checked={!product.isPhotoCake ? true : false}
                        onChange={(evt) =>
                          setProduct({
                            ...product,
                            isPhotoCake: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType3">
                        YES
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="cakeType4"
                        name="photoCake"
                        // checked={!product.isPhotoCake ? true : false}
                        value={false}
                        onChange={(evt) => {
                          setProduct({
                            ...product,
                            isPhotoCake: evt.target.value,
                          });
                        }}
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="cakeType4">
                        NO
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cake Shape */}
                <div
                  className={"form-group col-md-6"}
                  style={{ height: "200px" }}
                >
                  <label htmlFor="" className="text-dark h6 active">
                    CAKE SHAPE !
                  </label>
                  <div className="border p-2">
                    <div className="border p-2">
                      <Select
                        options={shapes}
                        onChange={(evt) => {
                          setProduct({ ...product, shape: evt.value });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SKUs */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Product Skus</h3>
                </div>
                {/* Weight */}
                <div className={"form-group col-md-4"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CAKE WEIGHT
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setWeight(evt.target.value)}
                    name="weight"
                    value={weight}
                    className="form-control"
                    placeholder={"1/2 kg"}
                  />
                </div>

                {/* MRP */}
                <div className={"form-group col-md-3"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CAKE MRP
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setMRP(evt.target.value)}
                    name="mrp"
                    value={mrp}
                    className="form-control"
                    placeholder={"700"}
                  />
                </div>

                {/* Selling Price */}
                <div className={"form-group col-md-3"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELLING PRICE
                  </label>
                  <input
                    type="text"
                    onChange={(evt) => setSellingPrice(evt.target.value)}
                    name="sellingPrice"
                    value={sellingPrice}
                    className="form-control"
                    placeholder={"599"}
                  />
                </div>
                <div className={"form-group col-md-2"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"button"}
                    onClick={addSkusHandler}
                  >
                    <div>
                      <i className="fas fa-plus"></i> Add
                    </div>
                  </button>
                </div>

                <div className="col-md-11">
                  {product.skus.map((value, index) => {
                    return (
                      <div className="card m-0 mb-1">
                        <div className="card-body px-2 py-2 d-flex justify-content-between">
                          <h6>Cake Weight: {value.weight} </h6>
                          <h6>Cake MRP: {value.mrp} </h6>
                          <h6>Cake Selling Price: {value.sellingPrice} </h6>
                          <button
                            type="button"
                            className="btn btn-danger px-2 py-0 m-0"
                            onClick={() => deleteSkuHandler(index)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Description */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Product Description</h3>
                </div>
                <div className={"form-group col-md-12"}>
                  <CKEditor
                    editor={ClassicEditor}
                    style={{ height: "100px" }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setProduct({ ...product, description: data });
                    }}
                    data={product.description}
                  />
                </div>
              </div>

              {/* Product Images */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Product Images</h3>
                </div>

                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT IMAGES
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={imageChangeHandler}
                    className="form-control"
                  />
                </div>

                <div className={"form-group col-md-2"}>
                  {previewImages.map((img, index) => {
                    return (
                      <img
                        key={index}
                        style={{
                          maxHeight: "100px",
                          maxWidth: "100px",
                          borderRadius: "100%",
                          border: "1px solid #5a5a5a",
                        }}
                        src={img.url}
                      />
                    );
                  })}

                  {progressInfos.forEach((info, index) => {
                    return (
                      <div className="progress mt-2">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${info}%`, height: "15px" }}
                          role="progressbar"
                        >
                          {info}%
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit Button */}
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Product
                      </div>
                    ) : (
                      <div>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
