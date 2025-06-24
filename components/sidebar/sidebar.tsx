import { useSidebarContext } from "@/src/context/layout-context";
import React from "react";
import CollapsableItem from "./collapsable-item";
import {
  BadgeDollarSignIcon,
  BoxIcon,
  BrickWallIcon,
  FolderSync,
  HistoryIcon,
  Settings,
  TruckIcon,
  User2Icon,
  UserCog,
} from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarItem from "./sidebar-item";

type Props = {};

const sidebarItems = [
  {
    name: "Kasir",
    link: "/cashier",
    icon: <BadgeDollarSignIcon />,
  },
  {
    name: "Transaksi Kasir",
    link: "/cashier-transaction",
    icon: <HistoryIcon />,
  },
  {
    name: "Daftar Barang",
    link: "/product",
    icon: <BoxIcon />,
  },
  {
    name: "Barang Masuk",
    link: "/product-transaction",
    icon: <TruckIcon />,
  },
  {
    name: "Daftar Supplier",
    link: "/supplier",
    icon: <UserCog />,
  },
  {
    name: "Daftar Pelanggan",
    link: "/customer",
    icon: <User2Icon />,
  },
  {
    name: "Master",
    icon: <BrickWallIcon />,
    sub: [
      {
        name: "Kategori",
        link: "/master/category",
      },
      {
        name: "Metode Pembayaran",
        link: "/master/payment-method",
      },
    ],
  },

  {
    name: "Pengaturan",
    link: "/setting",
    icon: <Settings />,
  },
  {
    name: "Sinkronisasi",
    link: "/sync-transaction",
    icon: <FolderSync />,
  },
];

export default function Sidebar({}: Props) {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="top-0 z-50 sticky flex h-screen">
      {collapsed ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:invisible"
          onClick={() => setCollapsed()}
        ></div>
      ) : null}
      <div
        className={`fixed flex flex-col -translate-x-full h-full bg-primary-foreground transition z-10 ${
          collapsed
            ? "md:fixed md:-translate-x-full translate-x-0"
            : "md:static md:-translate-x-0 -translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className="font-bold">POS Demo</h1>
        </div>

        <div className="flex flex-col mt-4 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            if (item.sub) {
              return (
                <CollapsableItem
                  key={index}
                  name={item.name}
                  sub={item.sub}
                  icon={item?.icon}
                />
              );
            } else {
              return (
                <SidebarItem
                  key={index}
                  name={item?.name}
                  url={item?.link}
                  icon={item?.icon}
                  isActive={`${pathname}/`.startsWith(`${item?.link}/`)}
                />
              );
            }
          })}
        </div>
      </div>
    </aside>
  );
}
