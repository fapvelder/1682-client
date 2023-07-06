import React, { useContext, useEffect, useState } from "react";
import { fetchCategories, fetchPlatforms, searchProduct } from "../../../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import ProductList from "../../../component/Product/ProductList";
import { InputNumber, Pagination, Select } from "antd";
import Loading from "../../../component/Loading";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import { Store } from "../../../Store";
import "./searchPage.css";
import { Helmet } from "react-helmet-async";
import Search from "../../../component/Search";
const { Option } = Select;

export default function SearchPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const stateSearch = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [available, setAvailable] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const fetchSearchProducts = async () => {
      handleLoading(
        async () => {
          const result = await searchProduct(
            state?.search,
            state?.category,
            state?.subCategory,
            platform,
            available,
            min,
            max,
            page,
            pageSize
          );
          setProducts(result.data.products);
          setTotalPages(result.data.totalPages);
        },
        setLoading,
        setReload
      );
    };

    fetchSearchProducts();
  }, [
    state?.search,
    category,
    subCategory,
    state?.subCategory,
    platform,
    available,
    min,
    max,
    setLoading,
    setReload,
    ctxDispatch,
    state?.category,
    page,
    pageSize,
  ]);
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.data);
    };
    fetchAllCategories();
  }, []);
  useEffect(() => {
    const fetchAllPlatforms = async () => {
      const result = await fetchPlatforms();
      setPlatforms(result.data);
    };
    fetchAllPlatforms();
  }, []);
  const handleClearAll = () => {
    ctxDispatch({ type: "SET_CATEGORY", payload: "" });
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: "" });
    setPlatform("");
    setAvailable("");
    setMin("");
    setMax("");
    setPage(1);
  };
  const handleChangeCategory = (category) => {
    ctxDispatch({ type: "SET_CATEGORY", payload: category });
  };
  const handleChangeSubCategory = (subCategory) => {
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: subCategory });
  };
  const calculateDefaultCategory = () => {
    return state?.category ? state?.category : "";
  };
  const calculateDefaultSubCategory = () => {
    return state?.subCategory ? state?.subCategory : "";
  };
  return (
    <Grid container style={{ padding: 20, paddingBottom: "50vh" }}>
      {loading && <Loading />}
      <Helmet>
        <title>Search Product</title>
      </Helmet>
      <Grid container>
        <Grid item md={3}>
          <Grid container className="border" style={{ width: "90%" }}>
            <Grid item md={8} className="text-start" style={{ padding: 10 }}>
              Filter By
            </Grid>
            <Grid
              item
              md={4}
              style={{ padding: 10, color: "grey", cursor: "pointer" }}
              onClick={() => handleClearAll()}
            >
              Clear all
            </Grid>
            <Grid
              item
              md={12}
              className="border text-start"
              style={{ padding: 10 }}
            >
              <Grid container style={{ width: "100%" }}>
                <div>Category</div>
                <div style={{ width: "100%" }}>
                  <Select
                    onChange={(e) => {
                      handleChangeCategory(e);
                      handleChangeSubCategory("");
                    }}
                    value={calculateDefaultCategory()}
                    style={{ width: "100%" }}
                  >
                    <Option value="">Any</Option>
                    {categories.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Grid>
              {state.category && (
                <Grid container style={{ width: "100%" }}>
                  <div>Sub-Category</div>
                  <div style={{ width: "100%" }}>
                    <Select
                      onChange={(e) => handleChangeSubCategory(e)}
                      value={calculateDefaultSubCategory()}
                      style={{ width: "100%" }}
                    >
                      <Option value="">Any</Option>
                      {categories
                        .filter((category) => category._id === state.category)
                        .map((category) =>
                          category.subCategory.map((subCategory) => (
                            <Option
                              key={subCategory._id}
                              value={subCategory.title}
                            >
                              {subCategory.title}
                            </Option>
                          ))
                        )}
                    </Select>
                  </div>
                </Grid>
              )}
              {/* <Grid container style={{ width: "100%" }}>
                <div>Platform</div>
                <div style={{ width: "100%" }}>
                  <Select
                    onChange={(e) => setPlatform(e)}
                    defaultValue=""
                    style={{ width: "100%" }}
                  >
                    <Option value="">Any</Option>
                    {platforms.map((platform) => (
                      <Option key={platform._id} value={platform._id}>
                        {platform.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Grid> */}
              <Grid container style={{ width: "100%" }}>
                <div>Available</div>
                <div style={{ width: "100%" }}>
                  <Select
                    onChange={(e) => setAvailable(e)}
                    defaultValue=""
                    style={{ width: "100%" }}
                  >
                    <Option value="">Any</Option>
                    <Option value="true">On Sale</Option>
                    <Option value="false">Sold</Option>
                  </Select>
                </div>
              </Grid>
              <Grid container style={{ width: "100%" }}>
                <div>Custom Price</div>
                <div style={{ width: "100%" }}>
                  <InputNumber
                    value={min}
                    onChange={(e) => setMin(e)}
                    min={0}
                    placeholder="Min"
                    style={{ width: "48%" }}
                  />
                  <span> - </span>
                  <InputNumber
                    value={max}
                    onChange={(e) => setMax(e)}
                    min={0}
                    placeholder="Max"
                    style={{ width: "48%" }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={9} className="text-start">
          <Grid container style={{ gridGap: "20px 0px" }}>
            {products.length > 0 ? (
              products?.map((product, index) => (
                <Grid
                  item
                  md={3}
                  lg={3}
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/item/${product._id}`)}
                >
                  <ProductList
                    title={product.title}
                    price={product.price}
                    img={product.photos[0]}
                    sold={!product.isAvailable}
                  />
                </Grid>
              ))
            ) : (
              <Grid container>
                <Grid
                  item
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h2>We don't find any products you search for...</h2>
                </Grid>
                <Grid
                  item
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <h4>Please try another products</h4>
                </Grid>

                <Grid
                  item
                  md={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div>
                    <Search placeholder={"Search"} />
                  </div>
                </Grid>
              </Grid>
            )}
          </Grid>
          {products.length > 0 && (
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Pagination
                onChange={(e) => setPage(e)}
                current={page}
                total={totalPages * 10}
                showSizeChanger={false}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
