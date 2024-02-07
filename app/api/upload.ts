import type { NextApiRequest, NextApiResponse } from "next";

import { parseForm, FormidableError  } from "../../lib/parse-form";


type Data = {
    name: string;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<{
      data: {
        url: string | string[];
      } | null;
      error: string | null;
    }>
  ) => {

    console.log("req: ", req);

    res.status(500).json({ data: null, error: "Internal Server Error" });
    return;

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).json({
        data: null,
        error: "Method Not Allowed",
      });
      return;
    }


    try {
      const { fields, files } = await parseForm(req);
    
      const file = files.media;
      let url = Array.isArray(file) ? file?.map((f) => f.filepath) : file!.filepath;
    
      res.status(200).json({
        data: {
          url,
        },
        error: null,
      });
  
    } catch (e) {
      if (e instanceof FormidableError) {
        res.status(e.httpCode || 400).json({ data: null, error: e.message });
      } else {
        console.error(e);
        res.status(500).json({ data: null, error: "Internal Server Error" });
      }
    }

    res.status(200).json({
      data: {
        url: "/uploaded-file-url",
      },
      error: null,
    });
  }
  
  export const config = {
  // Next.js has a default body-parser for parsing form data, we have to disable it to be able to parse it ourselves.
    api: {
      bodyParser: false,
    },
  };
  
  export default handler;
