import { HTMLAttributes } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/pages/Products";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  setName: (name: string) => void;
  price: number | undefined;
  setPrice: (price: number | undefined) => void;
  stock: number | undefined;
  setStock: (stock: number | undefined) => void;
  add: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  edit: boolean;
  payload?: Product;
  setSelectedId?: (id: string) => void;
}

const DialogPrompt = ({
  name,
  setName,
  price,
  setPrice,
  stock,
  setStock,
  add,
  open,
  setOpen,
  payload = { id: "", name: "", price: 0, stock: 0 },
  edit,
  setSelectedId = () => {},
  ...props
}: DialogProps) => {
  return (
    <Dialog {...props} open={open}>
      {edit ? (
        <Button
          onClick={() => {
            setName(payload.name);
            setPrice(payload.price);
            setStock(payload.stock);
            setSelectedId(payload.id);
            setOpen(true);
          }}
          className="w-full"
        >
          Edit
        </Button>
      ) : (
        <DialogTrigger className="self-end" asChild>
          <Button onClick={() => setOpen(true)}>Tambah Product Baru</Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-slate-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {edit ? "Ubah Product" : "Tambah Product Baru"}
          </DialogTitle>
          <DialogDescription>
            Silakan isi dan tidak boleh kosong
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              type="text"
              id="price"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              type="text"
              id="stock"
              className="col-span-3"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose
            onClick={() => {
              setName("");
              setPrice(undefined);
              setStock(undefined);
              setOpen(false);
            }}
            asChild
          >
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          {edit ? (
            <Button onClick={add}>Update Product</Button>
          ) : (
            <Button onClick={add}>Tambah Product</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPrompt;
