import { gql } from "@apollo/client";

// User Queries
export const GET_USERS = gql`
  query GetUsers($id: String, $name: String, $email: String) {
    user(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

// User Mutations
export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const DELETE_ALL_USERS = gql`
  mutation DeleteAllUsers {
    deleteAllUsers
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($id: String, $name: String, $price: Float, $stock: Int) {
    product(id: $id, name: $name, price: $price, stock: $stock) {
      id
      name
      price
      stock
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      stock
    }
  }
`;

// Product Mutations
export const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $price: Float!, $stock: Int!) {
    addProduct(name: $name, price: $price, stock: $stock) {
      id
      name
      price
      stock
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: String!
    $name: String!
    $price: Float!
    $stock: Int!
  ) {
    updateProduct(id: $id, name: $name, price: $price, stock: $stock) {
      id
      name
      price
      stock
    }
  }
`;
