import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import { Link } from '@heroui/link';
import type { FC } from 'react';

export interface BreadcrumbItem {
  id: string;
  name?: string;
}

export interface BreadcrumbsProps {
  list: Array<string | BreadcrumbItem>;
  // name?:string
  separator?: string;
}

export const ProjectBreadcrumbs: FC<BreadcrumbsProps> = ({ list /*,name*/, separator = '>' }) => {
  //{(FC<BreadcrumbsProps>) {

  // const splitted = String(name).split('_')

  // console.log("splitted: ", splitted)

  // const makeUrl (url:string, item:string) => string  {
  //     url += (url == "") ? "/projects/" : "_"
  //     url += item
  //     return url
  // }

  const makeBreadItem = (url: string, data: string) => {
    return <BreadcrumbItem>{data}</BreadcrumbItem>;
  };

  const makeBreadcrumbItem = (item: string | BreadcrumbItem) => {
    if (typeof item === 'string') {
      return <BreadcrumbItem key={item}>{item}</BreadcrumbItem>;
    } else {
      return <BreadcrumbItem key={item.id}>{item.name || item.id}</BreadcrumbItem>;
    }
  };

  return (
    <>
      <Breadcrumbs
        separator={separator}
        itemClasses={{
          separator: 'px-2',
        }}
      >
        {list.map(item => makeBreadcrumbItem(item))}
      </Breadcrumbs>
    </>
  );
};
