import React, {
  Fragment,
  createContext,
  useReducer,
  useContext,
  useEffect,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { initialState, branchReducer } from "../../reducer/branchReducer";
import Profile from "./pages/Profile";
import PageNoteFound from "./pages/PageNotFound";

import ParentCategory from "./pages/ParentCategory";
import Category from "./pages/Category";

// ================   Products  =====================
import AddProduct from "./pages/products/AddProduct";
import ProductList from "./pages/products/ProductList";

// ================   Coupons  =====================
import AddCoupon from "./pages/coupons/AddCoupon";
import CouponList from "./pages/coupons/CouponList";
import EditCoupon from "./pages/coupons/EditCoupon";
import ShippingMethodList from "./pages/shippingMethod/ShippingMethodList";
import AddShippingMethod from "./pages/shippingMethod/AddShippingMethod";
import EditShippingMethod from "./pages/shippingMethod/EditShippingMethod";
import FlavourList from "./pages/flavours/FlavourList";
import AddFlavour from "./pages/flavours/AddFlavour";
import EditFlavour from "./pages/flavours/EditFlavour";
import ColorList from "./pages/colors/ColorList";
import AddColor from "./pages/colors/AddColor";
import EditColor from "./pages/colors/EditColor";
import EditProduct from "./pages/products/EditProduct";
import AdonProductList from "./pages/adonProducts/AdonProductList";
import EditAdonProduct from "./pages/adonProducts/EditAdonProduct";
import AddAdonProduct from "./pages/adonProducts/AddAdonProduct";
import DealsList from "./pages/deals/DealsList";
import AddDeals from "./pages/deals/AddDeals";
import EditDeals from "./pages/deals/EditDeals";
import PincodeList from "./pages/pincode/PincodeList";
import AddPincode from "./pages/pincode/AddPincode";
import EditPincode from "./pages/pincode/EditPincode";
import ShapeList from "./pages/shapes/ShapeList";
import AddShape from "./pages/shapes/AddShape";
import EditShape from "./pages/shapes/EditShape";
import NewOrders from "./pages/orders/NewOrders";
import CustomerList from "./pages/customers/CustomerList";
import ViewOrder from "./pages/orders/ViewOrder";
import OrderList from "./pages/orders/OrderList";
import Setting from "./pages/setting/Setting";
import MainSlider from "./pages/banners/MainSlider";
import NextToSlider from "./pages/banners/NextToSlider";
import DailyBestSaleBanner from "./pages/banners/DailyBestSaleBanner";
import CategoryPageBanner from "./pages/banners/CategoryPageBanner";
import OfferBanner from "./pages/banners/OfferBanner";

// Create Context
export const BranchContext = createContext();

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(BranchContext);
  useEffect(() => {
    const branch = JSON.parse(localStorage.getItem("branch"));
    if (branch) {
      dispatch({ type: "BRANCH", payload: branch });
      // history.push("/")
    } else {
      history.push("/branch/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/branch" component={Dashboard} />
      <Route exact path="/branch/login" component={Login} />
      <Route exact path="/branch/profile" component={Profile} />

      {/* Parent Category */}
      <Route exact path="/branch/parentCategory" component={ParentCategory} />
      <Route exact path="/branch/category" component={Category} />

      {/* Products */}
      <Route exact path="/branch/products" component={ProductList} />
      <Route exact path="/branch/product/add" component={AddProduct} />
      <Route exact path="/branch/product/edit/:id" component={EditProduct} />

      {/* Adon Products */}
      <Route exact path="/branch/adonProducts" component={AdonProductList} />
      <Route exact path="/branch/adonProduct/add" component={AddAdonProduct} />
      <Route
        exact
        path="/branch/adonProduct/edit/:id"
        component={EditAdonProduct}
      />

      {/* Coupons */}
      <Route exact path="/branch/coupons" component={CouponList} />
      <Route exact path="/branch/coupon/add" component={AddCoupon} />
      <Route exact path="/branch/coupon/edit/:id" component={EditCoupon} />

      {/* Deals */}
      <Route exact path="/branch/deals" component={DealsList} />
      <Route exact path="/branch/deals/add" component={AddDeals} />
      <Route exact path="/branch/deals/edit/:id" component={EditDeals} />

      {/* Shipping Method */}
      <Route
        exact
        path="/branch/shippingMethods"
        component={ShippingMethodList}
      />
      <Route
        exact
        path="/branch/shippingMethod/add"
        component={AddShippingMethod}
      />
      <Route
        exact
        path="/branch/shippingMethod/edit/:id"
        component={EditShippingMethod}
      />
      {/* Flavour */}
      <Route exact path="/branch/flavours" component={FlavourList} />
      <Route exact path="/branch/flavour/add" component={AddFlavour} />
      <Route exact path="/branch/flavour/edit/:id" component={EditFlavour} />

      {/* Shape */}
      <Route exact path="/branch/shapes" component={ShapeList} />
      <Route exact path="/branch/shape/add" component={AddShape} />
      <Route exact path="/branch/shape/edit/:id" component={EditShape} />

      {/* Pincode */}
      <Route exact path="/branch/pincodes" component={PincodeList} />
      <Route exact path="/branch/pincode/add" component={AddPincode} />
      <Route exact path="/branch/pincode/edit/:id" component={EditPincode} />

      {/* Colors */}
      <Route exact path="/branch/colors" component={ColorList} />
      <Route exact path="/branch/color/add" component={AddColor} />
      <Route exact path="/branch/color/edit/:id" component={EditColor} />

      {/* Orders */}
      <Route exact path="/branch/newOrders" component={NewOrders} />
      <Route exact path="/branch/order/show/:id" component={ViewOrder} />
      <Route exact path="/branch/orders" component={OrderList} />

      {/* Customer */}
      <Route exact path="/branch/customers" component={CustomerList} />

      {/* Settings */}
      <Route exact path="/branch/setting" component={Setting} />

      {/* Images */}
      <Route exact path="/branch/slider" component={MainSlider} />
      <Route exact path="/branch/nextToSlider" component={NextToSlider} />
      <Route
        exact
        path="/branch/bestSaleBanner"
        component={DailyBestSaleBanner}
      />
      <Route
        exact
        path="/branch/categoryPageBanner"
        component={CategoryPageBanner}
      />
      <Route exact path="/branch/offerBanner" component={OfferBanner} />

      {/* Page Not Found */}
      <Route exact path="/*" component={PageNoteFound} />
    </Switch>
  );
};

const Branch = () => {
  const [state, dispatch] = useReducer(branchReducer, initialState);
  return (
    <div id="main-wrapper">
      <BranchContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />
          <Routing />
        </Router>
      </BranchContext.Provider>
    </div>
  );
};

export default Branch;
