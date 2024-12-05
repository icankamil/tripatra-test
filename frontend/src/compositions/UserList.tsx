import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogProps } from "@/compositions/Modal";

import { Button } from "@/components/ui/button";
import { User } from "@/pages/Users";

import { Skeleton } from "@/components/ui/skeleton";
import DialogPrompt from "@/compositions/Modal";

import SearchInput from "@/compositions/SearchInput";

interface ProductListProps extends Omit<DialogProps, "edit"> {
  searchName: Record<string, unknown>;
  setSearchName: (name: { [key: string]: string }) => void;
  searchEmail: string;
  setSearchEmail: (email: string) => void;
  data?: { user?: User[]; users?: User[] };
  add: () => void;
  delete: (id: string) => void;
  deleteAll: () => void;
  loading: boolean;
  update: () => void;
}

const field = [
  { id: "name", placeholder: "Nama", type: "text" },
  { id: "email", placeholder: "Email", type: "email" },
];
export default function UserList(props: ProductListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <SearchInput
          fields={field}
          setSearch={props.setSearchName}
          search={props.searchName}
        />
        <div className="grid grid-cols-1">
          <DialogPrompt
            name={props.name}
            setName={props.setName}
            email={props.email}
            setEmail={props.setEmail}
            add={props.add}
            open={props.open}
            setOpen={props.setOpen}
            edit={false}
          />
          <Button
            className="mt-3"
            variant={"destructive"}
            onClick={props.deleteAll}
          >
            Hapus Semua User
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data &&
          props.data.users &&
          props.data.users.length > 0 &&
          props.loading === false ? (
            props.data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <DialogPrompt
                    name={props.name}
                    setName={props.setName}
                    email={props.email}
                    setEmail={props.setEmail}
                    add={props.update}
                    open={props.open}
                    setOpen={props.setOpen}
                    edit={true}
                    payload={user}
                    setSelectedId={props.setSelectedId}
                  />
                  <Button variant={"destructive"}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          ) : props.data &&
            props.data.user &&
            props.data.user.length > 0 &&
            props.loading === false ? (
            props.data.user.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Button>Edit</Button>
                  <Button variant={"destructive"}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          ) : props.data?.users?.length === 0 ? (
            <TableRow>
              <h5 className="text-center">There is no data</h5>
            </TableRow>
          ) : props.data?.user?.length === 0 ? (
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
