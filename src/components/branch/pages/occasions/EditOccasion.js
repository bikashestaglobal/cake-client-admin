import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditOccasion = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    status: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();
    const updateData = {
      name: formData.name,
      status: formData.status,
    };
    fetch(`${Config.SERVER_URL}/occasions/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
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
          setIsUpdateLoaded(true);
        },
        (error) => {
          setIsUpdateLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions/${id}`, {
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
            setFormData(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsDataLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsDataLoaded(true);
        }
      );
  }, []);

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}

        <Breadcrumb title={"OCCASIONS"} pageTitle="Edit Occasion" />

        {/* Add Occasion Form */}
        <div className="row">
          {isDataLoaded ? (
            <div className={"col-md-11 mx-auto"}>
              <form
                onSubmit={submitHandler}
                className="form-horizontal form-material"
              >
                {/* Coupon Details */}
                <div className={"row shadow-sm bg-white py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>Occasion Details</h3>
                  </div>

                  {/* Occasion Name */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      OCCASION NAME !
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(evt) =>
                        setFormData({ ...formData, name: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Birthday Cake"}
                    />
                  </div>

                  {/* Occasion Status */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      OCCASION STATUS
                    </label>
                    <select
                      name=""
                      id=""
                      value={formData.status}
                      onChange={(evt) => {
                        setFormData({ ...formData, status: evt.target.value });
                      }}
                      className="form-control"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Disabled</option>
                    </select>
                  </div>

                  <div className={"form-group col-md-6"}>
                    <button
                      className="btn btn-info rounded px-3 py-2"
                      type={"submit"}
                    >
                      {isUpdateLoaded ? (
                        <div>
                          <i className="fas fa-refresh"></i> Update Occasion
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
          ) : (
            <div className="col-md-11 mx-auto text-center bg-white py-5">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOccasion;
