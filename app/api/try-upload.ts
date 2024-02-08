import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "@/lib/parse-form";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{
    data: {
      url: string | string[];
    } | null;
    error: string | null;
  }>
) => {


  // throw new Error("no file");

  console.log("upload");
  // console.log("req: ", req);

  // return res.status(500).json({data:null , error:"error"})
  // res.status(500).json({ data: null, error: "Internal Server Error" });
  // return;



  if (req.method !== "POST") {
    console.log("not post");
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });
    return;
  }


  try {
    const { fields, files } = await parseForm(req);

    if (files) {
      const file = files.media //as { filepath: string };
      // let url : string | Array<string> = "";
      let url : Array<string> = [];
      if (Array.isArray(file)) {
        url = file.map((f) => f.filepath)
      } 
      else {
        console.log("eeeeerrrrrrrooooooorrrrrrr")
        throw new Error("no file");
        // if (file != undefined) {
        //   url = file.upload.filepath //.filepath ;
        // }
      }

      res.status(200).json({
        data: {
          url,
        },
        error: null,
      });
    }
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
};




  export const config = {
  // Next.js has a default body-parser for parsing form data, we have to disable it to be able to parse it ourselves.
    api: {
      bodyParser: false,
    },
  };

  export default handler;
