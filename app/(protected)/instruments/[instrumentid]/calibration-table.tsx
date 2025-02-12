"use client"

import React, { useState, useEffect } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { key } from '@/api/key';
import { useRouter } from "next/navigation";
import { useAsyncList } from "react-stately";
import { ICalibration, Instrument } from "@/app/api/network/interfaces";
// import { Calibration, Instrument } from "@/app/api/network/zooprocess-api";

export interface IKey {
  key: string;
}

export interface CalibrationKey extends IKey, ICalibration {}    

const columns = [
  {name: "ID", uid: "id", allowSorting:true},
  {name: "FRAME", uid: "frame", allowSorting:true},
  {name: "X OFFSET", uid: "xOffset", allowSorting:true},
  {name: "Y OFFSET", uid: "yOffset", allowSorting:true},
  {name: "X SIZE", uid: "xSize", allowSorting:true},
  {name: "Y SIZE", uid: "ySize", allowSorting:true},
  {name: "ACTIONS", uid: "actions", allowSorting:false},
];

export function CalibrationTable(props: { instrument: Instrument, calibrations?: Array<ICalibration>, refreshTrigger: number }) {
  const router = useRouter();
  const stripped = true;
  const { instrument, calibrations = [], refreshTrigger } = props;

  console.debug("CalibrationTable", instrument)
  console.debug("CalibrationTable", calibrations)


  // const [rows, setRows] = useState<Array<CalibrationKey>>([]);
  const initialRows = calibrations.map((calibration: ICalibration) => ({
    id: calibration.id,
    frame: calibration.frame,
    xOffset: calibration.xOffset,
    yOffset: calibration.yOffset,
    xSize: calibration.xSize,
    ySize: calibration.ySize,
    key: calibration.id,
    instrumentId: instrument.id,
  }));
  
  const [rows, setRows] = useState<Array<CalibrationKey>>(initialRows);

  useEffect(() => {
    console.log("useEffect", calibrations)
    console.log("useEffect", instrument)

    const updateddata = calibrations.map((calibration: ICalibration) => ({
      id: calibration.id,
      frame: calibration.frame,
      xOffset: calibration.xOffset,
      yOffset: calibration.yOffset,
      xSize: calibration.xSize,
      ySize: calibration.ySize,
      key: calibration.id,
      instrumentId: instrument.id,
    }));
    setRows(updateddata);
  }, [refreshTrigger, calibrations, instrument.id]);

  let list = useAsyncList<CalibrationKey>({
    async load({ signal }) {
      return {
        items: rows.map((item: CalibrationKey) => ({
          ...item,
          instrumentId: instrument.id
        })),
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof CalibrationKey];
          let second = b[sortDescriptor.column as keyof CalibrationKey];
          let cmp = (parseInt(first as string) || first) < (parseInt(second as string) || second) ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  const renderCell = React.useCallback((calibration: CalibrationKey, columnKey: keyof CalibrationKey | "actions") => {
    const cellValue = calibration[columnKey as keyof CalibrationKey];

    switch (columnKey) {
      case "id":
      case "frame":
      case "xOffset":
      case "yOffset":
      case "xSize":
      case "ySize":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "actions":
        if (calibration.archived){return null}
        return (
          <div className="relative flex items-center gap-2" key={key(calibration.id, 'action')}>
            <Button
              data-testid="action_btn"
              variant="flat"
              size="sm"
              color="primary"
              disableRipple
              as={Link}
              href={`/instruments/${instrument.id}/${calibration.id}`}
            >
              {/* {`/instruments/${instrument.id}/${calibration.id}`} */}
              Edit
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      isStriped={stripped}
      aria-label="Drives">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={list.items}>
        {(item: CalibrationKey) => (
          <TableRow key={key(item.id, "tr")}>
            {(columnKey) => <TableCell key={key(item.id, columnKey as string)}>{renderCell(item, columnKey as keyof CalibrationKey | "actions")}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
