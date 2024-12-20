import { useState } from "react";
import UserList from "@/compositions/UserList";
import Layout from "@/compositions/Layout";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_USERS,
  GET_USERS,
  ADD_USER,
  DELETE_USER,
  DELETE_ALL_USERS,
  UPDATE_USER,
} from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export interface User {
  id: string;
  name: string;
  email: string;
}
// interface ProductsProps {
//   data: Record<string, unknown>;
// }

export default function Users(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [searchName, setSearchName] = useState<Record<string, unknown>>({}); // State for name search term
  const [searchEmail, setSearchEmail] = useState<string>(""); // State for email search term
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Determine which query to use based on search terms
  const query = searchName || searchEmail ? GET_USERS : GET_ALL_USERS;
  // Use the search terms in the query
  const { loading, error, data } = useQuery(query, {
    variables: { ...searchName }, // Pass both search terms to the query
  });

  const [addUser, { data: newuser, loading: loadingnew, error: errornew }] =
    useMutation(ADD_USER, {
      refetchQueries: [{ query: query }],
    });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: query }],
  });

  const [deleteAllUsers] = useMutation(DELETE_ALL_USERS, {
    refetchQueries: [{ query: query }],
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: query }],
  });

  const handleAddUser = async () => {
    const response = await addUser({ variables: { name, email } });
    if (loadingnew) {
      console.log("submit");
    } else {
      setOpen(false);
    }
    setName("");
    setEmail("");
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this users ?")) {
      await deleteUser({ variables: { id } });
    }
  };

  const handleDeleteAllUsers = async () => {
    if (window.confirm("Are you sure you want to delete all users ?")) {
      await deleteAllUsers();
    }
  };
  const handleUpdateUser = async () => {
    if (selectedUserId) {
      await updateUser({ variables: { id: selectedUserId, name, email } });
      setSelectedUserId(null);
      setName("");
      setEmail("");
    }
  };

  if (loading) return <Skeleton className="w-full h-[20px] " />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      {loading ? (
        <Skeleton className="w-full h-[20px] " />
      ) : (
        <UserList
          searchName={searchName}
          setSearchName={setSearchName}
          searchEmail={searchEmail}
          setSearchEmail={setSearchEmail}
          data={data}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          add={handleAddUser}
          delete={handleDeleteUser}
          deleteAll={handleDeleteAllUsers}
          loading={loading}
          open={open}
          setOpen={setOpen}
          update={handleUpdateUser}
          setSelectedId={setSelectedUserId}
        />
      )}
    </Layout>
  );
}
