import OpenAI from 'openai';

export const generateNotes = async (notes: string, openAiKey?: string) => {
  const openai = new OpenAI({ apiKey: openAiKey, dangerouslyAllowBrowser: true });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          "role": "system",
          "content": "All responses must be structured and formatted in HTML tags. \
        Please assist me in organizing the following information into a structured format. \
        You must employ headers, sub-headers, bulleted lists, bolding, italicizing, and other relevant formatting methods to ensure clarity and ease of reference. Use these liberally. \
        Group related topics together and provide smooth transitions between different sections as necessary. \
        Be concise and speak plainly for easy reference later. Do your best to exclude redundant, or unnecessary information. \
        This is a one-way interaction; no conversation is required, or allowed."
        },
        { "role": "user", "content": "A group of flamingos is called a flamboyance." },
        { "role": "assistant", "content": "<h1>Animal Groups</h1>\n<p>A group of <b>flamingos</b> is known as a <i>flamboyance</i>.</p>" },
        { "role": "user", "content": "The Eiffel Tower can be 15 cm taller during the summer." },
        { "role": "assistant", "content": "<h1>Interesting Information</h1>\n<p>The <b>Eiffel Tower</b> experiences a height increase of <i>15 cm</i> during the summer due to thermal expansion.</p>" },
        { "role": "user", "content": notes }
      ],
      temperature: 0.9,
      stream: true,
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch(e: any){
    if(e.status === 401){
      throw new Error('Access Denied')
    }
    else{
      throw new Error(`Error: ${e}`)
    }
  }
};