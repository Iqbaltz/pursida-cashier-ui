"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { SupplierSchema } from "@/src/entity/supplier-entity";
import { supplierService } from "@/src/service/supplier";

type Props = {
  supplierName: string;
  supplierAddress: string;
  supplierPhoneNumber: string;
};

export default function EditForm({
  supplierName,
  supplierAddress,
  supplierPhoneNumber,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const form = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      name: supplierName,
      address: supplierAddress,
      phone_number: supplierPhoneNumber,
    },
  });

  const { editSupplier } = supplierService;

  async function onSubmit(data: z.infer<typeof SupplierSchema>) {
    const res = await editSupplier(Number(id), {
      ...data,
    });
    if (res) {
      alert("Supplier berhasil diubah");
      form.reset();
      router.push("/supplier");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Supplier</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Supplier</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Simpan</Button>
      </form>
    </Form>
  );
}
