import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';

import { formatDate, formatTime } from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';

import { Debug } from '@/components/Debug';
import { useAsyncList } from 'react-stately';
import { EyeIcon } from './auth/EyeIcon';
import { MyImage } from '@/components/myImage';

interface IColumn {
  name: string;
  uid: string;
  allowSorting?: boolean;
}

const getColumns = (t: any) => [
  // {name: t("Table_Background.ID"), uid: "id", allowSorting:true},
  // {name: "DRIVE", uid: "drive"},
  { name: t('Table_Background.NAME'), uid: 'name', allowSorting: true },
  { name: t('Table_Background.CREATOR'), uid: 'creator', allowSorting: true },
  // {name: "SAMPLE", uid: "background"},
  // {name: "SCAN", uid: "scan"},
  { name: t('Table_Background.Time'), uid: 'time', allowSorting: true },
  { name: t('Table_Background.DATE'), uid: 'date', allowSorting: true },
  { name: t('Table_Background.QC'), uid: 'qc', allowSorting: true },
  { name: t('Table_Background.ACTION'), uid: 'action', allowSorting: false },
];

export function BackgroundTable(props: { projectId: String; backgrounds: any }) {
  const { projectId, backgrounds = [] } = props;
  const stripped = true;
  const t = useTranslations();
  const columns = getColumns(t);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageURL, setImageURL] = useState<string>('');

  console.log('BackgroundsTable projectId= ', projectId);
  console.log('BackgroundsTable backgrounds= ', backgrounds);

  function setShowImage(image: any): void {
    console.log('setShowImage', image);
    setImageURL(image);
    onOpen();
  }

  let list = useAsyncList({
    async load({ signal }) {
      return {
        items: backgrounds,
      };
    },
    async sort({ items, sortDescriptor }) {
      console.debug('sort: ', items, sortDescriptor);
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          console.debug('sort: ', first, second, cmp);

          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const updateddata = backgrounds.map((background: any) => {
    console.debug('background: ', background);
    background['key'] = background.id;
    return background;
  });

  console.log('BackgroundTable updateddata: ', updateddata);

  const [rows, setRows] = useState(updateddata);

  const StatusString = (status: string) => {
    console.log('Status: ', status);
    switch (status) {
      case 'TODO':
      case undefined:
        return t('Table_Background_QC.Not_Done');
      case 'FULLY_SCANNED':
        return t('Table_Background_QC.Fully_Scanned');
      case 'NOT_FULLY_SCANNED':
        return t('Table_Background_QC.Not_Fully_Scanned');
      case 'PROCESS':
        return t('Table_Background_QC.Process');
      case 'PROPORTION_OF_MULTIPLE':
        return t('Table_Background_QC.Proportion_Of_Multiple');
      default:
        return t('Table_Background_QC.Error');
    }
  };

  // const onDetail = (projectId,sampleid) => {
  //     navigate({
  //         pathname: '/projects/[pid]/backgrounds/[sid]',
  //             query: { pid: projectId , sid: sampleid },
  //     })
  // }

  const renderCell = React.useCallback((background: any, columnKey: any) => {
    // console.log("render cell :columnKey ", columnKey);

    const cellValue = background[columnKey];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );

      case 'name':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm ">{cellValue}</p>
          </div>
        );

      // case "background":
      //         return (
      //             <div className="flex flex-col" >
      //                 <p className="text-bold text-sm capitalize">{cellValue}</p>
      //             </div>
      //         );
      case 'creator':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );

      case 'date':
        console.log('createdAt - createdAt');
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{formatDate(cellValue)}</p>
          </div>
        );

      case 'time':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{formatTime(cellValue)}</p>
          </div>
        );

      case 'qc':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{StatusString(cellValue)}</p>
          </div>
        );

      case 'action':
        return (
          <div className="relative flex items-center gap-2" key={key(background.id, 'action')}>
            <Button
              data-testid="action_btn"
              variant="flat"
              size="sm"
              color="primary"
              as={Link}
              onPress={() => setShowImage(background.action)}
            >
              {/* EYE */}
              <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Debug params={props} />
      <Table
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        isStriped={stripped}
        aria-label="Background Table"
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.allowSorting}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {/* <TableBody items={backgrounds}> */}
        <TableBody items={list.items}>
          {(item: any) => (
            <TableRow key={key(item.id, 'tr')}>
              {columnKey => (
                <TableCell key={key(item.id, columnKey)}>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <MyImage src={imageURL} />
                <p>{imageURL}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  {t('Table_Background.Modal_Close')}
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                    Action
                    </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
