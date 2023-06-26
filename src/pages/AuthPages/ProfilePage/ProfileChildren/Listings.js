import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { getUserProducts } from "../../../../api";
import { Store } from "../../../../Store";
import ProductList from "../../../../component/Product/ProductList";
import { useNavigate, useParams } from "react-router-dom";

export default function Listings() {
  const { state } = useContext(Store);
  const params = useParams();
  const navigate = useNavigate();
  const slug = params?.slug;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      const result = await getUserProducts(slug);
      setProducts(result.data);
    };
    getProducts();
  }, [slug]);
  return (
    <Grid container className="pb-50">
      <Grid container>
        {products?.map((product) => (
          <Grid item md={3} onClick={() => navigate(`/item/${product._id}`)}>
            <ProductList
              title={product.title}
              price={product.price}
              img={product.photos[0]}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
