import ProductList from "@/compositions/ProductList";
import Layout from "@/compositions/Layout";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function Products(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>();
  const [stock, setStock] = useState<number | undefined>();
  const [searchPayload, setSearchPayload] = useState<Record<string, unknown>>(
    {}
  ); // State for name search term
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState<boolean>(false);

  // Determine which query to use based on search terms
  const query =
    searchPayload.name || searchPayload.price || searchPayload.stock
      ? GET_PRODUCTS
      : GET_ALL_PRODUCTS;
  // Use the search terms in the query
  const { loading, error, data } = useQuery(query, {
    variables: { ...searchPayload }, // Pass both search terms to the query
  });

  const [addProduct, { data: newdata, loading: newloading, error: newerror }] =
    useMutation(ADD_PRODUCT, {
      refetchQueries: [{ query: query }],
    });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: query }],
  });

  const [
    updateProduct,
    { data: updatedata, loading: updateloading, error: updateerror },
  ] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: query }],
  });

  const handleAddProduct = async () => {
    const response = await addProduct({ variables: { name, price, stock } });
    if (newloading) {
      console.log("submitting");
    } else {
      setOpen(false);
    }
    setName("");
    setPrice(undefined);
    setStock(undefined);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product ?")) {
      await deleteProduct({ variables: { id } });
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProductId) {
      const response = await updateProduct({
        variables: { id: selectedProductId, name, price, stock },
      });
      if (updateloading) {
        console.log("submit");
      } else {
        setOpen(false);
      }
      setSelectedProductId(null);
      setName("");
      setPrice(undefined);
      setStock(undefined);
    }
  };
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Layout>
      {loading ? (
        <Skeleton className="w-full h-[20px] " />
      ) : (
        <ProductList
          data={data}
          setSearchPayload={setSearchPayload}
          searchPayload={searchPayload}
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          stock={stock}
          setStock={setStock}
          add={handleAddProduct}
          delete={(id) => handleDeleteProduct(id)}
          loading={loading}
          open={open}
          setOpen={setOpen}
          update={handleUpdateProduct}
          setSelectedId={setSelectedProductId}
        />
      )}
    </Layout>
  );
}
