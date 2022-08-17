import React from "react";
import Papa from "papaparse";
import { useState } from "react";
import Config from "../../../config/Config";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import tableToCSV from "../../helpers";

const AddCoponFromCSV = () => {
  const history = useHistory();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);

  const fileChangeHandler = (event) => {
    const files = event.target.files[0];
    if (files) {
      setUploadLoading(true);

      Papa.parse(event.target.files[0], {
        complete: async (results) => {
          let keys = results.data[0];
          // I want to remove some óíúáé, blan spaces, etc
          keys = results.data[0].map((v) =>
            v
              // .toLowerCase()
              .replace(/ /g, "_")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
          let values = results.data.slice(1);
          let objects = values.map((array) => {
            let object = {};
            keys.forEach((key, i) => (object[key] = array[i]));
            return object;
          });
          // Now I call to my API and everything goes ok

          // Get data from array and call the api
          objects.map((item, i) => {
            if (item.code) {
              submitHandler(item);
            }
            if (i == objects.length - 1) {
              setUploadLoading(false);
            }
          });
        },
      });

      // Papa.parse(files[0], {
      //   complete: function (results) {
      //     console.log("Finished:", results.data);
      //     insertDataHandler({ name: results.data });
      //   },
      // });
    }
  };

  const makeElement = (elemName, innerText = null, row = null) => {
    const elem = document.createElement(elemName);
    if (innerText) {
      elem.innerHTML = innerText;
    }
    if (row) {
      row.appendChild(elem);
    }
    return elem;
  };

  const downloadCSVHandler = () => {
    let table = makeElement("table");
    let thead = makeElement("thead");
    table.appendChild(thead);

    let row = makeElement("tr");
    makeElement("th", "code", row);
    makeElement("th", "applyFor", row);
    makeElement("th", "discountType", row);
    makeElement("th", "discount", row);
    makeElement("th", "description", row);
    makeElement("th", "minimumAmount", row);
    makeElement("th", "usesTimes", row);
    makeElement("th", "startDate", row);
    makeElement("th", "validity", row);

    let dummyRow = makeElement("tr");
    makeElement("td", "NEW20", dummyRow);
    makeElement("td", "EXISTING_USER", dummyRow);
    makeElement("td", "AMOUNT", dummyRow);
    makeElement("td", 20, dummyRow);
    makeElement("td", "Dummy Description", dummyRow);
    makeElement("td", 500, dummyRow);
    makeElement("td", 1, dummyRow);
    makeElement("td", "28-06-2022", dummyRow);
    makeElement("td", "05-07-2022", dummyRow);

    thead.appendChild(row);
    thead.appendChild(dummyRow);

    tableToCSV("coupons.csv", table);
  };

  // Submit Handler
  const submitHandler = (data) => {
    fetch(Config.SERVER_URL + "/coupon", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            // M.toast({ html: result.message, classes: "bg-success" });
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
          }
          setUploaded((old) => {
            return [
              ...old,
              {
                code: result.body.code || "",
                message: result.message || result.errors.message,
              },
            ];
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <div className="row page-titles">
          <div className="col-md-5 col-8 align-self-center">
            <h3 className="text-themecolor">Coupon</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active">Add Coupon</li>
            </ol>
          </div>
        </div>

        {/* Add Category Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              //   onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Color Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12 d-flex justify-content-between">
                  <h3 className={"my-3 text-info"}>Upload CSV File</h3>
                  <div className="">
                    <button
                      onClick={downloadCSVHandler}
                      className="btn btn-info"
                      type="button"
                    >
                      <i className="fa fa-download"></i> Download CSV Format
                    </button>
                  </div>
                </div>

                <div className={"form-group col-md-6"}>
                  <input
                    type="file"
                    onChange={fileChangeHandler}
                    className="form-control"
                    placeholder={"Chocolaty"}
                  />
                </div>
                <div className={"form-group col-md-6"}>
                  {uploadLoading ? (
                    <div className={"bg-white p-3 text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading..
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-11 mx-auto">
            <div className={"row shadow-sm bg-white py-3"}>
              <div className="col-md-12">
                {uploaded.map((item, index) => {
                  return (
                    <div className="card card-body">
                      {" "}
                      {item.code} {item.message}{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoponFromCSV;