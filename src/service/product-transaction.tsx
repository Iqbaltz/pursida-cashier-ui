import { ProductTransactionEntity } from "../entity/product-transaction-entity";
import { fetchWrapper } from "../helpers/fetch-wrapper";
import { fetchWrapperServer } from "../helpers/fetch-wrapper-server";
import PaginatedModel from "../helpers/pagination";

const getAllProductTransactions = async (page: string, searchKey: string) => {
  const res = await fetchWrapper.get(
    `/barang-transaction?page=${page}&search=${searchKey}`
  );
  res.data["summary"] = res.summary;
  return res?.data as PaginatedModel<ProductTransactionEntity>;
};

const getProductTransaction = async (id: number) => {
  return await fetchWrapper.get(`/barang-transaction/${id}`);
};

const getProductTransactionServer = async (id: number) => {
  return await fetchWrapperServer.get(`/barang-transaction/${id}`);
};

const addProductTransaction = async (payload: ProductTransactionEntity) => {
  return await fetchWrapper.post("/barang-transaction", payload);
};

const editProductTransaction = async (
  id: number,
  payload: ProductTransactionEntity
) => {
  return await fetchWrapper.post(`/barang-transaction/${id}`, payload);
};

const deleteProductTransaction = async (id: number) => {
  return await fetchWrapper.remove(`/barang-transaction/${id}`);
};

export const productTransactionService = {
  getAllProductTransactions,
  getProductTransaction,
  addProductTransaction,
  editProductTransaction,
  deleteProductTransaction,
  getProductTransactionServer,
};
