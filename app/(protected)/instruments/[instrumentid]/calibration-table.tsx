"use client"

import React, { useState, useEffect } from "react";
import {  Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip} from "@nextui-org/react";
import { key } from '@/api/key';
import { useRouter } from "next/navigation";
import { useAsyncList } from "react-stately";
import { ICalibration, Instrument } from "@/app/api/network/interfaces";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

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
  // {name: "ARCHIVED", uid: "archived", allowSorting:true},
  {name: "ACTIONS", uid: "actions", allowSorting:false},
];

export function CalibrationTable(props: { instrument: Instrument, calibrations?: Array<ICalibration>, refreshTrigger: number }) {
  const router = useRouter();
  const stripped = true;
  const { instrument, calibrations = [], refreshTrigger } = props;
  const [refreshKey, setRefreshKey] = useState(0);


  console.debug("CalibrationTable.instrument", instrument)
  console.debug("CalibrationTable.calibrations", calibrations)


  // const [rows, setRows] = useState<Array<CalibrationKey>>([]);
  const initialRows = calibrations.map((calibration: ICalibration) => ({
    id: calibration.id,
    frame: calibration.frame,
    xOffset: calibration.xOffset,
    yOffset: calibration.yOffset,
    xSize: calibration.xSize,
    ySize: calibration.ySize,
    key: calibration.id,
    archived: calibration.archived,
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
      archived: calibration.archived,
      instrumentId: instrument.id,
    }));
    setRows(updateddata);
  }, [refreshTrigger, calibrations, instrument.id, refreshKey]);

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
          let cmp = ((parseInt(first as string) || first) ?? 0) < ((parseInt(second as string) || second) ?? 0) ? -1 : 1;
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
      case "archived":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue?"Archived":"Active"}</p>
            </div>
          );
      
      case "actions":

      const onPressArchiveCalibration = async (id: string) => {
        const data = {
            id: calibration.id,
            instrumentId: instrument.id,
            archived: true
        };
        console.debug("onPressArchiveCalibration data=", data);

        try {
            // Call the local API else data no pass to the Next server part
            console.debug("onPressArchiveCalibration before fetch");
            const response = await fetch(`/api/instruments/${instrument.id}/calibrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.debug("onPressArchiveCalibration after fetch");
            if (!response.ok) {
                throw new Error('Failed to update calibration');
            }
    
            // Refresh the table data
            console.debug("Triggering refresh");
            setRefreshKey(prev => prev + 1);            router.refresh();
        } catch (error) {
            console.error("Error updating calibration:", error);
        }
    }
    
          // todo: update this action with delete button if no scan associated with this calibration
        if (calibration.archived){return (<span>Archived</span>)}
        console.debug("ACTION archived", calibration.archived)


        return (
          // WARNING: forbid to edit the calibration if there is a scan associated with this calibration
          // todo: update this action with delete button if no scan associated with this calibration
          // or archive button if scan associated with this calibration
          <div className="relative flex items-center gap-2" key={key(calibration.id, 'action')}>
            <Tooltip content="Detail">
              <Link
                data-testid="action_btn"
                size="sm"
                color="primary"
                as={Link}
                href={`/instruments/${instrument.id}/${calibration.id}`}
              >
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon/>
                  </span>
              </Link>
            </Tooltip>
            <Tooltip  color="danger" content="Archive calibration">
                <Link 
                    data-testid="delete_action_btn"
                    size="sm"
                    color="primary" 
                    // as={Link} 
                    // href={`/projects/${project.id}/delete`}
                    onPress={() => {onPressArchiveCalibration(calibration.id)}}
                >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon/>
              </span>
                </Link>
                </Tooltip>
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
