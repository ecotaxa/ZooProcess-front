/// <reference types="jest" />

import { describe, it } from 'node:test';
import { pathToSessionStorage } from './gateway';

// import { gateway } from './gateway';
// or
// import * as gateway from './gateway';

describe('pathToSessionStorage', () => {
  // Returns path with sessionFolder prefix when matching drive URL is found
  it('should prefix path with sessionFolder when drive URL matches', async () => {
    const mockDrives = [
      {
        id: '1',
        name: 'Drive1',
        url: '/drives/drive1',
      },
    ];

    // jest.spyOn(gateway, 'getDrives').mockResolvedValue(mockDrives);

    const path = '/drives/drive1/folder/file.jpg';
    const sessionFolder = '/uploads';

    const result = await pathToSessionStorage(path, sessionFolder);

    expect(result).toBe('/uploads/folder/file.jpg');
  });

  // Handles empty path string
  it('should return empty string when path is empty', async () => {
    const mockDrives = [
      {
        id: '1',
        name: 'Drive1',
        url: '/drives/drive1',
      },
    ];

    // jest.spyOn(gateway, 'getDrives').mockResolvedValue(mockDrives);

    const result = pathToSessionStorage('');

    expect(result).toBe('');
  });
});
