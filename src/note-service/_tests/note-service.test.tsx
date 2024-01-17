import { generateNotes } from '../note-service';
import fetch from 'jest-fetch-mock';

describe('Open AI service', () => {

    beforeEach(() => jest.clearAllMocks())

    it('calls fetch with the correct data', async () => {
        const mockNotes = 'Test notes';
        fetch.mockResponse(JSON.stringify({})); 
    
        await generateNotes(mockNotes);

        const url = fetch.mock.calls[0][0];
    
        expect(url).toEqual('https://api.openai.com/v1/chat/completions');
      });
  
})