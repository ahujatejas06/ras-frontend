import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";

import DataGrid from "@components/DataGrid";
import Meta from "@components/Meta";
import ActiveButton from "@components/Buttons/ActiveButton";
import useStore from "@store/store";
import proformaRequest, { ProformaType } from "@callbacks/company/proforma";

const ROUTE_PATH = "/company/rc/[rcId]/opening/[openingId]";
const ROUTE_PATH_PROFORMA = "/company/rc/[rcId]/proforma/[proformaId]";

const columns: GridColDef[] = [
  { field: "ID", headerName: "ID", width: 90 },
  {
    field: "nature_of_business",
    headerName: "Role name",
    width: 400,
  },
  {
    field: "set_deadline",
    headerName: "Application Deadline",
    width: 200,

    renderCell(params) {
      return `${
        params.row.set_deadline === 0
          ? "Date not Set"
          : new Date(params.value).toLocaleString()
      }`;
    },
  },
  {
    field: "proforma",
    headerName: "Proforma",
    width: 200,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Link
        href={{
          pathname: ROUTE_PATH_PROFORMA,
          query: {
            rcId: params.row.recruitment_cycle_id,
            proformaId: params.row.ID,
          },
        }}
        passHref
      >
        <ActiveButton sx={{ height: 30, width: "100%" }}>
          VIEW PROFORMA
        </ActiveButton>
      </Link>
    ),
  },
  {
    field: "applicants",
    headerName: "View Applicants",
    sortable: false,
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Link
        href={{
          pathname: ROUTE_PATH,
          query: {
            rcId: params.row.recruitment_cycle_id,
            openingId: params.row.ID,
          },
        }}
        passHref
      >
        <ActiveButton sx={{ height: 30, width: "100%" }}>
          VIEW APPLICANTS
        </ActiveButton>
      </Link>
    ),
  },
];

function Applications() {
  const { token } = useStore();

  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();

  const [proformas, setProformas] = useState<ProformaType[]>([]);

  useEffect(() => {
    const getall = async () => {
      let data = await proformaRequest.getAll(token, rid);
      data = data.filter((item) => item.is_approved.Bool);

      setProformas(data);
    };
    if (router.isReady && rid !== "") getall();
  }, [router.isReady, token, rid]);
  return (
    <div className="container">
      <Meta title="Applications - QuadEye" />
      <Stack>
        <h1>Applications</h1>
        <h2>Intern Season</h2>
        <DataGrid
          rows={proformas}
          columns={columns}
          getRowId={(row) => row.ID}
        />
      </Stack>
    </div>
  );
}

Applications.layout = "companyPhaseDashboard";
export default Applications;
