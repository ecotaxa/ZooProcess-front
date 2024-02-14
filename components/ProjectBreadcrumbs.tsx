import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/breadcrumbs";
import { Link } from "@nextui-org/link";
// import { url } from "inspector";
import { FC } from "react";


export interface BreadcrumbsProps {
	list: Array<string>;
	// name?:string
  separator?: string
}

// export function ProjectBreadcrumbs(FC<BreadcrumbsProps>) {

export const ProjectBreadcrumbs : FC<BreadcrumbsProps> = ({list/*,name*/, separator = "_"}) => { //{(FC<BreadcrumbsProps>) {

    // const splitted = String(name).split('_')

    // console.log("splitted: ", splitted)
    
  // const makeUrl (url:string, item:string) => string  {
  //     url += (url == "") ? "/projects/" : "_"
  //     url += item
  //     return url
  // }

    const makeBreadItem = (url:string, data:string) => {
      return (
          <BreadcrumbItem key={url}>
            <Link href={url}>{data}</Link>
          </BreadcrumbItem>
      )
    }

    const makeBreadcrumbItems = (list : Array<string>, mode = "ID") => {
      let url = ""

      let breadcrumbItems : Array<any> = []

      // console.log("makeBreadcrumbItems: ", list)

      for (const item in list) {

        // console.log("item: ", list[item])

        if ( mode == "ID" )  {
          url = "/projects/" + list[item]
        } else {
          url += (url == "") ? "/projects/" : "_"
          url += list[item]
        }
        // const elem = `<BreadcrumbItem><Link href="${url}">${list[item]}</Link></BreadcrumbItem>`
        const elem =  makeBreadItem(url, list[item])

        // console.log("elem: ", elem)

        breadcrumbItems.push(elem)
      }

      return breadcrumbItems
    }
    
    //const separator = ( mode == "ID" ) ? "/" : "_"
    
    return (
        <Breadcrumbs
          separator={separator}
          itemClasses={{
            separator: "px-2"
          }}
        >
        {/* { makeBreadcrumbItems(splitted).map(item => item) } */}
        { makeBreadcrumbItems(list).map(item => item) }



      </Breadcrumbs>
    ); 

}


    
  