import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Product } from "@/pages/Products";

import { Button } from "@/components/ui/button";
import SearchInput from "@/compositions/SearchInput";
import DialogPrompt from "./ModalProduct";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogProps } from "./ModalProduct";

interface ProductListProps extends Omit<DialogProps, "edit"> {
  searchPayload: Record<string, unknown>;
  setSearchPayload: (payload: { [key: string]: string }) => void;
  data?: { product?: Product[]; products?: Product[] };
  delete: (id: string) => void;
  loading: boolean;
  update: () => void;
}

const field = [
  { id: "name", placeholder: "Nama Produk", type: "text" },
  { id: "price", placeholder: "Harga Produk", type: "number" },
  { id: "stock", placeholder: "Stok Produk", type: "number" },
];
export default function ProductList(props: ProductListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <SearchInput
          fields={field}
          setSearch={props.setSearchPayload}
          search={props.searchPayload}
        />
        <DialogPrompt
          name={props.name}
          setName={props.setName}
          stock={props.stock}
          setStock={props.setStock}
          price={props.price}
          setPrice={props.setPrice}
          add={props.add}
          open={props.open}
          setOpen={props.setOpen}
          edit={false}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data &&
          props.data.products &&
          props.data.products.length > 0 &&
          props.loading === false ? (
            props.data.products.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.price}</TableCell>
                <TableCell>{user.stock}</TableCell>
                <TableCell className="text-center">
                  <Button>
                    <DialogPrompt
                      name={props.name}
                      setName={props.setName}
                      stock={props.stock}
                      setStock={props.setStock}
                      price={props.price}
                      setPrice={props.setPrice}
                      add={props.update}
                      open={props.open}
                      setOpen={props.setOpen}
                      edit={true}
                      payload={user}
                      setSelectedId={props.setSelectedId}
                    />
                  </Button>
                  <Button
                    onClick={() => {
                      props.delete(user.id);
                    }}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : props.data &&
            props.data.product &&
            props.data.product.length > 0 &&
            props.loading === false ? (
            props.data.product.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.price}</TableCell>
                <TableCell>{user.stock}</TableCell>
                <TableCell className="text-center">
                  <Button>
                    <DialogPrompt
                      name={props.name}
                      setName={props.setName}
                      stock={props.stock}
                      setStock={props.setStock}
                      price={props.price}
                      setPrice={props.setPrice}
                      add={props.update}
                      open={props.open}
                      setOpen={props.setOpen}
                      edit={true}
                      payload={user}
                      setSelectedId={props.setSelectedId}
                    />
                  </Button>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      props.delete(user.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : props.data?.products?.length === 0 ? (
            <TableRow>
              <h5 className="text-center">There is no data</h5>
            </TableRow>
          ) : props.data?.product?.length === 0 ? (
            <TableRow>
              <h5 className="text-center">There is no data</h5>
            </TableRow>
          ) : (
            <TableRow>
              <Skeleton className="w-full h-[20px] " />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
