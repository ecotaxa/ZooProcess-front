import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import { Link } from '@heroui/link';
import type { FC } from 'react';

export interface BreadcrumbItem {
  id: string;
  name?: string;
}

export interface BreadcrumbsProps {
  items: Array<BreadcrumbItem>;
  separator?: string;
}

export const ProjectBreadcrumbs: FC<BreadcrumbsProps> = ({ items /*,name*/, separator = '>' }) => {
  const makeBreadcrumbItem = (item: string | BreadcrumbItem) => {
    if (typeof item === 'string') {
      return <BreadcrumbItem key={item}>{item}</BreadcrumbItem>;
    } else {
      return <BreadcrumbItem key={item.id}>{item.name || item.id}</BreadcrumbItem>;
    }
  };

  return (
    <Breadcrumbs
      separator={separator}
      itemClasses={{
        separator: 'px-2',
      }}
    >
      {items.map(item => makeBreadcrumbItem(item))}
    </Breadcrumbs>
  );
};
