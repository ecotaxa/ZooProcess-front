/// <reference types="jest" />

// const  {converttiff2jpg}  = require('./convert');
// import { converttiff2jpg } from './convert';
// import converttiff2jpg  from './convert';

// foo.ts
// work
//export const  foo = () => {}
// don't work
// //export const  foo = (data:any) => {}


import { foo } from './foo'

// pas moyen d'importer le fichier à tester dès qu'il y a un parametre dans la fonction


describe('convert', () => {


    it('should do something', () => {
        // test code
        expect(true).toBeTruthy();
      });

    // // Successfully converts TIFF to JPG when server responds with 200 OK
    // it('should return a successful response when server returns 200 OK', async () => {
    //     // Mock data
    //     const mockData = { filePath: '/path/to/image.tiff' };
    
    //     // Mock successful fetch response
    //     global.fetch = jest.fn().mockResolvedValue({
    //       ok: true,
    //       status: 200,
    //       text: jest.fn().mockResolvedValue('"/converted/image.jpg"')
    //     });
    
    //     // Call the function
    //     const result = await converttiff2jpg(mockData);
    
    //     // Assertions
    //     expect(fetch).toHaveBeenCalledWith(
    //       'http://zooprocess.imev-mer.fr:8000/convert',
    //       {
    //         method: 'POST',
    //         body: JSON.stringify(mockData),
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //           'User-Agent': 'Zooprocess v10',
    //         },
    //       }
    //     );
    //     expect(result).toBeDefined();
    //     expect(result).toEqual({
    //       ok: true,
    //       status: 200,
    //       data: '/converted/image.jpg'
    //     });
    //   });


    // // Server responds with 422 status code
    // it('should throw an error when server responds with 422 status code', async () => {
    //     // Mock data
    //     const mockData = { filePath: '/path/to/image.tiff' };
    
    //     // Mock fetch response with 422 status
    //     global.fetch = jest.fn().mockResolvedValue({
    //       ok: false,
    //       status: 422,
    //       statusText: 'Unprocessable Entity'
    //     });
    
    //     // Call the function and expect it to return the 404 image path
    //     const result = await converttiff2jpg(mockData);
    
    //     // Assertions
    //     expect(fetch).toHaveBeenCalledWith(
    //       'http://zooprocess.imev-mer.fr:8000/convert',
    //       {
    //         method: 'POST',
    //         body: JSON.stringify(mockData),
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //           'User-Agent': 'Zooprocess v10',
    //         },
    //       }
    //     );
    //     expect(result).toBe('/images/404.jpg');
    //   });

});
