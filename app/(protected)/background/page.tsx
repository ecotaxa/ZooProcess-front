"use client";

import { Debug } from "@/components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
// import { Button, Card, CardBody, CardFooter, getKeyValue } from "@heroui/react";
import { Button, getKeyValue } from "@heroui/react";
// import { FC, useEffect, useState } from "react"
import { FC } from "react"
import { useRouter } from "next/navigation";
// import { MySelect } from "@/components/mySelect5";
// import { useProject } from "@/app/api/projects";
// import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";

import React from "react";

// import { useBackgrounds } from '@/app/api/background';
import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@heroui/react";
// import { map } from "zod";
// import { Background } from "@/app/api/network/zooprocess-api";

import { useAsyncList } from "@react-stately/data";
import { Background } from "@/app/api/network/interfaces";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,
    }
}



const BackgroundPage: FC<pageProps> = ({ params }) => {
    const router = useRouter();
    const { projectid, sampleid, subsampleid } = params;

    const selectColor = "success";

    function onPress() {
        const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/scan`;
        router.push(path);
    }

    let columns = [
        {
            key: "createdAt",
            label: "Date",
            sort: true
        },
        {
            key: "user",
            label: "Operator",
            sort: false
        },
        {
            key: "url",
            label: "File",
            sort: false
        },
    ];

    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = React.useState(true);
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER;
    let defaultSelectedKeys: Set<string> = new Set();

    const onSelected = (event: any) => {
        console.log("typeof event", typeof(event));
        console.log("event", event);
    };

    const [token, setToken] = React.useState<string>("");

    React.useEffect(() => {
        // Fetch or set the token here
        // For example:
        // setToken(fetchToken());
    }, []);

    let list = useAsyncList({
        async load({ signal }) {
            const instrumentId = "1";
            let res = await fetch(`${baseURL}/background/${instrumentId}`, {
                signal,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status !== 200) {
                throw new Error(`Error fetching backgrounds: ${res.status}`);
            }

            let backgrounds = await res.json();
            setIsLoading(false);

            console.log("backgrounds", backgrounds);

            const rows = backgrounds.map((background: Background) => {
                return {
                    key: background.id,
                    createdAt: background.createdAt,
                    url: background.url,
                    user: background.user.name,
                };
            });

            if (rows.length >= 2) {
                defaultSelectedKeys = new Set([rows[0].key, rows[1].key]);
                console.log("defaultSelectedKeys", defaultSelectedKeys);
                setSelectedKeys(defaultSelectedKeys);
            }

            return {
                items: rows,
            };
        },
        async sort({ items, sortDescriptor }) {
            console.log("sort", items, sortDescriptor);
            return {
                items: items.sort((a: any, b: any) => {
                    let first = a[sortDescriptor.column as keyof typeof a];
                    let second = b[sortDescriptor.column as keyof typeof b];

                    console.log("first", first);
                    console.log("second", second);

                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                }),
            };
        },
    });


    const defaultlist = [
        { text: "Fill Metadata", checked: true },
        // { text: "Background", checked: false },
        { text: "Preview", checked: false },
        { text: "Scan", checked: true },
        { text: "Process", checked: false },
        { text: "Check", checked: false },
      ];

    return (
        <>
            <Timeline_scan current={0.5} list={defaultlist} />

            <h1>Page to remove, can't pass projectid</h1>
            <h2>but add an instrument select, and scan, and let choose later</h2>

            <div className="text-start w-">
                <h1>Selectionner le background</h1>
                <Debug params={selectedKeys} />
                <Table
                    aria-label="Backgrounds associated to the instrument"
                    color={selectColor}
                    selectionMode="multiple"
                    selectionBehavior="toggle"
                    defaultSelectedKeys={defaultSelectedKeys}
                    selectedKeys={selectedKeys}
                    onSelectionChange={(keys) => setSelectedKeys(new Set(Array.from(keys) as string[]))}
                    sortDescriptor={list.sortDescriptor}
                    onSortChange={list.sort}
                    classNames={{
                        table: "min-h-[400px]",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key} allowsSorting={column.sort}>{column.label}</TableColumn>}
                    </TableHeader>

                    <TableBody
                        items={list.items}
                        isLoading={isLoading}
                        loadingContent={<MySpinner />}
                        emptyContent={"No background scan"}
                    >
                        {(item: any) => (
                            <TableRow key={item.key}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div>
                <Button onPress={onPress} color="primary">DONE</Button>
            </div>
        </>
    );
};
export default BackgroundPage;
