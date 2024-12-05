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
import { User } from "@/pages/Users";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  add: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  edit: boolean;
  payload?: User;
  setSelectedId?: (id: string) => void;
}

const DialogPrompt = ({
  name,
  setName,
  email,
  setEmail,
  add,
  open,
  setOpen,
  edit = false,
  payload = { id: "", name: "", email: "" },
  setSelectedId = () => {},
  ...props
}: DialogProps) => {
  return (
    <Dialog {...props} open={open}>
      {edit ? (
        <Button
          onClick={() => {
            setName(payload.name);
            setEmail(payload.email);
            setSelectedId(payload.id);
            setOpen(true);
          }}
        >
          Edit
        </Button>
      ) : (
        <DialogTrigger className="self-end" asChild>
          <Button onClick={() => setOpen(true)}>Tambah User Baru</Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-slate-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit User" : "Tambah User"}</DialogTitle>
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
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose
            onClick={() => {
              setName("");
              setEmail("");
              setOpen(false);
            }}
            asChild
          >
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          {edit ? (
            <Button onClick={add}>Update User</Button>
          ) : (
            <Button onClick={add}>Tambah User</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPrompt;
