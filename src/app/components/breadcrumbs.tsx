import React from 'react';
import { Breadcrumbs, BreadcrumbItem as UIBreadcrumbItem } from '@heroui/breadcrumbs';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  id: string;
  name?: string;
}

export interface BreadcrumbsProps {
  items: Array<BreadcrumbItem>;
  separator?: string;
}

export const ProjectBreadcrumbs: FC<BreadcrumbsProps> = ({ items /*,name*/, separator = '>' }) => {
  return (
    <Breadcrumbs
      separator={separator}
      itemClasses={{
        separator: 'px-2',
      }}
    >
      {items.map((item, idx) => {
        const key = item.id;
        const label = item.name || item.id;
        // First breadcrumb links to dashboard with the project preselected
        if (idx === 0) {
          return (
            <UIBreadcrumbItem key={key}>
              <RouterLink to={`/dashboard?project=${encodeURIComponent(item.id)}`}>
                {label}
              </RouterLink>
            </UIBreadcrumbItem>
          );
        }
        return (
          <UIBreadcrumbItem isDisabled={true} key={key}>
            {label}
          </UIBreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
};
