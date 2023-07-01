import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./SellItem.css";
import { Button } from "antd";
import { fetchCategories } from "../../../api";
import { useNavigate } from "react-router-dom";
export default function SellItem() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    if (category && brand) {
      if (category === "Game Items") {
        navigate(`/sell-item/${category}/${subCategory}/${brand}`);
      } else {
        navigate("/listing", {
          state: {
            category: category,
            subCategory: subCategory,
          },
        });
      }
    }
  }, [brand, category, subCategory, navigate]);
  const [subCategories, setSubCategories] = useState("");
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      const allCategories = result?.data?.map((cate) => ({
        id: cate?._id,
        name: cate?.name,
        src: cate?.image,
        active: false,
        categoryDesc: cate?.categoryDesc,
        subCate: cate?.subCategory,
      }));
      setCategories(allCategories);
    };
    fetchAllCategories();
  }, []);
  const handleClickCategory = (id) => {
    setCategories((prevElements) =>
      prevElements.map((element) =>
        element.id === id
          ? { ...element, active: true }
          : { ...element, active: false }
      )
    );
    categories?.filter((cate) => cate.id === id && setCategory(cate.name));
    categories?.filter((cate) => {
      if (cate.id === id) {
        const brands = cate?.subCate?.map((subCate) => ({
          id: subCate?._id,
          title: subCate?.title,
          subCategory: subCate?.subCategoryName?.name,
          src: subCate?.image,
          active: false,
        }));
        setBrands(brands);
        setSubCategories(cate?.categoryDesc);
      }
    });
  };

  const handleClickBrand = (id) => {
    brands?.filter((brand) => {
      if (brand.id === id) {
        setBrand(brand.title);
        setSubCategory(brand.subCategory);
      }
    });
  };
  return (
    <Grid container className="selling-item pb-50">
      <Helmet>
        <title>Start Selling</title>
      </Helmet>
      <div className="mg-auto-80">
        <h3 className="mt-15"> Start Selling</h3>
        <Grid container className="mg-auto-80 selectCategory">
          <Grid
            item
            md={12}
            className="categorySection"
            style={{ marginTop: 50 }}
          >
            <h3>
              <span>Select Category</span>
            </h3>
            <Grid container>
              {categories.map((element) => (
                <Grid
                  item
                  md={2}
                  key={element.id}
                  className={"select"}
                  onClick={() => handleClickCategory(element.id)}
                >
                  <img
                    className={element.active ? "mt-15 active" : "mt-15"}
                    src={element.src}
                    alt=""
                    style={{
                      width: 140,
                      height: 140,
                    }}
                  />
                  <h6>{element.name}</h6>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            className="brandSection"
            style={{ display: subCategories ? "block" : "none", marginTop: 50 }}
          >
            <h3>
              <span>Select {subCategories}</span>
            </h3>
            <Grid container>
              {brands.map((element) => (
                <Grid
                  item
                  md={2}
                  key={element.id}
                  className={"select"}
                  // onClick={() => console.log(`/${}`)}
                  onClick={() => handleClickBrand(element.id)}
                >
                  <img
                    className={element.active ? "mt-15 active" : "mt-15"}
                    src={element.src}
                    alt=""
                    style={{
                      width: 140,
                      height: 140,
                    }}
                  />
                  <h6>{element.name}</h6>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item md={12}>
            <p className="mt-15">
              By listing on GameBay, you confirm that you legally own the
              item(s) or that you have the full rights to sell the item(s). You
              are responsible for verifying what rights you have, and for
              adhering to all applicable terms and conditions with respect to
              the respective game(s), game publisher(s) or platform provider(s).
            </p>
            <p>
              Selling prohibited and counterfeit items are against the law, and
              we do not allow such items on GameBay.
            </p>
            <Button disabled className="defaultButton text-white">
              Next
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
