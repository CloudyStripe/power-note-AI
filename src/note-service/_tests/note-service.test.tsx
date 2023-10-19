import { noteService } from "../note-service";
import fetch from 'jest-fetch-mock';

describe('FEC service', () => {

    beforeEach(() => jest.clearAllMocks())

    it('calls fetch with the correct data', async () => {
        const mockNotes = 'Test notes';
        fetch.mockResponse(JSON.stringify({})); 
    
        await noteService(mockNotes);
    
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3001/organize',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes: mockNotes }),
          }
        );
      });
  
})